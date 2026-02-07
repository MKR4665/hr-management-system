import DashboardLayout from './DashboardLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { cn } from '../../shared/lib/utils';

const stats = [
  { label: 'Total Headcount', value: '428', change: '+12 this month', trend: 'up' },
  { label: 'Open Roles', value: '19', change: '5 in final stage', trend: 'neutral' },
  { label: 'Offer Acceptance', value: '82%', change: '+6% vs last month', trend: 'up' },
  { label: 'Avg. Time to Hire', value: '24 days', change: '-3 days trend', trend: 'down' }
];

const interviews = [
  { name: 'Ariana W.', role: 'People Ops Analyst', time: '10:30 AM', initial: 'AW', color: 'bg-blue-100 text-blue-600' },
  { name: 'Jonas K.', role: 'Benefits Lead', time: '12:00 PM', initial: 'JK', color: 'bg-amber-100 text-amber-600' },
  { name: 'Priya S.', role: 'HR Business Partner', time: '02:30 PM', initial: 'PS', color: 'bg-emerald-100 text-emerald-600' }
];

const pipeline = [
  { label: 'Sourced', value: 180, total: 260, color: 'bg-slate-500' },
  { label: 'Screened', value: 120, total: 260, color: 'bg-brand-400' },
  { label: 'Interviewing', value: 72, total: 260, color: 'bg-brand-600' },
  { label: 'Offer', value: 18, total: 260, color: 'bg-emerald-500' }
];

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="HR Dashboard"
      subtitle="Overview of your workforce, recruitment, and team engagement."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" className="hidden sm:inline-flex">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </Button>
          <Button className="bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-100">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Hire
          </Button>
        </div>
      }
    >
      {/* Stats Grid */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500">{item.label}</span>
                <div className={cn(
                  "p-2 rounded-lg",
                  item.trend === 'up' ? "bg-emerald-50" : item.trend === 'down' ? "bg-red-50" : "bg-slate-50"
                )}>
                  <svg className={cn(
                    "h-4 w-4",
                    item.trend === 'up' ? "text-emerald-600" : item.trend === 'down' ? "text-red-600" : "text-slate-600"
                  )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.trend === 'up' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />}
                    {item.trend === 'down' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />}
                    {item.trend === 'neutral' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />}
                  </svg>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900">{item.value}</h3>
                <p className={cn(
                  "text-xs font-medium",
                  item.trend === 'up' ? "text-emerald-600" : item.trend === 'down' ? "text-red-600" : "text-slate-500"
                )}>
                  {item.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Hiring Pipeline */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
            <div>
              <CardTitle className="text-lg">Hiring Pipeline</CardTitle>
              <p className="text-sm text-slate-500">Active candidates this quarter</p>
            </div>
            <Button variant="ghost" size="sm" className="text-brand-600 hover:text-brand-700 hover:bg-brand-50">
              View Details
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {pipeline.map((stage) => {
                const pct = Math.round((stage.value / stage.total) * 100);
                return (
                  <div key={stage.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-700">{stage.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-900 font-bold">{stage.value}</span>
                        <span className="text-slate-400 text-xs">/ {stage.total}</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", stage.color)}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Interviews */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-lg">Today's Interviews</CardTitle>
            <p className="text-sm text-slate-500">Upcoming candidate meetings</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {interviews.map((item) => (
                <div
                  key={item.name}
                  className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs", item.color)}>
                      {item.initial}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">{item.time}</p>
                    <button className="text-[10px] font-bold text-brand-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      Join
                    </button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2 border-slate-200 text-slate-600 hover:bg-slate-50">
                View Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* People Spotlight */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base">People Spotlight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Maya Chen', detail: 'Promotion to Senior Recruiter', date: 'Today' },
                { name: 'Elijah Ross', detail: 'Onboarding completed', date: 'Yesterday' },
                { name: 'Team Atlas', detail: 'New manager assigned', date: '2 days ago' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-brand-500 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.detail}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Off Balance */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base">Team Presence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {[
                { team: 'Design', value: 6, total: 10, color: 'bg-brand-500' },
                { team: 'Engineering', value: 9, total: 12, color: 'bg-blue-500' },
                { team: 'Sales', value: 4, total: 8, color: 'bg-amber-500' }
              ].map((item) => (
                <div key={item.team} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span>{item.team}</span>
                    <span>{item.value} / {item.total} Present</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: item.total }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1.5 flex-1 rounded-full",
                          i < item.value ? item.color : "bg-slate-100"
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ops Updates */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base">Operational Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'Policy Refresh', meta: 'Handbook update ready', status: 'Pending' },
                { title: 'Engagement Pulse', meta: '72% participation rate', status: 'Active' },
                { title: 'Learning Credits', meta: '14 team members active', status: 'Update' }
              ].map((item) => (
                <div key={item.title} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200 uppercase">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{item.meta}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}