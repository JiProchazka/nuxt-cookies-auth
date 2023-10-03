export default defineNuxtConfig({
  modules: ["../src/module"],
  cookiesAuth: {
    apiBaseUrl: "",
    refreshTokenUrl: "/api/refresh-2"
  },
  devtools: { enabled: true }
})
