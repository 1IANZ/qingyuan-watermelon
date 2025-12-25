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
import PasswordStrengthIndicator from "@/components/ui/PasswordStrengthIndicator";
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
  const [password, setPassword] = useState("");

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
    <div className="min-h-screen bg-green-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
      <Card className="w-full max-w-md shadow-xl border-green-100 dark:border-green-900 bg-white dark:bg-gray-900">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <Sprout className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-900 dark:text-green-100">
            用户注册
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            清苑西瓜溯源与品质协同监管系统
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state?.message && (
              <div
                className={
                  state.success
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm p-3 rounded-md flex items-center border border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-md flex items-center border border-transparent dark:border-red-900/50"
                }
              >
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                {state.message}
              </div>
            )}

            {/* 用户名 */}
            <div className="space-y-2">
              <Label htmlFor="username" className="dark:text-gray-200">
                用户名
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  id="username"
                  name="username"
                  placeholder="请输入用户名或手机号"
                  className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            {/* 真实姓名 */}
            <div className="space-y-2">
              <Label htmlFor="realName" className="dark:text-gray-200">
                真实姓名
              </Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  id="realName"
                  name="realName"
                  placeholder="请输入真实姓名"
                  className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            {/* 密码 */}
            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-gray-200">
                密码
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="至少8位，包含大小写字母、数字和特殊字符"
                  className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <PasswordStrengthIndicator password={password} />
            </div>

            {/* 确认密码 */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="dark:text-gray-200">
                确认密码
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* 角色选择 */}
            <div className="space-y-2">
              <Label htmlFor="role" className="dark:text-gray-200">
                用户角色
              </Label>
              <Select
                name="role"
                defaultValue="farmer"
                onValueChange={(value) => value && setSelectedRole(value)}
              >
                <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {Object.entries(roleInfo).map(([value, info]) => {
                    const Icon = info.icon;
                    return (
                      <SelectItem
                        key={value}
                        value={value}
                        className="dark:text-gray-100 dark:focus:bg-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span>{info.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {roleInfo[selectedRole as keyof typeof roleInfo]?.description}
              </p>
              {selectedRole === "enterprise" && roleInfo.enterprise.notice && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs p-2 rounded-md mt-2 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{roleInfo.enterprise.notice}</span>
                </div>
              )}
            </div>

            <SubmitButton />

            {/* 返回登录 */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
              已有账号?{" "}
              <Link
                href="/login"
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:underline font-medium"
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
