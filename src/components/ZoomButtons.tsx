"use client";

import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

interface ZoomButtonsProps {
  onZoom: (direction: "in" | "out") => void;
}

export default function ZoomButtons({ onZoom }: ZoomButtonsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" size="icon" onClick={() => onZoom("in")}>
        <ZoomIn className="h-4 w-4" />
        <span className="sr-only">Przybliż</span>
      </Button>
      <Button variant="outline" size="icon" onClick={() => onZoom("out")}>
        <ZoomOut className="h-4 w-4" />
        <span className="sr-only">Oddal</span>
      </Button>
    </div>
  );
}
