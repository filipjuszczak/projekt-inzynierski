"use client";

import { Drawer } from "@/components/ui/drawer";
import MainHeader from "@/components/MainHeader";
import MainFooter from "@/components/MainFooter";
import MobileDrawerContent from "@/components/MobileDrawerContent";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <Drawer>
      <div className="container mx-auto flex min-h-screen flex-col">
        <MainHeader />
        {children}
        <MainFooter />
      </div>
      <MobileDrawerContent />
    </Drawer>
  );
}
