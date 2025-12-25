"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signToken } from "@/lib/auth-helper";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

type LoginState = { message?: string };

export async function loginAction(_prevState: LoginState, formData: FormData) {
	const username = formData.get("username") as string;
	const password = formData.get("password") as string;

	if (!username || !password) return { message: "请输入用户名和密码" };

	const user = await db.app_users.findUnique({ where: { username } });

	if (!user) {
		return { message: "账号或密码错误" };
	}

	// 使用 bcrypt 验证密码
	const isPasswordValid = await verifyPassword(password, user.password);
	if (!isPasswordValid) {
		return { message: "账号或密码错误" };
	}

	// 检查账户审核状态
	if (user.account_status === "pending") {
		return { message: "您的账户正在等待审核,请耐心等待政府部门审核通过。" };
	}

	if (user.account_status === "rejected") {
		return { message: "您的账户申请未通过审核,如有疑问请联系管理部门。" };
	}

	// 只有active状态的用户才能继续登录
	if (user.account_status !== "active") {
		return { message: "账户状态异常,无法登录。" };
	}

	const token = await signToken({
		userId: user.id,
		username: user.username,
		role: user.role,
	});

	const cookieStore = await cookies();
	cookieStore.set("auth_token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24,
		path: "/",
		sameSite: "lax",
	});

	redirect("/admin");
}

