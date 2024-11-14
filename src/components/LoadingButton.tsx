import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadingButtonProps {
  isPending: boolean;
  isFetching?: boolean;
  isError?: boolean;
  loadingText: string;
  idleText: string;
  disabled?: boolean;
  className?: string;
}

export default function LoadingButton({
  isPending,
  isFetching,
  isError,
  loadingText,
  idleText,
  disabled,
  className
}: LoadingButtonProps) {
  return (
    <Button
      variant="default"
      className={className}
      disabled={disabled || isPending || isFetching || isError}
    >
      {isPending && <Loader2 className="size-5 animate-spin" />}
      {isPending ? loadingText : idleText}
    </Button>
  );
}
