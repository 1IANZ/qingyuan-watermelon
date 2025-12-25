import { ArrowLeft, Database } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import BaseLocationManager from "@/components/admin/BaseLocationManager";
import BaseVarietyManager from "@/components/admin/BaseVarietyManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth-helper";
import { db } from "@/lib/db";

export default async function BaseDataPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // 获取基础数据
  const [locations, varieties] = await Promise.all([
    db.base_locations.findMany({ orderBy: { name: "asc" } }),
    db.base_varieties.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 顶部导航栏 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
              <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 dark:text-gray-100 text-lg">基础数据管理</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                管理基地位置和西瓜品种信息
              </p>
            </div>
          </div>
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回主页
            </Button>
          </Link>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-6xl mx-auto p-4 space-y-6 mt-4">
        {/* 统计概览 */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 pt-6">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">
                基地位置
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {locations.length}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">个基地</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 pt-6">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">
                西瓜品种
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {varieties.length}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">个品种</div>
            </CardContent>
          </Card>
        </div>

        {/* 基地位置管理 */}
        <BaseLocationManager locations={locations} />

        {/* 西瓜品种管理 */}
        <BaseVarietyManager varieties={varieties} />
      </main>
    </div>
  );
}
