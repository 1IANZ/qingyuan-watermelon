import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth-helper";
import { db } from "@/lib/db";
import DisposalForm from "./DisposalForm.client";

export default async function DisposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  const alert = await db.alerts.findUnique({
    where: { id },
    include: {
      batches: true,
    },
  });

  if (!alert) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/alerts">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              预警处置
              <Badge variant="outline" className="font-normal text-sm">
                NO.{alert.batches.batch_no}
              </Badge>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              请填写针对该预警的处置措施及结果
            </p>
          </div>
        </div>

        {/* Alert Info Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex gap-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg h-fit">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                  {alert.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {alert.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <div>
                  <span className="text-gray-500 block text-xs mb-1">预警级别</span>
                  <Badge variant={alert.alert_level === "high" ? "destructive" : "secondary"}>
                    {alert.alert_level.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs mb-1">触发源</span>
                  <span className="font-medium">{alert.triggered_by}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs mb-1">批次品种</span>
                  <span className="font-medium">{alert.batches.variety}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <DisposalForm alertId={alert.id} currentUser={user?.realName || user?.username} />
      </div>
    </div>
  );
}
