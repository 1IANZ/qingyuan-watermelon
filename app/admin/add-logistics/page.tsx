import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth-helper";
import { db } from "@/lib/db";
import LogisticsForm from "./LogisticsForm.client";

export default async function AddLogisticsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const batchId = sp.batchId as string;
  const user = await getCurrentUser();

  if (!batchId) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500">参数错误:缺少批次 ID</p>
        <Link href="/admin">
          <Button className="mt-4">返回首页</Button>
        </Link>
      </div>
    );
  }

  const batch = await db.batches.findUnique({
    where: { id: batchId },
  });

  if (!batch) {
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400">
        找不到该批次信息
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pb-20">
      <div className="flex items-center mb-6">
        <Link href="/admin">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2 mr-1 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          新增流通记录
        </h1>
      </div>

      <LogisticsForm batch={batch} defaultOperator={user?.realName || ""} />
    </div>
  );
}
