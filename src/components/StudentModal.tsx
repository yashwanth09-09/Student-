import { X, User, Phone, Mail, MapPin, ShieldAlert, Calendar, GraduationCap, Clock, Award } from 'lucide-react';
import { Student } from '../types';

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
}

export default function StudentModal({ student, onClose }: StudentModalProps) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="student-modal-overlay">
      <div 
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" 
        id="student-modal-container"
      >
        {/* Header with cover color/gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-white transition-colors cursor-pointer"
            id="student-modal-close-btn"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-2xl flex items-center justify-center shadow-lg">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-black">{student.name}</h3>
              <p className="text-xs opacity-90 mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span>Roll No: <strong className="font-semibold">{student.rollNumber}</strong></span>
                <span>•</span>
                <span>Reg No: <strong className="font-semibold">{student.regNumber}</strong></span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal content body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow" id="student-modal-body">
          {/* Section 1: Academic & Program details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-500" /> Academic Enrolment
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Department</span>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 mt-0.5">{student.department}</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Course / Degree</span>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 mt-0.5">{student.course}</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Year & Semester</span>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 mt-0.5">{student.yearSemester}</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Admission Status</span>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  Active / Enrolled
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Personal information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-1.5">
              <User className="w-4 h-4 text-blue-500" /> Personal Profile
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Gender</span>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 mt-0.5">{student.gender}</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Age</span>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 mt-0.5">{student.age} Years</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Date of Birth</span>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  {new Date(student.dob).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Contact information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-1.5">
              <Phone className="w-4 h-4 text-emerald-500" /> Contact details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-2.5 items-start">
                <Phone className="w-4 h-4 text-neutral-400 mt-0.5" />
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Mobile Number</span>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 mt-0.5">{student.mobile}</p>
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <Mail className="w-4 h-4 text-neutral-400 mt-0.5" />
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Email Address</span>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 mt-0.5 truncate max-w-[220px]">{student.email}</p>
                </div>
              </div>
              <div className="flex gap-2.5 items-start sm:col-span-2">
                <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Physical Address</span>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 mt-0.5 leading-relaxed">{student.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Guardian & Emergencies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" /> Parent / Emergency Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Parent / Guardian Name</span>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 mt-0.5">{student.guardianName}</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <Phone className="w-4 h-4 text-rose-400 mt-0.5" />
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Emergency Contact</span>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 mt-0.5">{student.emergencyContact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Metadata history */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-neutral-400 dark:text-neutral-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Created: <strong>{new Date(student.savedAt).toLocaleString()}</strong></span>
            </div>
            {student.updatedAt && (
              <div className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>Modified: <strong>{new Date(student.updatedAt).toLocaleString()}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Modal footer action */}
        <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-900/60 border-t border-neutral-100 dark:border-neutral-800 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 font-bold text-xs rounded-xl transition-all cursor-pointer"
            id="student-modal-close-bottom"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
