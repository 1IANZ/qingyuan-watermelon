import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-helper";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const token = request.cookies.get("auth_token")?.value;
	let isValid = false;
	if (token) {
		const payload = await verifyToken(token);
		if (payload) {
			isValid = true;
		} else {
			isValid = false;
		}
	}

	if (pathname.startsWith("/admin")) {
		if (!isValid) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
		return NextResponse.next();
	}

	if (pathname === "/login") {
		if (isValid) {
			return NextResponse.redirect(new URL("/admin", request.url));
		}
		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*", "/login"],
};
