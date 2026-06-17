import { BarChart3, Eye, TrendingUp, Calendar, Globe } from 'lucide-react'

interface AnalyticsData {
  todayViews: number
  weekViews: number
  monthViews: number
  totalViews: number
  topPages: { path: string; count: number }[]
  dailyViews: { date: string; count: number }[]
}

export function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const maxDaily = Math.max(...data.dailyViews.map(d => d.count), 1)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-slate-900 mb-1">Site Analytics</h1>
        <p className="text-slate-500 text-sm">Track visitor engagement across your website.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Today', value: data.todayViews, icon: Eye, color: 'bg-sky-50 text-sky-700 border-sky-200' },
          { label: 'This Week', value: data.weekViews, icon: Calendar, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'This Month', value: data.monthViews, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          { label: 'All Time', value: data.totalViews, icon: BarChart3, color: 'bg-violet-50 text-violet-700 border-violet-200' },
        ].map((stat) => (
          <div key={stat.label} className={`p-6 rounded-2xl border ${stat.color}`}>
            <stat.icon size={20} className="mb-3 opacity-70" />
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-sm opacity-80 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily chart */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white">
          <h2 className="font-display text-lg font-semibold text-slate-900 mb-6">Last 7 Days</h2>
          <div className="flex items-end gap-3 h-40">
            {data.dailyViews.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                <div
                  style={{ height: `${(d.count / maxDaily) * 100}%` }}
                  className="w-full bg-gradient-to-t from-sky-500 to-sky-300 rounded-t-lg min-h-[4px]"
                />
                <span className="text-[10px] text-slate-400 font-mono">{d.date}</span>
                <span className="text-xs font-semibold text-slate-700">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top pages */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white">
          <h2 className="font-display text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Globe size={18} className="text-sky-600" /> Top Pages
          </h2>
          <div className="space-y-3">
            {data.topPages.length === 0 ? (
              <p className="text-slate-400 text-sm">No page views recorded yet.</p>
            ) : data.topPages.map((page, i) => (
              <div key={page.path} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="text-sm font-medium text-slate-700">{page.path}</span>
                </div>
                <span className="text-sm font-bold text-sky-700">{page.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
