import { appendResponseHeader } from "h3"
import { FetchContext } from "ofetch"
import { useRequestEvent, useRequestHeaders, useRuntimeConfig } from "#imports"

export const useCookiesAuth = () => {
  const event = useRequestEvent()
  const header = useRequestHeaders()
  const config = useRuntimeConfig()
  console.log(config)

  return {
    retryStatusCodes: [401],
    retry: 1,
    baseURL: config.public.cookiesAuth.apiBaseUrl,
    onResponseError: async (context: FetchContext) => {
      if (context.response?.status === 401) {
        const res = await $fetch.raw(config.public.cookiesAuth.refreshTokenUrl, {
          method: "POST",
          baseURL: config.public.cookiesAuth.apiBaseUrl,
          headers: {
            cookie: header.cookie
          }
        })

        const cookies = (res.headers.get("set-cookie") || "").split(",")

        context.options.headers = {
          ...context.options.headers,
          cookie: cookies.map((c) => c.split(";")[0]).join(",")
        }

        if (event) {
          for (const cookie of cookies) {
            appendResponseHeader(event, "set-cookie", cookie)
          }
        }
      }
    }
  }
}
