import {
  ArrowLeft,
  Beaker,
  FileText,
  Microscope,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { addQualityReportAction } from "@/app/actions/add-quality";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/db";

export default async function AddQualityPage({
  searchParams,
}: {
  searchParams: Promise<{ batchId: string }>;
}) {
  const { batchId } = await searchParams;

  if (!batchId) {
    redirect("/admin");
  }

  const batch = await db.batches.findUnique({
    where: { id: batchId },
  });

  if (!batch) {
    return <div>批次不存在</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-t-4 border-t-blue-600">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/admin"
              className="text-sm text-gray-500 hover:text-blue-600 flex items-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> 返回列表
            </Link>
            <div className="bg-blue-100 p-2 rounded-full">
              <Microscope className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            录入质检报告
          </CardTitle>
          <CardDescription>
            请依据实验室检测结果，如实填写以下数据。
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* 批次信息摘要 */}
          <div className="bg-blue-50/50 p-4 rounded-lg mb-6 border border-blue-100 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">检测批次号:</span>
              <span className="font-mono font-bold text-gray-800">
                {batch.batch_no}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">西瓜品种:</span>
              <span className="font-medium text-gray-800">{batch.variety}</span>
            </div>
          </div>

          {/* 表单区域 */}
          <form action={addQualityReportAction} className="space-y-5">
            {/* 隐藏字段：传递 batchId */}
            <input type="hidden" name="batchId" value={batchId} />

            {/* 1. 糖度检测 */}
            <div className="space-y-2">
              <Label htmlFor="sugar" className="flex items-center gap-2">
                <Beaker className="w-4 h-4 text-blue-500" />
                中心糖度检测 (Brix %)
              </Label>
              <div className="relative">
                <Input
                  id="sugar"
                  name="sugarContent"
                  type="number"
                  step="0.1"
                  placeholder="例如: 12.5"
                  required
                  className="pl-3 pr-8"
                />
                <span className="absolute right-3 top-2.5 text-gray-400 text-sm font-medium">
                  %
                </span>
              </div>
              <p className="text-[10px] text-gray-400">
                *标准西瓜中心糖度通常在 10% - 13% 之间
              </p>
            </div>

            {/* 2. 农残检测结果 */}
            <div className="space-y-2">
              <Label htmlFor="pesticide" className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-600" />
                农药残留检测结论
              </Label>
              <select
                id="pesticide"
                name="pesticideResidue"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="未检出">未检出 (合格)</option>
                <option value="符合标准">符合国家标准 (合格)</option>
                <option value="超标">⚠ 残留超标 (不合格)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inspector" className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-gray-500" />
                检测员 / 机构名称
              </Label>
              <Input
                id="inspector"
                name="inspector"
                placeholder="请输入检测员姓名或机构名"
                defaultValue="企业质检部01"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 mt-4 text-white"
            >
              提交检测报告
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
