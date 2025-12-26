'use client';

import { useEffect, useState } from 'react';
import { Mail, User, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type UserProfile = {
  name: string;
  email: string;
  role: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' });
        if (!res.ok) return;

        const data = await res.json();
        const u = data.user ?? data;

        setUser({
          name: u.name,
          email: u.email,
          role: u.role,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        Loading profile…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        Profile not available
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-0">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-center mb-10">
        My Profile
      </h1>

      {/* Profile Card */}
      <Card className="max-w-xl mx-auto shadow-sm">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-xl">
            Account Information
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <ProfileItem
            icon={<User className="h-5 w-5 text-muted-foreground" />}
            label="Full Name"
            value={user.name}
          />

          <ProfileItem
            icon={<Mail className="h-5 w-5 text-muted-foreground" />}
            label="Email Address"
            value={user.email}
          />

          <ProfileItem
            icon={<Shield className="h-5 w-5 text-muted-foreground" />}
            label="Role"
            value={user.role}
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Sub component ---------- */

function ProfileItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>

      <div className="text-sm font-medium text-foreground text-right">
        {value}
      </div>
    </div>
  );
}
