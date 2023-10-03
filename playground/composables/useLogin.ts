import { useFetch } from "#imports"

export const useLogin = async () => {
  console.log("useLogin")
  return await useFetch("/api/login", { method: "POST" })
}
