import { redirectIfAuthenticated } from "@/lib/auth/redirect-if-authenticated"

export default async function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await redirectIfAuthenticated()
  return children
}
