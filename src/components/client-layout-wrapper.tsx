"use client";

import { useBackgroundSettings } from "@/hooks/use-background-settings";
import { useEffect } from "react";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { opacity } = useBackgroundSettings();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--background-opacity",
      opacity.toString()
    );
  }, [opacity]);

  return <>{children}</>;
}
