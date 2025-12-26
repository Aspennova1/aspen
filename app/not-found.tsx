import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-5xl font-bold">404</h1>

        <p className="text-lg text-muted-foreground">
          The page you are looking for does not exist.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
