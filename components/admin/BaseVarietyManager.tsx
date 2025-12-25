"use client";

import { Edit2, Plus, Sprout, Trash2, X } from "lucide-react";
import { useState } from "react";
import {
  addVarietyAction,
  deleteVarietyAction,
  updateVarietyAction,
} from "@/app/actions/base-data";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Variety = {
  id: string;
  name: string;
  days: number | null;
};

type Props = {
  varieties: Variety[];
};

export default function BaseVarietyManager({ varieties }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [varietyToDelete, setVarietyToDelete] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = editingId
      ? await updateVarietyAction(formData)
      : await addVarietyAction(formData);

    if (result.success) {
      setSuccess(result.message || "操作成功");
      setIsAdding(false);
      setEditingId(null);
      form.reset();
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(result.error || "操作失败");
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("id", id);

    const result = await deleteVarietyAction(formData);

    if (result.success) {
      setSuccess(result.message || "删除成功");
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(result.error || "删除失败");
    }

    setDeleteDialogOpen(false);
    setVarietyToDelete(null);
  };

  const confirmDelete = (id: string) => {
    setVarietyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const startEdit = (variety: Variety) => {
    setEditingId(variety.id);
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setError(null);
  };

  return (
    <Card className="border-green-100 dark:border-green-900/50">
      <CardHeader className="bg-green-50/50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900/50 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-green-900 dark:text-green-100 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
            西瓜品种管理
          </CardTitle>
          {!isAdding && !editingId && (
            <Button
              onClick={() => setIsAdding(true)}
              size="sm"
              className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500"
            >
              <Plus className="w-4 h-4 mr-1" />
              添加品种
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* 消息提示 */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* 添加表单 */}
        {isAdding && (
          <form
            onSubmit={handleSubmit}
            className="bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-green-900 dark:text-green-100">添加新西瓜品种</h3>
              <Button
                type="button"
                onClick={cancelEdit}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">品种名称 *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="例如：京欣一号、早佳8424"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="days">生长周期（天）*</Label>
                <Input
                  id="days"
                  name="days"
                  type="number"
                  min="1"
                  placeholder="例如：90"
                  required
                  defaultValue="90"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加西瓜品种
            </Button>
          </form>
        )}

        {/* 品种列表 */}
        <div className="grid md:grid-cols-2 gap-3">
          {varieties.map((variety) => (
            <div key={variety.id}>
              {editingId === variety.id ? (
                <form
                  onSubmit={handleSubmit}
                  className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-3"
                >
                  <input type="hidden" name="id" value={variety.id} />

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100 text-sm">
                      编辑西瓜品种
                    </h3>
                    <Button
                      type="button"
                      onClick={cancelEdit}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`name-${variety.id}`} className="text-xs">
                      品种名称
                    </Label>
                    <Input
                      id={`name-${variety.id}`}
                      name="name"
                      defaultValue={variety.name}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`days-${variety.id}`} className="text-xs">
                      生长周期（天）
                    </Label>
                    <Input
                      id={`days-${variety.id}`}
                      name="days"
                      type="number"
                      min="1"
                      defaultValue={variety.days || 90}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="sm"
                    className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500"
                  >
                    保存修改
                  </Button>
                </form>
              ) : (
                <div className="bg-card border rounded-lg p-4 hover:border-green-300 dark:hover:border-green-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Sprout className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="font-semibold text-foreground">
                          {variety.name}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        生长周期：{variety.days || 90} 天
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        onClick={() => startEdit(variety)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => confirmDelete(variety.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {varieties.length === 0 && !isAdding && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <Sprout className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>暂无西瓜品种，点击上方按钮添加</p>
          </div>
        )}
      </CardContent>

      {/*删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这个西瓜品种吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => varietyToDelete && handleDelete(varietyToDelete)}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
