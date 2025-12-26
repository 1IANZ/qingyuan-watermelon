export const STAGE_OPTIONS = [
  { value: "planting", label: "种植阶段 (农残自检)", shortLabel: "种植阶段" },
  { value: "harvest", label: "采收阶段 (糖度/分级)", shortLabel: "采收阶段" },
  { value: "transport", label: "流通运输 (抽检)", shortLabel: "流通运输" },
  { value: "market", label: "销售终端 (复检)", shortLabel: "销售终端" },
];

export const RESULT_OPTIONS = [
  {
    value: "pass",
    label: "合格",
    color: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30",
  },
  {
    value: "fail",
    label: "不合格",
    color: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30",
  },
  {
    value: "warning",
    label: "风险预警",
    color: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30",
  },
];

export const REPORT_KEY_MAP: Record<string, string> = {
  sugar: "糖度 (Brix)",
  pesticide: "农残结果",
};
