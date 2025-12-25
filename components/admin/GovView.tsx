import { format } from "date-fns";
import {
  BarChart3,
  Check,
  ExternalLink, // 新增:外链图标
  Eye,
  ShieldAlert,
  UserCheck, // 新增:用户审核图标
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  approveBatchAction,
  rejectBatchAction,
} from "@/app/actions/audit-batch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";

export default async function GovView() {
  const [
    totalBatches,
    userCount,
    pendingCount,
    rejectedCount,
    pendingUsers,
    recentBatches,
  ] = await Promise.all([
    db.batches.count(),

    db.app_users.count({
      where: { role: { not: "gov" } },
    }),

    db.batches.count({
      where: { status: "growing" },
    }),

    db.batches.count({
      where: { status: "rejected" },
    }),

    db.app_users.count({
      where: { account_status: "pending" },
    }),

    db.batches.findMany({
      orderBy: { created_at: "desc" },
      take: 5,
    }),
  ]);

  const passRate =
    totalBatches > 0
      ? (((totalBatches - rejectedCount) / totalBatches) * 100).toFixed(1)
      : "100.0";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 pt-6">
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">
              累计监管批次
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalBatches}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
              <BarChart3 className="w-3 h-3 mr-1" /> 实时数据
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 pt-6">
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">
              注册经营主体
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userCount}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center mt-1">
              <Users className="w-3 h-3 mr-1" /> 农户及企业
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 pt-6">
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">
              总体合格率
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{passRate}%</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">基于驳回记录计算</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 pt-6">
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">
              待/在管批次
            </div>
            <div className="text-2xl font-bold text-orange-500 dark:text-orange-400">
              {pendingCount}
            </div>
            <div className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium cursor-pointer hover:underline">
              需重点关注
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 用户审核管理入口 */}
      {pendingUsers > 0 && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-lg">
                  <UserCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    待审核用户申请
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    有 <span className="font-bold text-amber-600 dark:text-amber-400">{pendingUsers}</span> 个企业用户注册申请等待审核
                  </p>
                </div>
              </div>
              <Link href="/admin/users">
                <Button className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600">
                  <UserCheck className="w-4 h-4 mr-2" />
                  前往审核
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 预警中心入口 */}
      <Link href="/admin/alerts">
        <Card className="border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/20 hover:bg-red-100/50 dark:hover:bg-red-900/30 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-lg">
                  <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    品质预警中心
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    查看和处理品质预警,协同处置异常情况
                  </p>
                </div>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600">
                <ShieldAlert className="w-4 h-4 mr-2" />
                进入预警中心
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Card className="border-purple-100 dark:border-purple-900">
        <CardHeader className="bg-purple-50/50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-900 py-4">
          <CardTitle className="text-base font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            最新数据实时流
          </CardTitle>
        </CardHeader>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {recentBatches.map((batch) => (
            <div
              key={batch.id}
              className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-gray-700 dark:text-gray-200">
                    {batch.batch_no}
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                    {batch.variety}
                  </span>

                  <StatusBadge status={batch.status} />
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  时间:{" "}
                  {format(
                    new Date(batch.created_at as Date),
                    "yyyy-MM-dd HH:mm",
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 mr-2"
                >
                  <Link href={`/trace/${batch.batch_no}`} title="查看溯源详情">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">核查</span>
                  </Link>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 mr-2"
                >
                  <Link href={`/admin/quality/${batch.id}`} title="质量监管">
                    <BarChart3 className="w-4 h-4" />
                  </Link>
                </Button>

                <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                <form action={approveBatchAction.bind(null, batch.id)}>
                  <Button
                    size="icon"
                    variant="ghost"
                    type="submit"
                    disabled={batch.status === "approved"}
                    className="h-8 w-8 text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 disabled:opacity-30"
                    title="审核通过"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </form>

                <form action={rejectBatchAction.bind(null, batch.id)}>
                  <Button
                    size="icon"
                    variant="ghost"
                    type="submit"
                    disabled={batch.status === "rejected"}
                    className="h-8 w-8 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-30"
                    title="驳回/标记异常"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  if (status === "approved")
    return (
      <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded border border-green-200 dark:border-green-800">
        已审核
      </span>
    );
  if (status === "rejected")
    return (
      <span className="text-xs bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-2 py-0.5 rounded border border-red-200 dark:border-red-800">
        已驳回
      </span>
    );
  if (status === "growing")
    return (
      <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800">
        种植中
      </span>
    );
  return (
    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded">
      {status}
    </span>
  );
}
