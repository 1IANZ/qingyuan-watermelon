"use client";

import { format } from "date-fns";
import {
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { updateAlertStatusAction } from "@/app/actions/alerts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Alert = {
  id: string;
  batch_id: string;
  alert_type: string;
  alert_level: string;
  title: string;
  description: string | null;
  triggered_by: string | null;
  status: string;
  assigned_to: string | null;
  created_at: Date | null;
  batches: {
    batch_no: string;
    variety: string;
  };
  disposals: Array<{
    id: string;
    action_taken: string;
    result: string | null;
  }>;
};

export default function AlertsList({ alerts }: { alerts: Alert[] }) {
  const [filter, setFilter] = useState<string>("all");

  const filteredAlerts =
    filter === "all" ? alerts : alerts.filter((a) => a.status === filter);

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case "urgent":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
      case "high":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "low":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200">
            待处理
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200">
            处理中
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200">
            已解决
          </Badge>
        );
      case "closed":
        return (
          <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200">
            已关闭
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getAlertTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      inspection_fail: "检测不合格",
      quality_complaint: "质量投诉",
      env_abnormal: "环境异常",
      pesticide_exceed: "农残超标",
    };
    return map[type] || type;
  };

  const handleStatusChange = async (alertId: string, newStatus: string) => {
    await updateAlertStatusAction(alertId, newStatus);
  };

  return (
    <div>
      {/* 过滤器 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          全部 ({alerts.length})
        </Button>
        <Button
          size="sm"
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
        >
          待处理 ({alerts.filter((a) => a.status === "pending").length})
        </Button>
        <Button
          size="sm"
          variant={filter === "processing" ? "default" : "outline"}
          onClick={() => setFilter("processing")}
        >
          处理中 ({alerts.filter((a) => a.status === "processing").length})
        </Button>
        <Button
          size="sm"
          variant={filter === "resolved" ? "default" : "outline"}
          onClick={() => setFilter("resolved")}
        >
          已解决 ({alerts.filter((a) => a.status === "resolved").length})
        </Button>
      </div>

      {/* 预警列表 */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            暂无预警记录
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={`${getAlertLevelColor(alert.alert_level)} text-xs`}
                    >
                      {alert.alert_level === "urgent"
                        ? "紧急"
                        : alert.alert_level === "high"
                          ? "高危"
                          : alert.alert_level === "medium"
                            ? "中等"
                            : "低"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getAlertTypeLabel(alert.alert_type)}
                    </Badge>
                    {getStatusBadge(alert.status)}
                  </div>

                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {alert.title}
                  </h3>

                  {alert.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {alert.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-semibold">
                        {alert.batches.batch_no}
                      </span>
                      <span>({alert.batches.variety})</span>
                    </div>
                    {alert.assigned_to && <div>负责: {alert.assigned_to}</div>}
                    <div>
                      {format(
                        new Date(alert.created_at || new Date()),
                        "yyyy-MM-dd HH:mm",
                      )}
                    </div>
                  </div>

                  {/* 处置记录 */}
                  {alert.disposals.length > 0 && (
                    <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs">
                      <div className="flex items-center gap-1 text-green-700 dark:text-green-300 font-semibold mb-1">
                        <CheckCircle className="w-3 h-3" />
                        已处置
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {alert.disposals[0].action_taken}
                      </div>
                    </div>
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <Link href={`/trace/${alert.batches.batch_no}`}>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      查看
                    </Button>
                  </Link>

                  {alert.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(alert.id, "processing")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      处理
                    </Button>
                  )}

                  {alert.status === "processing" && (
                    <Link href={`/admin/alerts/${alert.id}/disposal`}>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        记录处置
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
