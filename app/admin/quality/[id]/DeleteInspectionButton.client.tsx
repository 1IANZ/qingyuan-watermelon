"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteInspectionAction } from "@/app/actions/quality";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";

export default function DeleteInspectionButton({ id }: { id: string }) {
  const handleDelete = async () => {
    const result = await deleteInspectionAction(id);
    if (result.success) {
      toast.success("记录已删除");
    } else {
      toast.error("删除失败");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={buttonVariants({
          size: "sm",
          variant: "ghost",
          className:
            "h-6 w-6 p-0 text-red-400 hover:text-red-600 md:opacity-0 md:group-hover:opacity-100 transition-opacity",
        })}
      >
        <Trash2 className="w-3 h-3" />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
            确认删除?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
            此操作无法撤销。这将永久删除该检测记录。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-0 hover:bg-gray-200 dark:hover:bg-gray-600">
            取消
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white border-0"
          >
            确认删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
