import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export type PasswordStrength = {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong";
};

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const errors: string[] = [];
  let strengthScore = 0;

  // 规则 1: 最小长度 8 个字符
  if (password.length < 8) {
    errors.push("密码至少需要 8 个字符");
  } else {
    strengthScore++;
  }

  // 规则 2: 包含大写字母
  if (!/[A-Z]/.test(password)) {
    errors.push("密码必须包含至少 1 个大写字母");
  } else {
    strengthScore++;
  }

  // 规则 3: 包含小写字母
  if (!/[a-z]/.test(password)) {
    errors.push("密码必须包含至少 1 个小写字母");
  } else {
    strengthScore++;
  }

  // 规则 4: 包含数字
  if (!/[0-9]/.test(password)) {
    errors.push("密码必须包含至少 1 个数字");
  } else {
    strengthScore++;
  }

  // 规则 5: 包含特殊字符
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("密码必须包含至少 1 个特殊字符 (!@#$%^&* 等)");
  } else {
    strengthScore++;
  }

  // 计算强度等级
  let strength: "weak" | "medium" | "strong";
  if (strengthScore <= 2) {
    strength = "weak";
  } else if (strengthScore <= 4) {
    strength = "medium";
  } else {
    strength = "strong";
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * 生成密码重置令牌
 * @returns UUID 格式的重置令牌
 */
export function generateResetToken(): string {
  return randomUUID();
}

/**
 * 检查令牌是否过期
 * @param expiryDate 令牌过期时间
 * @returns 是否已过期
 */
export function isTokenExpired(expiryDate: Date): boolean {
  return new Date() > new Date(expiryDate);
}

/**
 * 生成令牌过期时间（1小时后）
 * @returns 过期时间
 */
export function getTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 1);
  return expiry;
}
