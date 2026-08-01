import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  Award,
  Lock,
  Unlock,
  Search,
  BarChart3,
  FileSpreadsheet,
  AlertTriangle,
  RefreshCw,
  Home,
  CheckCircle2,
  XCircle,
  Download,
  Filter
} from 'lucide-react';
import { studentData as studentsData } from '../data/students';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Exam Status setting (persist in localStorage)
  const [examStatus, setExamStatus] = useState(() => {
    return localStorage.getItem('exam-admin-status') || 'OPEN';
  });
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample or live statistical preview from students data
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'cheating' | 'classes'

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin-auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Default teacher PIN: 2026 or 1234
    if (pinInput === '2026' || pinInput === '1234' || pinInput === '0000') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-auth');
    setIsAuthenticated(false);
    navigate('/');
  };

  const toggleExamStatus = () => {
    const nextStatus = examStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    setExamStatus(nextStatus);
    localStorage.setItem('exam-admin-status', nextStatus);
  };

  // Filter students
  const filteredStudents = studentsData.filter(s => {
    const matchesClass = selectedClass === 'ALL' || s.className === selectedClass;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.studentCode).includes(searchQuery);
    return matchesClass && matchesSearch;
  });

  const classesList = Array.from(new Set(studentsData.map(s => s.className))).sort();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <Shield className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">ផ្ទាំងគ្រប់គ្រងសម្រាប់គ្រូ</h1>
          <p className="text-slate-300 text-sm mb-6">សូមបញ្ចូលលេខកូដសម្ងាត់គ្រូ (PIN Code) ដើម្បីចូលគ្រប់គ្រងប្រព័ន្ធប្រឡង</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="••••"
                className="w-full text-center tracking-[0.5em] text-2xl font-bold bg-slate-950/60 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                autoFocus
              />
              {pinError && (
                <p className="text-rose-400 text-xs font-semibold mt-2">
                  លេខកូដសម្ងាត់មិនត្រឹមត្រូវ! (សាកល្បង៖ 2026 ឬ 1234)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-98 cursor-pointer"
            >
              ចូលគ្រប់គ្រងប្រព័ន្ធ
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" /> ត្រឡប់ទៅទំព័រដើម
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-4 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">Teacher Admin Panel</h1>
            <p className="text-xs text-slate-400">ប្រព័ន្ធគ្រប់គ្រងការប្រឡងវិទ្យាល័យអង្គរកា</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://docs.google.com/spreadsheets"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            បើក Google Sheets
          </a>

          <button
            onClick={handleLogout}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            ចាកចេញ
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Status & Quick Action Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Exam Lock/Unlock Control */}
          <div className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${
            examStatus === 'OPEN'
              ? 'bg-emerald-950/40 border-emerald-500/40'
              : 'bg-rose-950/40 border-rose-500/40'
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {examStatus === 'OPEN' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Lock className="w-5 h-5 text-rose-400" />
                )}
                <h3 className="font-bold text-sm text-white">ស្ថានភាពវិញ្ញាសា</h3>
              </div>
              <p className="text-xs text-slate-400">
                {examStatus === 'OPEN' ? 'កំពុងបើកទទួលចម្លើយប្រឡង' : 'បានបិទផ្អាកទទួលចម្លើយ'}
              </p>
            </div>

            <button
              onClick={toggleExamStatus}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                examStatus === 'OPEN'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {examStatus === 'OPEN' ? 'បិទប្រឡង (Lock)' : 'បើកប្រឡង (Open)'}
            </button>
          </div>

          {/* Card 2: Total Registered Students */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">សិស្សសរុបក្នុងប្រព័ន្ធ</p>
              <h3 className="text-2xl font-bold text-white">{studentsData.length} នាក់</h3>
              <p className="text-[11px] text-emerald-400 mt-1">ថ្នាក់ {classesList.join(', ')}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Anti-Cheat Monitoring */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">ការតាមដាន Anti-Cheat</p>
              <h3 className="text-2xl font-bold text-amber-400">សកម្មភាព</h3>
              <p className="text-[11px] text-slate-400 mt-1">ចាប់កំហុសប្តូរ Tab / ចេញក្រៅ</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            បញ្ជីសិស្ស និងថ្នាក់ ({filteredStudents.length})
          </button>
          <button
            onClick={() => setActiveTab('cheating')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cheating'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            ការណែនាំសុវត្ថិភាព និង Anti-Cheat
          </button>
        </div>

        {/* Tab 1: Overview & Students List */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Search and Class Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ស្វែងរកតាមឈ្មោះ ឬលេខរៀងសិស្ស..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="ALL">គ្រប់ថ្នាក់ទាំងអស់ ({studentsData.length})</option>
                  {classesList.map(cls => (
                    <option key={cls} value={cls}>ថ្នាក់ {cls}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">លេខរៀង</th>
                      <th className="py-3 px-4">ឈ្មោះសិស្ស</th>
                      <th className="py-3 px-4">ភេទ</th>
                      <th className="py-3 px-4">ថ្នាក់</th>
                      <th className="py-3 px-4">ស្ថានភាព</th>
                      <th className="py-3 px-4">Google Sheets</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {filteredStudents.slice(0, 30).map((student) => (
                      <tr key={`${student.className}-${student.studentCode}`} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-blue-400">#{student.studentCode}</td>
                        <td className="py-3 px-4 font-semibold text-white">{student.name}</td>
                        <td className="py-3 px-4 text-slate-300">{student.gender === 'M' ? 'ប្រុស' : 'ស្រី'}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {student.className}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            មានសិទ្ធិប្រឡង
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-slate-500">កត់ត្រាក្នុង Sheet "{student.className}"</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredStudents.length > 30 && (
                <div className="p-3 text-center border-t border-slate-800 bg-slate-900/40 text-xs text-slate-400">
                  បង្ហាញត្រឹម ៣០ នាក់ដំបូង។ សូមប្រើប្រអប់ស្វែងរក ឬជ្រើសរើសថ្នាក់ដើម្បីមើលសិស្សផ្សេងទៀត។
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Cheating Guide & Exam Policy */}
        {activeTab === 'cheating' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="font-bold text-white text-base">ការតាមដានការលួចបន្លំ (Anti-Cheat Engine)</h3>
                <p className="text-xs text-slate-400">ប្រព័ន្ធចាប់កំហុសសិស្សក្នុងពេលប្រឡង និងកំណត់ត្រាក្នុង Google Sheets</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-sm text-blue-400 mb-1">១. ការរាប់ចំនួនដងប្តូរ Tab (Tab Switches)</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  រាល់ពេលសិស្សចុចចេញក្រៅកម្មវិធី (Switch App, Split Screen, ឬលោត Notification) ប្រព័ន្ធនឹងកត់ត្រាចំនួនដង និងបោះចូលទៅក្នុង Google Sheets ត្រង់ក្រឡោន <b>"Tab Switches"</b> ក្នុង Sheet មេ និង Sheet ថ្នាក់។
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-sm text-purple-400 mb-1">២. ការដាក់ពិន័យ (Time Penalty)</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ពេលសិស្សប្តូរ Tab ច្រើនដង ប្រព័ន្ធនឹងចាក់សោរអេក្រង់ផ្អាកមិនឱ្យសរសេរចម្លើយរយៈពេល ៣០ វិនាទី ដើម្បីការពារកុំឱ្យសិស្សលួចចម្លងពីអត្ថបទផ្សេង។
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
