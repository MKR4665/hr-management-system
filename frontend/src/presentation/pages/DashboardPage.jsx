import DashboardLayout from './DashboardLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const stats = [
  { label: 'Total headcount', value: '428', change: '+12 this month' },
  { label: 'Open roles', value: '19', change: '5 in final stage' },
  { label: 'Offer acceptance', value: '82%', change: '+6% vs last month' },
  { label: 'Avg. time to hire', value: '24 days', change: '-3 days trend' }
];

const interviews = [
  { name: 'Ariana W.', role: 'People Ops Analyst', time: '10:30 AM' },
  { name: 'Jonas K.', role: 'Benefits Lead', time: '12:00 PM' },
  { name: 'Priya S.', role: 'HR Business Partner', time: '2:30 PM' }
];

const pipeline = [
  { label: 'Sourced', value: 180, total: 260 },
  { label: 'Screened', value: 120, total: 260 },
  { label: 'Interviewing', value: 72, total: 260 },
  { label: 'Offer', value: 18, total: 260 }
];

const updates = [
  { title: 'Policy refresh', meta: 'Handbook update ready for review' },
  { title: 'Engagement pulse', meta: '72% participation rate this week' },
  { title: 'Learning credits', meta: '14 team members used credits in January' }
];

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="HR dashboard"
      subtitle="Keep talent, culture, and compliance moving in sync."
      actions={
        <>
          <Button variant="outline">Export report</Button>
          <Button>New hire request</Button>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <Card key={item.label} className="relative overflow-hidden">
                <div className="absolute right-0 top-0 h-16 w-16 translate-x-4 -translate-y-4 rounded-full bg-brand-100/70" />
                <CardHeader>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
                    {item.label}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                  <p className="text-xs text-slate-500">{item.change}</p>
                </CardContent>
              </Card>
            ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <Card>
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Hiring pipeline</CardTitle>
                  <p className="text-sm text-slate-500">260 candidates in motion this quarter</p>
                </div>
                <Button variant="outline" size="sm">
                  View roles
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {pipeline.map((stage) => {
                  const pct = Math.round((stage.value / stage.total) * 100);
                  return (
                    <div key={stage.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{stage.label}</span>
                        <span className="text-slate-500">
                          {stage.value} / {stage.total}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-brand-100">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's interviews</CardTitle>
                <p className="text-sm text-slate-500">Stay ahead of key conversations</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {interviews.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-lg border border-brand-100 bg-brand-50/60 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.role}</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                      {item.time}
                    </span>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  Open schedule
                </Button>
              </CardContent>
            </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>People spotlight</CardTitle>
                <p className="text-sm text-slate-500">Latest shifts across teams</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Maya Chen', detail: 'Promotion to Senior Recruiter' },
                  { name: 'Elijah Ross', detail: 'Onboarding completed' },
                  { name: 'Team Atlas', detail: 'New manager assigned' }
                ].map((item) => (
                  <div key={item.name} className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.detail}</p>
                    </div>
                    <span className="text-xs text-brand-600">Update</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time off balance</CardTitle>
                <p className="text-sm text-slate-500">Upcoming requests in February</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { team: 'Design', value: '6 requests', tone: 'bg-brand-100' },
                  { team: 'Engineering', value: '9 requests', tone: 'bg-brand-200' },
                  { team: 'Sales', value: '4 requests', tone: 'bg-brand-50' }
                ].map((item) => (
                  <div key={item.team} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{item.team}</span>
                      <span className="text-slate-500">{item.value}</span>
                    </div>
                    <div className={`h-2 w-full rounded-full ${item.tone}`} />
                  </div>
                ))}
                <Button variant="outline" size="sm">
                  Review requests
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ops updates</CardTitle>
                <p className="text-sm text-slate-500">Signals that need attention</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {updates.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg border border-brand-100 bg-white/70 px-4 py-3"
                  >
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.meta}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
      </section>
    </DashboardLayout>
  );
}
