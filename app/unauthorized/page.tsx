import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-4xl font-bold">Access Denied</h1>

        <p className="text-muted-foreground">
          You don’t have permission to view this page.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button>Go Home</Button>
          </Link>

          <Link href="/profile">
            <Button variant="outline">My Profile</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
