import { useAuth as useAuthContext } from '@/context/AuthContext';

/**
 * Custom hook to access the authentication context
 * @returns {Object} - Auth context value
 */
export function useAuth() {
  return useAuthContext();
}
