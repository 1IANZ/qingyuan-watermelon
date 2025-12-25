"use client";

import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { AlertCircle, Calendar as CalendarIcon, Plus, Sprout } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  type CreateBatchState,
  createBatchAction,
} from "@/app/actions/create-batch";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
  varieties: { id: string; name: string }[];
  locations: { id: string; name: string }[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 shadow-md"
      disabled={pending}
    >
      {pending ? "正在创建档案..." : "确认创建批次"}
    </Button>
  );
}

const initialState: CreateBatchState = {
  message: "",
  success: false,
};

export default function CreateForm({ varieties, locations }: Props) {
  const [state, formAction] = useActionState(createBatchAction, initialState);

  const [varietyInput, setVarietyInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [varietyFocused, setVarietyFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  // 过滤建议列表
  const filteredVarieties = varieties.filter(v =>
    v.name.toLowerCase().includes(varietyInput.toLowerCase())
  );

  const filteredLocations = locations.filter(l =>
    l.name.toLowerCase().includes(locationInput.toLowerCase())
  );

  // 检查是否是新输入
  const isNewVariety = varietyInput.trim() && !varieties.find(v => v.name === varietyInput.trim());
  const isNewLocation = locationInput.trim() && !locations.find(l => l.name === locationInput.trim());

  return (
    <form action={formAction} className="space-y-6">
      <Card className="border-none shadow-sm dark:bg-card">
        <CardHeader className="bg-green-50/50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900 pb-3">
          <CardTitle className="text-base text-green-800 dark:text-green-100 flex items-center">
            <Sprout className="w-4 h-4 mr-2" />
            基本档案信息
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-5">
          {/* 错误提示 */}
          {state.message && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {state.message}
            </div>
          )}

          {/* 1. 品种输入 (Combobox) */}
          <div className="space-y-2">
            <Label>西瓜品种</Label>
            <div className="relative">
              <Input
                value={varietyInput}
                onChange={(e) => setVarietyInput(e.target.value)}
                onFocus={() => setVarietyFocused(true)}
                onBlur={() => setTimeout(() => setVarietyFocused(false), 200)}
                placeholder="输入或选择品种（如：京欣一号）"
                className="w-full"
              />

              {/* 建议下拉列表 */}
              {varietyFocused && (filteredVarieties.length > 0 || isNewVariety) && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredVarieties.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setVarietyInput(v.name);
                        setVarietyFocused(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-green-50 dark:hover:bg-green-900/30 text-sm dark:text-gray-200"
                    >
                      {v.name}
                    </button>
                  ))}
                  {isNewVariety && (
                    <div className="px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 flex items-center gap-2 border-t dark:border-gray-700">
                      <Plus className="w-4 h-4" />
                      <span>创建新品种: <strong>{varietyInput.trim()}</strong></span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <input type="hidden" name="varietyName" value={varietyInput} />
            {isNewVariety && (
              <p className="text-xs text-blue-600 dark:text-blue-400">✨ 这是一个新品种，将自动保存到系统中</p>
            )}
          </div>

          {/* 2. 地块输入 (Combobox) */}
          <div className="space-y-2">
            <Label>种植地块</Label>
            <div className="relative">
              <Input
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onFocus={() => setLocationFocused(true)}
                onBlur={() => setTimeout(() => setLocationFocused(false), 200)}
                placeholder="输入或选择地块（如：东大棚）"
                className="w-full"
              />

              {/* 建议下拉列表 */}
              {locationFocused && (filteredLocations.length > 0 || isNewLocation) && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredLocations.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        setLocationInput(l.name);
                        setLocationFocused(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-sm dark:text-gray-200"
                    >
                      {l.name}
                    </button>
                  ))}
                  {isNewLocation && (
                    <div className="px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 flex items-center gap-2 border-t dark:border-gray-700">
                      <Plus className="w-4 h-4" />
                      <span>创建新基地: <strong>{locationInput.trim()}</strong></span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <input type="hidden" name="locationName" value={locationInput} />
            {isNewLocation && (
              <p className="text-xs text-blue-600 dark:text-blue-400">✨ 这是一个新基地，将自动保存到系统中</p>
            )}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label>播种/定植日期</Label>

            <Popover>
              <PopoverTrigger
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full pl-3 text-left font-normal h-10",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? (
                  format(date, "PPP", { locale: zhCN })
                ) : (
                  <span>选择日期</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">

                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={zhCN} // 显示中文
                />
              </PopoverContent>
            </Popover>

            {/* 隐藏 Input 传日期字符串 */}
            <input
              type="hidden"
              name="sowingDate"
              value={date ? format(date, "yyyy-MM-dd") : ""}
            />
          </div>
        </CardContent>
      </Card>

      <SubmitButton />
    </form>
  );
}
