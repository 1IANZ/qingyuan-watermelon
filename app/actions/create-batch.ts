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

	const varietyName = formData.get("varietyName") as string;
	const locationName = formData.get("locationName") as string;
	const sowingDate = formData.get("sowingDate") as string;

	if (!varietyName || !locationName || !sowingDate) {
		return { message: "请完整填写所有必填项", success: false };
	}

	try {
		// 查找或创建品种
		let variety = await db.base_varieties.findUnique({
			where: { name: varietyName.trim() },
		});

		if (!variety) {
			// 如果品种不存在，创建新品种（默认90天生长周期）
			variety = await db.base_varieties.create({
				data: {
					name: varietyName.trim(),
					days: 90,
				},
			});
		}

		// 查找或创建基地
		let location = await db.base_locations.findUnique({
			where: { name: locationName.trim() },
		});

		if (!location) {
			// 如果基地不存在，创建新基地（默认温棚类型）
			location = await db.base_locations.create({
				data: {
					name: locationName.trim(),
					type: "warm",
				},
			});
		}

		const batchNo = `KL-${Date.now().toString().slice(-4)}`;

		// 创建批次
		await db.batches.create({
			data: {
				batch_no: batchNo,
				variety: variety.name,
				location: location.name,
				sowing_date: new Date(sowingDate),
				status: "growing",
				user_id: user.userId,
			},
		});

		revalidatePath("/admin");
		revalidatePath("/admin/create-batch");
	} catch (error) {
		console.error("新建批次失败:", error);
		return { message: "创建失败，请重试", success: false };
	}

	// ... existing code

	// 跳转
	redirect("/admin");
}

export async function deleteBatchAction(id: string) {
	try {
		await db.batches.delete({
			where: { id },
		});

		revalidatePath("/admin");
		return { success: true, message: "批次删除成功" };
	} catch (error) {
		console.error("Delete batch error:", error);
		return { success: false, message: "删除失败，请核对权限或重试" };
	}
}
