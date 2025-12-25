import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth-helper";
import { db } from "@/lib/db";
import AlertsList from "./AlertsList.client";


export default async function AlertsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "gov") {
    redirect("/admin");
  }

  // 获取所有预警
  const [allAlerts, pendingCount, processingCount, resolvedCount] =
    await Promise.all([
      db.alerts.findMany({
        include: {
          batches: {
            select: {
              batch_no: true,
              variety: true,
            },
          },
          disposals: {
            orderBy: { created_at: "desc" },
            take: 1,
          },
        },
        orderBy: { created_at: "desc" },
        take: 50,
      }),
      db.alerts.count({ where: { status: "pending" } }),
      db.alerts.count({ where: { status: "processing" } }),
      db.alerts.count({ where: { status: "resolved" } }),
    ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pb-20">
      <div className="flex items-center mb-6">
        <Link href="/admin">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2 mr-1 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          品质预警中心
        </h1>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900">
          <CardContent className="p-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {pendingCount}
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-1">
                  待处理预警
                </div>
              </div>
              <Clock className="w-8 h-8 text-orange-400 dark:text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900">
          <CardContent className="p-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {processingCount}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                  处理中
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-blue-400 dark:text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900">
          <CardContent className="p-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {resolvedCount}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                  已解决
                </div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400 dark:text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900">
          <CardContent className="p-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {
                    allAlerts.filter(
                      (a) =>
                        a.alert_level === "high" || a.alert_level === "urgent",
                    ).length
                  }
                </div>
                <div className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">
                  高危预警
                </div>
              </div>
              <XCircle className="w-8 h-8 text-red-400 dark:text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 预警列表 */}
      <Card>
        <CardHeader className="bg-purple-50/50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-900">
          <CardTitle className="text-purple-900 dark:text-purple-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            预警列表
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <AlertsList alerts={allAlerts} />
        </CardContent>
      </Card>
    </div>
  );
}
