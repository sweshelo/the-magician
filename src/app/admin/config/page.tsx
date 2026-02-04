import { getSystemConfig } from '@/actions/admin';
import { ConfigForm } from '@/feature/Admin/ConfigForm';

export default async function ConfigPage() {
  const config = await getSystemConfig();

  return <ConfigForm initialDailyFreePlays={config.dailyFreePlays} />;
}
