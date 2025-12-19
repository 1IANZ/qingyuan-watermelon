"use client";

import {
  ArrowLeft,
  Calendar,
  Camera,
  Droplets,
  Hammer,
  Leaf,
  MapPin,
  PenTool,
  Save,
  Tag,
  Truck,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BatchType {
  name: string;
  variety: string;
  location: string;
  days: number;
}
// --- 1. 配置数据：定义操作类型和对应的快捷标签 ---
const ACTION_TYPES = [
  {
    id: "water",
    label: "灌溉",
    icon: Droplets,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    tags: ["井水滴灌", "喷灌", "水肥一体化", "抗旱浇水"],
  },
  {
    id: "fertilizer",
    label: "施肥",
    icon: Leaf,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    tags: ["有机肥", "复合肥", "水溶肥", "农家肥", "钾肥"],
  },
  {
    id: "pesticide",
    label: "植保",
    icon: Hammer,
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    tags: ["生物防治", "粘虫板", "除草作业", "预防白粉病"],
  },
  {
    id: "harvest",
    label: "采收",
    icon: Truck,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    tags: ["首批采摘", "分批采摘", "测糖合格", "挑选装箱"],
  },
  {
    id: "custom",
    label: "其他",
    icon: PenTool,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    tags: ["大棚修缮", "整枝打叉", "授粉", "清理杂草", "农机作业"],
  },
];

// --- 2. 模拟数据库 (用于根据 URL 的 batchId 显示顶部信息) ---
const MOCK_BATCH_DB: Record<string, BatchType> = {
  batch_001: {
    name: "清苑A03号暖棚",
    variety: "麒麟8424",
    location: "清苑示范基地-A区",
    days: 45,
  },
  batch_002: {
    name: "东闾B12号露天田",
    variety: "黑美人",
    location: "东闾乡-B区",
    days: 28,
  },
  // 默认兜底数据
  default: {
    name: "未知地块",
    variety: "未登记品种",
    location: "未知位置",
    days: 0,
  },
};

// --- 3. 核心表单组件 ---
function RecordForm() {
  // 获取 URL 参数
  const searchParams = useSearchParams();
  const batchId = searchParams.get("batchId"); // 获取 ?batchId=...

  // 根据 ID 查找信息 (模拟数据库查询)
  const batchInfo = MOCK_BATCH_DB[batchId || ""] || MOCK_BATCH_DB.default;

  // 状态管理
  const [selectedType, setSelectedType] = useState(ACTION_TYPES[0].id);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 获取当前配置
  const currentTypeConfig =
    ACTION_TYPES.find((t) => t.id === selectedType) || ACTION_TYPES[0];
  const CurrentIcon = currentTypeConfig.icon;

  const handleTagClick = (tag: string) => {
    setDescription((prev) => (prev ? `${prev}, ${tag}` : tag));
  };

  const handleSubmit = () => {
    if (!description) {
      alert("请填写或选择具体内容");
      return;
    }
    setIsSubmitting(true);

    // 模拟提交
    console.log("提交数据:", {
      batchId: batchId,
      type: selectedType,
      desc: description,
    });

    setTimeout(() => {
      alert(
        `✅ [${batchInfo.name}] 的记录上传成功！\n消费者扫码即可看到最新状态。`,
      );
      setIsSubmitting(false);
      setDescription("");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* 顶部：动态档案信息卡片 */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Tag className="w-4 h-4 mr-1 text-green-600" />
              {batchInfo.variety}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              批次ID: {batchId || "未指定"}
            </p>
          </div>
          <Badge
            variant="outline"
            className="text-orange-500 border-orange-200 bg-orange-50"
          >
            生长第 {batchInfo.days} 天
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1 text-gray-400" />
            {batchInfo.location}
          </div>
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
            今天: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* 第一步：选择操作类型 */}
      <section>
        <Label className="mb-3 block text-gray-700">1. 选择操作类型</Label>
        <div className="grid grid-cols-4 gap-3">
          {ACTION_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;

            return (
              <button
                type="button" // 防止表单意外提交
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`
                  flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all
                  ${isSelected
                    ? `border-green-500 ${type.bgColor} ring-2 ring-green-200 ring-offset-1`
                    : "border-gray-100 bg-white hover:bg-gray-50"
                  }
                `}
              >
                <Icon
                  className={`w-6 h-6 mb-2 ${isSelected ? type.color : "text-gray-400"}`}
                />
                <span
                  className={`text-xs font-medium ${isSelected ? "text-gray-900" : "text-gray-500"}`}
                >
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 第二步：快捷标签与详情录入 */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div
              className={`
              w-10 h-10 rounded-full flex items-center justify-center border
              ${currentTypeConfig.bgColor} 
              ${currentTypeConfig.borderColor}
            `}
            >
              <CurrentIcon className={`w-5 h-5 ${currentTypeConfig.color}`} />
            </div>

            <div>
              <CardTitle className="text-base text-gray-900">
                {currentTypeConfig.label}详情
              </CardTitle>
              <p className="text-xs text-gray-400 font-normal mt-0.5">
                请完善下方的作业信息
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="flex flex-wrap gap-2">
            {currentTypeConfig.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700 py-1.5 px-3 transition-colors"
                onClick={() => handleTagClick(tag)}
              >
                + {tag}
              </Badge>
            ))}
          </div>

          <div className="relative">
            <Textarea
              placeholder={
                currentTypeConfig.id === "custom"
                  ? "请输入具体的操作内容..."
                  : `请输入${currentTypeConfig.label}的具体信息...`
              }
              className="min-h-30 text-base resize-none focus-visible:ring-green-500 bg-gray-50/50"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            className="w-full text-gray-500 border-dashed border-2 h-12 hover:bg-gray-50 hover:text-green-600 hover:border-green-200 transition-all"
          >
            <Camera className="mr-2 w-4 h-4" />
            添加现场照片 (可选)
          </Button>
        </CardContent>
      </Card>

      {/* 第三步：提交按钮 */}
      <Button
        className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2">⏳</span> 上传中...
          </span>
        ) : (
          <>
            <Save className="mr-2 w-5 h-5" /> 确认上传记录
          </>
        )}
      </Button>
    </div>
  );
}


export default function AdminAddRecordPage() {
  const router = useRouter(); // ✅ 获取 router 实例

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">

      {/* ✅ 修改后的 Header：增加了左侧返回按钮 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          {/* 返回按钮 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="-ml-2 mr-1"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">新增农事记录</h1>
        </div>

        <div className="text-right">
          <span className="block text-xs text-gray-400">系统时间</span>
          <span className="font-mono text-sm font-medium">
            {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      <Suspense fallback={<div className="text-center pt-10 text-gray-500">正在加载地块信息...</div>}>
        <RecordForm />
      </Suspense>
    </div>
  );
}