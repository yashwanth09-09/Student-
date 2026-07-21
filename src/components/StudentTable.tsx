import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, ArrowUpDown, Eye, Edit3, Trash2, Download, FileSpreadsheet, 
  Printer, Upload, ArrowLeft, ArrowRight, DownloadCloud, Sparkles, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { Student, DEPARTMENTS, SortField, SortOrder } from '../types';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDeleteClick: (student: Student) => void;
  onViewClick: (student: Student) => void;
  onImportStudents: (imported: Omit<Student, 'id' | 'savedAt'>[]) => { successCount: number; errors: string[] };
}

export default function StudentTable({
  students,
  onEdit,
  onDeleteClick,
  onViewClick,
  onImportStudents
}: StudentTableProps) {
  // Filters & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState<'name' | 'rollNumber'>('name');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('savedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Import Popup State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFeedback, setImportFeedback] = useState<{ success: number; errors: string[] } | null>(null);

  // Filter courses based on selected department for search options
  const availableCourses = useMemo(() => {
    if (!selectedDept) return [];
    // Extract unique courses in this department from students, or just free input
    const courses = students
      .filter(s => s.department === selectedDept)
      .map(s => s.course);
    return Array.from(new Set(courses));
  }, [selectedDept, students]);

  // Reset pagination when filter changes
  const handleFilterChange = (updater: () => void) => {
    updater();
    setCurrentPage(1);
  };

  // Process sorting & filtering
  const processedStudents = useMemo(() => {
    let result = [...students];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      if (searchField === 'name') {
        result = result.filter(s => s.name.toLowerCase().includes(q));
      } else {
        result = result.filter(s => s.rollNumber.toLowerCase().includes(q));
      }
    }

    // 2. Department Filter
    if (selectedDept) {
      result = result.filter(s => s.department === selectedDept);
    }

    // 3. Course Filter
    if (selectedCourse) {
      result = result.filter(s => s.course === selectedCourse);
    }

    // 4. Sort
    result.sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      if (sortBy === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortBy === 'rollNumber') {
        valA = a.rollNumber.toLowerCase();
        valB = b.rollNumber.toLowerCase();
      } else if (sortBy === 'savedAt') {
        valA = new Date(a.savedAt).getTime();
        valB = new Date(b.savedAt).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, searchQuery, searchField, selectedDept, selectedCourse, sortBy, sortOrder]);

  // Pagination calculations
  const totalRecords = processedStudents.length;
  const totalPages = Math.ceil(totalRecords / rowsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return processedStudents.slice(start, start + rowsPerPage);
  }, [processedStudents, currentPage, rowsPerPage]);

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Export to CSV (Excel format)
  const exportToExcel = () => {
    if (students.length === 0) return;

    const headers = [
      'ID', 'Name', 'Roll Number', 'Registration Number', 'Department', 'Course', 
      'Year Semester', 'Age', 'Gender', 'DOB', 'Mobile', 'Email', 
      'Address', 'Guardian Name', 'Emergency Contact', 'Registered Date & Time'
    ];

    const rows = students.map(s => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.rollNumber}"`,
      `"${s.regNumber}"`,
      `"${s.department}"`,
      `"${s.course}"`,
      `"${s.yearSemester}"`,
      s.age,
      s.gender,
      s.dob,
      `"${s.mobile}"`,
      `"${s.email}"`,
      `"${s.address.replace(/"/g, '""')}"`,
      `"${s.guardianName.replace(/"/g, '""')}"`,
      `"${s.emergencyContact}"`,
      `"${new Date(s.savedAt).toLocaleString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Student_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print list/Export to PDF
  const printStudentList = () => {
    // Generate a high-quality printable window markup
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableRows = processedStudents.map((s, index) => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${s.name}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${s.rollNumber}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${s.department}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${s.course}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${s.mobile}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${new Date(s.savedAt).toLocaleDateString()}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Student Management System - Enrolled Directory</title>
          <style>
            body { font-family: system-ui, sans-serif; color: #333; margin: 40px; }
            h1 { text-align: center; color: #1e3a8a; margin-bottom: 5px; }
            p.meta { text-align: center; color: #666; font-size: 14px; margin-top: 0; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
            th { background-color: #f3f4f6; border: 1px solid #ddd; padding: 10px; text-align: left; color: #111; }
            tr:nth-child(even) { background-color: #fafafa; }
            .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 15px; }
          </style>
        </head>
        <body>
          <h1>Student Directory Report</h1>
          <p class="meta">Generated on ${new Date().toLocaleString()} | Total Active Records: ${processedStudents.length}</p>
          <table>
            <thead>
              <tr>
                <th style="width: 50px; text-align: center;">S.No</th>
                <th>Student Name</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Course</th>
                <th>Mobile Number</th>
                <th>Date Added</th>
              </tr>
            </thead>
            <tbody>
              ${processedStudents.length === 0 ? '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #888;">No student records found matching the current criteria.</td></tr>' : tableRows}
            </tbody>
          </table>
          <div class="footer">
            Student Management System &copy; ${new Date().getFullYear()} - Academic Records Vault.
          </div>
          <script>
            window.onload = function() {
              window.print();
              // close temporary tab optionally after print dialog closes
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Download Import Template
  const downloadTemplate = () => {
    const headers = [
      'Name', 'Roll Number', 'Registration Number', 'Department', 'Course', 
      'Year Semester', 'Age', 'Gender', 'DOB', 'Mobile', 'Email', 
      'Address', 'Guardian Name', 'Emergency Contact'
    ];
    const sampleRow = [
      'John Doe', '2026CSE099', 'REG778899', 'Computer Science & Engineering', 'B.Tech CSE',
      'Year 1 - Semester 1', '19', 'Male', '2007-04-12', '9876543210', 'john.doe@univ.edu',
      '123 University Drive, Block B', 'Robert Doe', '9876543211'
    ];

    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'student_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom Local File CSV Parse & Import
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        // Simple CSV parser supporting double quotes
        const lines = [];
        let row = [];
        let inQuotes = false;
        let currentValue = '';

        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const nextChar = text[i + 1];

          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              currentValue += '"';
              i++; // skip next quote
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            row.push(currentValue.trim());
            currentValue = '';
          } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') {
              i++; // skip \n
            }
            row.push(currentValue.trim());
            if (row.length > 1 || row[0] !== '') {
              lines.push(row);
            }
            row = [];
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        if (currentValue !== '' || row.length > 0) {
          row.push(currentValue.trim());
          lines.push(row);
        }

        if (lines.length < 2) {
          setImportFeedback({ success: 0, errors: ['CSV file is empty or missing data rows.'] });
          return;
        }

        const headers = lines[0].map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
        const dataRows = lines.slice(1);
        const importedData: Omit<Student, 'id' | 'savedAt'>[] = [];
        const parseErrors: string[] = [];

        // Expected mapping: name, rollnumber, registrationnumber, department, course, yearsemester, age, gender, dob, mobile, email, address, guardianname, emergencycontact
        dataRows.forEach((cols, idx) => {
          if (cols.length < 14) {
            parseErrors.push(`Row ${idx + 2}: Insufficient columns. Got ${cols.length}, expected 14.`);
            return;
          }

          // Match index to column order based on standard headers, or default index mapping if custom
          const getVal = (colIdx: number) => cols[colIdx] || '';

          const nameVal = getVal(0);
          const rollVal = getVal(1);
          const regVal = getVal(2);
          const deptVal = getVal(3);
          const courseVal = getVal(4);
          const ysVal = getVal(5);
          const ageVal = parseInt(getVal(6));
          const genderVal = getVal(7);
          const dobVal = getVal(8);
          const mobVal = getVal(9);
          const emailVal = getVal(10);
          const addrVal = getVal(11);
          const guardVal = getVal(12);
          const emergVal = getVal(13);

          if (!nameVal || !rollVal || !regVal || !deptVal || !courseVal || !ysVal || isNaN(ageVal) || !genderVal || !dobVal || !mobVal || !emailVal || !addrVal || !guardVal || !emergVal) {
            parseErrors.push(`Row ${idx + 2}: Missing or invalid fields. Ensure all required fields are filled.`);
            return;
          }

          importedData.push({
            name: nameVal,
            rollNumber: rollVal,
            regNumber: regVal,
            department: deptVal,
            course: courseVal,
            yearSemester: ysVal,
            age: ageVal,
            gender: genderVal,
            dob: dobVal,
            mobile: mobVal,
            email: emailVal,
            address: addrVal,
            guardianName: guardVal,
            emergencyContact: emergVal
          });
        });

        if (importedData.length > 0) {
          const result = onImportStudents(importedData);
          setImportFeedback({
            success: result.successCount,
            errors: [...parseErrors, ...result.errors]
          });
        } else {
          setImportFeedback({
            success: 0,
            errors: parseErrors.length > 0 ? parseErrors : ['No valid records found for import.']
          });
        }
      } catch (err) {
        setImportFeedback({ success: 0, errors: ['Failed to parse CSV file. Ensure standard format.'] });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6" id="student-records-tab">
      {/* Search and Filters Card */}
      <div className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border border-white/20 dark:border-white/5 p-5 rounded-2xl shadow-sm space-y-4" id="table-toolbar">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          
          {/* Left: Search Box */}
          <div className="flex flex-col sm:flex-row gap-2 flex-grow max-w-xl">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={searchField === 'name' ? 'Search by full name...' : 'Search by roll number...'}
                value={searchQuery}
                onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 text-neutral-800 dark:text-neutral-100 transition-all duration-150"
                id="search-input"
              />
            </div>
            <select
              value={searchField}
              onChange={(e) => handleFilterChange(() => setSearchField(e.target.value as 'name' | 'rollNumber'))}
              className="px-3 py-2 text-sm bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-neutral-800 dark:text-neutral-100 transition-all duration-150"
              id="search-field-select"
            >
              <option value="name">Search Name</option>
              <option value="rollNumber">Search Roll No.</option>
            </select>
          </div>

          {/* Right: Actions (Import/Export/Print) */}
          <div className="flex flex-wrap items-center gap-2" id="toolbar-export-import-actions">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3.5 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl flex items-center gap-1.5 transition-all duration-150 cursor-pointer"
              title="Import from Excel CSV"
              id="toolbar-import-csv"
            >
              <Upload className="w-3.5 h-3.5" />
              Import CSV
            </button>
            <button
              onClick={exportToExcel}
              disabled={students.length === 0}
              className="px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl flex items-center gap-1.5 transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Export to Excel"
              id="toolbar-export-excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export Excel
            </button>
            <button
              onClick={printStudentList}
              className="px-3.5 py-2 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl flex items-center gap-1.5 transition-all duration-150 cursor-pointer"
              title="Print student list / PDF"
              id="toolbar-print"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Dropdown Filters Line */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2" id="advanced-filter-row">
          {/* Department Filter */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Department</span>
            <select
              value={selectedDept}
              onChange={(e) => handleFilterChange(() => {
                setSelectedDept(e.target.value);
                setSelectedCourse('');
              })}
              className="px-3 py-1.5 text-xs bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-neutral-800 dark:text-neutral-100 transition-all duration-150"
              id="filter-department"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Course Filter */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Course / Degree</span>
            <select
              value={selectedCourse}
              onChange={(e) => handleFilterChange(() => setSelectedCourse(e.target.value))}
              disabled={!selectedDept}
              className={`px-3 py-1.5 text-xs bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-neutral-800 dark:text-neutral-100 transition-all duration-150 ${!selectedDept ? 'opacity-40 cursor-not-allowed' : ''}`}
              id="filter-course"
            >
              <option value="">{selectedDept ? 'All Courses' : 'Select Dept First'}</option>
              {availableCourses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sort By Field */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Sort Field</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortField)}
              className="px-3 py-1.5 text-xs bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-neutral-800 dark:text-neutral-100 transition-all duration-150"
              id="sort-field-select"
            >
              <option value="name">Sort by Name</option>
              <option value="rollNumber">Sort by Roll Number</option>
              <option value="savedAt">Sort by Date Added</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Sort Order</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="px-3 py-1.5 text-xs bg-white/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-neutral-800 dark:text-neutral-100 transition-all duration-150"
              id="sort-order-select"
            >
              <option value="asc">Ascending (A-Z / Oldest)</option>
              <option value="desc">Descending (Z-A / Newest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Table Card */}
      <div className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden" id="table-card">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse" id="records-table">
            <thead>
              <tr className="border-b border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-100/50 dark:bg-neutral-900/40 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <th className="py-4 px-4 text-center w-[70px]">S.No</th>
                <th className="py-4 px-4 cursor-pointer hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-colors" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1.5">
                    Student Name
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                  </div>
                </th>
                <th className="py-4 px-4 cursor-pointer hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-colors" onClick={() => toggleSort('rollNumber')}>
                  <div className="flex items-center gap-1.5">
                    Roll Number
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                  </div>
                </th>
                <th className="py-4 px-4">Department</th>
                <th className="py-4 px-4">Course</th>
                <th className="py-4 px-4">Mobile</th>
                <th className="py-4 px-4 cursor-pointer hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-colors" onClick={() => toggleSort('savedAt')}>
                  <div className="flex items-center gap-1.5">
                    Saved Date & Time
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                  </div>
                </th>
                <th className="py-4 px-4 text-center w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60 text-sm">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-neutral-400 dark:text-neutral-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Sparkles className="w-8 h-8 text-neutral-300 dark:text-neutral-700 animate-bounce" />
                      <span>No matching records found. Try adjusting your search query or filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student, idx) => {
                  const serialNo = (currentPage - 1) * rowsPerPage + idx + 1;
                  return (
                    <tr 
                      key={student.id} 
                      className="hover:bg-white/30 dark:hover:bg-neutral-900/30 transition-all duration-150 group"
                      id={`row-${student.rollNumber}`}
                    >
                      <td className="py-3.5 px-4 text-center font-bold text-neutral-400 dark:text-neutral-600">
                        {serialNo}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-neutral-800 dark:text-neutral-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {student.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        {student.rollNumber}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300 truncate max-w-[150px]">
                        {student.department}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-1 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium">
                          {student.course}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300">
                        {student.mobile}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-neutral-500 dark:text-neutral-400">
                        {new Date(student.savedAt).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* View Button */}
                          <button
                            onClick={() => onViewClick(student)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/10 transition-colors cursor-pointer"
                            title="View Full Profile"
                            id={`btn-view-${student.rollNumber}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => onEdit(student)}
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer"
                            title="Edit Student Info"
                            id={`btn-edit-${student.rollNumber}`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => onDeleteClick(student)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete Student"
                            id={`btn-delete-${student.rollNumber}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Pagination controls */}
        {totalRecords > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-neutral-50/50 dark:bg-neutral-900/20 border-t border-neutral-200/50 dark:border-neutral-800/50 text-xs text-neutral-500 dark:text-neutral-400" id="table-pagination">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-800 dark:text-neutral-100 focus:outline-none"
                id="pagination-rows-select"
              >
                <option value={5}>5 rows</option>
                <option value={10}>10 rows</option>
                <option value={20}>20 rows</option>
                <option value={50}>50 rows</option>
              </select>
              <span>of <strong className="font-semibold text-neutral-700 dark:text-neutral-300">{totalRecords}</strong> entries</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                id="pagination-prev"
                aria-label="Previous Page"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <span>
                Page <strong className="font-semibold text-neutral-700 dark:text-neutral-300">{currentPage}</strong> of <strong className="font-semibold text-neutral-700 dark:text-neutral-300">{totalPages}</strong>
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                id="pagination-next"
                aria-label="Next Page"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSV Import Modal popup */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="import-modal-overlay">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 w-full max-w-lg p-6 rounded-2xl shadow-xl space-y-4" id="import-modal-container">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-extrabold text-base text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-500" />
                Import Students from CSV
              </h3>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFeedback(null);
                }}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                id="import-modal-close"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs text-neutral-600 dark:text-neutral-400">
              <p>
                Import multiple student records instantly using a standard comma-separated values (.csv) file. Fields must follow this precise ordering:
              </p>
              <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-x-auto font-mono text-[10px] leading-relaxed select-all">
                Name, Roll Number, Registration Number, Department, Course, Year Semester, Age, Gender, DOB, Mobile, Email, Address, Guardian Name, Emergency Contact
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Ready to start?</span>
                <button
                  onClick={downloadTemplate}
                  className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold rounded-lg flex items-center gap-1 transition-all duration-150 cursor-pointer text-[11px]"
                  id="btn-download-csv-template"
                >
                  <DownloadCloud className="w-3.5 h-3.5" />
                  Download Sample CSV
                </button>
              </div>

              {/* Upload Input Area */}
              <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 dark:hover:border-indigo-400 p-6 rounded-xl text-center cursor-pointer transition-all relative group">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="csv-file-picker"
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-neutral-400 group-hover:text-indigo-500 transition-colors" />
                  <p className="font-semibold text-neutral-700 dark:text-neutral-300 text-xs">Drag and drop CSV here or click to select</p>
                  <p className="text-[10px] text-neutral-400">Supported format: Standard CSV (.csv)</p>
                </div>
              </div>

              {/* Feedback Area */}
              {importFeedback && (
                <div className={`p-4 rounded-xl border ${importFeedback.success > 0 ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' : 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'} space-y-2`} id="import-feedback-box">
                  <div className="flex items-center gap-2">
                    {importFeedback.success > 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    )}
                    <span className="font-bold text-neutral-800 dark:text-neutral-100">
                      Successfully imported {importFeedback.success} student records!
                    </span>
                  </div>
                  {importFeedback.errors.length > 0 && (
                    <div className="space-y-1 pt-1.5 border-t border-neutral-200/50 dark:border-neutral-800/50">
                      <p className="font-semibold text-rose-600 dark:text-rose-400 text-[10px] uppercase tracking-wider">Errors & Warnings:</p>
                      <ul className="list-disc pl-4 space-y-1 text-[10px] text-rose-600 dark:text-rose-400 max-h-[100px] overflow-y-auto">
                        {importFeedback.errors.map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFeedback(null);
                }}
                className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold rounded-xl transition-all cursor-pointer text-xs"
                id="btn-close-import-modal"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
