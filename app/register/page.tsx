"use client";

import {
  AlertCircle,
  Building2,
  Lock,
  Sprout,
  User,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerAction } from "../actions/register";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full bg-green-600 hover:bg-green-700 transition-all"
      disabled={pending}
    >
      {pending ? "正在注册..." : "立即注册"}
    </Button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerAction, { message: "" });
  const [selectedRole, setSelectedRole] = useState("farmer");

  const roleInfo = {
    farmer: {
      label: "农户",
      icon: Sprout,
      description: "种植端用户,负责上传种植记录,注册后立即可用",
    },
    enterprise: {
      label: "企业",
      icon: Building2,
      description: "流通端用户,负责品质检测和流通追踪",
      notice: "企业账户注册后需经政府审核通过方可登录",
    },
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-green-100">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-green-100 p-3 rounded-full">
              <Sprout className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-900">
            用户注册
          </CardTitle>
          <CardDescription>清苑西瓜溯源与品质协同监管系统</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state?.message && (
              <div
                className={
                  state.success
                    ? "bg-green-50 text-green-700 text-sm p-3 rounded-md flex items-center border border-green-200"
                    : "bg-red-50 text-red-600 text-sm p-3 rounded-md flex items-center"
                }
              >
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                {state.message}
              </div>
            )}

            {/* 用户名 */}
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  name="username"
                  placeholder="请输入用户名或手机号"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            {/* 真实姓名 */}
            <div className="space-y-2">
              <Label htmlFor="realName">真实姓名</Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="realName"
                  name="realName"
                  placeholder="请输入真实姓名"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            {/* 密码 */}
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="至少6位字符"
                  className="pl-9"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* 确认密码 */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  className="pl-9"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* 角色选择 */}
            <div className="space-y-2">
              <Label htmlFor="role">用户角色</Label>
              <Select
                name="role"
                defaultValue="farmer"
                onValueChange={(value) => value && setSelectedRole(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleInfo).map(([value, info]) => {
                    const Icon = info.icon;
                    return (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span>{info.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {roleInfo[selectedRole as keyof typeof roleInfo]?.description}
              </p>
              {selectedRole === "enterprise" && roleInfo.enterprise.notice && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs p-2 rounded-md mt-2 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{roleInfo.enterprise.notice}</span>
                </div>
              )}
            </div>

            <SubmitButton />

            {/* 返回登录 */}
            <div className="text-center text-sm text-gray-600 pt-2">
              已有账号?{" "}
              <Link
                href="/login"
                className="text-green-600 hover:text-green-700 hover:underline font-medium"
              >
                立即登录
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
