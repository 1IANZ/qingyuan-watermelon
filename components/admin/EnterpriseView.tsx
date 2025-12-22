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
        <Card className="bg-blue-50 border-blue-100 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FlaskConical className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {pendingCount}
              </div>
              <div className="text-xs text-blue-600 font-medium">
                待检测批次 (实时)
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {passRate}%
              </div>
              <div className="text-xs text-green-600 font-medium">
                近期样本合格率
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${failedCount > 0 ? "bg-red-100 animate-pulse" : "bg-red-50"} border-red-100 shadow-sm`}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className={`w-6 h-6 ${failedCount > 0 ? "text-red-700" : "text-red-600"}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-900">{failedCount}</div>
              <div className="text-xs text-red-600 font-medium">
                质量检测不合格
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FileBadge className="w-5 h-5 text-blue-600" />
            近期批次质检列表
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="输入批次号查询..."
              className="pl-9 h-9 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {displayBatches.map((batch) => {
            const lastInspection = batch.inspections[0];
            const hasReport = !!lastInspection;

            return (
              <div
                key={batch.id}
                className="p-4 hover:bg-blue-50/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-gray-700">
                      {batch.batch_no}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
                      {batch.variety}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    创建于:{" "}
                    {format(
                      new Date(batch.created_at as Date),
                      "yyyy-MM-dd HH:mm",
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right mr-4 hidden sm:block">
                    <div className="text-xs text-gray-400">检测状态</div>
                    {hasReport ? (
                      <div className="text-sm font-medium text-green-600 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 已检测
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-orange-500 flex items-center justify-end gap-1">
                        <AlertCircle className="w-3 h-3" /> 待录入
                      </div>
                    )}
                  </div>

                  <Link href={`/admin/quality/${batch.id}`}>
                    <Button
                      size="sm"
                      variant={hasReport ? "secondary" : "default"}
                      className={
                        !hasReport ? "bg-blue-600 hover:bg-blue-700" : ""
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
                    <Button size="sm" variant="ghost" className="text-gray-500">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 bg-gray-50 text-center text-xs text-gray-500 border-t border-gray-200">
          统计样本: 最近 {recentBatches.length} 条 | 数据库总量: {totalCount} 条
        </div>
      </div>
    </div>
  );
}