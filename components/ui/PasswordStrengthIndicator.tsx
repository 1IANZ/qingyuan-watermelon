"use client";

import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { PasswordStrength } from "@/lib/password";

type Props = {
  password: string;
};

export default function PasswordStrengthIndicator({ password }: Props) {
  const [strength, setStrength] = useState<PasswordStrength>({
    isValid: false,
    errors: [],
    strength: "weak",
  });

  useEffect(() => {
    if (!password) {
      setStrength({
        isValid: false,
        errors: [],
        strength: "weak",
      });
      return;
    }

    // 客户端验证密码强度
    const errors: string[] = [];
    let strengthScore = 0;

    if (password.length < 8) {
      errors.push("至少 8 个字符");
    } else {
      strengthScore++;
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("至少 1 个大写字母");
    } else {
      strengthScore++;
    }

    if (!/[a-z]/.test(password)) {
      errors.push("至少 1 个小写字母");
    } else {
      strengthScore++;
    }

    if (!/[0-9]/.test(password)) {
      errors.push("至少 1 个数字");
    } else {
      strengthScore++;
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push("至少 1 个特殊字符");
    } else {
      strengthScore++;
    }

    let strengthLevel: "weak" | "medium" | "strong";
    if (strengthScore <= 2) {
      strengthLevel = "weak";
    } else if (strengthScore <= 4) {
      strengthLevel = "medium";
    } else {
      strengthLevel = "strong";
    }

    setStrength({
      isValid: errors.length === 0,
      errors,
      strength: strengthLevel,
    });
  }, [password]);

  if (!password) return null;

  const strengthColors = {
    weak: "bg-red-500",
    medium: "bg-yellow-500",
    strong: "bg-green-500",
  };

  const strengthLabels = {
    weak: "弱",
    medium: "中等",
    strong: "强",
  };

  const strengthTextColors = {
    weak: "text-red-600 dark:text-red-400",
    medium: "text-yellow-600 dark:text-yellow-400",
    strong: "text-green-600 dark:text-green-400",
  };

  const rules = [
    { label: "至少 8 个字符", met: password.length >= 8 },
    { label: "至少 1 个大写字母", met: /[A-Z]/.test(password) },
    { label: "至少 1 个小写字母", met: /[a-z]/.test(password) },
    { label: "至少 1 个数字", met: /[0-9]/.test(password) },
    {
      label: "至少 1 个特殊字符",
      met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    },
  ];

  return (
    <div className="mt-3 space-y-3">
      {/* 强度条 */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600 dark:text-gray-400">密码强度</span>
          <span
            className={`font-semibold ${strengthTextColors[strength.strength]}`}
          >
            {strengthLabels[strength.strength]}
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strengthColors[strength.strength]}`}
            style={{
              width:
                strength.strength === "weak"
                  ? "33%"
                  : strength.strength === "medium"
                    ? "66%"
                    : "100%",
            }}
          />
        </div>
      </div>

      {/* 规则检查列表 */}
      <div className="space-y-1">
        {rules.map((rule) => (
          <div
            key={rule.label}
            className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
          >
            {rule.met ? (
              <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 shrink-0" />
            )}
            <span
              className={rule.met ? "text-green-600 dark:text-green-400" : ""}
            >
              {rule.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
