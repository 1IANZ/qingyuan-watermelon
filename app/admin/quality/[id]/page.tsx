import { format } from "date-fns";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth-helper";
import { db } from "@/lib/db";
import DeleteBatchButton from "./DeleteBatchButton.client";
import DeleteInspectionButton from "./DeleteInspectionButton.client";
import InspectionForm from "./InspectionForm.client";

export default async function QualityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const batch = await db.batches.findUnique({
    where: { id },
    include: {
      inspections: {
        orderBy: { created_at: "desc" },
      },
    },
  });

  if (!batch) {
    return <div>Batch not found</div>;
  }

  const stageMap: Record<string, string> = {
    planting: "种植阶段",
    harvest: "采收阶段",
    transport: "流通运输",
    market: "销售终端",
  };

  const resultMap: Record<string, { label: string; color: string }> = {
    pass: {
      label: "合格",
      color:
        "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30",
    },
    fail: {
      label: "不合格",
      color: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30",
    },
    warning: {
      label: "预警",
      color:
        "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30",
    },
  };

  return (
    <div className="min-h-screen bg-background px-4 pb-4 pt-0 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">质量监管档案</h1>
            <p className="text-muted-foreground text-sm">
              批次号: <span className="font-mono">{batch.batch_no}</span> |
              品种: {batch.variety}
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <DeleteBatchButton id={batch.id} batchNo={batch.batch_no} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: List of Inspections */}
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  检测记录列表
                </CardTitle>
              </CardHeader>
              <CardContent>
                {batch.inspections.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground text-sm">
                    暂无检测记录，请在右侧录入
                  </div>
                ) : (
                  <div className="space-y-4">
                    {batch.inspections.map((insp) => (
                      <div
                        key={insp.id}
                        className="bg-card border rounded-lg p-4 shadow-sm hover:border-blue-200 dark:hover:border-blue-800 transition-colors relative group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">
                              {stageMap[insp.stage] || insp.stage}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded font-medium ${resultMap[insp.result]?.color ||
                                "bg-gray-100 dark:bg-gray-800"
                                }`}
                            >
                              {resultMap[insp.result]?.label || insp.result}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(
                              new Date(insp.created_at || new Date()),
                              "yyyy-MM-dd HH:mm",
                            )}
                          </span>
                        </div>

                        <div className="text-sm text-muted-foreground grid grid-cols-2 gap-2 mt-2 bg-muted/50 p-3 rounded">
                          {/* Parse generic JSON report_data */}
                          {insp.report_data &&
                            Object.entries(
                              insp.report_data as Record<string, string>,
                            ).map(([key, value]) => {
                              if (key === "date" || !value) return null;
                              return (
                                <div key={key} className="flex flex-col">
                                  <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                                    {key}
                                  </span>
                                  <span className="font-medium text-foreground">
                                    {value}
                                  </span>
                                </div>
                              );
                            })}
                        </div>

                        <div className="mt-2 text-xs text-gray-400 flex justify-between items-center">
                          <span>检测人: {insp.inspector}</span>
                          <DeleteInspectionButton id={insp.id} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Add New Inspection Form */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">录入新检测</CardTitle>
              </CardHeader>
              <CardContent>
                <InspectionForm
                  batchId={batch.id}
                  userRealName={user.realName}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
