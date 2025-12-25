import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileBadge,
  FileCheck,
  FlaskConical,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";


export default async function EnterpriseView() {
  const [recentBatches, totalCount] = await Promise.all([
    db.batches.findMany({
      orderBy: { created_at: "desc" },
      take: 50,
      include: {
        inspections: {
          orderBy: { created_at: "desc" },
          take: 1,
        },
      },
    }),
    db.batches.count(),
  ]);

  let pendingCount = 0;
  let passedCount = 0;
  let failedCount = 0;
  let testedCount = 0;

  recentBatches.forEach((batch) => {
    // Check latest inspection in the list
    const lastInspection = batch.inspections[0];

    if (!lastInspection) {
      pendingCount++;
    } else {
      testedCount++;
      if (lastInspection.result === "fail" || lastInspection.result === "warning") {
        failedCount++;
      } else {
        passedCount++;
      }
    }
  });

  const passRate =
    testedCount > 0
      ? ((passedCount / testedCount) * 100).toFixed(1)
      : "100.0";

  const displayBatches = recentBatches.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
              <FlaskConical className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {pendingCount}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                待检测批次 (实时)
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {passRate}%
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                近期样本合格率
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${failedCount > 0 ? "bg-red-100 dark:bg-red-900/30 animate-pulse" : "bg-red-50 dark:bg-red-950/20"} border-red-100 dark:border-red-900 shadow-sm`}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full">
              <AlertCircle className={`w-6 h-6 ${failedCount > 0 ? "text-red-700 dark:text-red-400" : "text-red-600 dark:text-red-400"}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-900 dark:text-red-100">{failedCount}</div>
              <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                质量检测不合格
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <FileBadge className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            近期批次质检列表
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              type="search"
              placeholder="输入批次号查询..."
              className="pl-9 h-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {displayBatches.map((batch) => {
            const lastInspection = batch.inspections[0];
            const hasReport = !!lastInspection;

            return (
              <div
                key={batch.id}
                className="p-4 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-gray-700 dark:text-gray-300">
                      {batch.batch_no}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
                      {batch.variety}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    创建于:{" "}
                    {format(
                      new Date(batch.created_at as Date),
                      "yyyy-MM-dd HH:mm",
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right mr-4 hidden sm:block">
                    <div className="text-xs text-gray-400 dark:text-gray-500">检测状态</div>
                    {hasReport ? (
                      <div className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 已检测
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-orange-500 dark:text-orange-400 flex items-center justify-end gap-1">
                        <AlertCircle className="w-3 h-3" /> 待录入
                      </div>
                    )}
                  </div>

                  <Link href={`/admin/quality/${batch.id}`}>
                    <Button
                      size="sm"
                      variant={hasReport ? "secondary" : "default"}
                      className={
                        !hasReport ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600" : ""
                      }
                    >
                      {hasReport ? (
                        <>
                          <FileCheck className="w-4 h-4 mr-2" /> 管理检测 ({batch.inspections.length})
                        </>
                      ) : (
                        <>
                          <FlaskConical className="w-4 h-4 mr-2" /> 录入检测
                        </>
                      )}
                    </Button>
                  </Link>

                  <Link href={`/trace/${batch.batch_no}`}>
                    <Button size="sm" variant="ghost" className="text-gray-500 dark:text-gray-400 hover:text-foreground">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          统计样本: 最近 {recentBatches.length} 条 | 数据库总量: {totalCount} 条
        </div>
      </div>
    </div>
  );
}