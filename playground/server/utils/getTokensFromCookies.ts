export default (cookie: string) => {
  const tokens: Record<string, string | undefined> = {}

  cookie.split(";").forEach((cookie) => {
    const [key, value] = cookie.split("=")
    tokens[key.trim()] = value
  })
  return tokens
}
