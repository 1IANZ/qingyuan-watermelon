"use client";

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  MapPin,
  Sprout,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- 模拟基础数据 (真实项目中这些应该从后台获取) ---
const VARIETIES = [
  { id: "v1", name: "清苑麒麟8424 (早熟)", code: "KL8424" },
  { id: "v2", name: "黑美人 (抗病强)", code: "HMR01" },
  { id: "v3", name: "特小凤 (黄瓤)", code: "TXF02" },
];

const LOCATIONS = [
  { id: "l1", name: "清苑示范基地-A01暖棚" },
  { id: "l2", name: "清苑示范基地-A02暖棚" },
  { id: "l3", name: "清苑示范基地-A03暖棚" },
  { id: "l4", name: "东闾乡-B01露天田" },
  { id: "l5", name: "东闾乡-B02露天田" },
];

export default function CreateBatchPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    variety: "",
    location: "",
    sowingDate: new Date().toISOString().split("T")[0], // 默认今天
    batchName: "", // 批次别名
  });

  // 智能生成批次名的逻辑
  const updateBatchName = (field: string, value: string) => {
    let newName = formData.batchName;
    const dateStr = formData.sowingDate.replace(/-/g, "").slice(4); // 取MMDD

    if (field === "variety") {
      const v = VARIETIES.find((v) => v.id === value);
      if (v) {
        // 简单的命名规则: 品种-日期
        newName = `${v.name.split(" ")[0]}-${dateStr}`;
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value, batchName: newName }));
  };

  const handleSubmit = () => {
    if (!formData.variety || !formData.location || !formData.batchName) {
      alert("请完整填写所有带 * 的必填项");
      return;
    }

    setIsSubmitting(true);

    // 模拟API请求
    setTimeout(() => {
      // 假设后台返回了新生成的ID: batch_999
      alert("✅ 开工大吉！\n新批次已建立，生成的溯源ID为: batch_999");
      router.push("/admin/dashboard"); // 建完回首页
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-10">
      {/* 顶部导航 */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="-ml-2"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900 ml-2">新建种植批次</h1>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* 顶部引导卡片 */}
        <div className="bg-green-600 text-white p-5 rounded-2xl shadow-lg shadow-green-200">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">新周期的开始</h2>
              <p className="text-sm opacity-90 mt-1 leading-relaxed">
                请准确录入“身份证”信息，这些信息一经创建将
                <span className="font-bold underline">无法修改</span>。
              </p>
            </div>
          </div>
        </div>

        {/* 表单区域 */}
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6 space-y-5">
            {/* 1. 品种选择 */}
            <div className="space-y-2">
              <Label className="flex items-center text-gray-700">
                <Tag className="w-4 h-4 mr-2 text-green-600" /> 选择品种{" "}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select onValueChange={(val) => updateBatchName("variety", val as string)}>
                <SelectTrigger className="h-12 bg-gray-50 border-gray-200 focus:ring-green-500">
                  <SelectValue >
                    <span className="text-gray-400">请选择品种</span>
                  </SelectValue >
                </SelectTrigger>
                <SelectContent>
                  {VARIETIES.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. 地块选择 */}
            <div className="space-y-2">
              <Label className="flex items-center text-gray-700">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" /> 种植地块{" "}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, location: val as string }))
                }
              >
                <SelectTrigger className="h-12 bg-gray-50 border-gray-200 focus:ring-green-500">
                  <SelectValue >
                    <span className="text-gray-400">请选择大棚或地块</span>
                  </SelectValue >
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 3. 播种时间 */}
            <div className="space-y-2">
              <Label className="flex items-center text-gray-700">
                <Calendar className="w-4 h-4 mr-2 text-orange-500" />{" "}
                播种/定植时间 <span className="text-red-500 ml-1">*</span>
              </Label>
              {/* 使用原生 date input 以获得最佳移动端体验 */}
              <Input
                type="date"
                className="h-12 bg-gray-50 border-gray-200 block w-full"
                value={formData.sowingDate}
                onChange={(e) => updateBatchName("sowingDate", e.target.value)}
              />
            </div>

            {/* 4. 批次别名 (自动生成 + 可修改) */}
            <div className="space-y-2 pt-2">
              <Label className="text-gray-500 text-xs">
                系统生成的批次名称 (用于内部管理)
              </Label>
              <Input
                value={formData.batchName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    batchName: e.target.value,
                  }))
                }
                className="h-10 border-dashed border-green-300 bg-green-50 text-green-700 font-medium"
                placeholder="自动生成，例如: 麒麟-0620"
              />
            </div>
          </CardContent>
        </Card>

        {/* 底部提交按钮 */}
        <Button
          className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 shadow-xl shadow-green-200 rounded-xl"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "正在创建..."
          ) : (
            <>
              <CheckCircle2 className="mr-2 w-5 h-5" /> 确认开工
            </>
          )}
        </Button>

        <p className="text-center text-xs text-gray-400">
          点击确认后，将自动生成唯一溯源码
        </p>
      </div>
    </div>
  );
}
