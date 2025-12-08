import { redirect } from 'next/navigation';

// Force dynamic rendering - authenticated page
export const dynamic = 'force-dynamic';

export default function AccountPage() {
  redirect('/account/profile');
}
