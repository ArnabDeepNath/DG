function routeGuard() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html'; // Redirect to login page if token is not present
  }
}
