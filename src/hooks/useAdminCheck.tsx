import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthWrapper';
import { supabase } from '@/integrations/supabase/client';

export const useAdminCheck = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAdminStatus = async () => {
      try {
        // Resolve current session to avoid race conditions
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = user ?? session?.user ?? null;

        if (!currentUser) {
          if (isMounted) {
            setIsAdmin(false);
            setUserRole(null);
            setIsLoading(false);
          }
          return;
        }

        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', currentUser.id)
          .single();

        if (!isMounted) return;

        if (error) {
          console.error('Error fetching user role:', error);
          setIsAdmin(false);
          setUserRole(null);
        } else {
          const role = data?.role ?? null;
          setUserRole(role);
          setIsAdmin(['admin', 'super_admin'].includes(role || ''));
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        if (isMounted) {
          setIsAdmin(false);
          setUserRole(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      // Re-check when auth state changes
      setIsLoading(true);
      setTimeout(checkAdminStatus, 0);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    isAdmin,
    isLoading,
    userRole,
    user
  };
};