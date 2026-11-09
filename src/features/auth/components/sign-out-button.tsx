import { LogOut } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui";
import { signOutUser } from "../server/actions";

interface SignOutButtonProps {
  label: string;
  variant?: ButtonProps["variant"];
}

export function SignOutButton({ label, variant = "outline" }: SignOutButtonProps) {
  return (
    <form action={signOutUser}>
      <Button type="submit" variant={variant}>
        <LogOut aria-hidden="true" />
        {label}
      </Button>
    </form>
  );
}
