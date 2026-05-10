export default function UpdatePasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  /* Sin redirectIfAuthenticated: el usuario llega con sesión de recuperación y debe poder cambiar la contraseña. */
  return children
}
