import Image from "next/image";
import { Button } from "@/components/ui/button";
import { poppins } from "@/ui/fonts";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-800 to-slate-950">
      <div className="space-y-6 text-center">
        <h1
          className={`text-6xl font-semibold text-white drop-shadow-lg ${poppins.className}`}
        >
          🔐 Auth
        </h1>
        <p className="text-white text-lg">A simple auhthentication service</p>
        <div>
          <LoginButton mode="modal" asChild>
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
