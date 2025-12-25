import { Check, CheckCircle2, Clock, Users, X, XCircle } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth-helper";
import { db } from "@/lib/db";

async function getUsersList() {
  const users = await db.app_users.findMany({
    orderBy: [
      { account_status: "asc" }, // pending first
      { created_at: "desc" },
    ],
  });
  return users;
}

export default async function UsersManagementPage() {
  const currentUser = await getCurrentUser();

  // 只有gov角色可以访问
  if (!currentUser || currentUser.role !== "gov") {
    redirect("/admin");
  }

  const allUsers = await getUsersList();

  // 分类用户
  const pendingUsers = allUsers.filter((u) => u.account_status === "pending");
  const activeUsers = allUsers.filter((u) => u.account_status === "active");
  const rejectedUsers = allUsers.filter((u) => u.account_status === "rejected");

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">已激活</Badge>;
      case "pending":
        return <Badge className="bg-amber-500">待审核</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">已拒绝</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  const getRoleName = (role: string | null) => {
    switch (role) {
      case "farmer":
        return "农户";
      case "enterprise":
        return "企业";
      case "gov":
        return "政府";
      default:
        return "未知";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">用户审核管理</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">审核企业用户的注册申请</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              待审核
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {pendingUsers.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
              已通过
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {activeUsers.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
              已拒绝
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {rejectedUsers.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 待审核用户列表 */}
      {pendingUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>待审核用户</CardTitle>
            <CardDescription>需要审核的企业用户注册申请</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {user.real_name}
                      </p>
                      {getStatusBadge(user.account_status)}
                      <Badge variant="outline">{getRoleName(user.role)}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      用户名: {user.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      注册时间:{" "}
                      {user.created_at
                        ? new Date(user.created_at).toLocaleString("zh-CN")
                        : "未知"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <form
                      action={async () => {
                        "use server";
                        await db.app_users.update({
                          where: { id: user.id },
                          data: { account_status: "active" },
                        });
                        revalidatePath("/admin/users");
                      }}
                    >
                      <Button
                        type="submit"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        通过
                      </Button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await db.app_users.update({
                          where: { id: user.id },
                          data: { account_status: "rejected" },
                        });
                        revalidatePath("/admin/users");
                      }}
                    >
                      <Button type="submit" size="sm" variant="destructive">
                        <X className="w-4 h-4 mr-1" />
                        拒绝
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 已审核用户列表 */}
      <Card>
        <CardHeader>
          <CardTitle>所有用户</CardTitle>
          <CardDescription>系统中的所有注册用户</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {allUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{user.real_name}</p>
                    {getStatusBadge(user.account_status)}
                    <Badge variant="outline">{getRoleName(user.role)}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.username}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("zh-CN")
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
