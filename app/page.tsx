"use client";

import { Search, Sprout, UserCog } from "lucide-react"; // ❌ 移除了 ScanLine
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ConsumerHome() {
	const [traceId, setTraceId] = useState("");
	const router = useRouter();

	const handleSearch = () => {
		if (!traceId.trim()) return;
		router.push(`/trace/${traceId.trim()}`);
	};

	const handleLoginClick = () => {
		router.push("/login");
	};

	return (
		<div className="min-h-screen bg-green-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 relative transition-colors duration-300">
			{/* 右上角登录入口 */}
			<div className="absolute top-4 right-4">
				<Button
					variant="ghost"
					className="text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 gap-2"
					onClick={handleLoginClick}
				>
					<UserCog className="w-4 h-4" />
					<span className="hidden sm:inline">农户/监管登录</span>
					<span className="sm:hidden">登录</span>
				</Button>
			</div>

			{/* 标题区域 */}
			<div className="mb-8 text-center space-y-2">
				<div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full inline-block mb-2 shadow-sm">
					<Sprout className="w-10 h-10 text-green-600 dark:text-green-400" />
				</div>
				<h1 className="text-3xl font-bold text-green-900 dark:text-green-100 tracking-tight">
					清苑西瓜溯源平台
				</h1>
				<p className="text-green-700/80 dark:text-green-300/80 text-sm">
					一瓜一码 · 全程透明 · 品质保障
				</p>
			</div>

			{/* 核心查询卡片 */}
			<Card className="w-full max-w-md shadow-lg border-green-100 dark:border-green-900 bg-white dark:bg-gray-900">
				<CardHeader className="text-center pb-2">
					<CardTitle className="text-xl text-gray-800 dark:text-gray-100">产品溯源查询</CardTitle>
					<CardDescription className="dark:text-gray-400">
						请输入西瓜标签上的溯源编号 (如 KL-xxxx)
					</CardDescription>
				</CardHeader>

				<CardContent className="pt-6 pb-8 px-6">
					<div className="flex flex-col space-y-4">
						<div className="relative w-full">
							<Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
							<Input
								type="text"
								placeholder="请输入溯源码，例如: KL-1718"
								className="pl-10 h-12 text-lg border-green-200 dark:border-green-800 focus-visible:ring-green-500 bg-green-50/30 dark:bg-green-900/10 dark:text-gray-100 dark:placeholder:text-gray-600"
								value={traceId}
								onChange={(e) => setTraceId(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSearch()}
							/>
						</div>

						<Button
							onClick={handleSearch}
							className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white shadow-md shadow-green-200 dark:shadow-none"
						>
							立即查询
						</Button>
					</div>
				</CardContent>
			</Card>

			<footer className="absolute bottom-6 text-center text-xs text-green-800/40 dark:text-green-400/40">
				© 2025 清苑区农业农村局 · 技术支持
			</footer>
		</div>
	);
}