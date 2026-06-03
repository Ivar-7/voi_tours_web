// TODO: Implement RoleGuard
// Props: roles (['admin'|'agent'|'customer'][]), children
// If user.role not in roles: render <Navigate to="/" /> (forbidden)
// Wraps ProtectedRoute internally

export default function RoleGuard({ roles, children }) {
  return children;
}
