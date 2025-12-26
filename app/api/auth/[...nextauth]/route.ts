import { handlers } from "@/lib/auth"

function makeSafe(fn?: (req: Request) => Promise<Response>) {
	return async function (req: Request) {
		try {
			if (!fn) {
				throw new Error("Auth handler not available")
			}
			return await fn(req)
		} catch (err: any) {
			console.error("NextAuth handler error:", err?.stack || err)
			const body = { error: "server_error", message: err?.message || String(err) }
			return new Response(JSON.stringify(body), { status: 500, headers: { "content-type": "application/json" } })
		}
	}
}

export const GET = makeSafe((handlers as any)?.GET)
export const POST = makeSafe((handlers as any)?.POST)
