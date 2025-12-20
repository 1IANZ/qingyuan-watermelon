import { format } from "date-fns";
import {
  CheckCircle2,
  Clock,
  Droplets,
  Hammer,
  Leaf,
  MapPin,
  PenTool,
  QrCode,
  Sprout,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";

function getActionIcon(type: string) {
  switch (type) {
    case "water":
      return Droplets;
    case "fertilizer":
      return Leaf;
    case "pesticide":
      return Hammer;
    case "harvest":
      return Truck;
    default:
      return PenTool;
  }
}

function getActionColor(type: string) {
  switch (type) {
    case "water":
      return "bg-blue-100 text-blue-600";
    case "fertilizer":
      return "bg-amber-100 text-amber-600";
    case "pesticide":
      return "bg-red-100 text-red-600";
    case "harvest":
      return "bg-green-100 text-green-600";
    default:
      return "bg-purple-100 text-purple-600";
  }
}

function getTypeName(type: string) {
  const map: Record<string, string> = {
    water: "灌溉水源",
    fertilizer: "施肥养护",
    pesticide: "绿色防控",
    harvest: "成熟采摘",
    custom: "农事操作",
  };
  return map[type] || "农事操作";
}

// 🟢 这是一个公开页面 (Server Component)
export default async function TracePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. 查库：获取批次信息及其所有记录
  const batch = await db.batches.findUnique({
    where: { id },
    include: {
      records: {
        orderBy: { recorded_at: "desc" }, // 按时间倒序排列 (最新的在最上面)
      },
    },
  });

  if (!batch) {
    return notFound();
  }

  // 2. 静态资源模拟 (实际项目中根据 variety 显示不同图片)
  const bgImage =
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800";

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      <div className="relative h-64 bg-gray-900">
        <Image
          src={bgImage}
          alt="西瓜种植基地"
          fill // 自动填充父容器
          className="object-cover opacity-80" // 保持样式
          priority // 优先加载这张图，防止闪烁
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 to-transparent" />

        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
          <Badge className="bg-green-500 hover:bg-green-600 mb-2 border-none">
            <CheckCircle2 className="w-3 h-3 mr-1" /> 官方正品认证
          </Badge>
          <h1 className="text-3xl font-bold mb-1">{batch.variety}</h1>
          <div className="flex items-center text-gray-300 text-sm">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {batch.location}
          </div>
        </div>
      </div>

      {/* --- 核心信息卡 --- */}
      <div className="relative -mt-6 px-4 z-10">
        <Card className="shadow-lg border-none">
          <CardContent className="pt-6 pb-6 grid grid-cols-2 gap-y-4">
            <div>
              <div className="text-xs text-gray-400 mb-0.5">溯源批次号</div>
              <div className="font-mono font-bold text-gray-800 text-lg">
                {batch.batch_no}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-0.5">播种日期</div>
              <div className="font-medium text-gray-800">
                {format(new Date(batch.sowing_date), "yyyy年MM月dd日")}
              </div>
            </div>
            <div className="col-span-2 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400 mb-0.5">认证主体</div>
                <div className="font-medium text-gray-800 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1 text-green-600" />
                  绿源精品西瓜合作社
                </div>
              </div>
              <QrCode className="w-8 h-8 text-gray-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- 溯源时间轴 --- */}
      <div className="px-6 py-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <Sprout className="w-5 h-5 mr-2 text-green-600" />
          全流程溯源档案
        </h2>

        <div className="relative border-l-2 border-green-200 ml-3 space-y-8 pb-10">
          <div className="relative pl-8">
            <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow-sm" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-mono mb-1">
                {format(new Date(batch.sowing_date), "yyyy-MM-dd HH:mm")}
              </span>
              <span className="font-bold text-gray-800 text-base">
                🌱 播种定植
              </span>
              <div className="mt-2 text-sm text-gray-600 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                优质种苗定植，开启生长周期。
              </div>
            </div>
          </div>

          {batch.records.map((record) => {
            const Icon = getActionIcon(record.action_type);
            const colorClass = getActionColor(record.action_type);

            return (
              <div key={record.id} className="relative pl-8">
                <div
                  className={`absolute -left-2.25 top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${record.action_type === "harvest" ? "bg-green-600" : "bg-gray-300"}`}
                />

                <div className="flex flex-col">
                  <div className="flex items-center text-xs text-gray-400 mb-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {format(
                      new Date(record.recorded_at as Date),
                      "MM-dd HH:mm",
                    )}
                  </div>

                  <span className="font-bold text-gray-800 text-base flex items-center">
                    {getTypeName(record.action_type)}
                  </span>

                  <div className="mt-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {record.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-2 flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          操作人: {record.operator}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10 pb-10">
          <p className="text-xs text-gray-300">清苑区农业农村局 · 监管认证</p>
          <p className="text-[10px] text-gray-200 mt-1">溯源码: {id}</p>
        </div>
      </div>
    </div>
  );
}
