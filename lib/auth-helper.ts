import { type JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secret = process.env.JWT_SECRET as string;
const key = new TextEncoder().encode(secret);

export async function signToken(payload: JWTPayload) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("24h")
		.sign(key);
}

export async function verifyToken(token: string) {
	try {
		const { payload } = await jwtVerify(token, key, {
			algorithms: ["HS256"],
		});
		return payload;
	} catch (err) {
		console.error("[JWT Verify Error]", err);
		return null;
	}
}

export type UserRole = "farmer" | "enterprise" | "gov";

export interface UserSession {
	userId: string;
	username: string;
	role: UserRole;
}

export async function getCurrentUser(): Promise<UserSession | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token")?.value;
	if (!token) return null;

	const payload = await verifyToken(token);
	if (!payload) return null;

	return {
		userId: payload.userId as string,
		username: payload.username as string,
		role: payload.role as UserRole,
	};
}
