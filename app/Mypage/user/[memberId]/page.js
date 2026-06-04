import UserProfilePage from "./UserProfileClient";

export function generateStaticParams() {
  return ["1", "2", "3", "4", "5", "6"].map((memberId) => ({ memberId }));
}

export default function Page() {
  return <UserProfilePage />;
}
