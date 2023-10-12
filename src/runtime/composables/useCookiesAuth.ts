import { appendResponseHeader, sendRedirect, H3Event } from "h3"
import { FetchContext } from "ofetch"
import { navigateTo, useRequestEvent, useRequestHeaders, useRuntimeConfig, useRoute } from "#imports"
import { RuntimeConfig } from "@nuxt/schema"
import { RouteLocationNormalizedLoaded } from "#vue-router"

export const useCookiesAuth = () => {
  const event = useRequestEvent()
  const header = useRequestHeaders()
  const config = useRuntimeConfig()
  const route = useRoute()

  const refreshTokenOnResponseErrorHandler = getRefreshTokenOnResponseErrorHandler(event, config, route)

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
          },
          onResponseError: refreshTokenOnResponseErrorHandler
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

function getRefreshTokenOnResponseErrorHandler(
  event: H3Event,
  config: RuntimeConfig,
  route: RouteLocationNormalizedLoaded
) {
  if (config.public.cookiesAuth.redirectOnRefreshTokenExpiration) {
    const handler = async (refreshContext: FetchContext) => {
      if (refreshContext.response?.status === 401) {
        if (process.server) {
          if (route.path !== config.public.cookiesAuth.redirectTo) {
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
