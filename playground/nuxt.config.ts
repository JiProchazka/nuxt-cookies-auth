export default defineNuxtConfig({
  modules: ["../src/module"],
  cookiesAuth: {
    apiBaseUrl: "",
    refreshTokenUrl: "/api/refresh-2",
    redirectOnRefreshTokenExpiration: true,
    redirectTo: "/login"
  },
  devtools: { enabled: true }
})
