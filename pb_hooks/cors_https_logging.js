/// <reference path="../pb_data/types.d.ts" />

// Configuração básica
const ALLOWED_ORIGINS = (env("PB_ALLOWED_ORIGINS") || "http://localhost:5173,http://127.0.0.1:5173").split(",").map(s => s.trim())
const FORCE_HTTPS = (env("PB_FORCE_HTTPS") || "false").toLowerCase() === "true"

onBeforeServe((e) => {
  // Middleware global: CORS + HTTPS redirect + logging
  e.router.use((c, next) => {
    try {
      // CORS
      const origin = c.request.headers.get("Origin") || ""
      const isAllowed = !origin || ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes("*")
      const allowOrigin = isAllowed ? (origin || "*") : ALLOWED_ORIGINS[0] || "*"

      c.response.headers.set("Access-Control-Allow-Origin", allowOrigin)
      c.response.headers.set("Vary", "Origin")
      c.response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
      c.response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
      c.response.headers.set("Access-Control-Allow-Credentials", "true")

      // Preflight
      if (c.request.method === "OPTIONS") {
        return c.noContent(204)
      }

      // HTTPS redirect (quando atrás de proxy)
      if (FORCE_HTTPS) {
        const xfProto = c.request.headers.get("X-Forwarded-Proto")
        if (xfProto && xfProto.toLowerCase() === "http") {
          try {
            const url = new URL(c.request.url)
            url.protocol = "https:"
            return c.redirect(301, url.toString())
          } catch (_) {
            // ignore
          }
        }
      }

      const start = Date.now()
      return next(c).then((res) => {
        const ms = Date.now() - start
        const status = c.response.status || 200
        // Log simples de acesso
        console.log(`[${new Date().toISOString()}] ${c.request.method} ${c.request.url} -> ${status} ${ms}ms`)
        return res
      }).catch((err) => {
        // Log de erro
        console.error(`[${new Date().toISOString()}] ERROR ${c.request.method} ${c.request.url}:`, err?.message || err)
        throw err
      })
    } catch (err) {
      console.error("Middleware failure:", err)
      return next(c)
    }
  })
})

// Hooks de autenticação para logging detalhado
onRecordAuthRequestFailure((e) => {
  try {
    console.warn(`[AUTH FAIL] email=${e?.email || "-"} collection=${e?.collection?.name || "users"} ip=${e?.httpContext?.ip || "-"} reason=${e?.error || "unknown"}`)
  } catch (_) {}
})

onRecordAuthRequestSuccess((e) => {
  try {
    console.log(`[AUTH OK] userId=${e?.record?.id || "-"} email=${e?.record?.email || "-"}`)
  } catch (_) {}
})
