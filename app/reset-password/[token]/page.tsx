"use client";

import { AlertCircle, KeyRound, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  resetPassword,
  verifyResetToken,
} from "@/app/actions/password-reset";
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

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    params.then((p) => {
      setToken(p.token);
      // 验证令牌
      verifyResetToken(p.token).then((result) => {
        setVerifying(false);
        if (result.valid) {
          setTokenValid(true);
          setUsername(result.username || "");
        } else {
          setError(result.message || "无效的重置链接");
        }
      });
    });
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("两次密码输入不一致");
      return;
    }

    setLoading(true);
    const result = await resetPassword(token, password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      setError(result.message || "重置失败");
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl bg-white dark:bg-gray-900">
          <CardContent className="pt-6">
            <div className="text-center text-gray-600 dark:text-gray-400">
              验证重置链接...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl bg-white dark:bg-gray-900">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              链接无效
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Link href="/forgot-password" className="flex-1">
                <Button variant="outline" className="w-full">
                  重新申请
                </Button>
              </Link>
              <Link href="/login" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  返回登录
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl bg-white dark:bg-gray-900">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <KeyRound className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              重置成功
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              密码已重置，正在跳转到登录页面...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl bg-white dark:bg-gray-900">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <KeyRound className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            重置密码
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            为用户 <span className="font-semibold">{username}</span> 设置新密码
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-md flex items-center border border-red-200 dark:border-red-800">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                {error}
              </div>
            )}

            {/* 新密码 */}
            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-gray-200">
                新密码
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="至少8位，包含大小写字母、数字和特殊字符"
                  className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100"
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
                确认新密码
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="请再次输入新密码"
                  className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "重置中..." : "重置密码"}
            </Button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium"
              >
                返回登录
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
