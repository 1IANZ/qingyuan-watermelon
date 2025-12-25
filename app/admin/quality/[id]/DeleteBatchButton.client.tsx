"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteBatchAction } from "@/app/actions/create-batch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function DeleteBatchButton({
  id,
  batchNo,
}: {
  id: string;
  batchNo: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    const result = await deleteBatchAction(id);
    if (result.success) {
      toast.success(result.message);
      setOpen(false);
      router.push("/admin");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        className="gap-2"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="w-4 h-4" />
        删除此批次
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除批次 {batchNo}?</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销。这将永久删除该批次的所有信息，包括：
              <br />- 所有农事记录
              <br />- 所有质检报告
              <br />- 相关物流与溯源信息
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              确认彻底删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
