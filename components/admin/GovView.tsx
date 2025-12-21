import { format } from "date-fns";
import {
  BarChart3,
  Check,
  ExternalLink, // 新增：外链图标
  Eye,
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
  const [totalBatches, userCount, pendingCount, rejectedCount, recentBatches] =
    await Promise.all([
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
            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
              累计监管批次
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalBatches}
            </div>
            <div className="text-xs text-green-600 flex items-center mt-1">
              <BarChart3 className="w-3 h-3 mr-1" /> 实时数据
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 pt-6">
            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
              注册经营主体
            </div>
            <div className="text-2xl font-bold text-gray-900">{userCount}</div>
            <div className="text-xs text-gray-400 flex items-center mt-1">
              <Users className="w-3 h-3 mr-1" /> 农户及企业
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 pt-6">
            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
              总体合格率
            </div>
            <div className="text-2xl font-bold text-green-600">{passRate}%</div>
            <div className="text-xs text-gray-400 mt-1">基于驳回记录计算</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 pt-6">
            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
              待/在管批次
            </div>
            <div className="text-2xl font-bold text-orange-500">
              {pendingCount}
            </div>
            <div className="text-xs text-red-500 mt-1 font-medium cursor-pointer hover:underline">
              需重点关注
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-purple-100">
        <CardHeader className="bg-purple-50/50 border-b border-purple-100 py-4">
          <CardTitle className="text-base font-bold text-purple-900 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            最新数据实时流
          </CardTitle>
        </CardHeader>
        <div className="divide-y divide-gray-100">
          {recentBatches.map((batch) => (
            <div
              key={batch.id}
              className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-gray-700">
                    {batch.batch_no}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {batch.variety}
                  </span>

                  <StatusBadge status={batch.status} />
                </div>
                <div className="text-xs text-gray-400 mt-1">
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
                  className="h-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 mr-2"
                >
                  <Link
                    href={`/trace/${batch.batch_no}`}
                    title="查看溯源详情"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">核查</span>
                  </Link>
                </Button>

                <div className="h-4 w-px bg-gray-200 mx-1"></div>

                <form action={approveBatchAction.bind(null, batch.id)}>
                  <Button
                    size="icon"
                    variant="ghost"
                    type="submit"
                    disabled={batch.status === "approved"}
                    className="h-8 w-8 text-green-600 hover:bg-green-50 disabled:opacity-30"
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
                    className="h-8 w-8 text-red-600 hover:bg-red-50 disabled:opacity-30"
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
      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200">
        已审核
      </span>
    );
  if (status === "rejected")
    return (
      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200">
        已驳回
      </span>
    );
  if (status === "growing")
    return (
      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
        种植中
      </span>
    );
  return (
    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
      {status}
    </span>
  );
}
