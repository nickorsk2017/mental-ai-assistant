import { redirect } from 'next/navigation';

export default function DashboardIndexPage() {
  redirect('/patient-panel/chat');
}
