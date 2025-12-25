"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function approveBatchAction(batchId: string) {
  try {
    await db.batches.update({
      where: { id: batchId },
      data: { audit_status: "approved" },
    });

    revalidatePath("/admin");
    revalidatePath(`/trace/${batchId}`); // Invalidate trace page cache if possible, though usually it uses batch_no
  } catch (error) {
    console.error("审核通过失败", error);
  }
}

export async function rejectBatchAction(batchId: string) {
  try {
    await db.batches.update({
      where: { id: batchId },
      data: { audit_status: "rejected" },
    });
    revalidatePath("/admin");
    revalidatePath(`/trace/${batchId}`);
  } catch (error) {
    console.error("驳回失败", error);
  }
}
  