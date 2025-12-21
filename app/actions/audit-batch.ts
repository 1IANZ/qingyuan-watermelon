"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function approveBatchAction(batchId: string) {
  try {
    await db.batches.update({
      where: { id: batchId },
      data: { status: "approved" },
    });

    revalidatePath("/admin");
  } catch (error) {
    console.error("审核通过失败", error);
  }
}

export async function rejectBatchAction(batchId: string) {
  try {
    await db.batches.update({
      where: { id: batchId },
      data: { status: "rejected" },
    });
    revalidatePath("/admin");
  } catch (error) {
    console.error("驳回失败", error);
  }
}
