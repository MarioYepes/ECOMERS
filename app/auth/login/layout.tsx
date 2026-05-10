import { redirectIfAuthenticated } from "@/lib/auth/redirect-if-authenticated"

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await redirectIfAuthenticated()
  return children
}
