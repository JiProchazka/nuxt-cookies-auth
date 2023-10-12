import { defineNuxtModule, addPlugin, createResolver, addImports } from "@nuxt/kit"
import { defu } from "defu"

// Module options TypeScript interface definition
export interface ModuleOptions {
  apiBaseUrl?: string
  refreshTokenUrl: string
  redirectOnRefreshTokenExpiration: boolean
  redirectTo: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-cookies-auth",
    configKey: "cookiesAuth"
  },
  // Default configuration options of the Nuxt module
  defaults: {
    apiBaseUrl: "",
    refreshTokenUrl: "/api/refresh",
    redirectOnRefreshTokenExpiration: true,
    redirectTo: "/login"
  },
  setup(options, nuxt) {
    if (!options.refreshTokenUrl) {
      throw new Error("nuxt-cookies-auth refreshTokenUrl in nuxt.config.ts is required")
    }

    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve("./runtime/plugin"))

    addImports({
      name: "useCookiesAuth",
      as: "useCookiesAuth",
      from: resolver.resolve("./runtime/composables/useCookiesAuth")
    })

    nuxt.options.runtimeConfig.public.cookiesAuth = defu(nuxt.options.runtimeConfig.public.cookiesAuth!, options)
  }
})
