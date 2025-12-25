"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { checkAndCreateAlerts } from "./alerts";

export async function submitFeedbackAction(formData: FormData) {
  const batchId = formData.get("batch_id") as string;
  const rating = parseInt(formData.get("rating") as string);
  const content = formData.get("content") as string;
  const contact = formData.get("contact") as string;
  const batchNo = formData.get("batch_no") as string;

  try {
    await db.feedbacks.create({
      data: {
        batch_id: batchId,
        rating: rating || 5,
        content: content || "",
        consumer: contact || "Anonymous",
      },
    });

    // 触发预警检查
    await checkAndCreateAlerts(batchId);

    revalidatePath(`/trace/${batchNo}`);
    return { success: true, message: "感谢您的评价！" };
  } catch (error) {
    console.error("Feedback error:", error);
    // Return simple object, let client handle it
    return { success: false, message: "提交失败" };
  }
}
