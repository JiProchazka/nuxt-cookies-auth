import { defineEventHandler, protectRoute } from "#imports"

export default defineEventHandler(async (event) => {
  protectRoute(event)

  return { message: "Hello!" }
})
