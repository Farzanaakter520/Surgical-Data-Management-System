// components/Logo.tsx
import Image from "next/image";
import { companySettings } from "@/lib/config/settings";

export default function Logo({ className = "" }) {
  return (
    <Image
  src={companySettings.logo}
  alt={`${companySettings.name} Logo`}
  width={32}  // Set your desired display width
  height={32} // Set your desired display height
  className={`rounded-md ${className} w-8 h-8 sm:w-10 sm:h-10`}
  priority // Optional: for above-the-fold images
/>
  );
}