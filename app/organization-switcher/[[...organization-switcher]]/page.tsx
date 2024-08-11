import { OrganizationSwitcher } from '@clerk/nextjs';

export default function OrganizationSwitcherPage() {
  return (
    <div>
      <OrganizationSwitcher
        afterCreateOrganizationUrl="/organization/:slug"
        afterSelectOrganizationUrl="/organization/:slug"
        createOrganizationMode={'modal'}
        hidePersonal={true}
      />
    </div>
  );
}
