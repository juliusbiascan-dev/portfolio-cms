"use client";

import { use, useEffect } from "react";
import { useSubdomainModal } from "@/hooks/use-subdomain-modal";

const SetupPage = () => {
  const onOpen = useSubdomainModal((state) => state.onOpen);
  const isOpen = useSubdomainModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};

export default SetupPage;

