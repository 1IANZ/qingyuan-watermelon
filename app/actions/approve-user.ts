"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth-helper";
import { db } from "@/lib/db";

/**
 * 审核通过用户账户(简化版,用于直接作为form action)
 */
export async function approveUser(formData: FormData): Promise<void> {
  const userId = formData.get("userId") as string;

  // 检查当前用户权限(必须是gov角色)
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "gov") {
    throw new Error("无权限操作,仅政府账户可以审核用户");
  }

  if (!userId) {
    throw new Error("用户ID不能为空");
  }

  // 更新用户状态为active
  await db.app_users.update({
    where: { id: userId },
    data: { account_status: "active" },
  });

  // 刷新页面数据
  revalidatePath("/admin/users");
}

/**
 * 拒绝用户账户申请(简化版,用于直接作为form action)
 */
export async function rejectUser(formData: FormData): Promise<void> {
  const userId = formData.get("userId") as string;

  // 检查当前用户权限(必须是gov角色)
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "gov") {
    throw new Error("无权限操作,仅政府账户可以审核用户");
  }

  if (!userId) {
    throw new Error("用户ID不能为空");
  }

  // 更新用户状态为rejected
  await db.app_users.update({
    where: { id: userId },
    data: { account_status: "rejected" },
  });

  // 刷新页面数据
  revalidatePath("/admin/users");
}
