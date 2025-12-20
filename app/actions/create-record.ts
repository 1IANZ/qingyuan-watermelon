"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

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

	if (!batchId || !actionType || !description) {
		return { message: "请完整填写操作类型和详细描述", success: false };
	}

	const cookieStore = await cookies();
	const userId = cookieStore.get("auth_token")?.value;

	let operatorName = "未知农户";

	if (userId) {
		const user = await db.app_users.findUnique({
			where: { id: userId },
		});
		if (user) {
			operatorName = user.real_name;
		}
	}

	try {
		await db.records.create({
			data: {
				batch_id: batchId,
				action_type: actionType,
				description: description,
				operator: operatorName,
				images: [],
			},
		});

		revalidatePath("/admin");
		revalidatePath(`/admin/add-record`);
	} catch (error) {
		console.error("写入失败:", error);
		return { message: "数据库写入失败", success: false };
	}

	redirect("/admin");
}
