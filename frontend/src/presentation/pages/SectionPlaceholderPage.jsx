import DashboardLayout from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function SectionPlaceholderPage({ title, description }) {
  return (
    <DashboardLayout 
      title={title} 
      subtitle={description}
      actions={<Button>Create Entry</Button>}
    >
      <Card className="border-dashed bg-slate-50/50">
        <CardHeader>
          <CardTitle>Get started with {title}</CardTitle>
          <CardDescription>
            This section is ready for your data and custom workflows.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-slate-900">No entries yet</p>
            <p className="text-sm text-slate-500 max-w-xs">
              Start by creating your first entry or importing data from a spreadsheet.
            </p>
          </div>
          <Button variant="outline" className="mt-2">
            Import Data
          </Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}