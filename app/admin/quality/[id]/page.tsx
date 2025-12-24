import { format } from "date-fns";
import {
  ArrowLeft,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  addInspectionAction,
  deleteInspectionAction,
} from "@/app/actions/quality";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getCurrentUser } from "@/lib/auth-helper";
import { db } from "@/lib/db";

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
    pass: { label: "合格", color: "text-green-600 bg-green-50" },
    fail: { label: "不合格", color: "text-red-600 bg-red-50" },
    warning: { label: "预警", color: "text-orange-600 bg-orange-50" },
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-4 pt-0 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">质量监管档案</h1>
            <p className="text-gray-500 text-sm">
              批次号: <span className="font-mono">{batch.batch_no}</span> |
              品种: {batch.variety}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: List of Inspections */}
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  检测记录列表
                </CardTitle>
              </CardHeader>
              <CardContent>
                {batch.inspections.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    暂无检测记录，请在右侧录入
                  </div>
                ) : (
                  <div className="space-y-4">
                    {batch.inspections.map((insp) => (
                      <div
                        key={insp.id}
                        className="bg-white border rounded-lg p-4 shadow-sm hover:border-blue-200 transition-colors relative group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800">
                              {stageMap[insp.stage] || insp.stage}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded font-medium ${resultMap[insp.result]?.color || "bg-gray-100"}`}
                            >
                              {resultMap[insp.result]?.label || insp.result}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {format(
                              new Date(insp.created_at || new Date()),
                              "yyyy-MM-dd HH:mm",
                            )}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 grid grid-cols-2 gap-2 mt-2 bg-gray-50 p-3 rounded">
                          {/* Parse generic JSON report_data */}
                          {insp.report_data &&
                            Object.entries(
                              insp.report_data as Record<string, string>,
                            ).map(([key, value]) => {
                              if (key === "date" || !value) return null;
                              return (
                                <div key={key} className="flex flex-col">
                                  <span className="text-xs text-gray-400 capitalize">
                                    {key}
                                  </span>
                                  <span className="font-medium">{value}</span>
                                </div>
                              );
                            })}
                        </div>

                        <div className="mt-2 text-xs text-gray-400 flex justify-between items-center">
                          <span>检测人: {insp.inspector}</span>

                          <form
                            action={async () => {
                              "use server";
                              await deleteInspectionAction(insp.id);
                            }}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              type="submit"
                              className="h-6 w-6 p-0 text-red-400 hover:text-red-600 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </form>
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
                <form action={async (formData) => {
                  "use server";
                  await addInspectionAction(formData);
                }} className="space-y-4">
                  <input type="hidden" name="batch_id" value={batch.id} />
                  <input type="hidden" name="inspector" value={user.username} />

                  <div className="space-y-2">
                    <Label htmlFor="stage">检测阶段</Label>
                    <Select name="stage" defaultValue="harvest">
                      <SelectTrigger id="stage">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planting">
                          种植阶段 (农残自检)
                        </SelectItem>
                        <SelectItem value="harvest">
                          采收阶段 (糖度/分级)
                        </SelectItem>
                        <SelectItem value="transport">
                          流通运输 (抽检)
                        </SelectItem>
                        <SelectItem value="market">销售终端 (复检)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="result">检测结论</Label>
                    <Select name="result" defaultValue="pass">
                      <SelectTrigger id="result">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">合格</SelectItem>
                        <SelectItem value="fail">不合格 (Fail)</SelectItem>
                        <SelectItem value="warning">
                          风险预警 (Warning)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>关键指标 (可选)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        name="sugar"
                        placeholder="糖度 (Brix)"
                        className="text-sm"
                        aria-label="Sugar Content"
                      />
                      <Input
                        name="pesticide"
                        placeholder="农残/结果"
                        className="text-sm"
                        aria-label="Pesticide Result"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">备注说明</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="输入检测详情说明..."
                      className="h-20"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" /> 提交记录
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
