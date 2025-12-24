"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signToken } from "@/lib/auth-helper";
import { db } from "@/lib/db";

type RegisterState = { message?: string; success?: boolean };

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const realName = formData.get("realName") as string;
  const role = formData.get("role") as string;

  // 验证必填字段
  if (!username || !password || !realName || !role) {
    return { message: "请填写所有必填字段" };
  }

  // 验证密码长度
  if (password.length < 6) {
    return { message: "密码至少需要6位字符" };
  }

  // 验证两次密码是否一致
  if (password !== confirmPassword) {
    return { message: "两次密码输入不一致" };
  }

  // 验证角色是否有效 (移除gov,禁止注册)
  const validRoles = ["farmer", "enterprise"];
  if (!validRoles.includes(role)) {
    return { message: "无效的用户角色,政府账户不允许注册" };
  }

  // 根据角色确定账户状态
  // farmer: 立即激活 (active)
  // enterprise: 待审核 (pending)
  const accountStatus = role === "farmer" ? "active" : "pending";

  // 检查用户名是否已存在并创建用户
  try {
    const existingUser = await db.app_users.findUnique({
      where: { username },
    });

    if (existingUser) {
      return { message: "该用户名已被注册，请选择其他用户名" };
    }

    // TODO: 在生产环境中应使用 bcrypt 等加密算法对密码进行哈希处理
    // 创建新用户
    const newUser = await db.app_users.create({
      data: {
        username,
        password, // 当前使用明文存储，与现有登录逻辑保持一致
        real_name: realName,
        role,
        account_status: accountStatus,
      },
    });

    if (accountStatus === "active") {
      const token = await signToken({
        userId: newUser.id,
        username: newUser.username,
        role: newUser.role,
      });

      const cookieStore = await cookies();
      cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24小时
        path: "/",
        sameSite: "lax",
      });
    } else {
      // enterprise用户注册成功但需要等待审核
      return {
        success: true,
        message: "注册成功!您的企业账户正在等待政府审核,审核通过后即可登录。",
      };
    }
  } catch (error) {
    console.error("注册错误:", error);
    return { message: "注册失败，请稍后重试" };
  }

  // 注册成功，重定向到管理后台 (仅farmer会执行到这里)
  // 注意: redirect() 会抛出特殊错误来触发重定向，这是 Next.js 的正常行为
  redirect("/admin");
}

