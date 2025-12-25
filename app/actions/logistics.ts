"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function createLogisticsAction(formData: FormData) {
  const batchId = formData.get("batch_id") as string;
  const stage = formData.get("stage") as string;
  const operator = formData.get("operator") as string;
  const location = formData.get("location") as string;
  const temperature = formData.get("temperature") as string;
  const humidity = formData.get("humidity") as string;
  const notes = formData.get("notes") as string;

  // 车辆信息
  const vehiclePlate = formData.get("vehicle_plate") as string;
  const vehicleDriver = formData.get("vehicle_driver") as string;
  const vehiclePhone = formData.get("vehicle_phone") as string;

  // 路线信息
  const routeFrom = formData.get("route_from") as string;
  const routeTo = formData.get("route_to") as string;
  const routeDistance = formData.get("route_distance") as string;

  // 构建 JSON 数据
  const vehicleInfo =
    vehiclePlate || vehicleDriver || vehiclePhone
      ? {
        plate: vehiclePlate || null,
        driver: vehicleDriver || null,
        phone: vehiclePhone || null,
      }
      : {};

  const routeInfo =
    routeFrom || routeTo || routeDistance
      ? {
        from: routeFrom || null,
        to: routeTo || null,
        distance: routeDistance ? parseFloat(routeDistance) : null,
      }
      : {};

  try {
    await db.logistics.create({
      data: {
        batch_id: batchId,
        stage: stage || "transport",
        operator: operator || "物流人员",
        location: location || null,
        temperature: temperature ? parseFloat(temperature) : null,
        humidity: humidity ? parseFloat(humidity) : null,
        vehicle_info: vehicleInfo,
        route_info: routeInfo,
        notes: notes || null,
        images: [], // 后续可以添加图片上传功能
      },
    });

    revalidatePath("/admin");
    revalidatePath(`/trace/${batchId}`);

    return { success: true, message: "流通记录已添加" };
  } catch (error) {
    console.error("Create logistics error:", error);
    return { success: false, message: "添加失败,请重试" };
  }
}

export async function deleteLogisticsAction(id: string) {
  try {
    await db.logistics.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Delete logistics error:", error);
    return { success: false };
  }
}

export async function getLogisticsByBatchId(batchId: string) {
  try {
    const logistics = await db.logistics.findMany({
      where: { batch_id: batchId },
      orderBy: { recorded_at: "asc" },
    });
    return logistics;
  } catch (error) {
    console.error("Get logistics error:", error);
    return [];
  }
}
