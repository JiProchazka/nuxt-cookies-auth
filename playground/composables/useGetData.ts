import { useFetch, useCookiesAuth } from "#imports"

export const useGetData = async () => {
  return await useFetch("/api/data", {
    ...useCookiesAuth()
  })
}
