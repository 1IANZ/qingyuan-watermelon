"use client";

import {
  Calendar,
  CheckCircle2,
  Droplets,
  FlaskConical,
  Hammer,
  Leaf,
  MapPin,
  Sprout,
  Truck,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- 1. 模拟后端返回的数据 (Mock Data) ---
const MOCK_DATA = {
  productInfo: {
    id: "20230620-8823",
    variety: "清苑麒麟8424",
    location: "清苑区东闾乡示范基地 A03棚",
    producer: "绿源精品西瓜合作社",
    harvestDate: "2023-06-18",
  },
  qualityReport: {
    status: "合格",
    sugar: "12.8%",
    pesticide: "未检出",
    tester: "河北省农产品质量检测中心",
  },
  timeline: [
    {
      id: "evt_001", // ✅ 新增唯一 ID
      date: "2023-04-01 08:30",
      type: "planting",
      title: "播种育苗",
      desc: "选用优质嫁接苗，沙土地定植，底肥充足。",
      operator: "张三 (农户)",
    },
    {
      id: "evt_002", // ✅ 新增唯一 ID
      date: "2023-04-20 10:15",
      type: "water",
      title: "滴灌作业",
      desc: "引用深层井水进行水肥一体化滴灌。",
      operator: "张三 (农户)",
    },
    {
      id: "evt_003", // ✅ 新增唯一 ID
      date: "2023-05-15 09:00",
      type: "fertilizer",
      title: "追肥记录",
      desc: "使用有机水溶肥，促进果实膨大。",
      operator: "张三 (农户)",
    },
    {
      id: "evt_004", // ✅ 新增唯一 ID
      date: "2023-06-18 06:00",
      type: "harvest",
      title: "成熟采摘",
      desc: "果形端正，纹路清晰，敲击声清脆。",
      operator: "李四 (采收员)",
    },
    {
      id: "evt_005", // ✅ 新增唯一 ID
      date: "2023-06-19 14:20",
      type: "transport",
      title: "分拣装车",
      desc: "发往北京新发地市场，冷链运输。",
      operator: "王五 (物流)",
    },
  ],
};

// --- 2. 辅助组件：根据类型返回对应图标 ---
const getEventIcon = (type: string) => {
  switch (type) {
    case "planting":
      return <Sprout className="w-5 h-5 text-white" />;
    case "water":
      return <Droplets className="w-5 h-5 text-white" />;
    case "fertilizer":
      return <Leaf className="w-5 h-5 text-white" />;
    case "harvest":
      return <Hammer className="w-5 h-5 text-white" />;
    case "transport":
      return <Truck className="w-5 h-5 text-white" />;
    default:
      return <CheckCircle2 className="w-5 h-5 text-white" />;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case "planting":
      return "bg-green-500";
    case "water":
      return "bg-blue-400";
    case "fertilizer":
      return "bg-amber-500";
    case "harvest":
      return "bg-red-500"; // 收获喜庆色
    case "transport":
      return "bg-indigo-500";
    default:
      return "bg-gray-400";
  }
};

export default function TraceResultPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || MOCK_DATA.productInfo.id; // 获取URL参数

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-green-600 pt-8 pb-16 px-4 rounded-b-[2rem] shadow-md">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-6 h-6" /> 溯源档案验证通过
          </h1>
          <p className="opacity-90 mt-2 text-sm">溯源码：{id}</p>
        </div>
      </div>

      <div className="px-4 -mt-10 max-w-lg mx-auto space-y-6">
        <Card className="shadow-lg border-none">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl text-green-900">
                  {MOCK_DATA.productInfo.variety}
                </CardTitle>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  {MOCK_DATA.productInfo.location}
                </div>
              </div>
              <Badge
                variant="outline"
                className="text-green-600 border-green-200 bg-green-50"
              >
                认证精品
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm mt-2">
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-400 block text-xs">种植主体</span>
                <span className="font-medium text-gray-700">
                  {MOCK_DATA.productInfo.producer}
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-400 block text-xs">上市日期</span>
                <span className="font-medium text-gray-700">
                  {MOCK_DATA.productInfo.harvestDate}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-green-200 bg-green-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center text-gray-800">
              <FlaskConical className="w-4 h-4 mr-2 text-green-600" />
              品质检测报告
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-green-100">
              <div className="text-center w-1/3 border-r">
                <div className="text-xs text-gray-400">综合判定</div>
                <div className="text-green-600 font-bold text-lg">
                  {MOCK_DATA.qualityReport.status}
                </div>
              </div>
              <div className="text-center w-1/3 border-r">
                <div className="text-xs text-gray-400">中心糖度</div>
                <div className="text-gray-800 font-bold">
                  {MOCK_DATA.qualityReport.sugar}
                </div>
              </div>
              <div className="text-center w-1/3">
                <div className="text-xs text-gray-400">农药残留</div>
                <div className="text-gray-800 font-bold">
                  {MOCK_DATA.qualityReport.pesticide}
                </div>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              检测机构：{MOCK_DATA.qualityReport.tester}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 ml-2 flex items-center">
            <Calendar className="w-4 h-4 mr-2" /> 生长与流通记录
          </h3>

          <div className="relative pl-4">
            <div className="absolute left-6 top-2 bottom-4 w-0.5 bg-gray-200" />
            {MOCK_DATA.timeline.map((item) => (
              <div key={item.id} className="relative mb-6 last:mb-0">
                <div className="flex items-start">
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getEventColor(item.type)} shadow-sm border-2 border-white`}
                  >
                    {getEventIcon(item.type)}
                  </div>
                  <div className="ml-4 flex-1 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-800 text-sm">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                        {item.date.split(" ")[0]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="mt-2 text-[10px] text-gray-400 border-t pt-1 flex justify-between">
                      <span>操作人: {item.operator}</span>
                      <span>{item.date.split(" ")[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
