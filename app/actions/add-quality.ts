"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function addQualityReportAction(formData: FormData) {
  const batchId = formData.get("batchId") as string;
  const sugarContent = formData.get("sugarContent") as string;
  const pesticideResidue = formData.get("pesticideResidue") as string;
  const inspector = formData.get("inspector") as string;

  if (!batchId || !sugarContent) {
    throw new Error("请填写完整检测数据");
  }

  const report = {
    sugar: `${sugarContent}%`,
    pesticide: pesticideResidue || "未检出",
    inspector: inspector || "企业质检部",
    date: new Date().toISOString(),
    result: "PASS",
  };

  await db.batches.update({
    where: { id: batchId },
    data: {
      quality_report: report,
      status: 'checked'
    },
  });

  revalidatePath("/admin");
  redirect("/admin");
}
