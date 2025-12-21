"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helper";
import { db } from "@/lib/db";

export type CreateBatchState = {
	message: string;
	success: boolean;
};

export async function createBatchAction(
	_prevState: CreateBatchState,
	formData: FormData,
): Promise<CreateBatchState> {
	const user = await getCurrentUser();

	if (!user) {
		return { message: "登录已过期，请重新登录", success: false };
	}

	const varietyId = formData.get("varietyId") as string;
	const locationId = formData.get("locationId") as string;
	const sowingDate = formData.get("sowingDate") as string;

	if (!varietyId || !locationId || !sowingDate) {
		return { message: "请完整填写所有必填项", success: false };
	}

	const [varietyObj, locationObj] = await Promise.all([
		db.base_varieties.findUnique({ where: { id: varietyId } }),
		db.base_locations.findUnique({ where: { id: locationId } }),
	]);

	if (!varietyObj || !locationObj) {
		return { message: "选择的数据无效，请刷新页面重试", success: false };
	}

	const batchNo = `KL-${Date.now().toString().slice(-4)}`;

	try {
		// 3. 写入数据库
		await db.batches.create({
			data: {
				batch_no: batchNo,
				variety: varietyObj.name,
				location: locationObj.name,
				sowing_date: new Date(sowingDate),
				status: "growing",
				user_id: user.userId,
			},
		});

		revalidatePath("/admin");
	} catch (error) {
		console.error("新建批次失败:", error);
		return { message: "创建失败，请重试", success: false };
	}

	// 跳转
	redirect("/admin");
}
