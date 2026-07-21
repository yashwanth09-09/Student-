import { Users, UserSquare2, Sparkles, Building2, CalendarRange, TrendingUp } from 'lucide-react';
import { Student, DashboardStats } from '../types';

interface DashboardProps {
  students: Student[];
  onNavigateToForm: () => void;
  onNavigateToRecords: () => void;
}

export default function Dashboard({ students, onNavigateToForm, onNavigateToRecords }: DashboardProps) {
  // Compute stats
  const total = students.length;
  const male = students.filter(s => s.gender === 'Male').length;
  const female = students.filter(s => s.gender === 'Female').length;
  const other = students.filter(s => s.gender !== 'Male' && s.gender !== 'Female').length;
  
  const depts = Array.from(new Set(students.map(s => s.department)));
  const deptsCount = depts.length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRegs = students.filter(s => s.savedAt.startsWith(todayStr)).length;

  const stats: DashboardStats = {
    totalStudents: total,
    maleStudents: male,
    femaleStudents: female,
    otherStudents: other,
    departmentsCount: deptsCount,
    todayRegistrations: todayRegs
  };

  // Compute department distribution
  const deptCounts: { [key: string]: number } = {};
  students.forEach(s => {
    if (s.department) {
      deptCounts[s.department] = (deptCounts[s.department] || 0) + 1;
    }
  });

  const sortedDepts = Object.entries(deptCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // top 5 departments

  const malePercent = total > 0 ? Math.round((male / total) * 100) : 0;
  const femalePercent = total > 0 ? Math.round((female / total) * 100) : 0;
  const otherPercent = total > 0 ? Math.round((other / total) * 100) : 0;

  // Get 4 most recent students
  const recentStudents = [...students]
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Welcome & Action Banner */}
      <div 
        className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/10 dark:border-blue-500/20 backdrop-blur-md"
        id="dashboard-welcome-banner"
      >
        <div className="absolute top-0 right-0 p-10 translate-x-12 -translate-y-12 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 p-10 -translate-x-12 translate-y-12 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
              Academic Hub Overview
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mt-2 max-w-xl">
              Welcome to the central academic console. Manage registrations, analyze student metrics, export records, and configure individual profiles efficiently.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onNavigateToForm}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-blue-950/40 hover:-translate-y-0.5 transition-all duration-250 flex items-center gap-2 cursor-pointer text-sm"
              id="dashboard-new-student-btn"
            >
              <Users className="w-4 h-4" />
              New Registration
            </button>
            <button
              onClick={onNavigateToRecords}
              className="px-5 py-2.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 transition-all duration-200 cursor-pointer text-sm"
              id="dashboard-view-records-btn"
            >
              View Directory
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" id="stats-cards-grid">
        {/* Total Students */}
        <div className="group bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-white/20 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-500/30 p-5 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md" id="stat-total-students">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Total Enrollment</p>
              <h3 className="text-3xl font-black text-neutral-800 dark:text-neutral-100 mt-1 transition-all group-hover:scale-105 origin-left">
                {stats.totalStudents}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-neutral-500 dark:text-neutral-400">
            <span className="text-emerald-500 font-bold flex items-center gap-0.5 mr-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Active
            </span>
            <span>in system database</span>
          </div>
        </div>

        {/* Male Students */}
        <div className="group bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-white/20 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 p-5 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md" id="stat-male-students">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Male Students</p>
              <h3 className="text-3xl font-black text-neutral-800 dark:text-neutral-100 mt-1 transition-all group-hover:scale-105 origin-left">
                {stats.maleStudents}
              </h3>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
              <UserSquare2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              <span>Ratio</span>
              <span className="font-bold">{malePercent}%</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${malePercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Female Students */}
        <div className="group bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-white/20 dark:border-white/5 hover:border-rose-500/30 dark:hover:border-rose-500/30 p-5 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md" id="stat-female-students">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Female Students</p>
              <h3 className="text-3xl font-black text-neutral-800 dark:text-neutral-100 mt-1 transition-all group-hover:scale-105 origin-left">
                {stats.femaleStudents}
              </h3>
            </div>
            <div className="p-3 bg-rose-500/10 rounded-xl text-rose-600 dark:text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
              <UserSquare2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              <span>Ratio</span>
              <span className="font-bold">{femalePercent}%</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${femalePercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Departments Count */}
        <div className="group bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-white/20 dark:border-white/5 hover:border-purple-500/30 dark:hover:border-purple-500/30 p-5 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md" id="stat-departments">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Departments</p>
              <h3 className="text-3xl font-black text-neutral-800 dark:text-neutral-100 mt-1 transition-all group-hover:scale-105 origin-left">
                {stats.departmentsCount}
              </h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-neutral-500 dark:text-neutral-400">
            <span>Across multiple disciplines</span>
          </div>
        </div>

        {/* Today's Registrations */}
        <div className="group bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-white/20 dark:border-white/5 hover:border-amber-500/30 dark:hover:border-amber-500/30 p-5 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md" id="stat-today-registrations">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Added Today</p>
              <h3 className="text-3xl font-black text-neutral-800 dark:text-neutral-100 mt-1 transition-all group-hover:scale-105 origin-left">
                {stats.todayRegistrations}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
              <CalendarRange className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-semibold text-amber-500">Real-time update</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-analytics-grid">
        {/* Department-wise Student Count Chart */}
        <div className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border border-white/20 dark:border-white/5 p-6 rounded-2xl shadow-sm space-y-4" id="department-distribution-card">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-500" />
              Department Enrollment Share
            </h3>
            <span className="text-xs px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full font-semibold">Top 5</span>
          </div>

          {sortedDepts.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 dark:text-neutral-500 text-sm">
              No enrollment data available. Register students to view analytics.
            </div>
          ) : (
            <div className="space-y-4">
              {sortedDepts.map(([dept, count]) => {
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={dept} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-neutral-700 dark:text-neutral-200 truncate pr-4 max-w-[70%]">
                        {dept}
                      </span>
                      <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                        {count} {count === 1 ? 'student' : 'students'} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recently Added Students Grid */}
        <div className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border border-white/20 dark:border-white/5 p-6 rounded-2xl shadow-sm space-y-4" id="recent-registrations-card">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Recent Registrations
            </h3>
            <span className="text-xs px-2.5 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full font-semibold">Latest Entries</span>
          </div>

          {recentStudents.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 dark:text-neutral-500 text-sm">
              No student records found. Add students using the Registration tab.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {recentStudents.map((student) => (
                <div key={student.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-neutral-700 dark:text-neutral-200 font-extrabold flex items-center justify-center border border-indigo-500/10">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {student.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 flex gap-2">
                        <span>Roll: <span className="font-medium text-neutral-700 dark:text-neutral-300">{student.rollNumber}</span></span>
                        <span>•</span>
                        <span className="truncate">{student.department}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-lg">
                      {student.course}
                    </span>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">
                      {new Date(student.savedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
