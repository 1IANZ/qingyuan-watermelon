"use client";

import { ScanLine, Search, Sprout } from "lucide-react";
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

	// 处理手动查询
	const handleSearch = () => {
		if (!traceId.trim()) return;
		// 跳转到详情页，带上 ID 参数
		router.push(`/trace/result?id=${traceId}`);
	};

	// 处理扫码 (模拟)
	const handleScanClick = () => {
		alert("此处调用手机摄像头组件，扫描成功后自动填入ID并跳转");
		// 实际逻辑：打开摄像头 -> 识别二维码 -> router.push(...)
	};

	return (
		<div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
			<div className="mb-8 text-center space-y-2">
				<div className="bg-green-100 p-4 rounded-full inline-block mb-2">
					<Sprout className="w-10 h-10 text-green-600" />
				</div>
				<h1 className="text-3xl font-bold text-green-900 tracking-tight">
					清苑西瓜
				</h1>
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
								placeholder="例如: 20230620-8823"
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
		</div>
	);
}
