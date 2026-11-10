'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

const translations = {
  en: {
    dashboard: 'Dashboard',
    tasks: 'Tasks',
    admin: 'Admin',
    adminPanel: 'Admin Panel',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    private: 'Private',
    team: 'Team',
    vintexProject: 'VinteX Project',
    designDevelopment: 'Design & Development',
    todaysProductivity: "Today's productivity",
    projectActivity: 'Project Activity',
    statistic: 'Statistic',
    syncCalls: 'Sync Calls',
    workshops: 'Workshops',
    reviews: 'Reviews',
    todaysTasks: "Today's Tasks",
    hi: 'Hi',
    readyToJoin: 'Ready to join?',
    joinMeeting: 'Join a meeting',
    performers: 'Performers',
    allTasks: 'All Tasks',
    all: 'All',
    todo: 'To Do',
    inProgress: 'In Progress',
    completed: 'Completed',
    highPriority: 'High Priority',
    mediumPriority: 'Medium Priority',
    lowPriority: 'Low Priority',
    searchTasks: 'Search tasks...',
    add: 'Add',
    createTask: 'Create Task',
    editTask: 'Edit Task',
    title: 'Title',
    description: 'Description',
    priority: 'Priority',
    status: 'Status',
    dueDate: 'Due Date',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    delete: 'Delete',
    reopen: 'Reopen',
    quickRequests: 'Quick requests',
    setTask: 'Set Task',
    workspace: 'Workspace',
    sprintProgress: 'Sprint Progress',
    noTasksFound: 'No tasks found',
    adminAccessRequired: 'Admin Access Required',
    adminRestrictedNotice: 'This area is restricted to administrators only.',
    backToDashboard: 'Back to Dashboard',
    signInAsAdmin: 'Sign In as Admin',
    registeredUsers: 'Registered Users',
    totalSystemTasks: 'Total System Tasks',
    userAccountsPermissions: 'User Accounts & Permissions',
    role: 'Role',
    makeAdmin: 'Make Admin',
    demoteToUser: 'Demote to User',
    currentSession: 'Current Session',
    tasksCreated: 'Tasks Created',
    registered: 'Registered',
    refreshData: 'Refresh Data',
    welcomeToLisso: 'Welcome to Lisso',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account? Sign In',
    dontHaveAccount: "Don't have an account? Create one",
    demoUserLogin: '👤 Demo User',
    adminUserLogin: '👑 Admin User',
    fullName: 'Full Name',
    email: 'Email',
    password: 'Password',
    tasksSubtitle: 'Manage, filter, and track all your tasks and deadlines',
    allPriorities: 'All Priorities',
    newestFirst: 'Newest First',
    oldestFirst: 'Oldest First',
    dueDateEarliest: 'Due Date (Earliest)',
    priorityHighToLow: 'Priority (High to Low)',
    searchByTitle: 'Search by title...',
    retry: 'Retry',
    loadingTasks: 'Loading tasks...',
    taskTitleDescription: 'Task Title & Description',
    created: 'Created',
    actions: 'Actions',
    pending: 'Pending',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    user: 'User',
    emailAddress: 'Email Address',
    statusAction: 'Status / Action',
    totalUsers: 'Total Users',
    totalTasks: 'Total Tasks',
    activeAdmins: 'Active Admins',
    systemOverview: 'System Overview & User Management',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    tasks: 'المهام',
    admin: 'الإدارة',
    adminPanel: 'لوحة الإدارة',
    signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج',
    private: 'خاص',
    team: 'فريق العمل',
    vintexProject: 'مشروع VinteX',
    designDevelopment: 'التصميم والتطوير',
    todaysProductivity: 'إنتاجية اليوم',
    projectActivity: 'نشاط المشروع',
    statistic: 'إحصائية',
    syncCalls: 'مكالمات المزامنة',
    workshops: 'ورش العمل',
    reviews: 'المراجعات',
    todaysTasks: 'مهام اليوم',
    hi: 'مرحباً',
    readyToJoin: 'جاهز للانضمام؟',
    joinMeeting: 'الانضمام للاجتماع',
    performers: 'المشاركون',
    allTasks: 'جميع المهام',
    all: 'الكل',
    todo: 'قيد الانتظار',
    inProgress: 'جاري التنفيذ',
    completed: 'مكتملة',
    highPriority: 'أولوية عالية',
    mediumPriority: 'أولوية متوسطة',
    lowPriority: 'أولوية منخفضة',
    searchTasks: 'ابحث في المهام...',
    add: 'إضافة',
    createTask: 'إنشاء مهمة',
    editTask: 'تعديل المهمة',
    title: 'العنوان',
    description: 'الوصف',
    priority: 'الأولوية',
    status: 'الحالة',
    dueDate: 'تاريخ الاستحقاق',
    cancel: 'إلغاء',
    save: 'حفظ',
    saving: 'جاري الحفظ...',
    delete: 'حذف',
    reopen: 'إعادة فتح',
    quickRequests: 'طلبات سريعة',
    setTask: 'تحديد مهمة',
    workspace: 'مساحة العمل',
    sprintProgress: 'تقدم المرحلة الحالية',
    noTasksFound: 'لم يتم العثور على مهام',
    adminAccessRequired: 'مطلوب صلاحيات الأدمن',
    adminRestrictedNotice: 'هذه الصفحة مخصصة فقط لمديري النظام والأدمن.',
    backToDashboard: 'العودة للرئيسية',
    signInAsAdmin: 'دخول كأدمن',
    registeredUsers: 'المستخدمين المسجلين',
    totalSystemTasks: 'إجمالي مهام النظام',
    userAccountsPermissions: 'حسابات وصلاحيات المستخدمين',
    role: 'الصلاحية',
    makeAdmin: 'ترقية إلى أدمن',
    demoteToUser: 'تخفيض إلى مستخدم',
    currentSession: 'جلستك الحالية',
    tasksCreated: 'المهام المنشأة',
    registered: 'تاريخ التسجيل',
    refreshData: 'تحديث البيانات',
    welcomeToLisso: 'مرحباً بك في Lisso',
    createAccount: 'إنشاء حساب جديد',
    alreadyHaveAccount: 'لديك حساب بالفعل؟ تسجيل الدخول',
    dontHaveAccount: 'ليس لديك حساب؟ أنشئ حساباً الآن',
    demoUserLogin: '👤 مستخدم تجريبي',
    adminUserLogin: '👑 حساب الأدمن',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    tasksSubtitle: 'إدارة وتصفية ومتابعة جميع مهامك ومواعيدك',
    allPriorities: 'جميع الأولويات',
    newestFirst: 'الأحدث أولاً',
    oldestFirst: 'الأقدم أولاً',
    dueDateEarliest: 'تاريخ الاستحقاق (الأقرب)',
    priorityHighToLow: 'الأولوية (من الأعلى للأقل)',
    searchByTitle: 'ابحث بالعنوان...',
    retry: 'إعادة المحاولة',
    loadingTasks: 'جاري تحميل المهام...',
    taskTitleDescription: 'عنوان المهمة ووصفها',
    created: 'تاريخ الإنشاء',
    actions: 'إجراءات',
    pending: 'معلقة',
    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة',
    user: 'مستخدم',
    emailAddress: 'عنوان البريد',
    statusAction: 'الحالة / إجراء',
    totalUsers: 'إجمالي المستخدمين',
    totalTasks: 'إجمالي المهام',
    activeAdmins: 'المسؤولون النشطون',
    systemOverview: 'نظرة عامة على النظام وإدارة المستخدمين',
  },
};

type TranslationKey = keyof typeof translations.en;

interface ThemeLanguageContextType {
  language: Language;
  theme: Theme;
  dir: 'ltr' | 'rtl';
  toggleLanguage: () => void;
  toggleTheme: () => void;
  t: (key: TranslationKey) => string;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export function ThemeLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Read saved preferences
    const savedLang = localStorage.getItem('lisso_lang') as Language;
    const savedTheme = localStorage.getItem('lisso_theme') as Theme;

    if (savedLang === 'ar' || savedLang === 'en') {
      setLanguage(savedLang);
    }
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lisso_lang', language);
    localStorage.setItem('lisso_theme', theme);

    // Apply HTML dir and lang
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

    // Apply dark class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [language, theme]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <ThemeLanguageContext.Provider
      value={{
        language,
        theme,
        dir: language === 'ar' ? 'rtl' : 'ltr',
        toggleLanguage,
        toggleTheme,
        t,
      }}
    >
      {children}
    </ThemeLanguageContext.Provider>
  );
}

export function useThemeLang() {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useThemeLang must be used within ThemeLanguageProvider');
  }
  return context;
}
