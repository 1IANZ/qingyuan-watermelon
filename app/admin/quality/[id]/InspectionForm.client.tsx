"use client";

import { Plus } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { addInspectionAction } from "@/app/actions/quality";
import { Button } from "@/components/ui/button";
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

export default function InspectionForm({
  batchId,
  userRealName,
}: {
  batchId: string;
  userRealName: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    const result = await addInspectionAction(formData);
    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <input type="hidden" name="batch_id" value={batchId} />
      <input type="hidden" name="inspector" value={userRealName} />

      <div className="space-y-2">
        <Label htmlFor="stage">检测阶段</Label>
        <Select name="stage" defaultValue="harvest">
          <SelectTrigger id="stage">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planting">种植阶段 (农残自检)</SelectItem>
            <SelectItem value="harvest">采收阶段 (糖度/分级)</SelectItem>
            <SelectItem value="transport">流通运输 (抽检)</SelectItem>
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
            <SelectItem value="fail">不合格</SelectItem>
            <SelectItem value="warning">风险预警</SelectItem>
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
  );
}
