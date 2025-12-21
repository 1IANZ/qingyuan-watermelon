"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase/server";

export type RecordState = {
	message: string;
	success: boolean;
};

export async function createRecordAction(
	_prevState: RecordState,
	formData: FormData,
): Promise<RecordState> {
	const batchId = formData.get("batchId") as string;
	const actionType = formData.get("actionType") as string;
	const description = formData.get("description") as string;
	const imageFile = formData.get("imageFile") as File | null;

	if (!batchId || !actionType || !description) {
		return { message: "请完整填写操作类型和详细描述", success: false };
	}

	const cookieStore = await cookies();
	const userId = cookieStore.get("auth_token")?.value;
	let operatorName = "未知农户";
	if (userId) {
		// 这里假设还没上 JWT，先用旧逻辑跑通上传
		const user = await db.app_users.findUnique({ where: { id: userId } });
		if (user) operatorName = user.real_name;
	}
	const imageUrls: string[] = [];

	if (imageFile && imageFile.size > 0) {
		try {
			// 生成唯一文件名: batchId/时间戳.jpg
			// 这样文件夹结构清晰：watermelon/batch_123/171888.jpg
			const fileExt = imageFile.name.split(".").pop();
			const fileName = `${batchId}/${Date.now()}.${fileExt}`;

			const { error } = await supabase.storage
				.from("watermelon")
				.upload(fileName, imageFile, {
					cacheControl: "3600",
					upsert: false,
				});

			if (error) {
				console.error("Supabase 上传出错:", error);
				return {
					message: "图片上传被拒绝，请检查 Supabase 权限",
					success: false,
				};
			}

			const { data: publicData } = supabase.storage
				.from("watermelon")
				.getPublicUrl(fileName);

			console.log("上传成功，链接:", publicData.publicUrl);
			imageUrls.push(publicData.publicUrl);
		} catch (error) {
			console.error("上传发生未知错误:", error);
			return { message: "上传服务异常", success: false };
		}
	}

	try {
		await db.records.create({
			data: {
				batch_id: batchId,
				action_type: actionType,
				description: description,
				operator: operatorName,
				images: imageUrls,
			},
		});

		revalidatePath("/admin");
		revalidatePath(`/admin/add-record`);
	} catch (error) {
		console.error("数据库写入失败:", error);
		return { message: "数据库写入失败", success: false };
	}

	redirect("/admin");
}
