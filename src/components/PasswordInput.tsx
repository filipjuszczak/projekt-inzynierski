"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type PasswordInputProps = React.ComponentProps<typeof Input>;

export default function PasswordInput({
  onChange,
  value,
  defaultValue,
  id,
  ...props
}: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const Icon = isPasswordVisible ? EyeOffIcon : EyeIcon;

  return (
    <div className="relative">
      <Input
        {...props}
        type={isPasswordVisible ? "text" : "password"}
        id={id}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3"
        onClick={() => setIsPasswordVisible((i) => !i)}
      >
        <Icon className="h-4 w-4" />
        <span className="sr-only">
          {isPasswordVisible ? "Ukryj hasło" : "Pokaż hasło"}
        </span>
      </Button>
    </div>
  );
}
