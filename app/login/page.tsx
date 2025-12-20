"use client";

import { AlertCircle, Lock, Sprout, User } from "lucide-react";
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
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-xl border-green-100">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-green-100 p-3 rounded-full">
              <Sprout className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-900">
            系统登录
          </CardTitle>
          <CardDescription>清苑西瓜溯源与品质协同监管系统</CardDescription>
        </CardHeader>
        <CardContent>
          {/* formAction 绑定到 form 上 */}
          <form action={formAction} className="space-y-4">
            {/* 错误提示区 */}
            {state?.message && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {state.message}
              </div>
            )}

            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  name="username"
                  placeholder="用户名 / 手机号"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  name="password"
                  type="password"
                  placeholder="密码"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
