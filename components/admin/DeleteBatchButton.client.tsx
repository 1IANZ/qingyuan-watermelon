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
import { cn } from "@/lib/utils";

type DeleteBatchButtonProps = {
  id: string;
  batchNo: string;
  className?: string;
  variant?:
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
};

export default function DeleteBatchButton({
  id,
  batchNo,
  className,
  variant = "destructive",
  size = "sm",
  children,
}: DeleteBatchButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    const result = await deleteBatchAction(id);
    if (result.success) {
      toast.success(result.message);
      setOpen(false);
      // Refresh logic might be needed if used in a list that doesn't auto-refresh via router.refresh()
      // But server actions with revalidatePath usually handle it.
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={cn("gap-2", className)}
        onClick={() => setOpen(true)}
      >
        {children || (
          <>
            <Trash2 className="w-4 h-4" />
            删除此批次
          </>
        )}
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
