"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

// Define the possible trigger_data structures for different alert types
type AlertTriggerData =
  | {
    inspection_id: string;
    stage: string;
    result: string;
    report_data: Record<string, string | number | boolean | null>;
  }
  | {
    low_rating_count: number;
    avg_rating: string;
    feedbacks: Array<{ rating: number; content: string | null }>;
  }
  | {
    logistics_id: string;
    temperature: number | null;
    humidity: number | null;
    location: string | null;
  };

export async function checkAndCreateAlerts(batchId: string) {
  try {
    // 获取批次信息及相关数据
    const batch = await db.batches.findUnique({
      where: { id: batchId },
      include: {
        inspections: {
          orderBy: { created_at: "desc" },
          take: 5,
        },
        feedbacks: {
          orderBy: { created_at: "desc" },
          take: 10,
        },
        logistics: {
          where: { stage: "storage" },
          orderBy: { recorded_at: "desc" },
          take: 5,
        },
      },
    });

    if (!batch) return { success: false, message: "批次不存在" };

    const alerts: Array<{
      batch_id: string;
      alert_type: string;
      alert_level: string;
      title: string;
      description: string | null;
      triggered_by: string | null;
      trigger_data?: AlertTriggerData;
      assigned_to: string | null;
    }> = [];

    const failedInspections = batch.inspections.filter(
      (i) => i.result === "fail" || i.result === "warning",
    );
    if (failedInspections.length > 0) {
      const latestFailed = failedInspections[0];
      const reportData = latestFailed.report_data as Record<string, string | number | boolean | null>;

      const existingAlert = await db.alerts.findFirst({
        where: {
          batch_id: batchId,
          alert_type: "inspection_fail",
          status: { in: ["pending", "processing"] },
        },
      });

      if (!existingAlert) {
        alerts.push({
          batch_id: batchId,
          alert_type: "inspection_fail",
          alert_level: latestFailed.result === "fail" ? "high" : "medium",
          title: `检测不合格 - ${getStageLabel(latestFailed.stage)}`,
          description: `检测结果: ${latestFailed.result === "fail" ? "不合格" : "预警"}。${reportData.notes || ""}`,
          triggered_by: "inspection",
          trigger_data: {
            inspection_id: latestFailed.id,
            stage: latestFailed.stage,
            result: latestFailed.result,
            report_data: reportData,
          },
          assigned_to: "监管部门",
        });
      }
    }

    // 规则2: 消费者低评分预警
    const lowRatings = batch.feedbacks.filter((f) => f.rating <= 2);
    if (lowRatings.length >= 3) {
      const existingAlert = await db.alerts.findFirst({
        where: {
          batch_id: batchId,
          alert_type: "quality_complaint",
          status: { in: ["pending", "processing"] },
        },
      });

      if (!existingAlert) {
        const avgRating = (
          lowRatings.reduce((sum, f) => sum + f.rating, 0) / lowRatings.length
        ).toFixed(1);

        alerts.push({
          batch_id: batchId,
          alert_type: "quality_complaint",
          alert_level: lowRatings.length >= 5 ? "high" : "medium",
          title: `消费者质量投诉 - 低评分异常`,
          description: `近期收到${lowRatings.length}条低评分反馈,平均评分${avgRating}分,需要关注产品品质。`,
          triggered_by: "feedback",
          trigger_data: {
            low_rating_count: lowRatings.length,
            avg_rating: avgRating,
            feedbacks: lowRatings.map((f) => ({
              rating: f.rating,
              content: f.content,
            })),
          },
          assigned_to: "企业质检部门",
        });
      }
    }

    // 规则3: 仓储环境异常预警
    for (const log of batch.logistics) {
      if (log.temperature || log.humidity) {
        const temp = log.temperature ? parseFloat(log.temperature.toString()) : null;
        const hum = log.humidity ? parseFloat(log.humidity.toString()) : null;

        let isAbnormal = false;
        let abnormalReason = "";

        // 温度异常 (西瓜适宜温度 10-15℃)
        if (temp !== null && (temp < 5 || temp > 20)) {
          isAbnormal = true;
          abnormalReason += `温度${temp}℃异常 (适宜范围10-15℃); `;
        }

        // 湿度异常 (适宜湿度 85-90%)
        if (hum !== null && (hum < 70 || hum > 95)) {
          isAbnormal = true;
          abnormalReason += `湿度${hum}%异常 (适宜范围85-90%); `;
        }

        if (isAbnormal) {
          const existingAlert = await db.alerts.findFirst({
            where: {
              batch_id: batchId,
              alert_type: "env_abnormal",
              status: { in: ["pending", "processing"] },
              created_at: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24小时内
              },
            },
          });

          if (!existingAlert) {
            alerts.push({
              batch_id: batchId,
              alert_type: "env_abnormal",
              alert_level: "medium",
              title: `仓储环境异常`,
              description: abnormalReason.trim(),
              triggered_by: "system",
              trigger_data: {
                logistics_id: log.id,
                temperature: temp,
                humidity: hum,
                location: log.location,
              },
              assigned_to: "企业仓储部门",
            });
          }
        }
      }
    }

    // 批量创建预警
    if (alerts.length > 0) {
      await db.alerts.createMany({
        data: alerts,
      });
    }

    revalidatePath("/admin");
    revalidatePath(`/trace/${batch.batch_no}`);

    return {
      success: true,
      message: `检测完成,生成${alerts.length}条预警`,
      alertCount: alerts.length,
    };
  } catch (error) {
    console.error("Check alerts error:", error);
    return { success: false, message: "预警检测失败" };
  }
}

/**
 * 创建手动预警
 */
export async function createAlertAction(formData: FormData) {
  const batchId = formData.get("batch_id") as string;
  const alertType = formData.get("alert_type") as string;
  const alertLevel = formData.get("alert_level") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const assignedTo = formData.get("assigned_to") as string;

  try {
    await db.alerts.create({
      data: {
        batch_id: batchId,
        alert_type: alertType,
        alert_level: alertLevel || "medium",
        title,
        description: description || null,
        triggered_by: "system",
        assigned_to: assignedTo || null,
      },
    });

    revalidatePath("/admin");
    return { success: true, message: "预警已创建" };
  } catch (error) {
    console.error("Create alert error:", error);
    return { success: false, message: "创建失败" };
  }
}

/**
 * 更新预警状态
 */
export async function updateAlertStatusAction(
  alertId: string,
  status: string,
) {
  try {
    await db.alerts.update({
      where: { id: alertId },
      data: {
        status,
        updated_at: new Date(),
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Update alert status error:", error);
    return { success: false };
  }
}

/**
 * 创建处置记录
 */
export async function createDisposalAction(formData: FormData) {
  const alertId = formData.get("alert_id") as string;
  const responsibleParty = formData.get("responsible_party") as string;
  const actionTaken = formData.get("action_taken") as string;
  const result = formData.get("result") as string;
  const handler = formData.get("handler") as string;

  try {
    await db.disposals.create({
      data: {
        alert_id: alertId,
        responsible_party: responsibleParty || null,
        action_taken: actionTaken,
        result: result || null,
        attachments: [],
        handler: handler || null,
        handled_at: new Date(),
      },
    });

    // 更新预警状态为已解决
    await db.alerts.update({
      where: { id: alertId },
      data: {
        status: "resolved",
        updated_at: new Date(),
      },
    });

    revalidatePath("/admin");
    return { success: true, message: "处置记录已提交" };
  } catch (error) {
    console.error("Create disposal error:", error);
    return { success: false, message: "提交失败" };
  }
}

/**
 * 获取批次的所有预警
 */
export async function getAlertsByBatchId(batchId: string) {
  try {
    const alerts = await db.alerts.findMany({
      where: { batch_id: batchId },
      include: {
        disposals: {
          orderBy: { created_at: "desc" },
        },
      },
      orderBy: { created_at: "desc" },
    });
    return alerts;
  } catch (error) {
    console.error("Get alerts error:", error);
    return [];
  }
}

// 辅助函数
function getStageLabel(stage: string): string {
  const map: Record<string, string> = {
    planting: "种植期",
    harvest: "采收期",
    transport: "流通期",
    market: "销售期",
  };
  return map[stage] || stage;
}
