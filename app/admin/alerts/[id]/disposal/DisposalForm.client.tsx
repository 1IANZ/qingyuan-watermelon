"use client";

import { CheckCircle, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createDisposalAction } from "@/app/actions/alerts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DisposalForm({
  alertId,
  currentUser,
}: {
  alertId: string;
  currentUser?: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    formData.append("alert_id", alertId);

    try {
      const res = await createDisposalAction(formData);
      if (res.success) {
        toast.success("处置记录已保存", {
          description: "预警状态已更新为“已解决”"
        });
        router.push("/admin/alerts");
      } else {
        toast.error("保存失败", {
          description: res.message
        });
      }
    } catch (_) {
      toast.error("系统错误，请重试");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-green-100 dark:border-green-900 shadow-lg">
      <CardHeader className="bg-green-50/50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900 pb-4">
        <CardTitle className="text-lg font-bold text-green-800 dark:text-green-300 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          填写处置结果
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form action={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="responsible_party">责任人/单位</Label>
              <Input
                id="responsible_party"
                name="responsible_party"
                placeholder="例如：生产部-张三"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="handler">处置执行人</Label>
              <Input
                id="handler"
                name="handler"
                defaultValue={currentUser || ""}
                placeholder="记录本次处置的操作员"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="action_taken">采取的措施</Label>
            <Textarea
              id="action_taken"
              name="action_taken"
              placeholder="详细描述采取了哪些措施来消除风险..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="result">处置结果/成效</Label>
            <Textarea
              id="result"
              name="result"
              placeholder="描述处置后的结果，例如：隐患已消除，复检合格。"
              className="min-h-[80px]"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  提交处置记录
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
