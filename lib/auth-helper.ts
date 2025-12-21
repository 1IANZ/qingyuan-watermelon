import { type JWTPayload, jwtVerify, SignJWT } from "jose";

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
