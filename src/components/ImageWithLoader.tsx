"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { useImageLoader } from "@/hooks/use-image-loader";
import { cn } from "@/lib/utils";

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  border?: boolean;
  rounded?: boolean;
}

export function ImageWithLoader({
  src,
  alt,
  fill = true,
  priority = false,
  sizes = "100vw",
  className = "",
  style,
  border,
  rounded
}: ImageWithLoaderProps) {
  const { isLoading, error } = useImageLoader(src);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden" style={style}>
      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-background",
            rounded && "rounded-xl",
            border && "border"
          )}
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {error && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-background text-red-500",
            rounded && "rounded-xl",
            border && "border"
          )}
        >
          Nie udało się załadować obrazu.
        </div>
      )}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          priority={priority}
          sizes={sizes}
          onLoad={() => setIsVisible(true)}
          className={className}
        />
      </motion.div>
    </div>
  );
}
