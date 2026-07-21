export interface Student {
  id: string; // Unique internal ID
  name: string;
  rollNumber: string; // Unique student identifier
  regNumber: string;
  department: string;
  course: string;
  yearSemester: string;
  age: number;
  gender: string;
  dob: string;
  mobile: string;
  email: string;
  address: string;
  guardianName: string;
  emergencyContact: string;
  savedAt: string; // Date-time string of registration
  updatedAt?: string; // Date-time string of last update
}

export interface DashboardStats {
  totalStudents: number;
  maleStudents: number;
  femaleStudents: number;
  otherStudents: number;
  departmentsCount: number;
  todayRegistrations: number;
}

export type SortField = 'name' | 'rollNumber' | 'savedAt';
export type SortOrder = 'asc' | 'desc';

export interface FilterOptions {
  searchQuery: string;
  searchField: 'name' | 'rollNumber';
  department: string;
  course: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description: string;
}

export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
  'Business Administration',
  'Data Science & AI',
];

export const COURSES = {
  'Computer Science & Engineering': ['B.Tech CSE', 'M.Tech CSE', 'Ph.D CSE', 'B.Sc Computer Science'],
  'Electronics & Communication': ['B.Tech ECE', 'M.Tech Embedded Systems', 'B.Sc Electronics'],
  'Electrical & Electronics': ['B.Tech EEE', 'M.Tech Power Systems'],
  'Mechanical Engineering': ['B.Tech ME', 'M.Tech Robotics', 'Diploma Mechanical'],
  'Civil Engineering': ['B.Tech Civil', 'M.Tech Structural'],
  'Information Technology': ['B.Tech IT', 'MCA', 'BCA'],
  'Business Administration': ['BBA', 'MBA', 'Executive MBA'],
  'Data Science & AI': ['B.Tech AI & DS', 'M.Sc Data Science', 'Certification in AI'],
};

export const YEAR_SEMESTERS = [
  'Year 1 - Semester 1',
  'Year 1 - Semester 2',
  'Year 2 - Semester 1',
  'Year 2 - Semester 2',
  'Year 3 - Semester 1',
  'Year 3 - Semester 2',
  'Year 4 - Semester 1',
  'Year 4 - Semester 2',
];
