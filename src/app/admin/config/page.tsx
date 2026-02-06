import { getSystemConfig } from '@/actions/admin';
import { ConfigForm } from '@/feature/Admin/ConfigForm';
import { unstable_noStore as noStore } from 'next/cache';

export default async function ConfigPage() {
  noStore();
  const config = await getSystemConfig();

  return <ConfigForm initialDailyFreePlays={config.dailyFreePlays} />;
}
