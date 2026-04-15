export default function PrivateRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return null;
  }

  return children;
}
