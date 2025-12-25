"use client";

import {
  MapPin,
  Package,
  PackageCheck,
  Trash2,
  Truck,
  Warehouse,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createLogisticsAction,
  deleteLogisticsAction,
  getLogisticsByBatchId,
} from "@/app/actions/logistics";
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
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Batch = {
  id: string;
  batch_no: string;
  variety: string;
};

type LogisticsRecord = {
  id: string;
  stage: string;
  operator: string | null;
  location: string | null;
  notes: string | null;
  recorded_at: Date | null;
};

const STAGE_OPTIONS = [
  { value: "sorting", label: "分拣", icon: PackageCheck },
  { value: "packing", label: "包装", icon: Package },
  { value: "storage", label: "仓储", icon: Warehouse },
  { value: "transport", label: "运输", icon: Truck },
  { value: "delivery", label: "配送", icon: MapPin },
];

export default function LogisticsForm({
  batch,
  defaultOperator,
}: {
  batch: Batch;
  defaultOperator: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("transport");
  const [logisticsList, setLogisticsList] = useState<LogisticsRecord[]>([]);

  const fetchLogistics = useCallback(async () => {
    const data = await getLogisticsByBatchId(batch.id);
    setLogisticsList(data as unknown as LogisticsRecord[]);
  }, [batch.id]);

  useEffect(() => {
    fetchLogistics();
  }, [fetchLogistics]);

  const handleDelete = async (id: string) => {
    const result = await deleteLogisticsAction(id);
    if (result.success) {
      toast.success("记录已删除");
      fetchLogistics();
    } else {
      toast.error("删除失败");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("batch_id", batch.id);

    const result = await createLogisticsAction(formData);

    if (result.success) {
      toast.success(result.message);
      fetchLogistics();
      // Optional: reset specific fields or state if needed
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  const showVehicleInfo = stage === "transport" || stage === "delivery";
  const showRouteInfo = stage === "transport" || stage === "delivery";
  const showEnvironment = stage === "storage";

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-blue-50/50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900">
          <CardTitle className="text-blue-900 dark:text-blue-100">
            批次: {batch.batch_no}
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            品种: {batch.variety}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 流通阶段 */}
            <div className="space-y-2">
              <Label
                htmlFor="stage"
                className="text-gray-700 dark:text-gray-300"
              >
                流通阶段 <span className="text-red-500">*</span>
              </Label>
              <Select
                name="stage"
                value={stage}
                onValueChange={(value) => value && setStage(value)}
                required
              >
                <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                  <SelectValue>
                    {STAGE_OPTIONS.find((opt) => opt.value === stage)?.label ||
                      "请选择流通阶段"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {STAGE_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* 操作人员 */}
            <div className="space-y-2">
              <Label
                htmlFor="operator"
                className="text-gray-700 dark:text-gray-300"
              >
                操作人员
              </Label>
              <Input
                id="operator"
                name="operator"
                defaultValue={defaultOperator}
                placeholder="例如: 张三"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* 地点 */}
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-gray-700 dark:text-gray-300"
              >
                地点
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="例如: 清苑区物流中心"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* 环境监控 (仅仓储阶段显示) */}
            {showEnvironment && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900">
                <div className="space-y-2">
                  <Label
                    htmlFor="temperature"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    温度 (℃)
                  </Label>
                  <Input
                    id="temperature"
                    name="temperature"
                    type="number"
                    step="0.1"
                    placeholder="例如: 15.5"
                    className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="humidity"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    湿度 (%)
                  </Label>
                  <Input
                    id="humidity"
                    name="humidity"
                    type="number"
                    step="0.1"
                    placeholder="例如: 65"
                    className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
            )}

            {/* 车辆信息 (运输/配送阶段显示) */}
            {showVehicleInfo && (
              <div className="space-y-4 p-4 bg-green-50/50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
                <h3 className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  车辆信息
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="vehicle_plate"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      车牌号
                    </Label>
                    <Input
                      id="vehicle_plate"
                      name="vehicle_plate"
                      placeholder="例如: 冀F12345"
                      className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="vehicle_driver"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      司机姓名
                    </Label>
                    <Input
                      id="vehicle_driver"
                      name="vehicle_driver"
                      placeholder="例如: 李四"
                      className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="vehicle_phone"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      联系电话
                    </Label>
                    <Input
                      id="vehicle_phone"
                      name="vehicle_phone"
                      type="tel"
                      placeholder="例如: 13800138000"
                      className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 路线信息 (运输/配送阶段显示) */}
            {showRouteInfo && (
              <div className="space-y-4 p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-900">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  路线信息
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="route_from"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      起点
                    </Label>
                    <Input
                      id="route_from"
                      name="route_from"
                      placeholder="例如: 清苑仓库"
                      className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="route_to"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      终点
                    </Label>
                    <Input
                      id="route_to"
                      name="route_to"
                      placeholder="例如: 北京新发地"
                      className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="route_distance"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      距离 (公里)
                    </Label>
                    <Input
                      id="route_distance"
                      name="route_distance"
                      type="number"
                      step="0.1"
                      placeholder="例如: 150"
                      className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 备注 */}
            <div className="space-y-2">
              <Label
                htmlFor="notes"
                className="text-gray-700 dark:text-gray-300"
              >
                备注说明
              </Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="记录其他重要信息..."
                rows={3}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* 提交按钮 */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                {loading ? "提交中..." : "提交流通记录"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                取消
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 历史记录列表 */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          已添加记录 ({logisticsList.length})
        </h3>
        {logisticsList.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            暂无物流记录
          </p>
        ) : (
          <div className="space-y-3">
            {logisticsList.map((record) => {
              const StageOption =
                STAGE_OPTIONS.find((s) => s.value === record.stage) ||
                STAGE_OPTIONS[0];
              const Icon = StageOption.icon;

              return (
                <div
                  key={record.id}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 flex items-start gap-3"
                >
                  <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {StageOption.label}{" "}
                        {record.location ? `@ ${record.location}` : ""}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {record.recorded_at
                          ? new Date(record.recorded_at).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                    {record.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                        {record.notes}
                      </p>
                    )}
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
                              此操作无法撤销。这将永久删除该物流记录。
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
