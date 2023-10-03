import { defineEventHandler, randomString, setCookie } from "#imports"

export default defineEventHandler(async (event) => {
  const accessToken = randomString()
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
