import { createError, defineEventHandler, getHeader, randomString, getTokensFromCookies, setCookie } from "#imports"

export default defineEventHandler(async (event) => {
  const cookie = getHeader(event, "cookie")
  console.log("COOKIE ON SERVER in refresh", cookie)

  if (!cookie) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized - no refresh token"
    })
  }

  const tokens = getTokensFromCookies(cookie!)
  if (!tokens["refresh-token"]) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized - no refresh token"
    })
  }

  const accessToken = randomString()
  console.log("REFRESHING WITH TOKEN", accessToken)
  setCookie(event, "access-token", accessToken, {
    httpOnly: true,
    maxAge: 10,
    sameSite: "strict",
    secure: true
  })

  setCookie(event, "refresh-token", `r-${accessToken}`, {
    httpOnly: true,
    maxAge: 20,
    sameSite: "strict",
    secure: true
  })

  return
})
