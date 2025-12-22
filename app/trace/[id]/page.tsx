import { format } from "date-fns";
import {
  CheckCircle2,
  Clock,
  Droplets,
  FlaskConical,
  Hammer,
  Landmark,
  Leaf,
  MapPin,
  PenTool,
  ShieldAlert,
  ShieldCheck,
  Sprout,
  Star,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import FeedbackForm from "@/components/ui/FeedbackForm";
import TraceQRCode from "@/components/ui/TraceQRCode.client";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";


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

export default async function TracePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const batch = await db.batches.findFirst({
    where: { batch_no: id },
    include: {
      records: {
        orderBy: { recorded_at: "desc" },
      },
      inspections: {
        orderBy: { created_at: "asc" },
      },
      feedbacks: {
        orderBy: { created_at: "desc" },
      },
    },
  });

  if (!batch) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center space-y-4">
          <div className="bg-gray-100 p-4 rounded-full inline-block">
            <Sprout className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">未找到该批次档案</h1>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg text-sm"
          >
            返回首页
          </a>
        </div>
      </div>
    );
  }

  const isApproved = batch.status === "approved";
  const isRejected = batch.status === "rejected";

  const hasFail = batch.inspections.some((i) => i.result === "fail");

  const headerGradient =
    isRejected || hasFail
      ? "from-red-600 to-red-800"
      : "from-emerald-500 to-green-700";

  const stageMap: Record<string, string> = {
    planting: "种植期检测",
    harvest: "采收期检测",
    transport: "流通抽检",
    market: "销售复检",
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative pb-10">
      {(isRejected || hasFail) && (
        <div className="bg-red-600 text-white px-4 py-3 flex items-start gap-3 relative z-50 animate-in slide-in-from-top duration-500">
          <ShieldAlert className="w-6 h-6 shrink-0 animate-pulse text-yellow-300" />
          <div>
            <h3 className="font-bold text-sm">
              风险预警：该批次存在质量风险
            </h3>
            <p className="text-xs opacity-90 mt-1 leading-relaxed">
              监管部门检测到异常或不符合标准，请谨慎购买。
            </p>
          </div>
        </div>
      )}

      <div className={cn("relative h-64 overflow-hidden bg-linear-to-br transition-colors duration-500", headerGradient)}>
        <Sprout className="absolute -right-10 -top-10 w-40 h-40 text-white/10 rotate-12" />
        <Leaf className="absolute left-5 top-10 w-20 h-20 text-white/10 -rotate-45" />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 p-6 text-white w-full z-10">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
              <CheckCircle2 className="w-3 h-3 mr-1" /> 正品溯源
            </Badge>
            {isApproved && !hasFail && (
              <Badge className="bg-blue-500/90 hover:bg-blue-600 text-white border-none backdrop-blur-sm shadow-sm">
                <Landmark className="w-3 h-3 mr-1" /> 监管审核合规
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-1 drop-shadow-md">{batch.variety}</h1>
          <div className="flex items-center text-white/90 text-sm font-medium">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {batch.location}
          </div>
        </div>
      </div>

      <div className="relative -mt-6 px-4 z-10">
        <Card className="shadow-lg border-none">
          <CardContent className="pt-6 pb-6 grid grid-cols-2 gap-y-4">
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-400 mb-0.5">溯源批次号</div>
                <div className="font-mono font-bold text-gray-800 text-lg">{batch.batch_no}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">综合状态</div>
                <div className={cn("font-medium text-sm flex items-center", {
                  "text-green-600": !hasFail && !isRejected,
                  "text-red-600": hasFail || isRejected
                })}>
                  {hasFail || isRejected ? "存在风险" : "正常流通"}
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center">
              <TraceQRCode batchNo={batch.batch_no} />
            </div>
            <div className="col-span-2 pt-4 border-t border-gray-100 mt-2">
              <div className="text-xs text-gray-400 mb-0.5">生产经营主体</div>
              <div className="font-medium text-gray-800 flex items-center">
                <User className="w-3.5 h-3.5 mr-1 text-green-600" />
                绿源精品西瓜合作社
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Multi-stage Inspections List */}
      {batch.inspections.length > 0 && (
        <div className="px-4 mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <FlaskConical className="w-5 h-5 mr-2 text-blue-600" />
            全过程品质检控
          </h2>
          <div className="space-y-3">
            {batch.inspections.map((insp) => (
              <div key={insp.id} className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div>
                    <div className="font-bold text-gray-800 text-sm">{stageMap[insp.stage] || insp.stage}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {format(new Date(insp.created_at || new Date()), "yyyy-MM-dd HH:mm")}
                    </div>
                  </div>
                  {insp.result === "pass" ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">合格</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">不合格</Badge>
                  )}
                </div>

                {/* Report Data Grid */}
                {insp.report_data && (
                  <div className="grid grid-cols-2 gap-2 mt-3 bg-gray-50/80 p-2 rounded relative z-10">
                    {Object.entries(insp.report_data as Record<string, string>).map(([k, v]) => {
                      if (k === 'date' || !v) return null;
                      const labelMap: Record<string, string> = { sugar: '糖度', pesticide: '农残', notes: '备注' };
                      return (
                        <div key={k} className="flex flex-col">
                          <span className="text-[10px] text-gray-400">{labelMap[k] || k}</span>
                          <span className="font-medium text-xs text-gray-700 truncate">{v}</span>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="mt-2 text-[10px] text-blue-800/60 text-right relative z-10">
                  检测员: {insp.inspector || 'System'}
                </div>

                {/* Background decor */}
                <ShieldCheck className="absolute -right-2 -bottom-2 w-16 h-16 text-blue-50 rotate-12 z-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Farming Records Timeline */}
      <div className="px-6 py-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <Sprout className="w-5 h-5 mr-2 text-green-600" />
          全流程溯源档案
        </h2>

        <div className="relative border-l-2 border-green-200 ml-3 space-y-8">
          {/* Rendering Existing Records Logic (Simplified Reuse) */}
          {batch.records.map((record) => {
            const Icon = getActionIcon(record.action_type);
            const colorClass = getActionColor(record.action_type);
            return (
              <div key={record.id} className="relative pl-8">
                <div className={`absolute -left-2.25 top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${record.action_type === 'harvest' ? 'bg-green-600' : 'bg-gray-300'}`} />
                <div className="flex flex-col">
                  <div className="flex items-center text-xs text-gray-400 mb-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {format(new Date(record.recorded_at as Date), "MM-dd HH:mm")}
                  </div>
                  <span className="font-bold text-gray-800 text-base">{getTypeName(record.action_type)}</span>
                  <div className="mt-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="w-full">
                        <p className="text-sm text-gray-700 leading-relaxed">{record.description}</p>
                        {record.images && record.images.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {record.images.map(url => (
                              <div key={url} className="relative h-24 w-full rounded overflow-hidden">
                                <Image src={url} alt="img" fill className="object-cover" unoptimized />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="relative pl-8 pb-4">
            <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow-sm" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-mono mb-1">
                {format(new Date(batch.sowing_date), "yyyy-MM-dd")}
              </span>
              <span className="font-bold text-gray-800 text-base">🌱 播种定植</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-12 mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-orange-500" />
          消费者口碑
        </h2>

        {batch.feedbacks.length > 0 ? (
          <div className="mb-8 space-y-4">
            {batch.feedbacks.map(fb => (
              <div key={fb.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-3 h-3 ${star <= fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400">{format(new Date(fb.created_at || new Date()), "yyyy-MM-dd")}</span>
                </div>
                <p className="text-xs text-gray-700">{fb.content || "默认好评"}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200 mb-6">
            <p className="text-xs text-gray-400">暂无评价，快来抢占沙发吧~</p>
          </div>
        )}

        <FeedbackForm batchId={batch.id} batchNo={batch.batch_no} />
      </div>

    </div>
  );
}
