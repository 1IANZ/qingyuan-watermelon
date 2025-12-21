"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth-helper"; 
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
      where: { id: user.userId },});
    
    if (dbUser && dbUser.real_name) {
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

    revalidatePath("/admin");
    } catch (error) {
    console.error("数据库写入失败:", error);
    return { message: "数据库写入失败", success: false };
  }

  redirect("/admin");
}