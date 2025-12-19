"use client";

import {
  AlertCircle,
  ChevronRight,
  ClipboardList,
  Plus,
  Sprout,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// 模拟农户名下的所有地块/批次数据
const BATCH_LIST = [
  {
    id: "batch_001",
    name: "清苑A03号暖棚", // 地块名
    variety: "麒麟8424", // 品种
    status: "growing", // 状态：生长中
    stage: "果实膨大期", // 当前阶段
    dayCount: 45, // 种植天数
    progress: 65, // 生长进度条 (0-100)
    lastAction: "2天前 (施肥)", // 最近操作
    warnings: 0, // 预警数量
  },
  {
    id: "batch_002",
    name: "东闾B12号露天田",
    variety: "黑美人",
    status: "warning", // 状态：有预警
    stage: "开花坐果期",
    dayCount: 28,
    progress: 30,
    lastAction: "5天前 (灌溉)",
    warnings: 1, // 有一条未处理预警
  },
  {
    id: "batch_003",
    name: "试验田C区",
    variety: "特小凤 (黄瓤)",
    status: "finished", // 状态：已采收
    stage: "已完结",
    dayCount: 90,
    progress: 100,
    lastAction: "2023-06-15 (采收)",
    warnings: 0,
  },
];

export default function AdminDashboard() {
  const router = useRouter();

  // 跳转到我们刚才写的“添加记录”页面，并带上批次ID
  const handleCardClick = (batchId: string) => {
    router.push(`/admin/add-record?batchId=${batchId}`);
  };

  // 跳转到新建批次页
  const handleCreateNew = () => {
    router.push("/admin/create-batch");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      {/* 1. 顶部欢迎区 */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">工作台</h1>
          <p className="text-sm text-gray-500">欢迎回来，张三 (绿源合作社)</p>
        </div>
        <Button
          size="sm"
          onClick={handleCreateNew}
          className="bg-green-600 hover:bg-green-700 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1" /> 开新批次
        </Button>
      </div>

      {/* 2. 统计概览 (可选) */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-gray-800">3</div>
          <div className="text-xs text-gray-400">进行中</div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-orange-500">1</div>
          <div className="text-xs text-gray-400">待处理</div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-green-600">8</div>
          <div className="text-xs text-gray-400">已上市</div>
        </div>
      </div>

      {/* 3. 批次列表 (核心区域) */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-700 flex items-center">
          <ClipboardList className="w-4 h-4 mr-2" />
          种植管理列表
        </h2>

        {BATCH_LIST.map((batch) => (
          <Card
            key={batch.id}
            className={`
              active:scale-95 transition-transform cursor-pointer overflow-hidden border-l-4
              ${batch.status === "warning"
                ? "border-l-red-500"
                : batch.status === "finished"
                  ? "border-l-gray-300 opacity-80"
                  : "border-l-green-500"
              }
            `}
            onClick={() => handleCardClick(batch.id)}
          >
            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-bold text-gray-800 flex items-center">
                  {batch.name}
                  {batch.status === "warning" && (
                    <AlertCircle className="w-4 h-4 text-red-500 ml-2 animate-pulse" />
                  )}
                </CardTitle>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Sprout className="w-3 h-3 mr-1" /> {batch.variety}
                </div>
              </div>
              <Badge
                variant={batch.status === "finished" ? "secondary" : "outline"}
                className="text-xs"
              >
                {batch.stage}
              </Badge>
            </CardHeader>

            <CardContent className="pb-3 px-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>生长进度 (第{batch.dayCount}天)</span>
                <span>{batch.progress}%</span>
              </div>
              <Progress
                value={batch.progress}
                className={`h-2 ${batch.status === 'warning'
                  ? '**:data-[slot=progress-indicator]:bg-orange-400'
                  : '**:data-[slot=progress-indicator]:bg-green-500'
                  }`}
              />

              <div className="mt-3 bg-gray-50 p-2 rounded flex items-center justify-between text-xs">
                <span className="text-gray-400">最近操作:</span>
                <span className="font-medium text-gray-600">
                  {batch.lastAction}
                </span>
              </div>
            </CardContent>

            <CardFooter className="bg-gray-50/50 py-2 px-4 flex justify-between items-center border-t border-gray-100">
              <span className="text-[10px] text-gray-400">ID: {batch.id}</span>
              <div className="flex items-center text-xs text-green-600 font-medium">
                去记录 <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
