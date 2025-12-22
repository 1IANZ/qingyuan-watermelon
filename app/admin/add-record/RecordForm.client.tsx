"use client";

import {
  AlertCircle,
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
  X,
} from "lucide-react";
import Image from "next/image";
import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  createRecordAction,
  type RecordState,
} from "@/app/actions/create-record";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { batches } from "@/lib/generated/prisma/client";

// --- UI 配置 (补全了完整的数组) ---
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
    id: "transport",
    label: "流通运输",
    icon: Truck,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    tags: ["装车发货", "冷链运输", "到达集散地", "终端配送"],
  },
  {
    id: "storage",
    label: "仓储",
    icon: MapPin,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    tags: ["入库", "出库", "温湿度检测", "库存盘点"],
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

// 提交按钮组件
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
      disabled={pending}
    >
      {pending ? (
        <span className="flex items-center">
          <span className="animate-spin mr-2">⏳</span> 上传中...
        </span>
      ) : (
        <>
          <Save className="mr-2 w-5 h-5" /> 确认上传记录
        </>
      )}
    </Button>
  );
}

const initialState: RecordState = {
  message: "",
  success: false,
};

// --- 主组件 ---
export default function RecordForm({ batch }: { batch: batches }) {
  const [state, formAction] = useActionState(createRecordAction, initialState);

  const [selectedType, setSelectedType] = useState(ACTION_TYPES[0].id);
  const [description, setDescription] = useState("");

  // 🟢 1. 图片预览状态
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // 🟢 2. 引用隐藏的文件输入框
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTypeConfig =
    ACTION_TYPES.find((t) => t.id === selectedType) || ACTION_TYPES[0];
  const CurrentIcon = currentTypeConfig.icon;

  const handleTagClick = (tag: string) => {
    setDescription((prev) => (prev ? `${prev}, ${tag}` : tag));
  };

  // 🟢 3. 处理文件选择 (核心逻辑)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 创建本地预览 URL (blob:http://...)
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // 🟢 4. 点击按钮 -> 触发隐藏的 input 点击
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // 🟢 5. 删除已选图片
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // 清空 input 的值，允许重复选择同一张图
    }
  };

  return (
    <form action={formAction} className="space-y-6 max-w-md mx-auto">
      {/* 隐藏域：将 batchId 和 actionType 传给 Server Action */}
      <input type="hidden" name="batchId" value={batch.id} />
      <input type="hidden" name="actionType" value={selectedType} />

      {/* 顶部：档案信息 */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Tag className="w-4 h-4 mr-1 text-green-600" />
              {batch.variety}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              批次号: {batch.batch_no}
            </p>
          </div>
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            {batch.status === "growing" ? "种植中" : "已结束"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
          <div className="flex items-center truncate">
            <MapPin className="w-3 h-3 mr-1 text-gray-400 shrink-0" />
            {batch.location}
          </div>
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1 text-gray-400 shrink-0" />
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {state.message && !state.success && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          {state.message}
        </div>
      )}

      {/* 1. 操作类型选择 */}
      <section>
        <Label className="mb-3 block text-gray-700">1. 选择操作类型</Label>
        <div className="grid grid-cols-4 gap-3">
          {ACTION_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            return (
              <button
                type="button"
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

      {/* 2. 详情填写 & 图片上传 */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div
              className={`
              w-10 h-10 rounded-full flex items-center justify-center border
              ${currentTypeConfig.bgColor} ${currentTypeConfig.borderColor}
            `}
            >
              <CurrentIcon className={`w-5 h-5 ${currentTypeConfig.color}`} />
            </div>
            <div>
              <CardTitle className="text-base text-gray-900">
                {currentTypeConfig.label}详情
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* 快捷标签 */}
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

          {/* 动态表单字段 */}
          {selectedType === "transport" && (
            <div className="grid grid-cols-2 gap-3 mb-3 bg-orange-50 p-3 rounded-lg border border-orange-100">
              <div className="space-y-1">
                <Label className="text-xs text-orange-700">车牌号</Label>
                <input name="vehicle_no" placeholder="例如：京A88888" className="w-full text-sm p-1.5 rounded border border-orange-200" onChange={(e) => {
                  const val = e.target.value;
                  if (val) setDescription(prev => {
                    const clean = prev.replace(/【车牌.*?】/g, '');
                    return `【车牌:${val}】` + clean;
                  })
                }} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-orange-700">司机/负责人</Label>
                <input name="driver_name" placeholder="姓名" className="w-full text-sm p-1.5 rounded border border-orange-200" onChange={(e) => {
                  const val = e.target.value;
                  if (val) setDescription(prev => {
                    const clean = prev.replace(/【司机.*?】/g, '');
                    return clean + `【司机:${val}】`;
                  })
                }} />
              </div>
            </div>
          )}

          {selectedType === "storage" && (
            <div className="grid grid-cols-2 gap-3 mb-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="space-y-1">
                <Label className="text-xs text-blue-700">仓库名称</Label>
                <input name="warehouse" placeholder="例如：1号冷库" className="w-full text-sm p-1.5 rounded border border-blue-200" onChange={(e) => {
                  const val = e.target.value;
                  if (val) setDescription(prev => {
                    const clean = prev.replace(/【仓库.*?】/g, '');
                    return `【仓库:${val}】` + clean;
                  })
                }} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-blue-700">环境温度</Label>
                <input name="temperature" placeholder="例如：18℃" className="w-full text-sm p-1.5 rounded border border-blue-200" onChange={(e) => {
                  const val = e.target.value;
                  if (val) setDescription(prev => {
                    const clean = prev.replace(/【温度.*?】/g, '');
                    return clean + `【温度:${val}】`;
                  })
                }} />
              </div>
            </div>
          )}

          {/* 文本域 */}
          <div className="relative">
            <Textarea
              name="description"
              placeholder={`请输入${currentTypeConfig.label}的具体信息...`}
              className="min-h-32 text-base resize-none focus-visible:ring-green-500 bg-gray-50/50"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* 🟢 6. 图片上传区域 */}
          <div>
            {/* 真正的文件 Input (隐藏) */}
            <input
              type="file"
              name="imageFile" // 这个 name 很重要，Server Action 会用到
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              capture="environment" // 核心属性：在手机上优先调用后置摄像头
              onChange={handleFileChange}
            />

            {previewUrl ? (
              // 状态 A：已选择图片，显示预览
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 group">
                <Image
                  src={previewUrl}
                  alt="预览"
                  fill
                  className="object-cover"
                />
                {/* 删除按钮 */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              // 状态 B：未选择，显示上传按钮
              <Button
                type="button"
                variant="outline"
                className="w-full text-gray-500 border-dashed border-2 h-12 hover:bg-gray-50 hover:text-green-600 hover:border-green-200 transition-all"
                onClick={handleCameraClick}
              >
                <Camera className="mr-2 w-4 h-4" />
                点击拍照 / 上传图片
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <SubmitButton />
    </form>
  );
}
