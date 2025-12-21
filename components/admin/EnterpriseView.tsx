import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  FileBadge,
  FlaskConical,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";

export default async function EnterpriseView() {

  const batches = await db.batches.findMany({
    orderBy: { created_at: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-100 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FlaskConical className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">12</div>
              <div className="text-xs text-blue-600 font-medium">
                待检测批次
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-100 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">98.5%</div>
              <div className="text-xs text-green-600 font-medium">
                本月合格率
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-900">0</div>
              <div className="text-xs text-red-600 font-medium">
                严重质量告警
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. 批次检索与列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FileBadge className="w-5 h-5 text-blue-600" />
            近期批次质检列表
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="输入批次号查询..."
              className="pl-9 h-9 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="p-4 hover:bg-blue-50/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-gray-700">
                    {batch.batch_no}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
                    {batch.variety}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  创建于:{" "}
                  {format(new Date(batch.created_at as Date), "yyyy-MM-dd HH:mm")}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right mr-4 hidden sm:block">
                  <div className="text-xs text-gray-400">检测状态</div>
                  <div className="text-sm font-medium text-orange-500">
                    待录入
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <FlaskConical className="w-4 h-4 mr-2" />
                  录入检测
                </Button>
                <Link href={`/trace/${batch.batch_no}`}>
                  <Button size="sm" variant="ghost" className="text-gray-500">
                    查看
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-gray-50 text-center text-xs text-gray-500 border-t border-gray-200">
          显示最近 {batches.length} 条记录
        </div>
      </div>
    </div>
  );
}
