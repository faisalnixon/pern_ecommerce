import StoreLayout from "../../components/store/StoreLayout";
// import StoreLayout from "@/components/store/StoreLayout";
import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs";

export const metadata = {
  title: "perncommerce. - Store Dashboard",
  description: "perncommerce. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {
  return (
    <>
      <SignedIn>
        <StoreLayout>{children}</StoreLayout>
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center">
            <SignIn fallbackRedirectUrl="/store" routing="hash"/>
        </div>
      </SignedOut>
    </>
  );
}
