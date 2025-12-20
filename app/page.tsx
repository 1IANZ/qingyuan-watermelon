"use client";

import { ScanLine, Search, Sprout, UserCog } from "lucide-react";
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

	// 处理扫码 (模拟)
	const handleScanClick = () => {
		// 实际项目中这里接微信/支付宝/浏览器的扫码SDK
		// 扫码结果通常是一个完整的 URL (http://.../trace/uuid)

		alert("模拟扫码成功！将跳转到演示页面");


	};

	// 处理登录跳转
	const handleLoginClick = () => {
		router.push("/login");
	};

	return (
		<div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4 relative">

			<div className="absolute top-4 right-4">
				<Button
					variant="ghost"
					className="text-green-700 hover:text-green-900 hover:bg-green-100 gap-2"
					onClick={handleLoginClick}
				>
					<UserCog className="w-4 h-4" />
					<span className="hidden sm:inline">农户/监管登录</span>
					<span className="sm:hidden">登录</span>
				</Button>
			</div>

			<div className="mb-8 text-center space-y-2">
				<div className="bg-green-100 p-4 rounded-full inline-block mb-2">
					<Sprout className="w-10 h-10 text-green-600" />
				</div>
				<h1 className="text-3xl font-bold text-green-900 tracking-tight">
					清苑西瓜溯源平台
				</h1>
				<p className="text-green-700/80 text-sm">
					一瓜一码 · 全程透明 · 品质保障
				</p>
			</div>

			<Card className="w-full max-w-md shadow-lg border-green-100">
				<CardHeader className="text-center pb-2">
					<CardTitle className="text-xl text-gray-800">产品溯源查询</CardTitle>
					<CardDescription>
						请输入西瓜标签上的溯源码，或直接扫码
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4 pt-4">
					<div className="flex space-x-2">
						<div className="relative w-full">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
							<Input
								type="text"

								placeholder="例如: KL-1718..."
								className="pl-9 border-green-200 focus-visible:ring-green-500"
								value={traceId}
								onChange={(e) => setTraceId(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSearch()}
							/>
						</div>
						<Button
							onClick={handleSearch}
							className="bg-green-600 hover:bg-green-700 text-white"
						>
							查询
						</Button>
					</div>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-gray-100" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-white px-2 text-gray-400">或者</span>
						</div>
					</div>

					<Button
						variant="outline"
						className="w-full h-12 border-dashed border-2 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-500 transition-all"
						onClick={handleScanClick}
					>
						<ScanLine className="mr-2 h-5 w-5" />
						扫描二维码查询
					</Button>
				</CardContent>
			</Card>

			<footer className="absolute bottom-6 text-center text-xs text-green-800/40">
				© 2025 清苑区农业农村局 · 技术支持
			</footer>
		</div>
	);
}