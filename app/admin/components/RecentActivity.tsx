const activities = [
    {
      text: "Sarah Lee completed Machine Learning Fundamentals",
      time: "4m",
    },
    {
      text: "John Smith enrolled in Python for Data Science",
      time: "12m",
    },
    {
      text: 'Alex Brown completed "Linear Regression"',
      time: "18m",
    },
    {
      text: "Machine Learning Fundamentals was updated",
      time: "26m",
    },
    {
      text: "A new learner account was created",
      time: "41m",
    },
  ];
  
  export default function RecentActivity() {
    return (
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-[15px] font-semibold text-slate-950">
              Recent activity
            </h2>
  
            <p className="mt-1 text-[12px] text-slate-500">
              Latest learner and platform events
            </p>
          </div>
  
          <button className="text-[12px] font-medium text-blue-600 hover:text-blue-700">
            View all
          </button>
        </div>
  
        <div>
          {activities.map((activity, index) => (
            <div
              key={`${activity.text}-${index}`}
              className="flex items-center gap-3 border-b border-slate-100 px-5 py-3.5 last:border-0"
            >
              <div className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />
  
              <p className="min-w-0 flex-1 truncate text-[12px] text-slate-700">
                {activity.text}
              </p>
  
              <span className="shrink-0 text-[11px] text-slate-400">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  }