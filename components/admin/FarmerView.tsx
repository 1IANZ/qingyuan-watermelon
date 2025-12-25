import { format } from "date-fns";
import {
  CalendarDays,
  ExternalLink,
  FlaskConical,
  History,
  MapPin,
  Plus,
  QrCode,
  Sprout,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { db } from "@/lib/db";

function getTypeName(type: string) {
  const map: Record<string, string> = {
    water: "灌溉",
    fertilizer: "施肥",
    pesticide: "植保/打药",
    harvest: "采收",
    sowing: "播种",
    custom: "农事操作",
  };
  return map[type] || type;
}

function StatusBadge({ status }: { status: string | null }) {
  if (status === "approved")
    return (
      <span className="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full border border-green-200">
        已通过监管审核
      </span>
    );
  if (status === "rejected")
    return (
      <span className="text-xs font-medium bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full border border-red-200">
        监管驳回/异常
      </span>
    );
  if (status === "finished")
    return (
      <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full border border-gray-200">
        已采收上市
      </span>
    );
  return (
    <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full border border-blue-100">
      种植生产中
    </span>
  );
}

export default async function FarmerView({ userId }: { userId: string }) {
  const batches = await db.batches.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
    include: {
      records: {
        take: 1,
        orderBy: { recorded_at: "desc" },
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* 1. 顶部操作栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-green-100 dark:border-green-900">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">我的种植管理</h2>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            欢迎回来，请及时录入农事操作以保证溯源完整性。
          </p>
        </div>
        <div className="flex gap-2">
          {/* Removed the "基础数据" link */}
          <Link href="/admin/create-batch">
            <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 shadow-md">
              <Plus className="w-4 h-4 mr-2" /> 新建种植批次
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. 批次列表 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {batches.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <Sprout className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              暂无种植批次，开始您的第一次溯源吧！
            </p>
          </div>
        ) : (
          batches.map((batch) => {
            const lastRecord = batch.records[0];
            return (
              <Card
                key={batch.id}
                className="group hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                {/* Header: 显示批次号和状态 */}
                <CardHeader className="bg-green-50/30 dark:bg-green-950/30 border-b border-green-100 dark:border-green-900 py-3 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-1.5 rounded-md">
                      <QrCode className="w-5 h-5" />
                    </span>
                    <span className="font-mono font-bold text-gray-700 dark:text-gray-200 text-lg">
                      {batch.batch_no}
                    </span>
                  </div>
                  {/* 使用新的状态组件 */}
                  <StatusBadge status={batch.status} />
                </CardHeader>

                <CardContent className="pt-4 grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
                      <Sprout className="w-3 h-3 mr-1" /> 品种
                    </div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {batch.variety}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" /> 地块/大棚
                    </div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {batch.location}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
                      <CalendarDays className="w-3 h-3 mr-1" /> 播种日期
                    </div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {format(new Date(batch.sowing_date), "yyyy-MM-dd")}
                    </div>
                  </div>
                  <div className="sm:col-span-3 bg-orange-50/50 dark:bg-orange-950/30 rounded-lg p-3 text-sm mt-2 flex items-center justify-between border border-orange-100 dark:border-orange-900">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <History className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                      <span className="font-medium text-orange-900 dark:text-orange-300">
                        最新动态:
                      </span>
                      <span>
                        {lastRecord
                          ? `${format(
                            new Date(lastRecord.recorded_at as Date),
                            "MM-dd",
                          )} - ${getTypeName(lastRecord.action_type)}`
                          : "暂无操作记录"}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50/50 dark:bg-gray-900/50 py-3 gap-3">
                  <Link
                    href={`/admin/add-record?batchId=${batch.id}`}
                    className="flex-1"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 h-9 shadow-sm">
                      <Plus className="w-4 h-4 mr-2" /> 录入农事
                    </Button>
                  </Link>
                  <Link
                    href={`/trace/${batch.batch_no}`}
                    className="flex-1"
                    target="_blank"
                  >
                    <Button
                      variant="outline"
                      className="w-full h-9 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" /> 查看溯源
                    </Button>
                  </Link>
                  <Link href={`/admin/quality/${batch.id}`}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
                      title="质量管理"
                    >
                      <FlaskConical className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
