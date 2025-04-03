import ModeToggle from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="space-x-5">
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Login</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant={"secondary"}>Create a account</Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <ModeToggle />
    </div>
  );
}
