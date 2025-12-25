"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

// ==================== Base Locations Actions ====================

/**
 * 获取所有基地位置
 */
export async function getLocationsAction() {
  try {
    const locations = await db.base_locations.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: locations };
  } catch (error) {
    console.error("获取基地位置失败:", error);
    return { success: false, error: "获取基地位置失败" };
  }
}

/**
 * 添加新的基地位置
 */
export async function addLocationAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;

    if (!name || !type) {
      return { success: false, error: "基地名称和类型不能为空" };
    }

    // 检查是否已存在同名基地
    const existing = await db.base_locations.findUnique({
      where: { name },
    });

    if (existing) {
      return { success: false, error: "该基地名称已存在" };
    }

    await db.base_locations.create({
      data: {
        name: name.trim(),
        type,
      },
    });

    revalidatePath("/admin/base-data");
    revalidatePath("/admin/create-batch");
    return { success: true, message: "基地位置添加成功" };
  } catch (error) {
    console.error("添加基地位置失败:", error);
    return { success: false, error: "添加基地位置失败" };
  }
}

/**
 * 更新基地位置
 */
export async function updateLocationAction(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;

    if (!id || !name || !type) {
      return { success: false, error: "缺少必要参数" };
    }

    // 检查是否有其他基地使用了这个名称
    const existing = await db.base_locations.findFirst({
      where: {
        name,
        NOT: { id },
      },
    });

    if (existing) {
      return { success: false, error: "该基地名称已被其他基地使用" };
    }

    await db.base_locations.update({
      where: { id },
      data: {
        name: name.trim(),
        type,
      },
    });

    revalidatePath("/admin/base-data");
    revalidatePath("/admin/create-batch");
    return { success: true, message: "基地位置更新成功" };
  } catch (error) {
    console.error("更新基地位置失败:", error);
    return { success: false, error: "更新基地位置失败" };
  }
}

/**
 * 删除基地位置
 */
export async function deleteLocationAction(formData: FormData) {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return { success: false, error: "缺少基地ID" };
    }

    // 检查是否有批次正在使用这个基地
    const batchesUsingLocation = await db.batches.count({
      where: {
        location: (
          await db.base_locations.findUnique({ where: { id } })
        )?.name,
      },
    });

    if (batchesUsingLocation > 0) {
      return {
        success: false,
        error: `该基地正在被 ${batchesUsingLocation} 个批次使用，无法删除`,
      };
    }

    await db.base_locations.delete({
      where: { id },
    });

    revalidatePath("/admin/base-data");
    revalidatePath("/admin/create-batch");
    return { success: true, message: "基地位置删除成功" };
  } catch (error) {
    console.error("删除基地位置失败:", error);
    return { success: false, error: "删除基地位置失败" };
  }
}

// ==================== Base Varieties Actions ====================

/**
 * 获取所有西瓜品种
 */
export async function getVarietiesAction() {
  try {
    const varieties = await db.base_varieties.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: varieties };
  } catch (error) {
    console.error("获取西瓜品种失败:", error);
    return { success: false, error: "获取西瓜品种失败" };
  }
}

/**
 * 添加新的西瓜品种
 */
export async function addVarietyAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const daysStr = formData.get("days") as string;

    if (!name || !daysStr) {
      return { success: false, error: "品种名称和生长周期不能为空" };
    }

    const days = parseInt(daysStr, 10);
    if (Number.isNaN(days) || days <= 0) {
      return { success: false, error: "生长周期必须是大于0的数字" };
    }

    // 检查是否已存在同名品种
    const existing = await db.base_varieties.findUnique({
      where: { name },
    });

    if (existing) {
      return { success: false, error: "该品种名称已存在" };
    }

    await db.base_varieties.create({
      data: {
        name: name.trim(),
        days,
      },
    });

    revalidatePath("/admin/base-data");
    revalidatePath("/admin/create-batch");
    return { success: true, message: "西瓜品种添加成功" };
  } catch (error) {
    console.error("添加西瓜品种失败:", error);
    return { success: false, error: "添加西瓜品种失败" };
  }
}

/**
 * 更新西瓜品种
 */
export async function updateVarietyAction(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const daysStr = formData.get("days") as string;

    if (!id || !name || !daysStr) {
      return { success: false, error: "缺少必要参数" };
    }

    const days = parseInt(daysStr, 10);
    if (Number.isNaN(days) || days <= 0) {
      return { success: false, error: "生长周期必须是大于0的数字" };
    }

    // 检查是否有其他品种使用了这个名称
    const existing = await db.base_varieties.findFirst({
      where: {
        name,
        NOT: { id },
      },
    });

    if (existing) {
      return { success: false, error: "该品种名称已被其他品种使用" };
    }

    await db.base_varieties.update({
      where: { id },
      data: {
        name: name.trim(),
        days,
      },
    });

    revalidatePath("/admin/base-data");
    revalidatePath("/admin/create-batch");
    return { success: true, message: "西瓜品种更新成功" };
  } catch (error) {
    console.error("更新西瓜品种失败:", error);
    return { success: false, error: "更新西瓜品种失败" };
  }
}

/**
 * 删除西瓜品种
 */
export async function deleteVarietyAction(formData: FormData) {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return { success: false, error: "缺少品种ID" };
    }

    // 检查是否有批次正在使用这个品种
    const batchesUsingVariety = await db.batches.count({
      where: {
        variety: (
          await db.base_varieties.findUnique({ where: { id } })
        )?.name,
      },
    });

    if (batchesUsingVariety > 0) {
      return {
        success: false,
        error: `该品种正在被 ${batchesUsingVariety} 个批次使用，无法删除`,
      };
    }

    await db.base_varieties.delete({
      where: { id },
    });

    revalidatePath("/admin/base-data");
    revalidatePath("/admin/create-batch");
    return { success: true, message: "西瓜品种删除成功" };
  } catch (error) {
    console.error("删除西瓜品种失败:", error);
    return { success: false, error: "删除西瓜品种失败" };
  }
}
