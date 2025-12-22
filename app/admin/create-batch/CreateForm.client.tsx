"use client";

import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { AlertCircle, Calendar as CalendarIcon, Sprout } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  type CreateBatchState,
  createBatchAction,
} from "@/app/actions/create-batch";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const [variety, setVariety] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <form action={formAction} className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader className="bg-green-50/50 border-b border-green-100 pb-3">
          <CardTitle className="text-base text-green-800 flex items-center">
            <Sprout className="w-4 h-4 mr-2" />
            基本档案信息
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-5">
          {/* 错误提示 */}
          {state.message && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {state.message}
            </div>
          )}

          {/* 1. 品种选择 */}
          <div className="space-y-2">
            <Label>西瓜品种</Label>

            <Select
              value={variety}
              onValueChange={(value) => setVariety(value ?? "")}
            >
              <SelectTrigger>
                <SelectValue>
                  {variety
                    ? varieties.find((v) => v.id === variety)?.name
                    : "请选择品种"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {varieties.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 隐藏 Input 传 ID */}
            <input type="hidden" name="varietyId" value={variety} />
          </div>

          {/* 2. 地块选择 */}
          <div className="space-y-2">
            <Label>种植地块</Label>

            <Select
              value={location}
              onValueChange={(value) => setLocation(value ?? "")}
            >
              <SelectTrigger>
                <SelectValue>
                  {location
                    ? locations.find((l) => l.id === location)?.name
                    : "请选择地块"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {locations.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <input type="hidden" name="locationId" value={location} />
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
