// hooks/use-mobile.js
import React from "react";
import { useMediaQuery } from "react-responsive";

export function useIsMobile() {
  // এটি স্ক্রিনের প্রস্থ 767 পিক্সেলের কম হলে 'true' রিটার্ন করবে, যা মোবাইল ডিভাইস নির্দেশ করে।
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return isMobile;
}