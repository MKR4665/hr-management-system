import DashboardLayout from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function SectionPlaceholderPage({ title, description }) {
  return (
    <DashboardLayout title={title} subtitle={description}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600">
          <p>This section is ready for your data and workflows.</p>
          <p>Tell me what should live here and I will build it out.</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
