import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16 min-h-screen flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
