import { getUser, getProfile } from '@/lib/supabase-server';
import { Header } from '@/components';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
