import { auth } from "@clerk/nextjs/server";

export default async function ProtectedLayout({ children }) {
  await auth.protect({ unauthenticatedUrl: "/sign-in" });
  return <>{children}</>;
}
