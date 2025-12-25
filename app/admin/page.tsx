import { Building2, Landmark, LogOut, Sprout } from "lucide-react";
import { redirect } from "next/navigation";
import EnterpriseView from "@/components/admin/EnterpriseView";
import FarmerView from "@/components/admin/FarmerView";
import GovView from "@/components/admin/GovView";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { getCurrentUser, type UserRole } from "@/lib/auth-helper";
import { logoutAction } from "../actions/auth";

const ROLE_CONFIG: Record<
  UserRole,
  { label: string; color: string; icon: typeof Sprout }
> = {
  farmer: {
    label: "农户端",
    color: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 dark:border dark:border-green-800",
    icon: Sprout,
  },
  enterprise: {
    label: "企业端",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 dark:border dark:border-blue-800",
    icon: Building2,
  },
  gov: {
    label: "监管端",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 dark:border dark:border-purple-800",
    icon: Landmark,
  },
};

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const roleConfig = ROLE_CONFIG[user.role] || ROLE_CONFIG.farmer;
  const RoleIcon = roleConfig.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* ================= 顶部全局导航栏 ================= */}
      <header className="bg-card border-b px-4 py-3 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* 角色图标 */}
          <div className={`${roleConfig.color} p-2 rounded-full`}>
            <RoleIcon className="w-5 h-5" />
          </div>

          {/* 系统标题与用户信息 */}
          <div>
            <div className="font-bold text-foreground leading-tight">
              清苑西瓜监管系统
            </div>
            <div
              className={`text-[10px] px-1.5 py-0.5 rounded inline-block mt-0.5 font-medium ${roleConfig.color}`}
            >
              {roleConfig.label} : {user.username}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-1" /> 退出
            </Button>
          </form>
        </div>
      </header>

      <main className="p-4 pb-20 max-w-4xl mx-auto mt-4">
        {user.role === "farmer" && <FarmerView userId={user.userId} />}

        {user.role === "enterprise" && <EnterpriseView />}

        {user.role === "gov" && <GovView />}
      </main>
    </div>
  );
}
