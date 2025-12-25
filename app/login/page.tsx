"use client";

import { AlertCircle, Lock, Sprout, User } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
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
import { loginAction } from "../actions/login";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full bg-green-600 hover:bg-green-700 transition-all"
      disabled={pending}
    >
      {pending ? "正在验证..." : "立即登录"}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, { message: "" });

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
      <Card className="w-full max-w-sm shadow-xl border-green-100 dark:border-green-900 bg-white dark:bg-gray-900">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <Sprout className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-900 dark:text-green-100">
            系统登录
          </CardTitle>
          <CardDescription className="dark:text-gray-400">清苑西瓜溯源与品质协同监管系统</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state?.message && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-md flex items-center border border-transparent dark:border-red-900/50">
                <AlertCircle className="w-4 h-4 mr-2" />
                {state.message}
              </div>
            )}

            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input name="username" placeholder="用户名 / 手机号" className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500" required />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input name="password" type="password" placeholder="密码" className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500" required />
              </div>
            </div>

            <SubmitButton />

            {/* 注册入口 */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
              还没有账号?{" "}
              <Link
                href="/register"
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:underline font-medium"
              >
                立即注册
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
