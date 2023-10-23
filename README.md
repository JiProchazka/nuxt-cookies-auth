# Nuxt Cookies Auth

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

➡️ **useFetch** with automatic token refresh (stored in `httpOnly` cookies) ⬅️

[Nuxt 3](https://nuxt.com) module for passing cookies with each `useFetch` request (with the client calls and the SSR calls as well).  
**httpOnly** Cookies are the best option for storing access token (this way it is protected against XSS). Module automatically tries to refresh tokens with a `POST` call to a specified url on a **401 Unauthorized** exception response.

## Features

<!-- Highlight some of the features your module provide here -->

- 🌲 &nbsp;Handles access and refresh tokens, both can be `httpOnly`
- 🚠 &nbsp;Automatically tries to refresh tokens on 401 response
- ⛰ &nbsp;Works on client and server api

## Quick Setup

1. Add `nuxt-cookies-auth` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-cookies-auth

# Using yarn
yarn add --dev nuxt-cookies-auth

# Using npm
npm install --save-dev nuxt-cookies-auth
```

2. Add `nuxt-cookies-auth` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: ["nuxt-cookies-auth"]
  ...
})
```

3. Add configuration to the `nuxt.config.ts`

```js
export default defineNuxtConfig({
  ...
  cookiesAuth: {
    apiBaseUrl: "",
    refreshTokenUrl: "/api/refresh",
    redirectOnRefreshTokenExpiration: true,
    redirectTo: "/login"
  }
  ...
})
```

#### Configuration

- **refreshTokenUrl**: url expecting `POST` request for refreshing tokens (default: `"/api/refresh"`)
- **apiBaseUrl**: default API url. For calling Nuxt 3 server api routes leave it blank, otherwise put an absolute server url, eg: `http://test.com/api` (default: _blank_).  
  It sets the `baseURL` to the `useFetch` as well when the `useCookiesAuth` is called.
- **redirectOnRefreshTokenExpiration**: redirect or not to the `redirectTo` path when the api returns 401 response for the refresh token request (default: _true_)
- **redirectTo**: path where the app will be redirected when the api returns 401 response for refresh token request (default: _/login_)

[# More detailed example of configuration](#example)

That's it! You can now use `useCookiesAuth` in your Nuxt app ✨

```js
// use spread operator for useCookiesAuth composable and useFetch options:
const { data, error } = await useFetch("/api/data", {
  ...useCookiesAuth()
})

// with body or other parameters:
const { data, error } = await useFetch("/api/data", {
  ...useCookiesAuth(),
  method: "POST",
  query: {
    id: 7
  },
  body: {
    message: "Hello!"
  }
})
```

## Example

### Configuration

When you have api url `http://test.com/api/v1/auth/refresh` for refreshing token and `http://test.com/api/v1/users` for getting list of users, set:

- `apiBaseUrl: "http://test.com/api/v1"`
- `refreshTokeUrl: "/auth/refresh"`
- and call `useFetch("/users", { ...useCookiesAuth() })`.

### Backend

For an authorization with tokens in cookies there are only two routes needed:

- login
- refresh

Login sets two cookies. First with the access token with shorter expiration and second refresh token with a longer expiration.  
You can check the [Nuxt 3 server api login route](/playground/server/api/login.post.ts).  
Second [route for refreshing token](/playground/server/api/refresh.post.ts) just checks the refresh token and when it is correct it sends back a new pair of access and refresh token. This is the route that must be set to the `refreshTokenUrl` configuration field in `nuxt.config.ts`.

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-cookies-auth/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-cookies-auth
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-cookies-auth.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-cookies-auth
[license-src]: https://img.shields.io/npm/l/nuxt-cookies-auth.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-cookies-auth
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com

# Warranty

There is no warranty. Usage is at your own risk.
