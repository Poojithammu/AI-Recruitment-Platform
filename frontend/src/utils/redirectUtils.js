/**
 * Returns the dashboard path based on the user's role.
 * @param {string} role - The user's role (admin, recruiter, analyst, user)
 * @returns {string} - The path to the appropriate dashboard
 */
export const getDashboardPath = (role) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'recruiter':
      return '/recruiter/dashboard';
    case 'analyst':
      return '/analyst/dashboard';
    case 'user':
      return '/user/dashboard';
    default:
      return '/dashboard';
  }
};
