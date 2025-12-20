import { format } from "date-fns";
import {
  CalendarDays,
  ClipboardList,
  History,
  MapPin,
  Plus,
  QrCode, // 新增二维码图标，强调溯源属性
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

// 辅助函数：操作类型转中文
function getTypeName(type: string) {
  const map: Record<string, string> = {
    water: "灌溉",
    fertilizer: "施肥",
    pesticide: "植保/打药", // 强调农药记录
    harvest: "采收",
    custom: "其他农事",
  };
  return map[type] || "农事操作";
}

// 辅助函数：状态转中文及样式
function getStatusConfig(status: string | null) {
  switch (status) {
    case "finished":
      return {
        label: "已采收上市",
        color: "bg-gray-100 text-gray-500 border-gray-200",
      };
    case "warning":
      return {
        label: "异常/预警",
        color: "bg-red-50 text-red-600 border-red-200",
      };
    default:
      return {
        label: "种植中",
        color: "bg-green-50 text-green-700 border-green-200",
      };
  }
}

export default async function AdminPage() {
  // 1. 查询数据库：按创建时间倒序
  const batches = await db.batches.findMany({
    orderBy: { created_at: "desc" },
    include: {
      records: {
        take: 1, // 只取最新的一条记录
        orderBy: { recorded_at: "desc" },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      {/* 1. 顶部标头 */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">溯源管理工作台</h1>
          <p className="text-sm text-gray-500">
            清苑西瓜溯源与品质协同监管系统
          </p>
        </div>
        <Link href="/admin/create-batch">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1" /> 新建批次
          </Button>
        </Link>
      </div>

      {/* 2. 批次列表区域 */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-700 flex items-center mb-4">
          <ClipboardList className="w-4 h-4 mr-2" />
          种植批次档案 ({batches.length})
        </h2>

        {batches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sprout className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">暂无溯源档案</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">
              请点击右上角新建批次，开始“一株一码”溯源
            </p>
            <Link href="/admin/create-batch">
              <Button variant="outline">立即新建</Button>
            </Link>
          </div>
        ) : (
          batches.map((batch) => {
            const statusConfig = getStatusConfig(batch.status);
            const lastRecord = batch.records[0];
            const sowingDate = format(
              new Date(batch.sowing_date),
              "yyyy年MM月dd日",
            );

            return (
              <Card
                key={batch.id}
                className="overflow-hidden border-l-4 border-l-green-600 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* 卡片头部：批次号 + 状态 */}
                <CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center justify-between space-y-0 border-b border-gray-100 bg-gray-50/30">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-gray-400" />
                    <span className="font-mono font-bold text-gray-700 text-lg">
                      {batch.batch_no}
                    </span>
                  </div>
                  <div
                    className={`text-xs px-2.5 py-0.5 rounded-full border ${statusConfig.color} font-medium`}
                  >
                    {statusConfig.label}
                  </div>
                </CardHeader>

                {/* 卡片内容：核心档案信息 */}
                <CardContent className="pt-4 pb-4 px-4">
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                    {/* 第一行：品种 & 地块 */}
                    <div className="flex items-center text-gray-600">
                      <Sprout className="w-4 h-4 mr-2 text-green-600 shrink-0" />
                      <span className="font-medium text-gray-900">
                        {batch.variety}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-blue-500 shrink-0" />
                      <span className="truncate">{batch.location}</span>
                    </div>

                    {/* 第二行：播种时间 */}
                    <div className="flex items-center text-gray-500 col-span-2">
                      <CalendarDays className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                      <span>播种日期: {sowingDate}</span>
                    </div>
                  </div>

                  {/* 重点：最近农事记录展示区 */}
                  <div className="mt-4 bg-orange-50/50 rounded-lg p-3 border border-orange-100">
                    <div className="flex items-center text-xs text-orange-800 mb-1 font-semibold">
                      <History className="w-3.5 h-3.5 mr-1.5" />
                      最新溯源动态
                    </div>
                    {lastRecord ? (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-900 font-medium">
                          {getTypeName(lastRecord.action_type)}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {format(
                            new Date(lastRecord.recorded_at as Date),
                            "MM-dd HH:mm",
                          )}
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 italic">
                        暂无操作记录，请尽快录入
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="bg-gray-50 py-2 px-4 flex gap-2">
                  <Link href={`/admin/add-record?batchId=${batch.id}`} className="flex-1">
                    <Button variant="default" className="w-full bg-green-600 hover:bg-green-700 h-9 text-xs">
                      <Plus className="w-3.5 h-3.5 mr-1" /> 录入农事
                    </Button>
                  </Link>


                  <Link href={`/trace/${batch.batch_no}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full h-9 text-xs bg-white text-gray-600"
                    >
                      <QrCode className="w-3.5 h-3.5 mr-1" />
                      查看溯源页
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
