import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { StoreProvider } from "@/store/StoreProvider";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HardwareHub",
  description: "Your one-stop hardware shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <StoreProvider>
          <AuthProvider>{children}</AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
