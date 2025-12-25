"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth-helper";
import { db } from "@/lib/db";
import { supabase, supabaseAdmin } from "@/lib/supabase";

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

  const user = await getCurrentUser();

  if (!user) {
    return { message: "登录已过期，请重新登录", success: false };
  }

  let operatorName = user.username;

  try {
    const dbUser = await db.app_users.findUnique({
      where: { id: user.userId },
    });

    if (dbUser?.real_name) {
      operatorName = dbUser.real_name;
    }
  } catch (error) {
    console.error("获取用户详情失败，将使用用户名:", error);
  }

  const imageUrls: string[] = [];

  if (imageFile && imageFile.size > 0) {
    try {
      // 生成唯一文件名
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
          message: "图片上传失败，请重试",
          success: false,
        };
      }

      const { data: publicData } = supabase.storage
        .from("watermelon")
        .getPublicUrl(fileName);

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

    return { message: "记录上传成功", success: true };
  } catch (error) {
    console.error("数据库写入失败:", error);
    return { message: "数据库写入失败", success: false };
  }
}

export async function deleteRecordAction(id: string) {
  try {
    // 1. 获取记录信息以查找关联图片
    const record = await db.records.findUnique({
      where: { id },
      select: { images: true },
    });

    if (!record) {
      return { success: false, message: "记录不存在或已被删除" };
    }

    // 2. 如果存在图片，从 Supabase 删除
    if (record?.images && record.images.length > 0) {
      const pathsToDelete: string[] = [];

      record.images.forEach((url) => {

        const parts = url.split("/watermelon/");
        if (parts.length > 1) {
          pathsToDelete.push(decodeURIComponent(parts[1]));
        }
      });

      if (pathsToDelete.length > 0) {
        const { error } = await supabaseAdmin.storage
          .from("watermelon")
          .remove(pathsToDelete);

        if (error) {
          console.error("Supabase 图片删除失败:", error);
        }
      }
    }

    await db.records.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true, message: "记录已删除" };
  } catch (error) {
    console.error("Delete record error:", error);
    return { success: false, message: "删除失败" };
  }
}

export async function getRecordsByBatchId(batchId: string) {
  try {
    const records = await db.records.findMany({
      where: { batch_id: batchId },
      orderBy: { recorded_at: "desc" },
    });
    return records;
  } catch (error) {
    console.error("Get records error:", error);
    return [];
  }
}
