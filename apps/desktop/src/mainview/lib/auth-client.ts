import { createAuthClient } from "better-auth/react"
import { anonymousClient, magicLinkClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_AUTH_URL,
    plugins: [
        anonymousClient(),
        magicLinkClient()
    ]
})
