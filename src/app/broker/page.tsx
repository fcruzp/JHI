import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { CotizacionesService } from '@/lib/hubspot/service';
import { DashboardContent } from '@/components/broker/DashboardContent';

export const dynamic = 'force-dynamic';

export default async function BrokerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/broker/login');
  }

  // Fetch cotizaciones for this broker's email
  const cotizaciones = await CotizacionesService.getByContactEmail(session.user.email);

  return (
    <DashboardContent 
      userName={session.user.name || ''} 
      userEmail={session.user.email} 
      cotizaciones={cotizaciones} 
    />
  );
}
