import type { PropsWithChildren } from "react";

export default function Wrapper({ children }: PropsWithChildren) {
  return <main className="p-4">{children}</main>;
}
