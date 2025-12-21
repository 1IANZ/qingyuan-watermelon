"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signToken } from "@/lib/auth-helper";
import { db } from "@/lib/db";

type FormState = {
	message?: string;
};

export async function loginAction(
	_prevState: FormState | undefined,
	formData: FormData,
) {
	const username = formData.get("username") as string;
	const password = formData.get("password") as string;

	if (!username || !password) {
		return { message: "请输入用户名和密码" };
	}

	const user = await db.app_users.findUnique({
		where: { username },
	});

	if (!user || user.password !== password) {
		return { message: "用户名或密码错误" };
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

export async function logoutAction() {
	const cookieStore = await cookies();
	cookieStore.delete("auth_token");
	redirect("/login");
}
