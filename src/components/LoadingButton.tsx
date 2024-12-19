import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoadingButtonProps {
  isPending: boolean;
  isFetching?: boolean;
  isError?: boolean;
  loadingText: string;
  idleText: string;
  disabled?: boolean;
  className?: string;
  size?: ButtonProps["size"];
  onClick?: () => void;
}

export default function LoadingButton({
  isPending,
  isFetching,
  isError,
  loadingText,
  idleText,
  disabled,
  className,
  size,
  onClick
}: LoadingButtonProps) {
  return (
    <Button
      variant="default"
      size={size}
      className={cn(
        className,
        disabled && "cursor-not-allowed disabled:pointer-events-auto"
      )}
      disabled={disabled || isPending || isFetching || isError}
      onClick={onClick ?? undefined}
    >
      {isPending && <Loader2 className="size-5 animate-spin" />}
      {isPending ? loadingText : idleText}
    </Button>
  );
}
