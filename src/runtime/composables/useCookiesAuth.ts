import { appendResponseHeader, sendRedirect, H3Event } from "h3"
import { FetchContext } from "ofetch"
import { navigateTo, useRequestEvent, useRequestHeaders, useRuntimeConfig, useRoute } from "#imports"
import { RuntimeConfig } from "@nuxt/schema"

const credential = "include" as const

export const useCookiesAuth = (fromPath: string | undefined = undefined) => {
  const event = useRequestEvent()
  const header = useRequestHeaders()
  const config = useRuntimeConfig()
  const fromPathValue = fromPath || useRoute().path

  const refreshTokenOnResponseErrorHandler = getRefreshTokenOnResponseErrorHandler(event, config, fromPathValue)

  return {
    retryStatusCodes: [401],
    retry: 1,
    baseURL: config.public.cookiesAuth.apiBaseUrl,
    credentials: credential,
    onResponseError: async (context: FetchContext) => {
      if (context.response?.status === 401) {
        const res = await $fetch.raw(config.public.cookiesAuth.refreshTokenUrl, {
          method: "POST",
          baseURL: config.public.cookiesAuth.apiBaseUrl,
          headers: {
            cookie: header.cookie
          },
          credentials: credential,
          onResponseError: refreshTokenOnResponseErrorHandler
        })

        const cookies = (res.headers.get("set-cookie") || "").split(",")

        context.options.headers = {
          ...context.options.headers,
          cookie: cookies.map((c) => c.split(";")[0]).join(";")
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

function getRefreshTokenOnResponseErrorHandler(event: H3Event, config: RuntimeConfig, fromPath: string) {
  if (config.public.cookiesAuth.redirectOnRefreshTokenExpiration) {
    const handler = async (refreshContext: FetchContext) => {
      if (refreshContext.response?.status === 401) {
        if (process.server) {
          if (fromPath !== config.public.cookiesAuth.redirectTo) {
            return await sendRedirect(event, config.public.cookiesAuth.redirectTo)
          }
        } else if (process.client) {
          await navigateTo(config.public.cookiesAuth.redirectTo)
        }
      }
    }
    return handler
  } else {
    return undefined
  }
}
