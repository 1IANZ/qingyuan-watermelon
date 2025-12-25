"use client";

import {
  Calendar,
  Camera,
  Droplets,
  Hammer,
  Leaf,
  MapPin,
  PenTool,
  Save,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import {
  createRecordAction,
  deleteRecordAction,
  getRecordsByBatchId,
} from "@/app/actions/create-record";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { batches } from "@/lib/generated/prisma/client";

const ACTION_TYPES = [
  {
    id: "water",
    label: "灌溉",
    icon: Droplets,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    tags: ["井水滴灌", "喷灌", "水肥一体化", "抗旱浇水"],
  },
  {
    id: "fertilizer",
    label: "施肥",
    icon: Leaf,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    tags: ["有机肥", "复合肥", "水溶肥", "农家肥", "钾肥"],
  },
  {
    id: "pesticide",
    label: "植保",
    icon: Hammer,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    tags: ["生物防治", "粘虫板", "除草作业", "预防白粉病"],
  },
  {
    id: "harvest",
    label: "采收",
    icon: Truck,
    color: "text-green-600 dark:text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    tags: ["首批采摘", "分批采摘", "测糖合格", "挑选装箱"],
  },
  {
    id: "custom",
    label: "其他",
    icon: PenTool,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    tags: ["大棚修缮", "整枝打叉", "授粉", "清理杂草", "农机作业"],
  },
];

type Record = {
  id: string;
  action_type: string;
  description: string | null;
  operator: string | null;
  recorded_at: Date | null;
  images: string[];
};

// 提交按钮组件
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 shadow-lg shadow-green-200 dark:shadow-none"
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

// --- 主组件 ---
export default function RecordForm({ batch }: { batch: batches }) {
  const [selectedType, setSelectedType] = useState(ACTION_TYPES[0].id);
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [records, setRecords] = useState<Record[]>([]);

  const fetchRecords = useCallback(async () => {
    const data = await getRecordsByBatchId(batch.id);
    setRecords(data as unknown as Record[]);
  }, [batch.id]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleDelete = async (id: string) => {
    const result = await deleteRecordAction(id);
    if (result.success) {
      toast.success(result.message);
      fetchRecords();
    } else {
      toast.error(result.message);
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    const result = await createRecordAction(
      { message: "", success: false },
      formData,
    );
    if (result.success) {
      toast.success("记录上传成功");
      setDescription("");
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchRecords(); // 刷新列表
    } else {
      toast.error(result.message);
    }
  };

  const currentTypeConfig =
    ACTION_TYPES.find((t) => t.id === selectedType) || ACTION_TYPES[0];
  const CurrentIcon = currentTypeConfig.icon;

  const handleTagClick = (tag: string) => {
    setDescription((prev) => (prev ? `${prev}, ${tag}` : tag));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8 max-w-md mx-auto">
      <form action={handleFormSubmit} className="space-y-6">
        <input type="hidden" name="batchId" value={batch.id} />
        <input type="hidden" name="actionType" value={selectedType} />

        {/* 顶部：档案信息 */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center">
                <Tag className="w-4 h-4 mr-1 text-green-600 dark:text-green-500" />
                {batch.variety}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                批次号: {batch.batch_no}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
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

        {/* 1. 操作类型选择 */}
        <section>
          <Label className="mb-3 block text-gray-700 dark:text-gray-300">
            1. 选择操作类型
          </Label>
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
                      ? `border-green-500 ${type.bgColor} ring-2 ring-green-200 ring-offset-1 dark:ring-green-900 dark:ring-offset-0`
                      : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }
                `}
                >
                  <Icon
                    className={`w-6 h-6 mb-2 ${isSelected ? type.color : "text-gray-400"
                      }`}
                  />
                  <span
                    className={`text-xs font-medium ${isSelected
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-500"
                      }`}
                  >
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. 详情填写 & 图片上传 */}
        <Card className="border-none shadow-sm overflow-hidden dark:bg-gray-900">
          <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
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
                <CardTitle className="text-base text-gray-900 dark:text-gray-100">
                  {currentTypeConfig.label}详情
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-4 dark:bg-card">
            {/* 快捷标签 */}
            <div className="flex flex-wrap gap-2">
              {currentTypeConfig.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 py-1.5 px-3 transition-colors"
                  onClick={() => handleTagClick(tag)}
                >
                  + {tag}
                </Badge>
              ))}
            </div>

            {/* 文本域 */}
            <div className="relative">
              <Textarea
                name="description"
                placeholder={`请输入${currentTypeConfig.label}的具体信息...`}
                className="min-h-32 text-base resize-none focus-visible:ring-green-500 bg-gray-50/50 dark:bg-gray-800 dark:text-gray-100"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* 图片上传区域 */}
            <div>
              <input
                type="file"
                name="imageFile"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
              />

              {previewUrl ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
                  <Image
                    src={previewUrl}
                    alt="预览"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors backdrop-blur-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-gray-500 dark:text-gray-400 border-dashed border-2 h-12 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400 hover:border-green-200 dark:hover:border-green-800 transition-all"
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

      {/* 历史记录列表 */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          已添加记录 ({records.length})
        </h3>
        {records.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            暂无农事记录
          </p>
        ) : (
          <div className="space-y-3">
            {records.map((record) => {
              const TypeConfig =
                ACTION_TYPES.find((t) => t.id === record.action_type) ||
                ACTION_TYPES[0];
              const RecordIcon = TypeConfig.icon;
              return (
                <div
                  key={record.id}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 flex items-start gap-3"
                >
                  <div
                    className={`p-2 rounded-full ${TypeConfig.bgColor} ${TypeConfig.color}`}
                  >
                    <RecordIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {TypeConfig.label}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {record.recorded_at
                          ? new Date(record.recorded_at).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {record.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">
                        操作人: {record.operator}
                      </span>
                      <AlertDialog>
                        <AlertDialogTrigger
                          className={buttonVariants({
                            variant: "ghost",
                            size: "icon",
                            className:
                              "h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20",
                          })}
                        >
                          <Trash2 className="w-3 h-3" />
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                              确认删除?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
                              此操作无法撤销。这将永久删除该农事记录。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-0 hover:bg-gray-200 dark:hover:bg-gray-600">
                              取消
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(record.id)}
                              className="bg-red-600 hover:bg-red-700 text-white border-0"
                            >
                              确认删除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
