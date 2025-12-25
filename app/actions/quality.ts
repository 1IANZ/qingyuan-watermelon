"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { checkAndCreateAlerts } from "./alerts";

export async function addInspectionAction(formData: FormData) {
  const batchId = formData.get("batch_id") as string;
  const stage = formData.get("stage") as string;
  const result = formData.get("result") as string;
  const inspector = formData.get("inspector") as string;

  // Collect dynamic report data
  const sugar = formData.get("sugar") as string;
  const pesticide = formData.get("pesticide") as string;
  const notes = formData.get("notes") as string;

  const reportData = {
    sugar: sugar || null,
    pesticide: pesticide || null,
    notes: notes || null,
    date: new Date().toISOString(),
  };

  try {
    await db.inspections.create({
      data: {
        batch_id: batchId,
        stage: stage || "harvest",
        result: result || "pass",
        inspector: inspector || "系统监管员",
        report_data: reportData,
      },
    });

    // 自动检测预警
    await checkAndCreateAlerts(batchId);

    revalidatePath("/admin");
    revalidatePath(`/trace/${batchId}`);

    return { success: true, message: "检测记录已添加" };
  } catch (error) {
    console.error("Add inspection error:", error);
    return { success: false, message: "添加失败,请重试" };
  }
}

export async function deleteInspectionAction(id: string) {
  try {
    await db.inspections.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true };
  } catch (_) {
    return { success: false };
  }
}
