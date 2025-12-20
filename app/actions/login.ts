"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

type LoginState = {
	message: string;
};

export async function loginAction(_prevState: LoginState, formData: FormData) {
	const username = formData.get("username") as string;
	const password = formData.get("password") as string;

	if (!username || !password) {
		return { message: "请输入用户名和密码" };
	}

	try {
		const user = await db.app_users.findUnique({
			where: { username: username },
		});

		if (!user || user.password !== password) {
			return { message: "账号或密码错误" };
		}

		const cookieStore = await cookies();
		cookieStore.set("auth_token", user.id, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 60 * 24,
			path: "/",
		});
	} catch (error) {
		console.error("登录出错:", error);
		return { message: "系统错误，请稍后重试" };
	}

	redirect("/admin");
}
