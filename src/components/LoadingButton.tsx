import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadingButtonProps {
  isPending: boolean;
  loadingText: string;
  idleText: string;
  className?: string;
}

export default function LoadingButton({
  isPending,
  loadingText,
  idleText,
  className
}: LoadingButtonProps) {
  return (
    <Button variant="default" className={className} disabled={isPending}>
      {isPending && <Loader2 className="size-5 animate-spin" />}
      {isPending ? loadingText : idleText}
    </Button>
  );
}
