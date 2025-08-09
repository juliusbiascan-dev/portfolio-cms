"use client";

import { useEffect, useState } from "react";
import { SubdomainModal } from "../modals/subdomain-modal";


export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SubdomainModal />
    </>
  );
}
