import { format } from "date-fns";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Droplets,
  FileSignature,
  FlaskConical,
  Hammer,
  Landmark,
  Leaf,
  MapPin,
  PenTool,
  Percent,
  ShieldAlert,
  ShieldCheck,
  Sprout,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import TraceQRCode from "@/components/ui/TraceQRCode.client";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

interface QualityReport {
  sugar?: string;
  pesticide?: string;
  inspector?: string;
  date?: string;
  result?: string;
}

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
          <p className="text-gray-500 max-w-xs mx-auto text-sm">
            溯源码{" "}
            <span className="font-mono font-bold text-gray-700">{id}</span>{" "}
            不存在
          </p>
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

  const report = batch.quality_report as unknown as QualityReport;
  const hasReport = report?.result;

  const isApproved = batch.status === "approved";
  const isRejected = batch.status === "rejected";

  const headerGradient = isRejected
    ? "from-red-600 to-red-800"
    : "from-emerald-500 to-green-700";

  const newLocal = "relative h-64 overflow-hidden bg-gradient-to-br transition-colors duration-500";
  const newLocal_1 = "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm relative overflow-hidden";
  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative">

      {isRejected && (
        <div className="bg-red-600 text-white px-4 py-3 flex items-start gap-3 relative z-50 animate-in slide-in-from-top duration-500">
          <ShieldAlert className="w-6 h-6 shrink-0 animate-pulse text-yellow-300" />
          <div>
            <h3 className="font-bold text-sm">
              风险预警：该批次未通过监管审核
            </h3>
            <p className="text-xs opacity-90 mt-1 leading-relaxed">
              监管部门检测到该批次存在异常或不符合标准，为了您的健康，请谨慎购买。
            </p>
          </div>
        </div>
      )}


      <div
        className={cn(
          newLocal,
          headerGradient,
        )}
      >
        {/* 背景装饰纹理 */}
        <Sprout className="absolute -right-10 -top-10 w-40 h-40 text-white/10 rotate-12" />
        <Leaf className="absolute left-5 top-10 w-20 h-20 text-white/10 -rotate-45" />

        {/* 底部渐变遮罩 */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 p-6 text-white w-full z-10">

          <div className="flex flex-wrap gap-2 mb-3">

            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
              <CheckCircle2 className="w-3 h-3 mr-1" /> 正品溯源
            </Badge>

            {isApproved && (
              <Badge className="bg-blue-500/90 hover:bg-blue-600 text-white border-none backdrop-blur-sm shadow-sm">
                <Landmark className="w-3 h-3 mr-1" /> 监管审核合规
              </Badge>
            )}

            {isRejected && (
              <Badge className="bg-red-500/90 hover:bg-red-600 text-white border-none backdrop-blur-sm shadow-sm">
                <AlertTriangle className="w-3 h-3 mr-1" /> 监管已驳回
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-1 drop-shadow-md">
            {batch.variety}
          </h1>
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
                <div className="font-mono font-bold text-gray-800 text-lg">
                  {batch.batch_no}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">监管状态</div>

                <div
                  className={cn("font-medium text-sm flex items-center", {
                    "text-green-600": isApproved,
                    "text-red-600": isRejected,
                    "text-blue-600": !isApproved && !isRejected,
                  })}
                >
                  {isApproved && (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 政府监管通过
                    </>
                  )}
                  {isRejected && (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" />{" "}
                      存在异常风险
                    </>
                  )}
                  {!isApproved && !isRejected && (
                    <>
                      <Clock className="w-3.5 h-3.5 mr-1" /> 生产/监管中
                    </>
                  )}
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

      {hasReport && (
        <div className="px-4 mt-6 animate-in fade-in zoom-in duration-500">
          <div className={newLocal_1}>

            <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-100/50 rotate-12" />

            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="bg-blue-100 p-1.5 rounded-full">
                <FlaskConical className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-bold text-blue-900 text-sm">
                品质与安全检测报告
              </h3>

              {report.result === "FAIL" ? (
                <span className="ml-auto text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold border border-red-200">
                  不合格
                </span>
              ) : (
                <span className="ml-auto text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold border border-green-200">
                  检测合格
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">

              <div className="bg-white/70 p-3 rounded-lg backdrop-blur-sm border border-white/50 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <Percent className="w-3.5 h-3.5 text-orange-500" />
                  中心糖度
                </div>
                <div className="text-xl font-bold text-gray-800">
                  {report.sugar}
                </div>
              </div>

              <div className="bg-white/70 p-3 rounded-lg backdrop-blur-sm border border-white/50 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                  农残检测
                </div>
                <div
                  className={cn(
                    "text-xl font-bold",
                    report.result === "FAIL"
                      ? "text-red-600"
                      : "text-green-700",
                  )}
                >
                  {report.pesticide}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-200/50 flex justify-between items-center text-[10px] relative z-10">
              <div className="flex items-center text-blue-800/70">
                <FileSignature className="w-3 h-3 mr-1" />
                检测方: {report.inspector}
              </div>
              <div className="text-blue-800/70">
                {format(new Date(report.date || new Date()), "yyyy-MM-dd")}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 py-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <Sprout className="w-5 h-5 mr-2 text-green-600" />
          全流程溯源档案
        </h2>

        <div className="relative border-l-2 border-green-200 ml-3 space-y-8 pb-10">

          {batch.records.map((record) => {
            const Icon = getActionIcon(record.action_type);
            const colorClass = getActionColor(record.action_type);

            return (
              <div key={record.id} className="relative pl-8">

                <div
                  className={`absolute -left-2.25 top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${record.action_type === "harvest"
                    ? "bg-green-600"
                    : "bg-gray-300"
                    }`}
                />

                <div className="flex flex-col">
                  {/* 时间 */}
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

                      <div className="w-full">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {record.description}
                        </p>

                        {record.images && record.images.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {record.images.map((imgUrl) => (
                              <div
                                key={imgUrl}
                                className="relative h-24 w-full rounded-md overflow-hidden border border-gray-100"
                              >
                                <Image
                                  src={imgUrl}
                                  alt="农事记录图片"
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            ))}
                          </div>
                        )}
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

          {/* 循环 2: 播种定植 (最旧的，放在底部作为起点) */}
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
        </div>

        <div className="text-center mt-10 pb-10">
          <p className="text-xs text-gray-300">清苑区农业农村局 · 监管认证</p>
          <p className="text-[10px] text-gray-200 mt-1">溯源码: {id}</p>
        </div>
      </div>
    </div>
  );
}
