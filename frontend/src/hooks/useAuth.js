import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, isAuthenticated, loading, error, accessToken } = useSelector(
    (state) => state.auth
  );

  const isAdmin = user?.role === 'admin';
  const isRecruiter = user?.role === 'recruiter';
  const isAnalyst = user?.role === 'analyst';

  return {
    user,
    isAuthenticated,
    loading,
    error,
    accessToken,
    isAdmin,
    isRecruiter,
    isAnalyst,
  };
};
