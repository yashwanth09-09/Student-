import { useState, useEffect } from 'react';
import { 
  Users, UserPlus, FolderHeart, GraduationCap, LayoutDashboard, Clock, Calendar, 
  Sun, Moon, ShieldAlert, Sparkles, BookOpen, UserCheck, HelpCircle 
} from 'lucide-react';
import { Student, ToastMessage } from './types';
import Dashboard from './components/Dashboard';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';
import StudentModal from './components/StudentModal';
import ConfirmationDialog from './components/ConfirmationDialog';
import ToastContainer from './components/ToastContainer';

// Import our beautiful custom generated academic banner
import bannerImg from './assets/images/academic_banner_1784653710745.jpg';

// Initial dummy database to show beautiful analytical charts immediately
const INITIAL_STUDENTS: Student[] = [
  {
    id: 'student-1',
    name: 'Sophia Vance',
    rollNumber: '2026CSE001',
    regNumber: 'REG9820124',
    department: 'Computer Science & Engineering',
    course: 'B.Tech CSE',
    yearSemester: 'Year 3 - Semester 2',
    age: 21,
    gender: 'Female',
    dob: '2005-08-14',
    mobile: '9848022338',
    email: 'sophia.vance@university.edu',
    address: 'High Street, Block-4, Silicon Valley',
    guardianName: 'Vance Carter',
    emergencyContact: '9848022339',
    savedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), // 36 hours ago
  },
  {
    id: 'student-2',
    name: 'Alexander Sterling',
    rollNumber: '2026DS042',
    regNumber: 'REG8821039',
    department: 'Data Science & AI',
    course: 'B.Tech AI & DS',
    yearSemester: 'Year 2 - Semester 1',
    age: 20,
    gender: 'Male',
    dob: '2006-11-23',
    mobile: '9000188223',
    email: 'alex.sterling@university.edu',
    address: 'Hillview Apartments, Sector 7, Metro City',
    guardianName: 'Richard Sterling',
    emergencyContact: '9000188224',
    savedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), // 12 hours ago
  },
  {
    id: 'student-3',
    name: 'Meera Deshmukh',
    rollNumber: '2026ECE109',
    regNumber: 'REG7738290',
    department: 'Electronics & Communication',
    course: 'B.Tech ECE',
    yearSemester: 'Year 4 - Semester 1',
    age: 22,
    gender: 'Female',
    dob: '2004-03-05',
    mobile: '9123456789',
    email: 'meera.d@university.edu',
    address: 'Lakeview Heights, Flat 102, Green Glen Layout',
    guardianName: 'Sanjay Deshmukh',
    emergencyContact: '9123456780',
    savedAt: new Date().toISOString(), // registered today
  }
];

export default function App() {
  // Navigation State: 'dashboard' | 'register' | 'records'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'register' | 'records'>('dashboard');

  // Real-time Clock State
  const [time, setTime] = useState(new Date());

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Student list state with hydration from Local Storage
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('sms_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  // Edit Mode state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // View Modal state
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Delete confirmation dialog state
  const [deleteCandidate, setDeleteCandidate] = useState<Student | null>(null);

  // Toast message queue state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('sms_students', JSON.stringify(students));
  }, [students]);

  // Handle system dark mode initial preference
  useEffect(() => {
    const isDark = localStorage.getItem('sms_dark_mode') === 'true' || 
      (!('sms_dark_mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('sms_dark_mode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    showToast('info', 'Theme Updated', `Switched to ${newMode ? 'Dark' : 'Light'} Mode display.`);
  };

  // Helper to show custom dynamic toasts
  const showToast = (type: ToastMessage['type'], title: string, description: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, description }]);
    
    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Student Actions: CREATE
  const handleSaveStudent = (data: Omit<Student, 'id' | 'savedAt'>) => {
    // Check duplication roll number again to prevent bugs
    const isDuplicate = students.some(
      s => s.rollNumber.toLowerCase().trim() === data.rollNumber.toLowerCase().trim()
    );

    if (isDuplicate) {
      showToast('error', 'Registration Failed', `Roll Number ${data.rollNumber} already exists in the records.`);
      return;
    }

    const newStudent: Student = {
      ...data,
      id: `student-${Date.now()}`,
      savedAt: new Date().toISOString(),
    };

    setStudents(prev => [newStudent, ...prev]);
    showToast('success', 'Student Enrolled', `${data.name} has been enrolled successfully.`);
    setActiveTab('records'); // auto-redirect to records directory
  };

  // Student Actions: UPDATE
  const handleUpdateStudent = (id: string, data: Omit<Student, 'id' | 'savedAt' | 'updatedAt'>) => {
    // Check if other student has this roll number
    const isDuplicate = students.some(
      s => s.id !== id && s.rollNumber.toLowerCase().trim() === data.rollNumber.toLowerCase().trim()
    );

    if (isDuplicate) {
      showToast('error', 'Update Failed', `Roll Number ${data.rollNumber} is occupied by another student.`);
      return;
    }

    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          ...data,
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    }));

    setSelectedStudent(null);
    showToast('success', 'Profile Updated', `Academic record of ${data.name} has been updated.`);
    setActiveTab('records'); // auto-redirect to records directory
  };

  // Student Actions: DELETE Request
  const handleDeleteRequest = (id: string) => {
    const target = students.find(s => s.id === id);
    if (target) {
      setDeleteCandidate(target);
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = () => {
    if (!deleteCandidate) return;

    setStudents(prev => prev.filter(s => s.id !== deleteCandidate.id));
    
    // Clear edit form context if we deleted the student we were editing
    if (selectedStudent && selectedStudent.id === deleteCandidate.id) {
      setSelectedStudent(null);
    }

    showToast('success', 'Record Erased', `The academic record of ${deleteCandidate.name} has been permanently deleted.`);
    setDeleteCandidate(null);
  };

  // Forward to edit mode on Form tab
  const handleEditForward = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab('register');
    showToast('info', 'Editing Profile', `Populated ${student.name}'s details into the registration console.`);
  };

  // Handle CSV batch import
  const handleImportStudents = (imported: Omit<Student, 'id' | 'savedAt'>[]) => {
    let successCount = 0;
    const errors: string[] = [];
    const newStudentsList = [...students];

    imported.forEach((data, idx) => {
      const isDuplicate = newStudentsList.some(
        s => s.rollNumber.toLowerCase().trim() === data.rollNumber.toLowerCase().trim()
      );

      if (isDuplicate) {
        errors.push(`Record ${idx + 1} (${data.name}): Duplicate Roll Number "${data.rollNumber}".`);
        return;
      }

      const fresh: Student = {
        ...data,
        id: `student-imported-${Date.now()}-${idx}`,
        savedAt: new Date().toISOString()
      };

      newStudentsList.unshift(fresh);
      successCount++;
    });

    if (successCount > 0) {
      setStudents(newStudentsList);
      showToast('success', 'Batch Import Success', `Successfully loaded ${successCount} new students into directory.`);
    }

    return { successCount, errors };
  };

  // Time Formatter
  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formattedDate = time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // List of current roll numbers to validate on the fly
  const existingRollNumbers = students.map(s => s.rollNumber);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f3f4fd] via-[#f7f8fe] to-[#edf0fb] dark:from-[#0d0e15] dark:via-[#121420] dark:to-[#171927] text-neutral-800 dark:text-neutral-100 transition-colors duration-300 font-sans" id="sms-app-root">
      
      {/* HEADER SECTION WITH GRADIENT BACKGROUND */}
      <header className="relative w-full overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 text-white shadow-xl shadow-indigo-500/10 dark:shadow-none" id="sms-header">
        {/* Abstract vector blobs */}
        <div className="absolute top-0 right-0 p-24 bg-white/5 rounded-full blur-2xl pointer-events-none -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 p-16 bg-blue-500/10 rounded-full blur-2xl pointer-events-none translate-y-12 -translate-x-12"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-5 md:py-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo Brand info */}
          <div className="flex items-center gap-3 text-center md:text-left" id="header-brand">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-inner hover:scale-105 transition-all duration-300">
              <GraduationCap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center justify-center md:justify-start gap-2">
                Student Management System
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-emerald-500 text-white rounded-md">
                  V2.4 Active
                </span>
              </h1>
              <p className="text-xs opacity-75 mt-0.5 font-medium">Academic Records, Enrollment & Student Demographics Engine</p>
            </div>
          </div>

          {/* Center/Right: Live Clock and Date */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/10 dark:bg-black/20 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10" id="header-clock-panel">
            <div className="flex items-center gap-2" title="Current Time">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-sm font-extrabold tracking-wide text-neutral-50 dark:text-neutral-100">
                {formattedTime}
              </span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2" title="Current Date">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold">
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-2xl bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 text-white border border-white/10 dark:border-white/5 transition-all duration-200 cursor-pointer"
            id="theme-toggle-btn"
            aria-label="Toggle Dark / Light Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-200" />}
          </button>
        </div>
      </header>

      {/* CORE WRAPPER SECTION WITH SIDEBAR / HERO CARDS */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6" id="sms-main">
        {/* Navigation Tabs Header */}
        <div className="flex items-center justify-between p-1.5 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-2xl" id="sms-navigation-bar">
          <div className="flex flex-wrap gap-1 w-full sm:w-auto">
            {/* Dashboard Tab */}
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setSelectedStudent(null);
              }}
              className={`flex-grow sm:flex-grow-0 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/15'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }`}
              id="tab-dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard Hub
            </button>

            {/* Registration Form Tab */}
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-grow sm:flex-grow-0 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/15'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }`}
              id="tab-register"
            >
              <UserPlus className="w-4 h-4" />
              {selectedStudent ? 'Update Profile' : 'Student Registration'}
            </button>

            {/* Records Table Tab */}
            <button
              onClick={() => {
                setActiveTab('records');
                setSelectedStudent(null);
              }}
              className={`flex-grow sm:flex-grow-0 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                activeTab === 'records'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/15'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }`}
              id="tab-records"
            >
              <Users className="w-4 h-4" />
              Student Directory
              <span className="ml-1 text-[10px] px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md font-extrabold">
                {students.length}
              </span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500 pr-3">
            <BookOpen className="w-4 h-4" />
            <span>Interactive Campus Console</span>
          </div>
        </div>

        {/* ILLUSTRATIVE HERO BANNER SECTION */}
        {activeTab === 'dashboard' && (
          <div className="relative rounded-2xl overflow-hidden aspect-[21/9] md:aspect-[32/10] lg:aspect-[40/10] shadow-md border border-neutral-200 dark:border-neutral-800" id="educational-hero-banner">
            <img 
              src={bannerImg} 
              alt="Bright library student desk space" 
              className="absolute inset-0 w-full h-full object-cover brightness-[0.85] dark:brightness-75"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 flex flex-col justify-end p-6 md:p-8">
              <div className="max-w-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 px-2 py-1 bg-emerald-500/20 backdrop-blur-md rounded-md w-fit">
                  Online Academic Registry
                </span>
                <h2 className="text-xl md:text-3xl font-black text-white leading-tight">
                  Empowering Universities & Educators Globally
                </h2>
                <p className="text-xs md:text-sm text-neutral-200 font-medium">
                  Easily register students, view records with advanced filtering options, track campus demographics, and print professional grade directories instantly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENTS */}
        <div className="transition-all duration-300" id="main-tab-viewport">
          {activeTab === 'dashboard' && (
            <Dashboard 
              students={students} 
              onNavigateToForm={() => setActiveTab('register')}
              onNavigateToRecords={() => setActiveTab('records')}
            />
          )}

          {activeTab === 'register' && (
            <StudentForm 
              selectedStudent={selectedStudent}
              onSave={handleSaveStudent}
              onUpdate={handleUpdateStudent}
              onDelete={handleDeleteRequest}
              onClear={() => setSelectedStudent(null)}
              existingRollNumbers={existingRollNumbers}
            />
          )}

          {activeTab === 'records' && (
            <StudentTable 
              students={students}
              onEdit={handleEditForward}
              onDeleteClick={(s) => setDeleteCandidate(s)}
              onViewClick={(s) => setViewingStudent(s)}
              onImportStudents={handleImportStudents}
            />
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full mt-12 py-8 bg-neutral-100 dark:bg-[#0b0c10] border-t border-neutral-200/50 dark:border-neutral-900/50 text-xs text-neutral-500 dark:text-neutral-400" id="sms-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-500" />
            <span className="font-bold text-neutral-700 dark:text-neutral-300">Student Management System</span>
          </div>
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} SMS Academic Vault. Designed for instant compliance and offline durability. All student data persists safely in your local browser sandbox.
          </p>
          <div className="flex gap-4">
            <span className="hover:text-blue-500 cursor-pointer">Security Protocol</span>
            <span>•</span>
            <span className="hover:text-blue-500 cursor-pointer">Admin Guidelines</span>
          </div>
        </div>
      </footer>

      {/* MODALS & PORTALS */}

      {/* Toast notifications container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* View Details Profile Modal */}
      <StudentModal 
        student={viewingStudent} 
        onClose={() => setViewingStudent(null)} 
      />

      {/* Confirm Student Record Erase */}
      <ConfirmationDialog 
        isOpen={deleteCandidate !== null}
        title="Erase Academic Record?"
        message={`Are you absolutely sure you want to permanently delete the profile of ${deleteCandidate?.name} (Roll: ${deleteCandidate?.rollNumber})? This operation is completely irreversible.`}
        confirmText="Confirm Deletion"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
