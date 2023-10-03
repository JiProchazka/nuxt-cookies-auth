import { H3Event } from "h3"
import { createError, getHeader, getTokensFromCookies } from "#imports"

// If the user does not exist on the request, throw a 401 error
export default (event: H3Event) => {
  const cookie = getHeader(event, "cookie")
  console.log("COOKIE ON SERVER in protectRoute", cookie)
  if (!cookie) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    })
  }

  const tokens = getTokensFromCookies(cookie!)
  if (!tokens["access-token"]) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    })
  }
}
