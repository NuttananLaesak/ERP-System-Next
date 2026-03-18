import { GlobalErrorModal } from "@/components/global/global-error-modal";
import Navbar from "@/components/layout/navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <GlobalErrorModal />
      <main>{children}</main>
    </>
  );
}
