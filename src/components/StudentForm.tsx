import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Eraser, Trash2, UserPlus, FileText, Sparkles } from 'lucide-react';
import { Student, DEPARTMENTS, COURSES, YEAR_SEMESTERS } from '../types';

interface StudentFormProps {
  selectedStudent: Student | null;
  onSave: (studentData: Omit<Student, 'id' | 'savedAt'>) => void;
  onUpdate: (id: string, studentData: Omit<Student, 'id' | 'savedAt' | 'updatedAt'>) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  existingRollNumbers: string[];
}

export default function StudentForm({
  selectedStudent,
  onSave,
  onUpdate,
  onDelete,
  onClear,
  existingRollNumbers
}: StudentFormProps) {
  // Form States
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [yearSemester, setYearSemester] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Validation / Error States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Sync with selected student for editing
  useEffect(() => {
    if (selectedStudent) {
      setName(selectedStudent.name);
      setRollNumber(selectedStudent.rollNumber);
      setRegNumber(selectedStudent.regNumber);
      setDepartment(selectedStudent.department);
      setCourse(selectedStudent.course);
      setYearSemester(selectedStudent.yearSemester);
      setAge(selectedStudent.age.toString());
      setGender(selectedStudent.gender);
      setDob(selectedStudent.dob);
      setMobile(selectedStudent.mobile);
      setEmail(selectedStudent.email);
      setAddress(selectedStudent.address);
      setGuardianName(selectedStudent.guardianName);
      setEmergencyContact(selectedStudent.emergencyContact);
      setErrors({});
    } else {
      resetFormFields();
    }
  }, [selectedStudent]);

  // Handle department change to clear or sync courses
  const handleDepartmentChange = (dept: string) => {
    setDepartment(dept);
    setCourse(''); // reset course selection since department changed
  };

  const resetFormFields = () => {
    setName('');
    setRollNumber('');
    setRegNumber('');
    setDepartment('');
    setCourse('');
    setYearSemester('');
    setAge('');
    setGender('');
    setDob('');
    setMobile('');
    setEmail('');
    setAddress('');
    setGuardianName('');
    setEmergencyContact('');
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Basic required field validations
    if (!name.trim()) newErrors.name = 'Full name is required';
    else if (name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';

    if (!rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
    else if (
      (!selectedStudent && existingRollNumbers.includes(rollNumber.trim())) ||
      (selectedStudent && selectedStudent.rollNumber !== rollNumber.trim() && existingRollNumbers.includes(rollNumber.trim()))
    ) {
      newErrors.rollNumber = 'This Roll Number already exists in the database';
    }

    if (!regNumber.trim()) newErrors.regNumber = 'Registration number is required';
    if (!department) newErrors.department = 'Department is required';
    if (!course) newErrors.course = 'Course is required';
    if (!yearSemester) newErrors.yearSemester = 'Year/Semester is required';
    
    if (!age) newErrors.age = 'Age is required';
    else {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 15 || ageNum > 100) {
        newErrors.age = 'Age must be between 15 and 100';
      }
    }

    if (!gender) newErrors.gender = 'Gender is required';
    if (!dob) newErrors.dob = 'Date of Birth is required';

    const phoneRegex = /^[0-9]{10}$/;
    if (!mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!phoneRegex.test(mobile.trim())) {
      newErrors.mobile = 'Must be a valid 10-digit number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.email = 'Email address is required';
    else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Must be a valid email address';
    }

    if (!address.trim()) newErrors.address = 'Current address is required';
    if (!guardianName.trim()) newErrors.guardianName = 'Parent/Guardian name is required';

    if (!emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
    else if (!phoneRegex.test(emergencyContact.trim())) {
      newErrors.emergencyContact = 'Must be a valid 10-digit number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      regNumber: regNumber.trim(),
      department,
      course,
      yearSemester,
      age: parseInt(age),
      gender,
      dob,
      mobile: mobile.trim(),
      email: email.trim(),
      address: address.trim(),
      guardianName: guardianName.trim(),
      emergencyContact: emergencyContact.trim(),
    });
    
    resetFormFields();
  };

  const handleUpdate = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    if (!validateForm()) return;

    onUpdate(selectedStudent.id, {
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      regNumber: regNumber.trim(),
      department,
      course,
      yearSemester,
      age: parseInt(age),
      gender,
      dob,
      mobile: mobile.trim(),
      email: email.trim(),
      address: address.trim(),
      guardianName: guardianName.trim(),
      emergencyContact: emergencyContact.trim(),
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    onDelete(selectedStudent.id);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    resetFormFields();
    onClear();
  };

  // Get current courses based on selected department
  const availableCourses = department ? COURSES[department as keyof typeof COURSES] || [] : [];

  return (
    <div className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border border-white/20 dark:border-white/5 p-6 md:p-8 rounded-2xl shadow-sm space-y-6" id="registration-form-card">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <h3 className="font-extrabold text-lg text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
          {selectedStudent ? (
            <>
              <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin-slow" />
              Update Student Profile
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 text-blue-500" />
              Student Registration Form
            </>
          )}
        </h3>
        {selectedStudent && (
          <span className="text-xs px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full font-bold">
            Edit Mode: {selectedStudent.name}
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6" id="student-main-form">
        {/* Section 1: Academic Information */}
        <div>
          <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Academic Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Roll Number */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rollNumber" className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Roll Number <span className="text-rose-500">*</span></label>
              <input
                id="rollNumber"
                type="text"
                placeholder="e.g., 2026CSE041"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className={`px-3.5 py-2 rounded-xl text-sm bg-white/60 dark:bg-neutral-800/60 border ${errors.rollNumber ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-neutral-200 dark:border-neutral-700'} focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 transition-all duration-150`}
              />
              {errors.rollNumber && <span className="text-[10px] font-medium text-rose-500 mt-0.5">{errors.rollNumber}</span>}
            </div>

            {/* Registration Number */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="regNumber" className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Registration Number <span className="text-rose-500">*</span></label>
              <input
                id="regNumber"
                type="text"
                placeholder="e.g., REG1092834"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className={`px-3.5 py-2 rounded-xl text-sm bg-white/60 dark:bg-neutral-800/60 border ${errors.regNumber ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-neutral-200 dark:border-neutral-700'} focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 transition-all duration-150`}
              />
              {errors.regNumber && <span className="text-[10px] font-medium text-rose-500 mt-0.5">{errors.regNumber}</span>}
            </div>

            {/* Year/Semester */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="yearSemester" className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Year / Semester <span className="text-rose-500">*</span></label>
              <select
                id="yearSemester"
                value={yearSemester}
                onChange={(e) => setYearSemester(e.target.value)}
                className={`px-3.5 py-2 rounded-xl text-sm bg-white/60 dark:bg-neutral-800/60 border ${errors.yearSemester ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'} focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 text-neutral-800 dark:text-neutral-100 transition-all duration-150`}
              >
                <option value="">Select Year & Semester</option>
                {YEAR_SEMESTERS.map(ys => (
                  <option key={ys} value={ys}>{ys}</option>
                ))}
              </select>
              {errors.yearSemester && <span className="text-[10px] font-medium text-rose-500 mt-0.5">{errors.yearSemester}</span>}
            </div>

            {/* Department */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="department" className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Department <span className="text-rose-500">*</span></label>
              <select
                id="department"
                value={department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className={`px-3.5 py-2 rounded-xl text-sm bg-white/60 dark:bg-neutral-800/60 border ${errors.department ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'} focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 text-neutral-800 dark:text-neutral-100 transition-all duration-150`}
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <span className="text-[10px] font-medium text-rose-500 mt-0.5">{errors.department}</span>}
            </div>

            {/* Course */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="course" className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Course / Degree <span className="text-rose-500">*</span></label>
              <select
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                disabled={!department}
                className={`px-3.5 py-2 rounded-xl text-sm bg-white/60 dark:bg-neutral-800/60 border ${!department ? 'opacity-50 cursor-not-allowed bg-neutral-100 dark:bg-neutral-900' : ''} ${errors.course ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'} focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 text-neutral-800 dark:text-neutral-100 transition-all duration-150`}
              >
                <option value="">{department ? 'Select Course' : 'Choose Department First'}</option>
                {availableCourses.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.course && <span className="text-[10px] font-medium text-rose-500 mt-0.5">{errors.course}</span>}
            </div>
          </div>
        </div>

        {/* Section 2: Personal details */}
        <div>
          <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <UserPlus className="w-3.5 h-3.5" /> Personal Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Student Name */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="name" className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Student Name <span className="text-rose-500">*</span></label>
              <input
                id="name"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`px-3.5 py-2 rounded-xl text-sm bg-white/60 dark:bg-neutral-800/60 border ${errors.name ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'} focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 transition-all duration-150`}
              />
              {errors.name && <span className="text-[10px] font-medium text-rose-500 mt-0.5">{errors.name}</span>}
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="dob" className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Date of Birth <span className="text-rose-500">*</span></label>
              <input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={`px-3.5 py-2 rounded-xl text-sm bg-white/60 dark:bg-neutral-800/60 border ${errors.dob ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'} focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 text-neutral-800 dark:text-neutral-100 transition-all duration-150`}
              />
              {errors.dob && <span className="text-[10px] font-medium text-rose-500 mt-0.5">{errors.dob}</span>}
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="gender" className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Gender <span className="text-rose-500">*</span></label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={`px-3.5 py-2 rounded-xl text-sm bg-white/60 dark:bg-neutral-800/60 border ${errors.gender ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'} focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 text-neutral-800 dark:text-neutral-100 transition-all duration-150`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <span className="text-[10px] font-medium text-rose-500 mt-0.5">{errors.gender}</span>}
            </div>

            {/* Age */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="age" className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Age <span className="text-rose-500">*</span></label>
              <input
                id="age"
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={`px-3.5 py-2 rounded-xl text-sm bg-white/60 dark:bg-neutral-800/60 border ${errors.age ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'} focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 transition-all duration-150`}
              />
              {errors.age && <span className="text-[10px] font-medium text-rose-500 mt-0.5">{errors.age}</span>}
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="mobile" className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Mobile Number <span className="text-rose-500">*</span></label>
              <input
                id="mobile"
                type="tel"
                placeholder="10-digit mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                maxLength={10}
                className={`px-3.5 py-2 rounded-xl text-sm bg-white/60 dark:bg-neutral-800/60 border ${errors.mobile ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'} focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 transition-all duration-150`}
              />
              {errors.mobile && <span className="text-[10px] font-medium text-rose-500 mt-0.5">{errors.mobile}</span>}
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="email" className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Email Address <span className="text-rose-500">*</span></label>
              <input
                id="email"
                type="email"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`px-3.5 py-2 rounded-xl text-sm bg-white/60 dark:bg-neutral-800/60 border ${errors.email ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'} focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 transition-all duration-150`}
              />
              {errors.email && <span className="text-[10px] font-medium text-rose-500 mt-0.5">{errors.email}</span>}
            </div>
          </div>
        </div>

        {/* Section 3: Guardian & Emergency Contact */}
        <div>
          <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Guardian & Emergency Contacts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Guardian Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="guardianName" className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Parent / Guardian Name <span className="text-rose-500">*</span></label>
              <input
                id="guardianName"
                type="text"
                placeholder="Guardian Full Name"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className={`px-3.5 py-2 rounded-xl text-sm bg-white/60 dark:bg-neutral-800/60 border ${errors.guardianName ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'} focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 transition-all duration-150`}
              />
              {errors.guardianName && <span className="text-[10px] font-medium text-rose-500 mt-0.5">{errors.guardianName}</span>}
            </div>

            {/* Emergency Contact */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="emergencyContact" className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Emergency Contact Number <span className="text-rose-500">*</span></label>
              <input
                id="emergencyContact"
                type="tel"
                placeholder="10-digit emergency contact"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                maxLength={10}
                className={`px-3.5 py-2 rounded-xl text-sm bg-white/60 dark:bg-neutral-800/60 border ${errors.emergencyContact ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'} focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 transition-all duration-150`}
              />
              {errors.emergencyContact && <span className="text-[10px] font-medium text-rose-500 mt-0.5">{errors.emergencyContact}</span>}
            </div>
          </div>
        </div>

        {/* Section 4: Address */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="address" className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Permanent Address <span className="text-rose-500">*</span></label>
          <textarea
            id="address"
            placeholder="Full physical address"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`px-3.5 py-2.5 rounded-xl text-sm bg-white/60 dark:bg-neutral-800/60 border ${errors.address ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'} focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 resize-none transition-all duration-150`}
          />
          {errors.address && <span className="text-[10px] font-medium text-rose-500 mt-0.5">{errors.address}</span>}
        </div>

        {/* Form Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800" id="form-action-buttons">
          {/* Save Button */}
          <button
            type="submit"
            disabled={selectedStudent !== null}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer ${
              selectedStudent !== null
                ? 'opacity-40 cursor-not-allowed bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 dark:shadow-blue-950/30'
            }`}
            id="btn-save-student"
          >
            <Save className="w-4 h-4" />
            Save Student
          </button>

          {/* Update Button */}
          <button
            type="button"
            onClick={handleUpdate}
            disabled={selectedStudent === null}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer ${
              selectedStudent === null
                ? 'opacity-40 cursor-not-allowed bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20'
            }`}
            id="btn-update-student"
          >
            <RefreshCw className="w-4 h-4" />
            Update Student
          </button>

          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClear}
            className="px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer ml-auto"
            id="btn-clear-form"
          >
            <Eraser className="w-4 h-4" />
            Clear Form
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={selectedStudent === null}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer ${
              selectedStudent === null
                ? 'opacity-40 cursor-not-allowed bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600'
                : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-md shadow-rose-500/20'
            }`}
            id="btn-delete-student"
          >
            <Trash2 className="w-4 h-4" />
            Delete Student
          </button>
        </div>
      </form>
    </div>
  );
}
