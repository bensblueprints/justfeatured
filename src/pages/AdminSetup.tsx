import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/components/AuthWrapper";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const AdminSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const claimAdmin = async () => {
    if (!user) {
      toast({ title: "Please log in", description: "You need to log in before claiming admin.", variant: "destructive" });
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: user.id, role: "admin" as any });

      if (error) {
        console.error("Claim admin error", error);
        toast({
          title: "Unable to claim admin",
          description:
            "Either an admin already exists or you don't have permission. If an admin exists, ask them to grant you access.",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "You're now an admin", description: "Redirecting to dashboard..." });
      // Give time for policies to take effect and caches to update
      setTimeout(() => navigate("/dashboard"), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-16 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Admin Setup</CardTitle>
          <CardDescription>
            One-time setup: make the first logged-in user an admin. This is only allowed when no admin exists yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!user ? (
            <div className="space-y-3">
              <p>Please log in to continue.</p>
              <Button asChild>
                <Link to="/auth">Go to Login</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p>
                You are logged in as <span className="font-medium">{user.email}</span>.
                Click the button below to claim the admin role.
              </p>
              <Button onClick={claimAdmin} disabled={loading}>
                {loading ? "Claiming..." : "Claim Admin Role"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default AdminSetup;
