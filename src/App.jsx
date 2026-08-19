import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Home, BookOpen, Sparkles, CheckSquare, Calendar as CalendarIcon, Megaphone, Compass, Award, MessageSquare, User,
  Layers, ClipboardList, FileText, HelpCircle, Users, GraduationCap, Building2, UtensilsCrossed, Library as LibraryIcon,
  Store, AlertTriangle, BarChart3, Settings, Search, Bell, ChevronRight, ChevronLeft, X, Plus, Send, Clock, MapPin,
  CheckCircle2, Circle, AlertCircle, TrendingUp, Zap, ShoppingCart, Minus, BookMarked, Trophy, Shield, Star,
  ArrowRight, Menu, LogOut, RefreshCw, Filter, Mail, Phone, Flame, Siren, CloudRain, HeartPulse, ChevronDown,
  Rocket, Target, Wallet, PackageCheck, Loader2
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

/* ============================================================================
   DESIGN TOKENS
   Primary: Midnight Navy #0B1B3A · Secondary: Electric Blue #2F6FED
   Accent: Emerald #10B981 · Warning: Amber #F5A524 · Danger: #EF4444
   Background: #F5F7FA · Card: #FFFFFF · Text: #12172B / #5B6478
============================================================================ */
const T = {
  navy: "#0B1B3A",
  navySoft: "#132A52",
  blue: "#2F6FED",
  blueSoft: "#EAF1FE",
  emerald: "#10B981",
  emeraldSoft: "#E6F8F1",
  amber: "#F5A524",
  amberSoft: "#FEF3E0",
  red: "#EF4444",
  redSoft: "#FDECEC",
  bg: "#F5F7FA",
  card: "#FFFFFF",
  text: "#12172B",
  sub: "#5B6478",
  line: "#E7EAF0",
};

const fontStack = `
  .cc-root { font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif; color:${T.text}; }
  .cc-display { font-family: 'Manrope', 'Inter', ui-sans-serif, system-ui, sans-serif; }
  .cc-scroll::-webkit-scrollbar { width:6px; height:6px; }
  .cc-scroll::-webkit-scrollbar-thumb { background:#D7DCE6; border-radius:8px; }
  @keyframes ccFadeUp { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
  .cc-fade { animation: ccFadeUp .35s ease both; }
  @keyframes ccPulse { 0%,100%{opacity:1} 50%{opacity:.55} }
  .cc-pulse { animation: ccPulse 1.6s ease-in-out infinite; }
  @keyframes ccIn { from{opacity:0; transform:scale(.97)} to{opacity:1; transform:scale(1)} }
  .cc-modal { animation: ccIn .18s ease both; }
  .cc-input { width:100%; font-size:13.5px; padding:10px 12px; border-radius:12px; border:1px solid ${T.line}; outline:none; background:white; }
  .cc-input:focus { border-color:${T.blue}; box-shadow: 0 0 0 3px ${T.blueSoft}; }
`;

/* ============================================================================
   MOCK DATA
============================================================================ */
const STUDENT = { name: "Archisha Tripathy", grade: "11", cls: "11-A", school: "Indian Language School", avatar: "PA" };

const SUBJECTS = [
  { id: "phy", name: "Physics", teacher: "Dr. Mohan, Mr. Sunday", progress: 78, color: T.blue, assignments: 2, materials: 14 },
  { id: "chem", name: "Chemistry", teacher: "Mrs. Lakhanpal, Dr. Soni", progress: 64, color: T.emerald, assignments: 1, materials: 11 },
  { id: "math", name: "Mathematics", teacher: "Mr. Sunday, Mrs. Vaid, Mrs. Dhawan ", progress: 82, color: T.amber, assignments: 1, materials: 20 },
  { id: "info", name: "Informatics", teacher: "Mrs. Sharmila", progress: 91, color: "#8B5CF6", assignments: 0, materials: 9 },
];

const initialAssignments = [
  { id: "a1", title: "Projectile Motion Problem Set", subject: "Physics", teacher: "Mr. Adebayo", assigned: "Aug 15", due: "Today, 11:59 PM", priority: "High", est: "45 min", status: "In progress" },
  { id: "a2", title: "Titration Lab Report", subject: "Chemistry", teacher: "Mrs. Okafor", assigned: "Aug 14", due: "Tomorrow, 3:00 PM", priority: "High", est: "1h 15m", status: "Not started" },
  { id: "a3", title: "Quadratic Functions Worksheet", subject: "Mathematics", teacher: "Mr. Balogun", assigned: "Aug 13", due: "Aug 22, 9:00 AM", priority: "Medium", est: "30 min", status: "Not started" },
  { id: "a4", title: "Python Loops Mini-Project", subject: "Informatics", teacher: "Ms. Chinwe", assigned: "Aug 10", due: "Aug 19, 5:00 PM", priority: "Low", est: "50 min", status: "Submitted" },
  { id: "a5", title: "Thermodynamics Reading Response", subject: "Physics", teacher: "Mr. Adebayo", assigned: "Aug 8", due: "Aug 12", priority: "Medium", est: "20 min", status: "Completed" },
];

const initialTasks = [
  { id: "t1", title: "Finish robotics CAD model", category: "Robotics Club", due: "Today, 8:00 PM", est: "1h", priority: "High", done: false },
  { id: "t2", title: "Pack kit bag for weekend match", category: "Personal", due: "Tomorrow", est: "15 min", priority: "Low", done: false },
  { id: "t3", title: "Review Chemistry flashcards", category: "Study", due: "Today, 6:00 PM", est: "20 min", priority: "Medium", done: true },
];

const ANNOUNCEMENTS = [
  { id: "n1", title: "School Assembly Tomorrow — 8:15 AM Sharp", sender: "Principal's Office", category: "School", priority: "High", time: "2h ago", read: false, body: "All students are expected in the main hall by 8:15 AM for the term assembly. Attendance will be recorded." },
  { id: "n2", title: "Chemistry Practical Moved to Lab 2", sender: "Mrs. Okafor", category: "Class", priority: "Medium", time: "4h ago", read: false, body: "Tomorrow's practical session has been relocated to Lab 2 due to maintenance in Lab 1." },
  { id: "n3", title: "Robotics Club — New Meeting Time", sender: "Robotics Club", category: "Club", priority: "Low", time: "1d ago", read: true, body: "Weekly meetings now run Thursdays 4:00–5:30 PM in the Innovation Room." },
  { id: "n4", title: "Inter-House Sports Day — Save the Date", sender: "Sports Department", category: "Event", priority: "Medium", time: "2d ago", read: true, body: "Inter-house sports day holds on September 12th. Registration opens next week." },
  { id: "n5", title: "Grade 11 Mock Exam Timetable Released", sender: "Academic Office", category: "Grade", priority: "High", time: "3d ago", read: true, body: "Mock exam timetable is now available under Calendar. Please check for clashes and report immediately." },
];

const OPPORTUNITIES = [
  { id: "o1", title: "National AI Challenge", org: "Nigeria Tech Foundation", category: "Competitions", deadline: "6 days", location: "Nationwide · Online", match: 94, why: ["Grade requirement", "Subject requirement", "Age requirement"] },
  { id: "o2", title: "Young Scientists Scholarship", org: "STEM Africa Trust", category: "Scholarships", deadline: "12 days", location: "Lagos", match: 87, why: ["Subject requirement", "GPA requirement"] },
  { id: "o3", title: "Summer Robotics Internship", org: "Cortex Labs", category: "Internships", deadline: "18 days", location: "Lagos · Hybrid", match: 81, why: ["Skill requirement", "Age requirement"] },
  { id: "o4", title: "Physics Olympiad — Regional Round", org: "Nigerian Physics Society", category: "Olympiads", deadline: "9 days", location: "Lagos", match: 76, why: ["Grade requirement", "Subject requirement"] },
  { id: "o5", title: "Campus Clean-Up Volunteer Drive", org: "Green Campus Initiative", category: "Volunteering", deadline: "3 days", location: "On campus", match: 68, why: ["Open to all grades"] },
  { id: "o6", title: "University Bridge Research Program", org: "University of Lagos", category: "Research", deadline: "21 days", location: "Lagos", match: 59, why: ["Subject requirement"] },
];

const CANTEEN_MENU = [
  { id: "c1", name: "Vada Pav", price: 2000, tag: "Popular", desc: "Spicy classic snack from the state of Maharashtra." },
  { id: "c2", name: "Manchurian", price: 1500, tag: "Quick", desc: "Spicy sauce-coated vegetable or meatballs." },
  { id: "c3", name: "Juice", price: 800, tag: "Light", desc: "Watermelon, pineapple, grapes." },
  { id: "c4", name: "Indomie", price: 700, tag: "Snack", desc: "Instant noodles with spicy sauce." }
 
]
const BOOKS = [
  { id: "b1", title: "Physics — Concepts & Applications", author: "N. Okoro", subject: "Physics", copies: 4, due: null },
  { id: "b2", title: "Organic Chemistry Foundations", author: "A. Bello", subject: "Chemistry", copies: 0, due: "Aug 27" },
  { id: "b3", title: "Precalculus & Trigonometry", author: "R. Adeyemi", subject: "Mathematics", copies: 7, due: null },
  { id: "b4", title: "Introduction to Python", author: "T. Musa", subject: "Informatics", copies: 2, due: null },
  { id: "b5", title: "A Brief History of Time", author: "S. Hawking", subject: "General", copies: 1, due: null },
];

const STORE_PRODUCTS = [
  { id: "p1", name: "A4 Graph Book", price: 600, stock: 120, category: "Stationery" },
  { id: "p2", name: "School Crest Notebook (3-pack)", price: 1500, stock: 64, category: "Stationery" },
  { id: "p3", name: "Scientific Calculator", price: 6500, stock: 18, category: "Equipment" },
  { id: "p4", name: "PE Kit — Grade 11", price: 8500, stock: 9, category: "Uniform" },
  { id: "p5", name: "CampusConnect Hoodie", price: 12000, stock: 27, category: "Merchandise" },
];

const EVENTS = [
  { id: "e1", title: "Chemistry Mock Test", type: "Exam", date: "Aug 24", time: "9:00 AM", location: "Hall B" },
  { id: "e2", title: "Robotics Club Meeting", type: "Club", date: "Aug 21", time: "4:00 PM", location: "Innovation Room" },
  { id: "e3", title: "Inter-House Sports Day", type: "Sports", date: "Sep 12", time: "8:00 AM", location: "Main Field" },
  { id: "e4", title: "National AI Challenge Deadline", type: "Deadline", date: "Aug 25", time: "11:59 PM", location: "Online" },
  { id: "e5", title: "Term Assembly", type: "Assembly", date: "Aug 20", time: "8:15 AM", location: "Main Hall" },
];

const NOTIFICATIONS = [
  { id: "not1", title: "New assignment: Titration Lab Report", type: "Assignment", time: "10 min ago", critical: false },
  { id: "not2", title: "School Assembly Tomorrow — 8:15 AM", type: "Announcement", time: "2h ago", critical: false },
  { id: "not3", title: "Study plan updated for today", type: "StudyBuddy", time: "3h ago", critical: false },
  { id: "not4", title: "94% match: National AI Challenge", type: "Opportunity", time: "5h ago", critical: false },
  { id: "not5", title: "Reminder: Robotics CAD due tonight", type: "Reminder", time: "6h ago", critical: false },
];

const SKILL_PASSPORT = {
  academic: [{ name: "Physics", level: 78 }, { name: "Chemistry", level: 64 }, { name: "Mathematics", level: 82 }],
  technical: [{ name: "Python", level: 85 }, { name: "React", level: 55 }, { name: "Robotics", level: 70 }],
  leadership: [{ name: "Robotics Club — Team Lead", verified: true }, { name: "Sports Day Organizing Committee", verified: true }],
  achievements: [
    { name: "2nd Place — Regional Robotics Challenge", date: "Mar 2026", issuer: "Nigerian Robotics Assoc.", verified: true },
    { name: "Python for Beginners — Certificate", date: "Jan 2026", issuer: "CampusConnect Learn", verified: true },
    { name: "Science Fair Finalist", date: "Nov 2025", issuer: "Indian Language School", verified: false },
  ],
  community: { hours: 24, goal: 40 },
};

const TIMELINE = [
  { time: "08:00", label: "School starts", tag: "School" },
  { time: "09:20", label: "Breakfast break", tag: "Break" },
  { time: "12:20", label: "Lunch break", tag: "Break" },
  { time: "13:35", label: "School ends", tag: "School" },
  { time: "16:00", label: "Study session", tag: "Study" },
  { time: "16:45", label: "Tuition — Mathematics", tag: "Tuition" },
  { time: "19:00", label: "Revision", tag: "Study" },
];

const CLASSES = [
  { id: "cl1", name: "Grade 11 Physics", students: 34, avgProgress: 78, nextClass: "Today, 10:00 AM" },
  { id: "cl2", name: "Grade 11 Maths", students: 18, avgProgress: 85, nextClass: "Tomorrow, 9:00 AM" },
  { id: "cl3", name: "Grade 10 Chemistry", students: 41, avgProgress: 71, nextClass: "Today, 1:30 PM" },
];

const TEACHER_STUDENTS = [
  { id: "s1", name: "Archisha Tripathy", cls: "11-B", avg: 84, submitted: 11, missed: 1 },
  { id: "s2", name: "XYZ", cls: "11-B", avg: 91, submitted: 12, missed: 0 },
  { id: "s3", name: "ABC", cls: "11-B", avg: 67, submitted: 8, missed: 4 },
  { id: "s4", name: "PQR", cls: "11-A", avg: 78, submitted: 10, missed: 2 },
  { id: "s5", name: "OPQ", cls: "11-A", avg: 73, submitted: 9, missed: 3 },
];

const ADMIN_STUDENTS_STAT = { total: 1248, active: 1036 };
const ADMIN_TEACHERS_STAT = { total: 86, active: 79 };

const DELIVERY_DATA = [
  { name: "Delivered", value: 1183 },
  { name: "Pending", value: 17 },
];
const DELIVERY_COLORS = [T.emerald, T.amberSoft];

const ANALYTICS_WEEK = [
  { day: "Mon", active: 780, submissions: 62 },
  { day: "Tue", active: 812, submissions: 71 },
  { day: "Wed", active: 795, submissions: 65 },
  { day: "Thu", active: 860, submissions: 80 },
  { day: "Fri", active: 902, submissions: 88 },
  { day: "Sat", active: 410, submissions: 22 },
  { day: "Sun", active: 350, submissions: 15 },
];

const CANTEEN_FORECAST = [
  { item: "Vada Pav", orders: 72 },
  { item: "Samosa", orders: 43 },
  { item: "Manchurian", orders: 32 },
];

/* ============================================================================
   NAV CONFIG
============================================================================ */
const NAV = {
  student: [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "learn", label: "Learn", icon: BookOpen },
    { id: "studybuddy", label: "StudyBuddy", icon: Sparkles },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "calendar", label: "Calendar", icon: CalendarIcon },
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "opportunities", label: "Opportunities", icon: Compass },
    { id: "campus", label: "Campus", icon: Building2 },
    { id: "passport", label: "Skill Passport", icon: Award },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "profile", label: "Profile", icon: User },
  ],
  teacher: [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "classes", label: "Classes", icon: Layers },
    { id: "assignments", label: "Assignments", icon: ClipboardList },
    { id: "materials", label: "Materials", icon: FileText },
    { id: "quizzes", label: "Quizzes", icon: HelpCircle },
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "students", label: "Students", icon: Users },
    { id: "calendar", label: "Calendar", icon: CalendarIcon },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "profile", label: "Profile", icon: User },
  ],
  admin: [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "students", label: "Students", icon: GraduationCap },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "classes", label: "Classes", icon: Layers },
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "events", label: "Events", icon: CalendarIcon },
    { id: "canteen", label: "Canteen", icon: UtensilsCrossed },
    { id: "library", label: "Library", icon: LibraryIcon },
    { id: "store", label: "Store", icon: Store },
    { id: "emergency", label: "Emergency Center", icon: AlertTriangle },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ],
};

const MOBILE_PRIMARY = {
  student: ["dashboard", "learn", "studybuddy", "opportunities", "campus"],
  teacher: ["dashboard", "classes", "assignments", "students", "messages"],
  admin: ["dashboard", "students", "announcements", "analytics", "emergency"],
};

/* ============================================================================
   PRIMITIVES
============================================================================ */
const cx = (...a) => a.filter(Boolean).join(" ");

function Badge({ children, tone = "neutral", className = "" }) {
  const tones = {
    neutral: { bg: "#EEF1F6", color: T.sub },
    blue: { bg: T.blueSoft, color: T.blue },
    emerald: { bg: T.emeraldSoft, color: "#0B815A" },
    amber: { bg: T.amberSoft, color: "#946200" },
    red: { bg: T.redSoft, color: T.red },
    navy: { bg: "#EAF0FB", color: T.navy },
  };
  const s = tones[tone] || tones.neutral;
  return (
    <span
      className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide", className)}
      style={{ background: s.bg, color: s.color }}
    >
      {children}
    </span>
  );
}

function priorityTone(p) {
  if (p === "High") return "red";
  if (p === "Medium") return "amber";
  return "blue";
}
function statusTone(s) {
  if (s === "Completed" || s === "Submitted") return "emerald";
  if (s === "Overdue") return "red";
  if (s === "In progress") return "amber";
  return "neutral";
}

function Card({ children, className = "", onClick, style }) {
  return (
    <div
      onClick={onClick}
      className={cx(
        "bg-white rounded-2xl border transition-all",
        onClick && "cursor-pointer hover:shadow-md hover:-translate-y-[1px]",
        className
      )}
      style={{ borderColor: T.line, ...style }}
    >
      {children}
    </div>
  );
}

function Button({ children, variant = "primary", size = "md", className = "", icon: Icon, ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-[.97] disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { sm: "text-xs px-3 py-1.5", md: "text-sm px-4 py-2.5", lg: "text-[15px] px-5 py-3" };
  const variants = {
    primary: { background: T.navy, color: "white" },
    accent: { background: T.blue, color: "white" },
    emerald: { background: T.emerald, color: "white" },
    outline: { background: "white", color: T.navy, border: `1px solid ${T.line}` },
    ghost: { background: "transparent", color: T.sub },
    danger: { background: T.red, color: "white" },
  };
  return (
    <button className={cx(base, sizes[size], className)} style={variants[variant]} {...props}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function ProgressBar({ value, color = T.blue, track = "#EEF1F6", height = 8 }) {
  return (
    <div style={{ background: track, height, borderRadius: 999 }}>
      <div style={{ width: `${value}%`, background: color, height, borderRadius: 999, transition: "width .4s ease" }} />
    </div>
  );
}

function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6 cc-fade">
      <div>
        {eyebrow && <div className="text-[11px] font-bold tracking-[0.12em] uppercase mb-1.5" style={{ color: T.blue }}>{eyebrow}</div>}
        <h1 className="cc-display text-[26px] md:text-[30px] font-extrabold leading-tight" style={{ color: T.navy }}>{title}</h1>
        {subtitle && <p className="text-sm mt-1.5" style={{ color: T.sub }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone = "navy", trend }) {
  const tones = {
    navy: { bg: T.navy, fg: "white" },
    blue: { bg: T.blueSoft, fg: T.blue },
    emerald: { bg: T.emeraldSoft, fg: "#0B815A" },
    amber: { bg: T.amberSoft, fg: "#946200" },
  };
  const s = tones[tone];
  return (
    <Card className="p-5 cc-fade">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
          <Icon size={18} color={s.fg} />
        </div>
        {trend && <span className="text-[11px] font-semibold" style={{ color: T.emerald }}>{trend}</span>}
      </div>
      <div className="cc-display text-2xl font-extrabold" style={{ color: T.navy }}>{value}</div>
      <div className="text-[13px] mt-0.5" style={{ color: T.sub }}>{label}</div>
    </Card>
  );
}

function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ background: "rgba(11,27,58,0.45)" }} onClick={onClose}>
      <div
        className="cc-modal bg-white rounded-2xl w-full max-h-[88vh] overflow-y-auto cc-scroll shadow-2xl"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10" style={{ borderColor: T.line }}>
          <h3 className="cc-display font-bold text-lg" style={{ color: T.navy }}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] cc-fade">
      <div className="flex items-center gap-2.5 bg-white shadow-xl rounded-xl px-4 py-3 border" style={{ borderColor: T.line }}>
        <CheckCircle2 size={18} color={T.emerald} />
        <span className="text-sm font-medium" style={{ color: T.navy }}>{toast}</span>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon = CheckCircle2, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 cc-fade">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: T.emeraldSoft }}>
        <Icon size={24} color={T.emerald} />
      </div>
      <div className="font-bold text-[15px]" style={{ color: T.navy }}>{title}</div>
      {subtitle && <div className="text-sm mt-1" style={{ color: T.sub }}>{subtitle}</div>}
    </div>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="cc-display font-bold text-[15px]" style={{ color: T.navy }}>{children}</h2>
      {action}
    </div>
  );
}

/* ============================================================================
   APP ROOT
============================================================================ */
export default function App() {
  const [phase, setPhase] = useState("landing"); // landing | app
  const [role, setRole] = useState("student");
  const [view, setView] = useState("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [assignments, setAssignments] = useState(initialAssignments);
  const [tasks, setTasks] = useState(initialTasks);
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS);
  const [savedOpportunities, setSavedOpportunities] = useState(["o1"]);
  const [cart, setCart] = useState([]); // canteen cart
  const [storeCart, setStoreCart] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);
  const [emergencyActive, setEmergencyActive] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const enterApp = (r) => {
    setRole(r);
    setView("dashboard");
    setPhase("app");
  };

  if (phase === "landing") {
    return (
      <div className="cc-root">
        <style>{fontStack}</style>
        <Landing onEnter={enterApp} />
      </div>
    );
  }

  return (
    <div className="cc-root min-h-[760px]" style={{ background: T.bg }}>
      <style>{fontStack}</style>
      <div className="flex" style={{ minHeight: 760 }}>
        <Sidebar role={role} view={view} setView={setView} setRole={(r) => { setRole(r); setView("dashboard"); }} goLanding={() => setPhase("landing")} />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar
            role={role}
            onMenu={() => setMobileNavOpen(true)}
            onSearch={() => setCmdOpen(true)}
            onNotif={() => setNotifOpen(true)}
            onAI={() => setAiOpen(true)}
          />
          <main className="flex-1 overflow-y-auto cc-scroll px-4 md:px-8 py-6 pb-24 md:pb-8">
            <div className="max-w-6xl mx-auto">
              {role === "student" && (
                <StudentViews
                  view={view} setView={setView}
                  assignments={assignments} setAssignments={setAssignments}
                  tasks={tasks} setTasks={setTasks}
                  announcements={announcements} setAnnouncements={setAnnouncements}
                  savedOpportunities={savedOpportunities} setSavedOpportunities={setSavedOpportunities}
                  cart={cart} setCart={setCart}
                  storeCart={storeCart} setStoreCart={setStoreCart}
                  reservedBooks={reservedBooks} setReservedBooks={setReservedBooks}
                  showToast={showToast}
                />
              )}
              {role === "teacher" && <TeacherViews view={view} setView={setView} assignments={assignments} setAssignments={setAssignments} showToast={showToast} />}
              {role === "admin" && <AdminViews view={view} setView={setView} emergencyActive={emergencyActive} setEmergencyActive={setEmergencyActive} showToast={showToast} />}
            </div>
          </main>
        </div>
      </div>

      <BottomNav role={role} view={view} setView={setView} onMore={() => setMobileNavOpen(true)} />
      {mobileNavOpen && <MobileNav role={role} view={view} setView={(v) => { setView(v); setMobileNavOpen(false); }} onClose={() => setMobileNavOpen(false)} setRole={(r) => { setRole(r); setView("dashboard"); setMobileNavOpen(false); }} goLanding={() => { setPhase("landing"); setMobileNavOpen(false); }} />}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} role={role} setView={setView} assignments={assignments} announcements={announcements} />
      <NotificationDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
      <GlobalAI open={aiOpen} onClose={() => setAiOpen(false)} role={role} />
      <Toast toast={toast} />
    </div>
  );
}

/* ============================================================================
   LANDING PAGE
============================================================================ */
function Landing({ onEnter }) {
  return (
    <div style={{ background: T.navy, color: "white" }} className="min-h-[900px]">
      <style>{`
        .grain { background-image: radial-gradient(circle at 20% 20%, rgba(47,111,237,0.25), transparent 40%), radial-gradient(circle at 85% 10%, rgba(16,185,129,0.18), transparent 35%); }
      `}</style>
      <div className="grain">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: T.blue }}>
              <Zap size={16} color="white" />
            </div>
            <span className="cc-display font-extrabold text-lg">CampusConnect</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <span>Product</span><span>StudyBuddy</span><span>For Schools</span><span>Pricing</span>
          </div>
          <Button variant="accent" size="sm" onClick={() => onEnter("student")}>Get Started</Button>
        </nav>

        <header className="max-w-4xl mx-auto text-center px-6 pt-16 pb-20 cc-fade">
          <Badge tone="blue" className="mb-6">One campus. One ecosystem.</Badge>
          <h1 className="cc-display font-extrabold leading-[1.05] text-[40px] md:text-[64px] mb-5">
            CampusConnect
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-2">One campus. One ecosystem. Everything connected.</p>
          <p className="text-white/50 max-w-xl mx-auto mb-9 text-[15px]">
            CampusConnect brings learning, communication, opportunities, school services, and student life into one intelligent platform.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button variant="accent" size="lg" icon={Rocket} onClick={() => onEnter("student")}>Explore CampusConnect</Button>
            <Button variant="outline" size="lg" className="!bg-transparent !text-white !border-white/25" onClick={() => onEnter("admin")}>See How It Works</Button>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-6 pb-20">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur p-6 md:p-10 grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-red-300 mb-3">The Problem</div>
              <h3 className="cc-display text-2xl font-bold mb-3">Information is scattered.</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Homework on one platform. Announcements buried in email. Club updates on WhatsApp. Competitions on social media.
                Canteen menus shared verbally. School life is fragmented across a dozen disconnected tools — and things get missed.
              </p>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-300 mb-3">The Solution</div>
              <h3 className="cc-display text-2xl font-bold mb-3">One connected ecosystem.</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                CampusConnect unifies assignments, announcements, opportunities, canteen, library, store and communication delivery —
                so nothing important is ever missed again.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: T.bg, color: T.text }} className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: T.blue }}>Built for everyone on campus</div>
            <h2 className="cc-display text-3xl font-extrabold" style={{ color: T.navy }}>Three roles. One ecosystem.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <LandingRoleCard icon={GraduationCap} title="For Students" desc="Learn. Organize. Discover. Grow." cta="Enter as Student" onClick={() => onEnter("student")} accent={T.blue} />
            <LandingRoleCard icon={Users} title="For Teachers" desc="Teach. Communicate. Manage." cta="Enter as Teacher" onClick={() => onEnter("teacher")} accent={T.emerald} />
            <LandingRoleCard icon={Building2} title="For Schools" desc="Connect. Operate. Understand." cta="Enter as Admin" onClick={() => onEnter("admin")} accent={T.amber} />
          </div>
        </div>
      </div>

      <div style={{ background: T.card, color: T.text }} className="py-20 border-t" >
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          <FeatureTeaser icon={Sparkles} title="AI StudyBuddy" desc="A personalized academic assistant that builds your study plan around your real day." />
          <FeatureTeaser icon={Store} title="Campus Marketplace" desc="Canteen. Library. Store. One place to order, reserve, and pick up." />
          <FeatureTeaser icon={Compass} title="Opportunity Radar" desc="Discover competitions, scholarships and internships that actually match you." />
        </div>
      </div>

      <div style={{ background: T.navy }} className="py-20 text-center">
        <h2 className="cc-display text-3xl md:text-4xl font-extrabold text-white mb-6">Your school, connected.</h2>
        <Button variant="accent" size="lg" icon={ArrowRight} onClick={() => onEnter("student")}>Get Started</Button>
      </div>
    </div>
  );
}

function LandingRoleCard({ icon: Icon, title, desc, cta, onClick, accent }) {
  return (
    <Card className="p-7 cc-fade">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: `${accent}1A` }}>
        <Icon size={20} color={accent} />
      </div>
      <h3 className="cc-display font-bold text-lg mb-1.5" style={{ color: T.navy }}>{title}</h3>
      <p className="text-sm mb-5" style={{ color: T.sub }}>{desc}</p>
      <button onClick={onClick} className="text-sm font-semibold flex items-center gap-1.5" style={{ color: accent }}>
        {cta} <ChevronRight size={14} />
      </button>
    </Card>
  );
}
function FeatureTeaser({ icon: Icon, title, desc }) {
  return (
    <div className="cc-fade">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: T.blueSoft }}>
        <Icon size={18} color={T.blue} />
      </div>
      <h4 className="font-bold mb-1.5" style={{ color: T.navy }}>{title}</h4>
      <p className="text-sm" style={{ color: T.sub }}>{desc}</p>
    </div>
  );
}

/* ============================================================================
   NAVIGATION: SIDEBAR / TOPBAR / MOBILE
============================================================================ */
function RoleSwitcherPill({ role, setRole }) {
  const roles = [
    { id: "student", label: "Student", icon: GraduationCap },
    { id: "teacher", label: "Teacher", icon: Users },
    { id: "admin", label: "Admin", icon: Building2 },
  ];
  return (
    <div className="rounded-xl p-1 flex gap-1" style={{ background: "rgba(255,255,255,0.06)" }}>
      {roles.map((r) => {
        const active = r.id === role;
        return (
          <button
            key={r.id}
            onClick={() => setRole(r.id)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-semibold transition-all"
            style={{ background: active ? T.blue : "transparent", color: active ? "white" : "rgba(255,255,255,0.55)" }}
          >
            <r.icon size={13} /> {r.label}
          </button>
        );
      })}
    </div>
  );
}

function Sidebar({ role, view, setView, setRole, goLanding }) {
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0" style={{ background: T.navy }}>
      <div className="px-5 py-5 flex items-center gap-2 cursor-pointer" onClick={goLanding}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: T.blue }}>
          <Zap size={16} color="white" />
        </div>
        <span className="cc-display font-extrabold text-white text-[15px]">CampusConnect</span>
      </div>
      <div className="px-4 mb-4">
        <RoleSwitcherPill role={role} setRole={setRole} />
      </div>
      <nav className="flex-1 overflow-y-auto cc-scroll px-3 space-y-0.5">
        {NAV[role].map((item) => {
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all"
              style={{
                background: active ? "rgba(47,111,237,0.16)" : "transparent",
                color: active ? "#8FB4FF" : "rgba(255,255,255,0.65)",
              }}
            >
              <item.icon size={17} />
              {item.label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: T.blue }} />}
            </button>
          );
        })}
      </nav>
      <div className="p-4 mt-2 mx-3 mb-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: T.blue }}>
            {role === "student" ? STUDENT.avatar : role === "teacher" ? "MA" : "SA"}
          </div>
          <div className="min-w-0">
            <div className="text-white text-[13px] font-semibold truncate">
              {role === "student" ? STUDENT.name : role === "teacher" ? "Mr. Adebayo" : "School Admin"}
            </div>
            <div className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.45)" }}>
              {role === "student" ? `Grade ${STUDENT.grade} · ${STUDENT.cls}` : role === "teacher" ? "Physics Department" : STUDENT.school}
            </div>
          </div>
        </div>
        <button onClick={goLanding} className="w-full mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold py-1.5 rounded-lg" style={{ color: "rgba(255,255,255,0.5)" }}>
          <LogOut size={12} /> Exit demo
        </button>
      </div>
    </aside>
  );
}

function Topbar({ role, onMenu, onSearch, onNotif, onAI }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b px-4 md:px-8 py-3.5 flex items-center gap-3" style={{ borderColor: T.line }}>
      <button className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center border" style={{ borderColor: T.line }} onClick={onMenu}>
        <Menu size={17} />
      </button>
      <div className="hidden md:block text-[13px]" style={{ color: T.sub }}>{today} · {STUDENT.school}</div>
      <button
        onClick={onSearch}
        className="flex-1 md:flex-none md:w-80 flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm ml-auto md:ml-4"
        style={{ borderColor: T.line, color: T.sub, background: T.bg }}
      >
        <Search size={15} />
        <span className="truncate">Search assignments, books, events…</span>
        <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-md border hidden md:inline" style={{ borderColor: T.line }}>⌘K</span>
      </button>
      <button onClick={onAI} className="w-9 h-9 rounded-xl flex items-center justify-center relative" style={{ background: T.blueSoft }}>
        <Sparkles size={16} color={T.blue} />
      </button>
      <button onClick={onNotif} className="w-9 h-9 rounded-xl flex items-center justify-center relative border" style={{ borderColor: T.line }}>
        <Bell size={16} color={T.navy} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: T.red }} />
      </button>
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: T.navy }}>
        {role === "student" ? STUDENT.avatar : role === "teacher" ? "MA" : "SA"}
      </div>
    </header>
  );
}

function BottomNav({ role, view, setView, onMore }) {
  const ids = MOBILE_PRIMARY[role];
  const items = ids.map((id) => NAV[role].find((n) => n.id === id));
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t flex items-stretch" style={{ borderColor: T.line }}>
      {items.map((item) => {
        const active = view === item.id;
        return (
          <button key={item.id} onClick={() => setView(item.id)} className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5">
            <item.icon size={18} color={active ? T.blue : T.sub} />
            <span className="text-[10px] font-medium" style={{ color: active ? T.blue : T.sub }}>{item.label}</span>
          </button>
        );
      })}
      <button onClick={onMore} className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5">
        <Menu size={18} color={T.sub} />
        <span className="text-[10px] font-medium" style={{ color: T.sub }}>More</span>
      </button>
    </nav>
  );
}

function MobileNav({ role, view, setView, onClose, setRole, goLanding }) {
  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <div className="absolute inset-0" style={{ background: "rgba(11,27,58,0.5)" }} onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-72 bg-white cc-modal p-4 overflow-y-auto cc-scroll">
        <div className="flex items-center justify-between mb-4">
          <span className="cc-display font-bold" style={{ color: T.navy }}>Menu</span>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="mb-4 rounded-xl p-1 flex gap-1" style={{ background: T.bg }}>
          {["student", "teacher", "admin"].map((r) => (
            <button key={r} onClick={() => setRole(r)} className="flex-1 rounded-lg py-2 text-[11px] font-semibold capitalize" style={{ background: role === r ? T.navy : "transparent", color: role === r ? "white" : T.sub }}>
              {r}
            </button>
          ))}
        </div>
        <div className="space-y-0.5">
          {NAV[role].map((item) => (
            <button key={item.id} onClick={() => setView(item.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium" style={{ background: view === item.id ? T.blueSoft : "transparent", color: view === item.id ? T.blue : T.text }}>
              <item.icon size={17} /> {item.label}
            </button>
          ))}
        </div>
        <button onClick={goLanding} className="w-full mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium" style={{ color: T.sub }}>
          <LogOut size={16} /> Exit demo
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
   COMMAND PALETTE / NOTIFICATIONS / GLOBAL AI
============================================================================ */
function CommandPalette({ open, onClose, role, setView, assignments, announcements }) {
  const [q, setQ] = useState("");
  useEffect(() => { if (open) setQ(""); }, [open]);
  if (!open) return null;
  const pool = [
    ...NAV[role].map((n) => ({ label: n.label, sub: "Go to page", icon: n.icon, action: () => setView(n.id) })),
    ...assignments.map((a) => ({ label: a.title, sub: `Assignment · ${a.subject}`, icon: ClipboardList, action: () => setView("learn") })),
    ...announcements.map((a) => ({ label: a.title, sub: `Announcement · ${a.category}`, icon: Megaphone, action: () => setView("announcements") })),
    ...BOOKS.map((b) => ({ label: b.title, sub: "Library book", icon: BookMarked, action: () => setView("campus") })),
    ...OPPORTUNITIES.map((o) => ({ label: o.title, sub: "Opportunity", icon: Compass, action: () => setView("opportunities") })),
  ];
  const results = q ? pool.filter((p) => p.label.toLowerCase().includes(q.toLowerCase())).slice(0, 8) : pool.slice(0, 6);
  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center pt-24 px-4" style={{ background: "rgba(11,27,58,0.5)" }} onClick={onClose}>
      <div className="cc-modal w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: T.line }}>
          <Search size={17} color={T.sub} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search assignments, announcements, books, opportunities…"
            className="flex-1 outline-none text-sm"
          />
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md border" style={{ borderColor: T.line, color: T.sub }}>ESC</span>
        </div>
        <div className="max-h-80 overflow-y-auto cc-scroll py-2">
          {results.length === 0 && <div className="px-4 py-8 text-center text-sm" style={{ color: T.sub }}>No results for "{q}"</div>}
          {results.map((r, i) => (
            <button key={i} onClick={() => { r.action(); onClose(); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: T.blueSoft }}>
                <r.icon size={14} color={T.blue} />
              </div>
              <div className="min-w-0">
                <div className="text-[13.5px] font-medium truncate" style={{ color: T.text }}>{r.label}</div>
                <div className="text-[11px]" style={{ color: T.sub }}>{r.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationDrawer({ open, onClose }) {
  if (!open) return null;
  const iconFor = (type) => ({ Assignment: ClipboardList, Announcement: Megaphone, StudyBuddy: Sparkles, Opportunity: Compass, Reminder: Clock }[type] || Bell);
  return (
    <div className="fixed inset-0 z-[75]">
      <div className="absolute inset-0" style={{ background: "rgba(11,27,58,0.45)" }} onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white cc-modal flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: T.line }}>
          <h3 className="cc-display font-bold" style={{ color: T.navy }}>Notifications</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto cc-scroll p-4 space-y-2">
          {NOTIFICATIONS.map((n) => {
            const Icon = iconFor(n.type);
            return (
              <div key={n.id} className="flex gap-3 p-3 rounded-xl border" style={{ borderColor: T.line }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: T.blueSoft }}>
                  <Icon size={15} color={T.blue} />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium leading-snug" style={{ color: T.text }}>{n.title}</div>
                  <div className="text-[11px] mt-1" style={{ color: T.sub }}>{n.type} · {n.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function aiRespond(message, role) {
  const m = message.toLowerCase();
  if (m.includes("assignment") && (m.includes("week") || m.includes("due")))
    return "You have 3 assignments this week: Projectile Motion (Physics, due today), Titration Lab Report (Chemistry, due tomorrow), and Quadratic Functions Worksheet (Mathematics, due Aug 22). Want me to prioritize them for you?";
  if (m.includes("event") && m.includes("tomorrow"))
    return "Tomorrow: Chemistry practical (relocated to Lab 2, 10:00 AM) and Robotics Club meeting at 4:00 PM in the Innovation Room.";
  if (m.includes("opportunit"))
    return "Based on your grade and subjects, your top match is the National AI Challenge at 94%, followed by the Young Scientists Scholarship at 87%. Both close within 2 weeks.";
  if (m.includes("study plan") || m.includes("build me"))
    return "I've drafted a plan using your 3h 20m free window today: Physics (4:00–4:45), Chemistry (4:45–5:15), a break, then Maths (5:30–6:15) and a Chemistry quiz. Open StudyBuddy to fine-tune it.";
  if (m.includes("physics notes") || m.includes("where can i find"))
    return "Physics notes are under Learn → Physics → Materials. Mr. Adebayo uploaded 3 new pages this week on rotational motion.";
  if (m.includes("graph book") || m.includes("available"))
    return "Yes — the Precalculus & Trigonometry title has 7 copies available, and the Graph Book is in stock at the School Store (120 units). Want me to reserve or add to cart?";
  if (m.includes("quiz me"))
    return "Quick one: What is the SI unit of force? (Hint: named after a physicist known for his laws of motion.) Answer whenever you're ready.";
  return "Got it — I'm pulling that together from your dashboard, assignments, and calendar. In the full version I'd give you a precise, personalized answer here.";
}

function GlobalAI({ open, onClose, role }) {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi! I'm your CampusConnect assistant. Ask me about assignments, events, opportunities, or anything on campus." },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  const send = (text) => {
    const t = (text ?? input).trim();
    if (!t) return;
    setMessages((m) => [...m, { from: "user", text: t }]);
    setInput("");
    setTimeout(() => setMessages((m) => [...m, { from: "ai", text: aiRespond(t, role) }]), 500);
  };

  if (!open) return null;
  const prompts = ["What assignments do I have due this week?", "What events are happening tomorrow?", "Find opportunities I'm eligible for.", "Is the graph book available?"];
  return (
    <div className="fixed inset-0 z-[85] flex items-end md:items-center justify-center md:justify-end p-0 md:p-6">
      <div className="absolute inset-0" style={{ background: "rgba(11,27,58,0.35)" }} onClick={onClose} />
      <div className="cc-modal relative w-full md:w-[400px] h-[86vh] md:h-[640px] bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: T.line, background: T.navy }}>
          <div className="flex items-center gap-2">
            <Sparkles size={17} color="#8FB4FF" />
            <span className="text-white font-bold text-sm cc-display">Campus AI Assistant</span>
          </div>
          <button onClick={onClose}><X size={18} color="white" /></button>
        </div>
        <div className="flex-1 overflow-y-auto cc-scroll p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={cx("flex", m.from === "user" ? "justify-end" : "justify-start")}>
              <div
                className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13.5px] leading-relaxed"
                style={m.from === "user" ? { background: T.blue, color: "white" } : { background: T.bg, color: T.text }}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {prompts.map((p) => (
            <button key={p} onClick={() => send(p)} className="text-[11px] font-medium px-2.5 py-1.5 rounded-full border" style={{ borderColor: T.line, color: T.sub }}>
              {p}
            </button>
          ))}
        </div>
        <div className="p-3 border-t flex items-center gap-2" style={{ borderColor: T.line }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask anything about campus…"
            className="flex-1 px-3.5 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: T.line }}
          />
          <button onClick={() => send()} className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: T.navy }}>
            <Send size={15} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   STUDENT VIEWS
============================================================================ */
function StudentViews(props) {
  const { view } = props;
  switch (view) {
    case "dashboard": return <StuDashboard {...props} />;
    case "learn": return <StuLearn {...props} />;
    case "studybuddy": return <StuStudyBuddy {...props} />;
    case "tasks": return <StuTasks {...props} />;
    case "calendar": return <StuCalendar {...props} />;
    case "announcements": return <StuAnnouncements {...props} />;
    case "opportunities": return <StuOpportunities {...props} />;
    case "campus": return <StuCampus {...props} />;
    case "passport": return <StuPassport {...props} />;
    case "messages": return <StuMessages {...props} />;
    case "profile": return <StuProfile {...props} />;
    default: return <StuDashboard {...props} />;
  }
}

function StuDashboard({ assignments, announcements, savedOpportunities, tasks, setView }) {
  const dueToday = assignments.filter((a) => a.status !== "Completed" && a.status !== "Submitted").length;
  const unread = announcements.filter((a) => !a.read).length;
  return (
    <div>
      <PageHeader
        eyebrow="Student · Fully developed 100%"
        title={`Good morning, ${STUDENT.name.split(" ")[0]} 👋`}
        subtitle={`${STUDENT.school} · Grade ${STUDENT.grade} · ${STUDENT.cls}`}
        action={<Badge tone="emerald"><Flame size={12} /> 6-day streak</Badge>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={ClipboardList} label="Assignments due" value={dueToday} tone="blue" />
        <StatCard icon={Megaphone} label="New announcements" value={unread} tone="amber" />
        <StatCard icon={Compass} label="Saved opportunities" value={savedOpportunities.length} tone="emerald" />
        <StatCard icon={Clock} label="Until Chemistry test" value="5 days" tone="navy" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <SectionTitle action={<button onClick={() => setView("calendar")} className="text-xs font-semibold flex items-center gap-1" style={{ color: T.blue }}>Full calendar <ChevronRight size={13} /></button>}>
              Today's Timeline
            </SectionTitle>
            <div className="relative pl-6">
              <div className="absolute left-[7px] top-1 bottom-1 w-px" style={{ background: T.line }} />
              {TIMELINE.map((t, i) => (
                <div key={i} className="relative pb-4 last:pb-0">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 bg-white" style={{ borderColor: T.blue }} />
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[13px] font-semibold" style={{ color: T.navy }}>{t.time}</span>
                      <span className="text-[13px] ml-2" style={{ color: T.sub }}>{t.label}</span>
                    </div>
                    <Badge tone={t.tag === "Study" ? "emerald" : t.tag === "Break" ? "amber" : "blue"}>{t.tag}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle action={<button onClick={() => setView("learn")} className="text-xs font-semibold flex items-center gap-1" style={{ color: T.blue }}>View all <ChevronRight size={13} /></button>}>
              Upcoming Assignments
            </SectionTitle>
            <div className="space-y-2.5">
              {assignments.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: T.line }}>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-semibold truncate" style={{ color: T.navy }}>{a.title}</div>
                    <div className="text-[11.5px] mt-0.5" style={{ color: T.sub }}>{a.subject} · Due {a.due}</div>
                  </div>
                  <Badge tone={priorityTone(a.priority)}>{a.priority}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5" style={{ background: T.navy }}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} color="#8FB4FF" />
              <span className="text-white font-bold text-sm cc-display">AI StudyBuddy</span>
            </div>
            <p className="text-white/60 text-[12.5px] mb-4 leading-relaxed">You have 3h 20m free today. Your plan is ready — Physics, Chemistry, a break, then Maths.</p>
            <Button variant="accent" size="sm" className="w-full" onClick={() => setView("studybuddy")}>Open StudyBuddy</Button>
          </Card>

          <Card className="p-5">
            <SectionTitle>Personal Tasks</SectionTitle>
            <div className="space-y-2">
              {tasks.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center gap-2.5">
                  {t.done ? <CheckCircle2 size={16} color={T.emerald} /> : <Circle size={16} color={T.sub} />}
                  <span className={cx("text-[13px]", t.done && "line-through")} style={{ color: t.done ? T.sub : T.text }}>{t.title}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setView("tasks")} className="text-xs font-semibold mt-3" style={{ color: T.blue }}>Manage tasks →</button>
          </Card>

          <Card className="p-5">
            <SectionTitle>Top Opportunity Match</SectionTitle>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13.5px] font-semibold" style={{ color: T.navy }}>National AI Challenge</span>
              <Badge tone="emerald">94% Match</Badge>
            </div>
            <p className="text-[12px] mb-3" style={{ color: T.sub }}>Deadline: 6 days remaining</p>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setView("opportunities")}>View Opportunities</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---- LEARN ---- */
function StuLearn({ assignments, setAssignments, showToast }) {
  const [subject, setSubject] = useState(null);
  const [openAssignment, setOpenAssignment] = useState(null);

  const markComplete = (id) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "Completed" } : a)));
    showToast("Marked as complete ✓");
    setOpenAssignment(null);
  };

  if (subject) {
    const list = assignments.filter((a) => a.subject === subject.name);
    return (
      <div>
        <button onClick={() => setSubject(null)} className="flex items-center gap-1.5 text-sm font-semibold mb-4" style={{ color: T.blue }}>
          <ChevronLeft size={15} /> Back to Learn
        </button>
        <PageHeader eyebrow={subject.teacher} title={subject.name} subtitle={`${subject.materials} materials · ${subject.progress}% progress`} />
        <Card className="p-5 mb-6">
          <SectionTitle>Progress</SectionTitle>
          <ProgressBar value={subject.progress} color={subject.color} />
        </Card>
        <SectionTitle>Assignments</SectionTitle>
        <div className="space-y-3">
          {list.length === 0 && <EmptyState title="You're all caught up 🎉" subtitle="No assignments for this subject right now." />}
          {list.map((a) => (
            <AssignmentRow key={a.id} a={a} onOpen={() => setOpenAssignment(a)} />
          ))}
        </div>
        <AssignmentModal a={openAssignment} onClose={() => setOpenAssignment(null)} onComplete={markComplete} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader eyebrow="Student · Fully developed 100%" title="Learn" subtitle="Your subjects, materials, and progress in one place." />
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {SUBJECTS.map((s) => (
          <Card key={s.id} className="p-5" onClick={() => setSubject(s)}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}1A` }}>
                <BookOpen size={18} color={s.color} />
              </div>
              <Badge tone="neutral">{s.assignments} due</Badge>
            </div>
            <h3 className="cc-display font-bold" style={{ color: T.navy }}>{s.name}</h3>
            <p className="text-[12.5px] mb-3" style={{ color: T.sub }}>{s.teacher} · {s.materials} materials</p>
            <ProgressBar value={s.progress} color={s.color} />
            <div className="text-[11px] mt-1.5 font-semibold" style={{ color: s.color }}>{s.progress}% complete</div>
          </Card>
        ))}
      </div>

      <SectionTitle>All Assignments</SectionTitle>
      <div className="space-y-3">
        {assignments.map((a) => (
          <AssignmentRow key={a.id} a={a} onOpen={() => setOpenAssignment(a)} />
        ))}
      </div>
      <AssignmentModal a={openAssignment} onClose={() => setOpenAssignment(null)} onComplete={markComplete} />
    </div>
  );
}

function AssignmentRow({ a, onOpen }) {
  return (
    <Card className="p-4 flex items-center justify-between gap-3" onClick={onOpen}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: T.blueSoft }}>
          <ClipboardList size={15} color={T.blue} />
        </div>
        <div className="min-w-0">
          <div className="text-[13.5px] font-semibold truncate" style={{ color: T.navy }}>{a.title}</div>
          <div className="text-[11.5px] mt-0.5" style={{ color: T.sub }}>{a.subject} · {a.teacher} · Due {a.due} · Est. {a.est}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge tone={priorityTone(a.priority)} className="hidden sm:inline-flex">{a.priority}</Badge>
        <Badge tone={statusTone(a.status)}>{a.status}</Badge>
      </div>
    </Card>
  );
}

function AssignmentModal({ a, onClose, onComplete }) {
  const [note, setNote] = useState("");
  if (!a) return null;
  return (
    <Modal open={!!a} onClose={onClose} title={a.title}>
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge tone="blue">{a.subject}</Badge>
        <Badge tone={priorityTone(a.priority)}>{a.priority} priority</Badge>
        <Badge tone={statusTone(a.status)}>{a.status}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm mb-5">
        <div><div className="text-[11px]" style={{ color: T.sub }}>Teacher</div><div className="font-medium">{a.teacher}</div></div>
        <div><div className="text-[11px]" style={{ color: T.sub }}>Assigned</div><div className="font-medium">{a.assigned}</div></div>
        <div><div className="text-[11px]" style={{ color: T.sub }}>Due</div><div className="font-medium">{a.due}</div></div>
        <div><div className="text-[11px]" style={{ color: T.sub }}>Estimated time</div><div className="font-medium">{a.est}</div></div>
      </div>
      <div className="mb-5">
        <label className="text-[12px] font-semibold block mb-1.5" style={{ color: T.navy }}>Personal notes</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Add notes, questions or attachments reference…" className="w-full text-sm p-3 rounded-xl border outline-none" style={{ borderColor: T.line }} />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">Attach work</Button>
        {a.status !== "Completed" && a.status !== "Submitted" && (
          <Button variant="emerald" className="flex-1" icon={CheckCircle2} onClick={() => onComplete(a.id)}>Mark Complete</Button>
        )}
      </div>
    </Modal>
  );
}

/* ---- STUDYBUDDY (AI Study Planner) — fully developed ---- */
function StuStudyBuddy({ assignments, tasks }) {
  const basePlan = [
    { start: "4:00", end: "4:45", title: "Physics Assignment", tag: "Physics", color: T.blue },
    { start: "4:45", end: "5:15", title: "Chemistry Revision", tag: "Chemistry", color: T.emerald },
    { start: "5:15", end: "5:30", title: "Break", tag: "Break", color: T.amber },
    { start: "5:30", end: "6:15", title: "Mathematics Problems", tag: "Mathematics", color: "#8B5CF6" },
    { start: "6:15", end: "6:35", title: "Chemistry Quiz", tag: "Chemistry", color: T.emerald },
  ];
  const [plan, setPlan] = useState(basePlan);
  const [available, setAvailable] = useState("3h 20m");
  const [generating, setGenerating] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi Phoenix! I built today's plan around your Physics and Chemistry deadlines plus your 4:30–6:30 tuition-free window. Want any changes?" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const regenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const shuffled = [...basePlan].sort(() => Math.random() - 0.4);
      setPlan(shuffled.length ? basePlan : basePlan);
      setGenerating(false);
    }, 900);
  };

  const compress = () => {
    setGenerating(true);
    setAvailable("1h 30m");
    setTimeout(() => {
      setPlan([
        { start: "4:00", end: "4:35", title: "Physics Assignment (priority)", tag: "Physics", color: T.blue },
        { start: "4:35", end: "4:45", title: "Break", tag: "Break", color: T.amber },
        { start: "4:45", end: "5:20", title: "Chemistry Lab Report", tag: "Chemistry", color: T.emerald },
        { start: "5:20", end: "5:30", title: "Quick Maths Review", tag: "Mathematics", color: "#8B5CF6" },
      ]);
      setGenerating(false);
    }, 900);
  };

  const send = (text) => {
    const t = (text ?? input).trim();
    if (!t) return;
    setMessages((m) => [...m, { from: "user", text: t }]);
    setInput("");
    setTimeout(() => {
      let reply = aiRespond(t, "student");
      const lower = t.toLowerCase();
      if (lower.includes("90 minutes") || lower.includes("1h 30") || lower.includes("only have")) {
        compress();
        reply = "Got it — compressing your plan into 1h 30m, prioritizing Physics and Chemistry first.";
      } else if (lower.includes("move chemistry")) {
        reply = "Done — I've pushed Chemistry Revision to tomorrow morning and freed up 30 minutes today.";
      } else if (lower.includes("tuition")) {
        reply = "Noted — I've blocked 4:30–6:30 PM for tuition and rebuilt your plan around it.";
        regenerate();
      } else if (lower.includes("most urgent")) {
        reply = "Projectile Motion Problem Set (Physics) is most urgent — it's due today and marked High priority.";
      } else if (lower.includes("high priority") || lower.includes("why is this")) {
        reply = "It's High priority because it's due today, worth significant marks, and builds on tomorrow's Chemistry practical.";
      } else if (lower.includes("thermodynamics")) {
        reply = "Quick one: What state variable stays constant in an isothermal process? (Hint: it's in the name.)";
      }
      setMessages((m) => [...m, { from: "ai", text: reply }]);
    }, 550);
  };

  const totalMinutes = plan.reduce((sum, p) => {
    const [sh, sm] = p.start.split(":").map(Number);
    const [eh, em] = p.end.split(":").map(Number);
    return sum + ((eh * 60 + em) - (sh * 60 + sm));
  }, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Student · Fully developed 100%"
        title="AI StudyBuddy"
        subtitle="Your personalized academic assistant."
        action={<Button variant="outline" icon={RefreshCw} onClick={regenerate} disabled={generating}>{generating ? "Regenerating…" : "Regenerate Plan"}</Button>}
      />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5" style={{ background: T.navy }}>
            <div className="flex items-center justify-between mb-1">
              <span className="cc-display text-white font-bold text-[15px]">You have {available} available today.</span>
              <Badge tone="emerald">{Math.round(totalMinutes)} min planned</Badge>
            </div>
            <p className="text-white/50 text-[12px]">Built from your assignments, exams, and free time windows.</p>
          </Card>

          <Card className="p-5">
            <SectionTitle>Today's AI Study Plan</SectionTitle>
            {generating ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-14 rounded-xl cc-pulse" style={{ background: "#EEF1F6" }} />)}
              </div>
            ) : (
              <div className="space-y-2.5">
                {plan.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border" style={{ borderColor: T.line }}>
                    <div className="w-14 shrink-0 text-center">
                      <div className="text-[12px] font-bold" style={{ color: T.navy }}>{p.start}</div>
                      <div className="text-[10px]" style={{ color: T.sub }}>{p.end}</div>
                    </div>
                    <div className="w-1 self-stretch rounded-full" style={{ background: p.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-semibold truncate" style={{ color: T.navy }}>{p.title}</div>
                    </div>
                    <Badge tone="neutral">{p.tag}</Badge>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => send("I only have 90 minutes today.")}>I only have 90 minutes</Button>
              <Button variant="outline" size="sm" onClick={() => send("I have tuition from 4:30 to 6:30.")}>Add tuition block</Button>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle>Personal Tasks in Plan</SectionTitle>
            <div className="space-y-2">
              {tasks.map((t) => (
                <div key={t.id} className="flex items-center gap-2.5">
                  {t.done ? <CheckCircle2 size={16} color={T.emerald} /> : <Circle size={16} color={T.sub} />}
                  <span className="text-[13px]" style={{ color: T.text }}>{t.title}</span>
                  <Badge tone="neutral" className="ml-auto">{t.category}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-0 flex flex-col h-[560px] overflow-hidden">
          <div className="px-4 py-3.5 border-b flex items-center gap-2" style={{ borderColor: T.line, background: T.navy }}>
            <Sparkles size={15} color="#8FB4FF" />
            <span className="text-white text-sm font-bold cc-display">Ask StudyBuddy</span>
          </div>
          <div className="flex-1 overflow-y-auto cc-scroll p-3.5 space-y-2.5">
            {messages.map((m, i) => (
              <div key={i} className={cx("flex", m.from === "user" ? "justify-end" : "justify-start")}>
                <div className="max-w-[88%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed" style={m.from === "user" ? { background: T.blue, color: "white" } : { background: T.bg, color: T.text }}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="p-2.5 flex flex-wrap gap-1.5 border-t" style={{ borderColor: T.line }}>
            {["What should I study today?", "Which assignment is most urgent?", "Quiz me on thermodynamics."].map((p) => (
              <button key={p} onClick={() => send(p)} className="text-[10.5px] font-medium px-2 py-1 rounded-full border" style={{ borderColor: T.line, color: T.sub }}>{p}</button>
            ))}
          </div>
          <div className="p-3 border-t flex items-center gap-2" style={{ borderColor: T.line }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Message StudyBuddy…" className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: T.line }} />
            <button onClick={() => send()} className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: T.navy }}>
              <Send size={14} color="white" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---- TASKS — fully developed ---- */
function StuTasks({ tasks, setTasks, showToast }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Personal", due: "", est: "20 min", priority: "Medium" });

  const toggle = (id) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const addTask = () => {
    if (!form.title.trim()) return;
    setTasks((prev) => [{ id: "t" + Date.now(), ...form, due: form.due || "No due date", done: false }, ...prev]);
    setModalOpen(false);
    setForm({ title: "", category: "Personal", est: "20 min", priority: "Medium", due: "" });
    showToast("Task added ✓");
  };

  return (
    <div>
      <PageHeader eyebrow="Student · Fully developed 100%" title="Personal Tasks" subtitle="Your own to-dos — StudyBuddy factors these into your plan." action={<Button icon={Plus} onClick={() => setModalOpen(true)}>New Task</Button>} />
      <div className="space-y-3">
        {tasks.length === 0 && <EmptyState title="You're all caught up 🎉" subtitle="Add a personal task to get started." />}
        {tasks.map((t) => (
          <Card key={t.id} className="p-4 flex items-center gap-3.5">
            <button onClick={() => toggle(t.id)}>
              {t.done ? <CheckCircle2 size={20} color={T.emerald} /> : <Circle size={20} color={T.sub} />}
            </button>
            <div className="flex-1 min-w-0">
              <div className={cx("text-[13.5px] font-semibold", t.done && "line-through")} style={{ color: t.done ? T.sub : T.navy }}>{t.title}</div>
              <div className="text-[11.5px] mt-0.5" style={{ color: T.sub }}>{t.category} · Due {t.due} · Est. {t.est}</div>
            </div>
            <Badge tone={priorityTone(t.priority)}>{t.priority}</Badge>
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Personal Task">
        <div className="space-y-4">
          <Field label="Title"><input className="cc-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Finish robotics CAD" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select className="cc-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {["Personal", "Study", "Club", "Sports", "Family"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Priority">
              <select className="cc-input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {["Low", "Medium", "High"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Deadline"><input className="cc-input" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} placeholder="e.g. Today, 8 PM" /></Field>
            <Field label="Estimated duration"><input className="cc-input" value={form.est} onChange={(e) => setForm({ ...form, est: e.target.value })} placeholder="e.g. 30 min" /></Field>
          </div>
          <Button className="w-full" onClick={addTask}>Add Task</Button>
        </div>
      </Modal>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-[12px] font-semibold block mb-1.5" style={{ color: T.navy }}>{label}</label>
      {children}
    </div>
  );
}

/* ---- CALENDAR (skeleton) ---- */
function StuCalendar() {
  return (
    <div>
      <PageHeader eyebrow="Student · Prototype" title="Calendar" subtitle="Exams, clubs, deadlines and events at a glance." />
      <div className="grid md:grid-cols-2 gap-4">
        {EVENTS.map((e) => (
          <Card key={e.id} className="p-4 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0" style={{ background: T.blueSoft }}>
              <span className="text-[10px] font-bold" style={{ color: T.blue }}>{e.date.split(" ")[0]}</span>
              <span className="text-[13px] font-extrabold" style={{ color: T.blue }}>{e.date.split(" ")[1]}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-semibold truncate" style={{ color: T.navy }}>{e.title}</div>
              <div className="text-[11.5px] mt-0.5" style={{ color: T.sub }}>{e.time} · {e.location}</div>
            </div>
            <Badge tone={e.type === "Exam" ? "red" : e.type === "Deadline" ? "amber" : "blue"}>{e.type}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---- ANNOUNCEMENTS — fully developed ---- */
function StuAnnouncements({ announcements, setAnnouncements }) {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);
  const cats = ["All", "School", "Grade", "Class", "Club", "Event", "Emergency"];
  const list = filter === "All" ? announcements : announcements.filter((a) => a.category === filter);

  const markRead = (id) => setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));

  return (
    <div>
      <PageHeader eyebrow="Student · Fully developed 100%" title="Announcements" subtitle="Everything important, in one reliable place." />
      <div className="flex gap-2 mb-5 overflow-x-auto cc-scroll pb-1">
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border" style={{ background: filter === c ? T.navy : "white", color: filter === c ? "white" : T.sub, borderColor: filter === c ? T.navy : T.line }}>
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((a) => (
          <Card
            key={a.id}
            className="p-4 flex items-start gap-3.5"
            onClick={() => { setOpen(a); markRead(a.id); }}
            style={a.priority === "High" && !a.read ? { borderColor: T.red, borderWidth: 1.5 } : {}}
          >
            {!a.read && <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: T.blue }} />}
            {a.read && <span className="mt-1.5 w-2 h-2 shrink-0" />}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13.5px] font-semibold" style={{ color: T.navy }}>{a.title}</span>
                {a.priority === "High" && <Badge tone="red">Important</Badge>}
              </div>
              <div className="text-[11.5px] mt-1" style={{ color: T.sub }}>{a.sender} · {a.category} · {a.time}</div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.title}>
        {open && (
          <div>
            <div className="flex gap-2 mb-4">
              <Badge tone="blue">{open.category}</Badge>
              <Badge tone={priorityTone(open.priority)}>{open.priority}</Badge>
            </div>
            <p className="text-[13px] mb-2" style={{ color: T.sub }}>{open.sender} · {open.time}</p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: T.text }}>{open.body}</p>
            <Button variant="emerald" icon={CheckCircle2} className="w-full" onClick={() => setOpen(null)}>Acknowledge</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ---- OPPORTUNITIES — fully developed ---- */
function StuOpportunities({ savedOpportunities, setSavedOpportunities, showToast }) {
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState(null);
  const cats = ["All", "Competitions", "Hackathons", "Scholarships", "Internships", "Research", "Volunteering", "Olympiads"];
  const list = (cat === "All" ? OPPORTUNITIES : OPPORTUNITIES.filter((o) => o.category === cat)).sort((a, b) => b.match - a.match);

  const toggleSave = (id) => {
    setSavedOpportunities((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    showToast(savedOpportunities.includes(id) ? "Removed from saved" : "Saved ✓");
  };

  return (
    <div>
      <PageHeader eyebrow="Student · Fully developed 100%" title="Opportunity Radar" subtitle="Competitions, scholarships and internships, ranked for you." />
      <Card className="p-5 mb-6" style={{ background: T.navy }}>
        <div className="flex items-center gap-2 mb-2">
          <Target size={16} color="#8FB4FF" />
          <span className="text-white font-bold text-sm cc-display">Recommended for you</span>
        </div>
        <p className="text-white/55 text-[12.5px]">Ranked by eligibility, interests, skills, grade, and deadline urgency.</p>
      </Card>
      <div className="flex gap-2 mb-5 overflow-x-auto cc-scroll pb-1">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border" style={{ background: cat === c ? T.navy : "white", color: cat === c ? "white" : T.sub, borderColor: cat === c ? T.navy : T.line }}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {list.map((o) => (
          <Card key={o.id} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-[15px]" style={{ color: T.navy }}>{o.title}</h3>
                <p className="text-[12px]" style={{ color: T.sub }}>{o.org}</p>
              </div>
              <Badge tone="emerald">{o.match}% Match</Badge>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {o.why.map((w) => (
                <span key={w} className="text-[11px] flex items-center gap-1" style={{ color: T.sub }}><CheckCircle2 size={11} color={T.emerald} />{w}</span>
              ))}
            </div>
            <div className="flex items-center gap-3 text-[11.5px] mb-4" style={{ color: T.sub }}>
              <span className="flex items-center gap-1"><Clock size={12} />{o.deadline} remaining</span>
              <span className="flex items-center gap-1"><MapPin size={12} />{o.location}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setOpen(o)}>View Opportunity</Button>
              <Button variant={savedOpportunities.includes(o.id) ? "emerald" : "primary"} size="sm" className="flex-1" onClick={() => toggleSave(o.id)}>
                {savedOpportunities.includes(o.id) ? "Saved ✓" : "Save"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.title}>
        {open && (
          <div>
            <p className="text-[13px] mb-1" style={{ color: T.sub }}>{open.org} · {open.category}</p>
            <Badge tone="emerald" className="mb-4">{open.match}% Match</Badge>
            <p className="text-sm leading-relaxed mb-4" style={{ color: T.text }}>
              This opportunity aligns closely with your grade, subjects and demonstrated skills. Review eligibility criteria carefully and prepare required documents before the deadline.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm mb-5">
              <div><div className="text-[11px]" style={{ color: T.sub }}>Deadline</div><div className="font-medium">{open.deadline} remaining</div></div>
              <div><div className="text-[11px]" style={{ color: T.sub }}>Location</div><div className="font-medium">{open.location}</div></div>
            </div>
            <Button className="w-full">Start Application</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ---- CAMPUS: Canteen + Library + Store — fully developed ---- */
function StuCampus({ cart, setCart, storeCart, setStoreCart, reservedBooks, setReservedBooks, showToast }) {
  const [tab, setTab] = useState("canteen");
  const tabs = [
    { id: "canteen", label: "Canteen", icon: UtensilsCrossed },
    { id: "library", label: "Library", icon: LibraryIcon },
    { id: "store", label: "Store", icon: Store },
  ];

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((c) => c.id === item.id);
      if (found) return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...item, qty: 1 }];
    });
  };
  const changeQty = (id, delta) => {
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c)).filter((c) => c.qty > 0));
  };
  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);

  const addToStoreCart = (item) => {
    setStoreCart((prev) => {
      const found = prev.find((c) => c.id === item.id);
      if (found) return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...item, qty: 1 }];
    });
    showToast(`${item.name} added to cart`);
  };

  const reserveBook = (b) => {
    if (b.copies === 0) return;
    setReservedBooks((prev) => [...prev, b.id]);
    showToast(`Reserved "${b.title}" ✓`);
  };

  return (
    <div>
      <PageHeader eyebrow="Student · Fully developed 100%" title="Campus" subtitle="Canteen, library and store — all in one place." />
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border" style={{ background: tab === t.id ? T.navy : "white", color: tab === t.id ? "white" : T.sub, borderColor: tab === t.id ? T.navy : T.line }}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "canteen" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SectionTitle>Tomorrow's Menu</SectionTitle>
            <div className="space-y-3">
              {CANTEEN_MENU.map((item) => (
                <Card key={item.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[13.5px]" style={{ color: T.navy }}>{item.name}</span>
                      <Badge tone="neutral">{item.tag}</Badge>
                    </div>
                    <p className="text-[11.5px] mt-0.5" style={{ color: T.sub }}>{item.desc}</p>
                    <p className="text-[13px] font-bold mt-1" style={{ color: T.blue }}>₦{item.price.toLocaleString()}</p>
                  </div>
                  <Button size="sm" icon={Plus} onClick={() => addToCart(item)}>Add</Button>
                </Card>
              ))}
            </div>
          </div>
          <Card className="p-5 h-fit sticky top-20">
            <SectionTitle action={<ShoppingCart size={16} color={T.sub} />}>Your Order</SectionTitle>
            {cart.length === 0 ? <p className="text-sm" style={{ color: T.sub }}>Cart is empty.</p> : (
              <div className="space-y-3 mb-4">
                {cart.map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-sm">
                    <div className="min-w-0">
                      <div className="font-medium truncate" style={{ color: T.navy }}>{c.name}</div>
                      <div className="text-[11px]" style={{ color: T.sub }}>₦{c.price.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => changeQty(c.id, -1)} className="w-6 h-6 rounded-full border flex items-center justify-center" style={{ borderColor: T.line }}><Minus size={11} /></button>
                      <span className="w-4 text-center text-[12px] font-semibold">{c.qty}</span>
                      <button onClick={() => changeQty(c.id, 1)} className="w-6 h-6 rounded-full border flex items-center justify-center" style={{ borderColor: T.line }}><Plus size={11} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between mb-4 pt-3 border-t" style={{ borderColor: T.line }}>
              <span className="text-sm font-semibold">Total</span>
              <span className="font-bold" style={{ color: T.navy }}>₦{cartTotal.toLocaleString()}</span>
            </div>
            <Field label="Pickup time"><select className="cc-input"><option>12:20 PM (Break)</option><option>1:35 PM (After school)</option></select></Field>
            <Button className="w-full mt-3" disabled={cart.length === 0} onClick={() => showToast("Order placed — pickup at 12:20 PM ✓")}>Place Pre-order</Button>
          </Card>
        </div>
      )}

      {tab === "library" && (
        <div>
          <SectionTitle>Search the Library</SectionTitle>
          <div className="grid md:grid-cols-2 gap-4">
            {BOOKS.map((b) => (
              <Card key={b.id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-12 rounded-md flex items-center justify-center shrink-0" style={{ background: T.blueSoft }}>
                    <BookMarked size={16} color={T.blue} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[13px] truncate" style={{ color: T.navy }}>{b.title}</div>
                    <div className="text-[11px]" style={{ color: T.sub }}>{b.author} · {b.subject}</div>
                    <div className="text-[11px] mt-0.5 font-semibold" style={{ color: b.copies > 0 ? T.emerald : T.red }}>
                      {b.copies > 0 ? `${b.copies} copies available` : `All copies out · due ${b.due}`}
                    </div>
                  </div>
                </div>
                <Button size="sm" variant={reservedBooks.includes(b.id) ? "emerald" : "outline"} disabled={b.copies === 0 || reservedBooks.includes(b.id)} onClick={() => reserveBook(b)}>
                  {reservedBooks.includes(b.id) ? "Reserved" : b.copies === 0 ? "Unavailable" : "Reserve"}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "store" && (
        <div>
          <SectionTitle>School Store</SectionTitle>
          <div className="grid md:grid-cols-3 gap-4">
            {STORE_PRODUCTS.map((p) => (
              <Card key={p.id} className="p-4">
                <div className="w-full h-24 rounded-xl mb-3 flex items-center justify-center" style={{ background: T.blueSoft }}>
                  <PackageCheck size={26} color={T.blue} />
                </div>
                <div className="font-semibold text-[13px]" style={{ color: T.navy }}>{p.name}</div>
                <div className="text-[11px] mb-1" style={{ color: T.sub }}>{p.category} · {p.stock} in stock</div>
                <div className="font-bold text-[13px] mb-3" style={{ color: T.blue }}>₦{p.price.toLocaleString()}</div>
                <Button size="sm" variant="outline" className="w-full" icon={ShoppingCart} onClick={() => addToStoreCart(p)}>Add to Cart</Button>
              </Card>
            ))}
          </div>
          {storeCart.length > 0 && (
            <Card className="p-4 mt-5 flex items-center justify-between">
              <span className="text-sm font-medium">{storeCart.reduce((s, c) => s + c.qty, 0)} items in cart</span>
              <span className="font-bold" style={{ color: T.navy }}>₦{storeCart.reduce((s, c) => s + c.qty * c.price, 0).toLocaleString()}</span>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

/* ---- SKILL PASSPORT (skeleton but rich display) ---- */
function StuPassport() {
  return (
    <div>
      <PageHeader eyebrow="Student · Prototype" title="Skill Passport" subtitle="What grades can't show." />
      <Card className="p-6 mb-6" style={{ background: `linear-gradient(135deg, ${T.navy}, #17356B)` }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white" style={{ background: T.blue }}>{STUDENT.avatar}</div>
          <div>
            <div className="text-white font-bold text-lg cc-display">{STUDENT.name}</div>
            <div className="text-white/50 text-sm">Grade {STUDENT.grade} · {STUDENT.school}</div>
          </div>
          <Badge tone="emerald" className="ml-auto"><Shield size={11} /> Verified by School</Badge>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <SectionTitle>Academic</SectionTitle>
          {SKILL_PASSPORT.academic.map((s) => (
            <div key={s.name} className="mb-3">
              <div className="flex justify-between text-[12.5px] mb-1"><span className="font-medium">{s.name}</span><span style={{ color: T.sub }}>{s.level}%</span></div>
              <ProgressBar value={s.level} color={T.blue} />
            </div>
          ))}
        </Card>
        <Card className="p-5">
          <SectionTitle>Technical</SectionTitle>
          {SKILL_PASSPORT.technical.map((s) => (
            <div key={s.name} className="mb-3">
              <div className="flex justify-between text-[12.5px] mb-1"><span className="font-medium">{s.name}</span><span style={{ color: T.sub }}>{s.level}%</span></div>
              <ProgressBar value={s.level} color={T.emerald} />
            </div>
          ))}
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <SectionTitle>Leadership</SectionTitle>
          {SKILL_PASSPORT.leadership.map((l) => (
            <div key={l.name} className="flex items-center gap-2 mb-2 text-[13px]"><Trophy size={14} color={T.amber} />{l.name}{l.verified && <CheckCircle2 size={13} color={T.emerald} />}</div>
          ))}
        </Card>
        <Card className="p-5">
          <SectionTitle>Community</SectionTitle>
          <div className="flex justify-between text-[12.5px] mb-1"><span>Volunteer hours</span><span style={{ color: T.sub }}>{SKILL_PASSPORT.community.hours}/{SKILL_PASSPORT.community.goal}</span></div>
          <ProgressBar value={(SKILL_PASSPORT.community.hours / SKILL_PASSPORT.community.goal) * 100} color={T.amber} />
        </Card>
      </div>

      <SectionTitle>Achievements</SectionTitle>
      <div className="grid md:grid-cols-3 gap-4">
        {SKILL_PASSPORT.achievements.map((a) => (
          <Card key={a.name} className="p-4">
            <Star size={16} color={T.amber} className="mb-2" />
            <div className="font-semibold text-[13px] mb-1" style={{ color: T.navy }}>{a.name}</div>
            <div className="text-[11px]" style={{ color: T.sub }}>{a.issuer} · {a.date}</div>
            {a.verified ? <Badge tone="emerald" className="mt-2">Verified by School</Badge> : <Badge tone="neutral" className="mt-2">Pending verification</Badge>}
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---- MESSAGES (skeleton) ---- */
function StuMessages() {
  const threads = [
    { id: 1, name: "Mrs. Okafor", last: "Please bring your lab report tomorrow.", time: "2h", unread: true },
    { id: 2, name: "Robotics Club", last: "Meeting moved to Thursday 4 PM.", time: "1d", unread: false },
    { id: 3, name: "Mr. Adebayo", last: "Great work on the problem set!", time: "2d", unread: false },
  ];
  const [active, setActive] = useState(threads[0]);
  return (
    <div>
      <PageHeader eyebrow="Student · Prototype" title="Messages" />
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-2 md:col-span-1">
          {threads.map((t) => (
            <button key={t.id} onClick={() => setActive(t)} className="w-full flex items-center gap-3 p-3 rounded-xl text-left" style={{ background: active.id === t.id ? T.blueSoft : "transparent" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: T.navy }}>{t.name[0]}</div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold truncate" style={{ color: T.navy }}>{t.name}</div>
                <div className="text-[11.5px] truncate" style={{ color: T.sub }}>{t.last}</div>
              </div>
              {t.unread && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: T.blue }} />}
            </button>
          ))}
        </Card>
        <Card className="p-5 md:col-span-2 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="font-bold mb-4" style={{ color: T.navy }}>{active.name}</div>
            <div className="text-sm p-3 rounded-xl inline-block" style={{ background: T.bg }}>{active.last}</div>
          </div>
          <div className="flex gap-2 mt-4">
            <input className="cc-input flex-1" placeholder="Type a message… (prototype)" />
            <Button icon={Send}>Send</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---- PROFILE ---- */
function StuProfile() {
  return (
    <div>
      <PageHeader eyebrow="Student · Fully developed 100%" title="Profile" />
      <Card className="p-6 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ background: T.navy }}>{STUDENT.avatar}</div>
        <div>
          <div className="font-bold text-lg" style={{ color: T.navy }}>{STUDENT.name}</div>
          <div className="text-sm" style={{ color: T.sub }}>Grade {STUDENT.grade} · {STUDENT.cls} · {STUDENT.school}</div>
        </div>
      </Card>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <SectionTitle>Subjects</SectionTitle>
          <div className="flex flex-wrap gap-2">{SUBJECTS.map((s) => <Badge key={s.id} tone="blue">{s.name}</Badge>)}</div>
        </Card>
        <Card className="p-5">
          <SectionTitle>Academic Progress</SectionTitle>
          {SUBJECTS.map((s) => (
            <div key={s.id} className="mb-2.5">
              <div className="flex justify-between text-[12px] mb-1"><span>{s.name}</span><span style={{ color: T.sub }}>{s.progress}%</span></div>
              <ProgressBar value={s.progress} color={s.color} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ============================================================================
   TEACHER VIEWS
============================================================================ */
function TeacherViews(props) {
  const { view } = props;
  switch (view) {
    case "dashboard": return <TeaDashboard {...props} />;
    case "classes": return <TeaClasses {...props} />;
    case "assignments": return <TeaAssignments {...props} />;
    case "materials": return <TeaMaterials {...props} />;
    case "quizzes": return <TeaQuizzes {...props} />;
    case "announcements": return <TeaAnnouncements {...props} />;
    case "students": return <TeaStudents {...props} />;
    case "calendar": return <StuCalendar {...props} />;
    case "messages": return <StuMessages {...props} />;
    case "profile": return <TeaProfile {...props} />;
    default: return <TeaDashboard {...props} />;
  }
}

function TeaDashboard({ assignments, setView }) {
  return (
    <div>
      <PageHeader eyebrow="Teacher · Fully developed 100%" title="Good morning, Mr. Adebayo 👋" subtitle="Physics Department · 3 classes today" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Layers} label="Classes today" value="3" tone="blue" />
        <StatCard icon={ClipboardList} label="Assignments open" value={assignments.filter(a=>a.subject==="Physics").length} tone="amber" />
        <StatCard icon={CheckSquare} label="Submissions to grade" value="18" tone="emerald" />
        <StatCard icon={Megaphone} label="Announcements sent" value="4" tone="navy" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle>Today's Classes</SectionTitle>
          <div className="space-y-2.5">
            {CLASSES.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3.5 rounded-xl border" style={{ borderColor: T.line }}>
                <div>
                  <div className="text-[13.5px] font-semibold" style={{ color: T.navy }}>{c.name}</div>
                  <div className="text-[11.5px]" style={{ color: T.sub }}>{c.students} students · {c.nextClass}</div>
                </div>
                <Badge tone="blue">{c.avgProgress}% avg</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle>Quick Actions</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" icon={Plus} onClick={() => setView("assignments")}>Create Assignment</Button>
            <Button variant="outline" size="sm" icon={FileText} onClick={() => setView("materials")}>Upload Material</Button>
            <Button variant="outline" size="sm" icon={HelpCircle} onClick={() => setView("quizzes")}>Create Quiz</Button>
            <Button variant="outline" size="sm" icon={Megaphone} onClick={() => setView("announcements")}>Post Announcement</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function TeaClasses() {
  return (
    <div>
      <PageHeader eyebrow="Teacher · Prototype" title="Classes" />
      <div className="grid md:grid-cols-2 gap-4">
        {CLASSES.map((c) => (
          <Card key={c.id} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold" style={{ color: T.navy }}>{c.name}</h3>
              <Badge tone="blue">{c.students} students</Badge>
            </div>
            <p className="text-[12px] mb-3" style={{ color: T.sub }}>Next class: {c.nextClass}</p>
            <ProgressBar value={c.avgProgress} />
            <div className="text-[11px] mt-1.5 font-semibold" style={{ color: T.blue }}>{c.avgProgress}% average progress</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TeaAssignments({ assignments, setAssignments, showToast }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ subject: "Physics", cls: "Grade 11 Physics", title: "", description: "", due: "", est: "30 min", priority: "Medium" });
  const [justPublished, setJustPublished] = useState(null);

  const publish = () => {
    if (!form.title.trim()) return;
    const newA = { id: "a" + Date.now(), title: form.title, subject: form.subject, teacher: "Mr. Adebayo", assigned: "Today", due: form.due || "In 1 week", priority: form.priority, est: form.est, status: "Not started" };
    setAssignments((prev) => [newA, ...prev]);
    setJustPublished(form.cls);
    setModalOpen(false);
    setForm({ subject: "Physics", cls: "Grade 11 Physics", title: "", description: "", due: "", est: "30 min", priority: "Medium" });
    showToast(`Assignment published to ${form.cls}`);
    setTimeout(() => setJustPublished(null), 4000);
  };

  return (
    <div>
      <PageHeader eyebrow="Teacher · Fully developed 100%" title="Assignments" subtitle="Create, publish and track assignments across your classes." action={<Button icon={Plus} onClick={() => setModalOpen(true)}>Create Assignment</Button>} />
      {justPublished && (
        <Card className="p-4 mb-5 flex items-center gap-2.5" style={{ borderColor: T.emerald, background: T.emeraldSoft }}>
          <CheckCircle2 size={17} color={T.emerald} />
          <span className="text-[13.5px] font-medium" style={{ color: "#0B815A" }}>Assignment successfully published to {justPublished}.</span>
        </Card>
      )}
      <div className="space-y-3">
        {assignments.map((a) => (
          <Card key={a.id} className="p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[13.5px] font-semibold truncate" style={{ color: T.navy }}>{a.title}</div>
              <div className="text-[11.5px] mt-0.5" style={{ color: T.sub }}>{a.subject} · Due {a.due} · Est. {a.est}</div>
            </div>
            <Badge tone={statusTone(a.status)}>{a.status}</Badge>
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Assignment">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Subject"><select className="cc-input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>{SUBJECTS.map((s) => <option key={s.id}>{s.name}</option>)}</select></Field>
            <Field label="Class"><select className="cc-input" value={form.cls} onChange={(e) => setForm({ ...form, cls: e.target.value })}>{CLASSES.map((c) => <option key={c.id}>{c.name}</option>)}</select></Field>
          </div>
          <Field label="Title"><input className="cc-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Q1–10 Kinematics Review" /></Field>
          <Field label="Description"><textarea rows={3} className="cc-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Instructions for students…" /></Field>
          <Field label="Attachments"><div className="border-2 border-dashed rounded-xl p-4 text-center text-[12px]" style={{ borderColor: T.line, color: T.sub }}>Drop files here or click to upload (prototype)</div></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Due date"><input className="cc-input" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} placeholder="Aug 25" /></Field>
            <Field label="Est. time"><input className="cc-input" value={form.est} onChange={(e) => setForm({ ...form, est: e.target.value })} placeholder="30 min" /></Field>
            <Field label="Priority"><select className="cc-input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>{["Low", "Medium", "High"].map((p) => <option key={p}>{p}</option>)}</select></Field>
          </div>
          <Button className="w-full" onClick={publish}>Publish Assignment</Button>
        </div>
      </Modal>
    </div>
  );
}

function TeaMaterials({ showToast }) {
  const materials = [
    { id: 1, title: "Rotational Motion — Slides", subject: "Physics", type: "PDF" },
    { id: 2, title: "Lab Safety Guidelines", subject: "Physics", type: "PDF" },
    { id: 3, title: "Kinematics Practice Sheet", subject: "Physics", type: "DOCX" },
  ];
  return (
    <div>
      <PageHeader eyebrow="Teacher · Prototype" title="Materials" action={<Button icon={Plus} onClick={() => showToast("Material uploaded ✓")}>Upload Material</Button>} />
      <div className="grid md:grid-cols-2 gap-4">
        {materials.map((m) => (
          <Card key={m.id} className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: T.blueSoft }}><FileText size={16} color={T.blue} /></div>
            <div className="min-w-0"><div className="font-semibold text-[13px] truncate" style={{ color: T.navy }}>{m.title}</div><div className="text-[11px]" style={{ color: T.sub }}>{m.subject} · {m.type}</div></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TeaQuizzes({ showToast }) {
  const quizzes = [
    { id: 1, title: "Thermodynamics Quick Check", subject: "Physics", questions: 8, time: "15 min" },
    { id: 2, title: "Kinematics Fundamentals", subject: "Physics", questions: 10, time: "20 min" },
  ];
  return (
    <div>
      <PageHeader eyebrow="Teacher · Prototype" title="Quiz Builder" action={<Button icon={Plus} onClick={() => showToast("Quiz draft created ✓")}>Create Quiz</Button>} />
      <div className="grid md:grid-cols-2 gap-4">
        {quizzes.map((q) => (
          <Card key={q.id} className="p-4">
            <div className="font-semibold text-[13.5px] mb-1" style={{ color: T.navy }}>{q.title}</div>
            <div className="text-[11.5px]" style={{ color: T.sub }}>{q.subject} · {q.questions} questions · {q.time}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TeaAnnouncements({ showToast }) {
  const [text, setText] = useState("");
  return (
    <div>
      <PageHeader eyebrow="Teacher · Prototype" title="Post Announcement" />
      <Card className="p-5 mb-6">
        <Field label="Message"><textarea className="cc-input" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write an announcement for your class…" /></Field>
        <Button className="mt-3" onClick={() => { showToast("Announcement posted ✓"); setText(""); }}>Post Announcement</Button>
      </Card>
      <SectionTitle>Recent</SectionTitle>
      <div className="space-y-3">
        {ANNOUNCEMENTS.filter((a) => a.category === "Class").map((a) => (
          <Card key={a.id} className="p-4"><div className="font-semibold text-[13px]" style={{ color: T.navy }}>{a.title}</div><div className="text-[11px]" style={{ color: T.sub }}>{a.time}</div></Card>
        ))}
      </div>
    </div>
  );
}

function TeaStudents() {
  return (
    <div>
      <PageHeader eyebrow="Teacher · Fully developed 100%" title="Students" subtitle="Grade 11 Physics roster." />
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b" style={{ borderColor: T.line }}>
            {["Name", "Class", "Average", "Submitted", "Missed"].map((h) => <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wide" style={{ color: T.sub }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {TEACHER_STUDENTS.map((s) => (
              <tr key={s.id} className="border-b last:border-0" style={{ borderColor: T.line }}>
                <td className="px-4 py-3 font-medium" style={{ color: T.navy }}>{s.name}</td>
                <td className="px-4 py-3" style={{ color: T.sub }}>{s.cls}</td>
                <td className="px-4 py-3"><Badge tone={s.avg >= 80 ? "emerald" : s.avg >= 70 ? "amber" : "red"}>{s.avg}%</Badge></td>
                <td className="px-4 py-3" style={{ color: T.sub }}>{s.submitted}</td>
                <td className="px-4 py-3" style={{ color: s.missed > 2 ? T.red : T.sub }}>{s.missed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function TeaProfile() {
  return (
    <div>
      <PageHeader eyebrow="Teacher · Prototype" title="Profile" />
      <Card className="p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ background: T.navy }}>MA</div>
        <div><div className="font-bold text-lg" style={{ color: T.navy }}>Mr. Adebayo</div><div className="text-sm" style={{ color: T.sub }}>Physics Department · {STUDENT.school}</div></div>
      </Card>
    </div>
  );
}

/* ============================================================================
   ADMIN VIEWS
============================================================================ */
function AdminViews(props) {
  const { view } = props;
  switch (view) {
    case "dashboard": return <AdmDashboard {...props} />;
    case "students": return <AdmStudents {...props} />;
    case "teachers": return <AdmTeachers {...props} />;
    case "classes": return <TeaClasses {...props} />;
    case "announcements": return <AdmAnnouncements {...props} />;
    case "events": return <StuCalendar {...props} />;
    case "canteen": return <AdmCanteen {...props} />;
    case "library": return <AdmLibrary {...props} />;
    case "store": return <AdmStore {...props} />;
    case "emergency": return <AdmEmergency {...props} />;
    case "analytics": return <AdmAnalytics {...props} />;
    case "settings": return <AdmSettings {...props} />;
    default: return <AdmDashboard {...props} />;
  }
}

function AdmDashboard({ setView }) {
  return (
    <div>
      <PageHeader eyebrow="Administrator · Fully developed 100%" title="Campus Overview" subtitle={STUDENT.school} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={GraduationCap} label="Students" value="1,248" tone="blue" trend="+2.1% this term" />
        <StatCard icon={Users} label="Teachers" value="86" tone="emerald" />
        <StatCard icon={Layers} label="Classes" value="42" tone="amber" />
        <StatCard icon={Bell} label="Notification delivery" value="97.4%" tone="navy" trend="+0.6%" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle action={<button onClick={() => setView("announcements")} className="text-xs font-semibold flex items-center gap-1" style={{ color: T.blue }}>Communication Center <ChevronRight size={13} /></button>}>
            Communication
          </SectionTitle>
          <div className="text-[13px] font-semibold mb-2" style={{ color: T.navy }}>School Assembly Tomorrow</div>
          <DeliveryFunnel />
        </Card>
        <Card className="p-5">
          <SectionTitle>Weekly Active Students</SectionTitle>
          <div className="cc-display text-3xl font-extrabold mb-1" style={{ color: T.navy }}>83%</div>
          <p className="text-[12px]" style={{ color: T.sub }}>1,036 of 1,248 students active this week</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-5">
          <SectionTitle>Academic</SectionTitle>
          <MiniStatRow label="Assignments posted" value="214" />
          <MiniStatRow label="Submission rate" value="89%" />
          <MiniStatRow label="Quiz participation" value="76%" />
        </Card>
        <Card className="p-5">
          <SectionTitle>Campus Services</SectionTitle>
          <MiniStatRow label="Canteen orders (today)" value="147" />
          <MiniStatRow label="Library reservations" value="52" />
          <MiniStatRow label="Store purchases" value="38" />
        </Card>
      </div>
    </div>
  );
}

function MiniStatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0 text-sm" style={{ borderColor: T.line }}>
      <span style={{ color: T.sub }}>{label}</span>
      <span className="font-bold" style={{ color: T.navy }}>{value}</span>
    </div>
  );
}

function DeliveryFunnel() {
  const rows = [
    { label: "Recipients", value: 1200, color: T.navy },
    { label: "Delivered", value: 1183, color: T.blue },
    { label: "Acknowledged", value: 1109, color: T.emerald },
    { label: "Read", value: 1154, color: T.amber },
  ];
  const max = 1200;
  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex justify-between text-[11.5px] mb-1"><span style={{ color: T.sub }}>{r.label}</span><span className="font-semibold" style={{ color: T.navy }}>{r.value.toLocaleString()}</span></div>
          <ProgressBar value={(r.value / max) * 100} color={r.color} />
        </div>
      ))}
      <p className="text-[11px] pt-1" style={{ color: T.sub }}>17 pending delivery — mostly offline devices, retrying automatically.</p>
    </div>
  );
}

function AdmStudents() {
  return (
    <div>
      <PageHeader eyebrow="Administrator · Fully developed 100%" title="Students" subtitle="1,248 enrolled · 1,036 active this week" />
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b" style={{ borderColor: T.line }}>{["Name", "Class", "Average", "Submitted", "Missed"].map((h) => <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wide" style={{ color: T.sub }}>{h}</th>)}</tr></thead>
          <tbody>
            {TEACHER_STUDENTS.map((s) => (
              <tr key={s.id} className="border-b last:border-0" style={{ borderColor: T.line }}>
                <td className="px-4 py-3 font-medium" style={{ color: T.navy }}>{s.name}</td>
                <td className="px-4 py-3" style={{ color: T.sub }}>{s.cls}</td>
                <td className="px-4 py-3"><Badge tone={s.avg >= 80 ? "emerald" : s.avg >= 70 ? "amber" : "red"}>{s.avg}%</Badge></td>
                <td className="px-4 py-3" style={{ color: T.sub }}>{s.submitted}</td>
                <td className="px-4 py-3" style={{ color: s.missed > 2 ? T.red : T.sub }}>{s.missed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function AdmTeachers() {
  const teachers = [
    { name: "Mr. Adebayo", dept: "Physics", classes: 3, rating: 4.8 },
    { name: "Mrs. Okafor", dept: "Chemistry", classes: 4, rating: 4.6 },
    { name: "Mr. Balogun", dept: "Mathematics", classes: 5, rating: 4.9 },
    { name: "Ms. Chinwe", dept: "Informatics", classes: 2, rating: 4.7 },
  ];
  return (
    <div>
      <PageHeader eyebrow="Administrator · Prototype" title="Teachers" subtitle="86 teachers · 79 active this week" />
      <div className="grid md:grid-cols-2 gap-4">
        {teachers.map((t) => (
          <Card key={t.name} className="p-4 flex items-center justify-between">
            <div><div className="font-semibold text-[13.5px]" style={{ color: T.navy }}>{t.name}</div><div className="text-[11.5px]" style={{ color: T.sub }}>{t.dept} · {t.classes} classes</div></div>
            <Badge tone="emerald"><Star size={11} /> {t.rating}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AdmAnnouncements({ showToast }) {
  const [text, setText] = useState("");
  return (
    <div>
      <PageHeader eyebrow="Administrator · Fully developed 100%" title="Communication Center" subtitle="See whether communication actually reached students." />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle>New Announcement</SectionTitle>
          <Field label="Message"><textarea className="cc-input" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Announcement: School Assembly Tomorrow" /></Field>
          <Button className="mt-3" onClick={() => { showToast("Announcement sent to 1,200 students ✓"); setText(""); }}>Send to School</Button>

          <div className="mt-6">
            <SectionTitle>Announcement: School Assembly Tomorrow</SectionTitle>
            <p className="text-[12px] mb-3" style={{ color: T.sub }}>Recipients: 1,200 students</p>
            <DeliveryFunnel />
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle>Recent Announcements</SectionTitle>
          <div className="space-y-2.5">
            {ANNOUNCEMENTS.map((a) => (
              <div key={a.id} className="p-3 rounded-xl border" style={{ borderColor: T.line }}>
                <div className="text-[12.5px] font-semibold" style={{ color: T.navy }}>{a.title}</div>
                <div className="text-[11px] mt-1" style={{ color: T.sub }}>{a.category} · {a.time}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AdmCanteen() {
  return (
    <div>
      <PageHeader eyebrow="Administrator · Fully developed 100%" title="Canteen" subtitle="Tomorrow's demand forecast." />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5">
          <SectionTitle>Tomorrow's Forecast</SectionTitle>
          <div className="cc-display text-3xl font-extrabold mb-1" style={{ color: T.navy }}>147</div>
          <p className="text-[12px]" style={{ color: T.sub }}>Expected orders</p>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <SectionTitle>Demand by Item</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={CANTEEN_FORECAST}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
              <XAxis dataKey="item" tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="orders" fill={T.blue} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function AdmLibrary() {
  return (
    <div>
      <PageHeader eyebrow="Administrator · Prototype" title="Library Inventory" />
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b" style={{ borderColor: T.line }}>{["Title", "Subject", "Copies", "Status"].map((h) => <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wide" style={{ color: T.sub }}>{h}</th>)}</tr></thead>
          <tbody>
            {BOOKS.map((b) => (
              <tr key={b.id} className="border-b last:border-0" style={{ borderColor: T.line }}>
                <td className="px-4 py-3 font-medium" style={{ color: T.navy }}>{b.title}</td>
                <td className="px-4 py-3" style={{ color: T.sub }}>{b.subject}</td>
                <td className="px-4 py-3" style={{ color: T.sub }}>{b.copies}</td>
                <td className="px-4 py-3"><Badge tone={b.copies > 0 ? "emerald" : "red"}>{b.copies > 0 ? "Available" : "Fully reserved"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function AdmStore() {
  return (
    <div>
      <PageHeader eyebrow="Administrator · Prototype" title="School Store" />
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b" style={{ borderColor: T.line }}>{["Product", "Category", "Price", "Stock"].map((h) => <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wide" style={{ color: T.sub }}>{h}</th>)}</tr></thead>
          <tbody>
            {STORE_PRODUCTS.map((p) => (
              <tr key={p.id} className="border-b last:border-0" style={{ borderColor: T.line }}>
                <td className="px-4 py-3 font-medium" style={{ color: T.navy }}>{p.name}</td>
                <td className="px-4 py-3" style={{ color: T.sub }}>{p.category}</td>
                <td className="px-4 py-3" style={{ color: T.sub }}>₦{p.price.toLocaleString()}</td>
                <td className="px-4 py-3"><Badge tone={p.stock > 20 ? "emerald" : "amber"}>{p.stock} units</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function AdmEmergency({ emergencyActive, setEmergencyActive }) {
  const [type, setType] = useState(null);
  const types = [
    { id: "fire", label: "Fire", icon: Flame },
    { id: "security", label: "Security", icon: Shield },
    { id: "medical", label: "Medical", icon: HeartPulse },
    { id: "evac", label: "Evacuation", icon: AlertTriangle },
    { id: "weather", label: "Severe Weather", icon: CloudRain },
    { id: "other", label: "Other", icon: Siren },
  ];
  return (
    <div>
      <PageHeader eyebrow="Administrator · Prototype / Simulation" title="Emergency Center" subtitle="This is a simulation — no real alerts are sent." />
      {!emergencyActive ? (
        <Card className="p-6">
          <SectionTitle>Select Alert Type</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {types.map((t) => (
              <button key={t.id} onClick={() => setType(t.id)} className="flex flex-col items-center gap-2 p-4 rounded-xl border" style={{ borderColor: type === t.id ? T.red : T.line, background: type === t.id ? T.redSoft : "white" }}>
                <t.icon size={20} color={type === t.id ? T.red : T.sub} />
                <span className="text-[12px] font-semibold">{t.label}</span>
              </button>
            ))}
          </div>
          <Button variant="danger" size="lg" className="w-full" icon={AlertTriangle} disabled={!type} onClick={() => setEmergencyActive(true)}>
            ACTIVATE EMERGENCY ALERT
          </Button>
        </Card>
      ) : (
        <Card className="p-6" style={{ borderColor: T.red, borderWidth: 1.5 }}>
          <div className="flex items-center gap-2 mb-5">
            <Siren size={20} color={T.red} className="cc-pulse" />
            <span className="cc-display font-extrabold text-lg" style={{ color: T.red }}>🚨 EMERGENCY ALERT ACTIVE</span>
          </div>
          <SectionTitle>Delivery Channels</SectionTitle>
          <div className="space-y-2.5 mb-6">
            {[["App", 98.7], ["Web", 99.1], ["SMS fallback", 96.4], ["Email fallback", 94.2]].map(([label, val]) => (
              <div key={label}>
                <div className="flex justify-between text-[12px] mb-1"><span style={{ color: T.sub }}>{label}</span><span className="font-semibold">{val}%</span></div>
                <ProgressBar value={val} color={T.red} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm mb-5 p-3 rounded-xl" style={{ background: T.redSoft }}>
            <span style={{ color: T.sub }}>Acknowledged</span><span className="font-bold" style={{ color: T.red }}>91.4%</span>
          </div>
          <Button variant="outline" className="w-full" onClick={() => { setEmergencyActive(false); setType(null); }}>Resolve & Deactivate Alert</Button>
        </Card>
      )}
    </div>
  );
}

function AdmAnalytics() {
  return (
    <div>
      <PageHeader eyebrow="Administrator · Fully developed 100%" title="Analytics" />
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <SectionTitle>Weekly Active Students</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ANALYTICS_WEEK}>
              <defs>
                <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.blue} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={T.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="active" stroke={T.blue} fill="url(#activeGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <SectionTitle>Homework Submissions</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ANALYTICS_WEEK}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="submissions" stroke={T.emerald} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5">
          <SectionTitle>Notification Delivery</SectionTitle>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={DELIVERY_DATA} dataKey="value" innerRadius={45} outerRadius={65} paddingAngle={3}>
                {DELIVERY_DATA.map((d, i) => <Cell key={i} fill={DELIVERY_COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <SectionTitle>Opportunity Engagement</SectionTitle>
          <MiniStatRow label="Applications" value="312" />
          <MiniStatRow label="Saved" value="820" />
          <MiniStatRow label="Participation" value="41%" />
        </Card>
        <Card className="p-5">
          <SectionTitle>Campus Services Usage</SectionTitle>
          <MiniStatRow label="Canteen orders" value="147/day" />
          <MiniStatRow label="Library reservations" value="52/wk" />
          <MiniStatRow label="Store purchases" value="38/wk" />
        </Card>
      </div>
    </div>
  );
}

function AdmSettings() {
  return (
    <div>
      <PageHeader eyebrow="Administrator · Prototype" title="Settings" />
      <Card className="p-5 max-w-lg">
        <SectionTitle>School Profile</SectionTitle>
        <div className="space-y-3">
          <Field label="School name"><input className="cc-input" defaultValue={STUDENT.school} /></Field>
          <Field label="Academic year"><input className="cc-input" defaultValue="2025 / 2026" /></Field>
          <Field label="Time zone"><input className="cc-input" defaultValue="Africa/Lagos (WAT)" /></Field>
        </div>
        <Button className="mt-4">Save Changes</Button>
      </Card>
    </div>
  );
}
