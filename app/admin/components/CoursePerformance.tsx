const courses = [
    {
      name: "Machine Learning Fundamentals",
      learners: 428,
      completion: 72,
      status: "Healthy",
    },
    {
      name: "Python for Data Science",
      learners: 315,
      completion: 68,
      status: "Healthy",
    },
    {
      name: "Deep Learning",
      learners: 184,
      completion: 41,
      status: "Attention",
    },
    {
      name: "AI Fundamentals",
      learners: 162,
      completion: 58,
      status: "Stable",
    },
  ];
  
  export default function CoursePerformance() {
    return (
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-[15px] font-semibold text-slate-950">
              Course performance
            </h2>
  
            <p className="mt-1 text-[12px] text-slate-500">
              Enrollment and completion across courses
            </p>
          </div>
  
          <button className="text-[12px] font-medium text-blue-600 hover:text-blue-700">
            View courses
          </button>
        </div>
  
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-wider text-slate-500">
                  COURSE
                </th>
  
                <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-wider text-slate-500">
                  LEARNERS
                </th>
  
                <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-wider text-slate-500">
                  COMPLETION
                </th>
  
                <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-wider text-slate-500">
                  STATUS
                </th>
              </tr>
            </thead>
  
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.name}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-5 py-4 text-[13px] font-medium text-slate-900">
                    {course.name}
                  </td>
  
                  <td className="px-5 py-4 text-[13px] text-slate-600">
                    {course.learners}
                  </td>
  
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{
                            width: `${course.completion}%`,
                          }}
                        />
                      </div>
  
                      <span className="text-[12px] font-medium text-slate-600">
                        {course.completion}%
                      </span>
                    </div>
                  </td>
  
                  <td className="px-5 py-4">
                    <span
                      className={[
                        "inline-flex items-center gap-1.5 text-[12px] font-medium",
                        course.status === "Attention"
                          ? "text-amber-700"
                          : "text-slate-600",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "h-1.5 w-1.5 rounded-full",
                          course.status === "Attention"
                            ? "bg-amber-500"
                            : course.status === "Healthy"
                              ? "bg-emerald-500"
                              : "bg-slate-400",
                        ].join(" ")}
                      />
  
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }