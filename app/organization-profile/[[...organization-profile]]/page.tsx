import { OrganizationProfile } from "@clerk/nextjs";

export default function OrganizationProfilePage() {
  return (
    <div className="flex items-center justify-center my-auto container mx-auto p-4">
    <OrganizationProfile path="/organization-profile" />
    </div>
  )
}