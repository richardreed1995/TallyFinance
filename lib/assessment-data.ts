import type { LucideIcon } from "lucide-react"
import {
  User,
  Briefcase,
  TrendingUp,
  Home,
  Calendar,
  CalendarDays,
  CalendarRange,
  CalendarClock,
  CalendarX,
  PoundSterling,
  Wallet,
  Banknote,
  LandPlot,
  Building2,
  Landmark,
  HelpCircle,
  BarChart3,
  Globe,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Square,
  Wrench,
  Flame,
  TrendingDown,
  FileText,
  PiggyBank,
  Palmtree,
  XCircle,
  Minus,
  Target,
  ThumbsUp,
  Gauge,
  Layers,
  ArrowUpCircle,
  Clock,
  Globe2,
  MapPin,
  Navigation,
  Building,
  CreditCard,
  Shield,
  Star,
  CheckCircle2,
  Package,
} from "lucide-react"

export interface QuestionOption {
  label: string
  sublabel?: string
  icon: LucideIcon
  points: number
  tier?: string
  disqualify?: boolean
  hotLead?: boolean
}

export interface Question {
  id: number
  question: string
  subtitle?: string
  multiSelect?: boolean
  inputType?: "amount"
  options: QuestionOption[]
}

export const questions: Question[] = [
  {
    id: 1,
    question: "Are you a business owner?",
    options: [
      { label: "Yes", icon: CheckCircle2, points: 10 },
      { label: "No", icon: XCircle, points: 0, disqualify: true },
    ],
  },
  {
    id: 2,
    question: "How much would you like to borrow?",
    inputType: "amount",
    options: [
      { label: "£10k - £50k", icon: Wallet, points: 5 },
      { label: "£50k - £100k", icon: Banknote, points: 7 },
      { label: "£100k - £250k", icon: PoundSterling, points: 8 },
      { label: "£250k - £500k", icon: LandPlot, points: 10 },
      { label: "£500k - £1m", icon: Building2, points: 12 },
      { label: "£1m - £2m", icon: Landmark, points: 15 },
    ],
  },
  {
    id: 3,
    question: "How long have you been trading?",
    options: [
      { label: "24+ months", icon: CalendarRange, points: 10 },
      { label: "12 - 23 months", icon: CalendarDays, points: 5 },
      { label: "0 - 11 months", icon: Calendar, points: 2, disqualify: true },
    ],
  },
  {
    id: 4,
    question: "What is your annual turnover?",
    subtitle: "In the last 12 months (not forecast)",
    inputType: "turnover",
    options: [
      { label: "Under £50k", icon: Wallet, points: 2, disqualify: true },
      { label: "£50k - £100k", icon: Banknote, points: 5 },
      { label: "£100k - £250k", icon: PoundSterling, points: 7 },
      { label: "£250k - £500k", icon: LandPlot, points: 8 },
      { label: "£500k - £1m", icon: Building2, points: 10 },
      { label: "£1m+", icon: Landmark, points: 12 },
    ],
  },
  {
    id: 5,
    question: "Company Type?",
    options: [
      { label: "Limited company", icon: Building, points: 10 },
      { label: "Sole trader", icon: User, points: 8 },
    ],
  },
  {
    id: 6,
    question: "What will the finance be used for?",
    multiSelect: false,
    options: [
      { label: "Working capital", icon: Wallet, points: 3 },
      { label: "Equipment purchase", icon: Wrench, points: 3 },
      { label: "Property purchase", icon: Home, points: 3 },
      { label: "Business expansion", icon: TrendingUp, points: 3 },
      { label: "Debt consolidation", icon: CreditCard, points: 3 },
      { label: "Stock/inventory", icon: Package, points: 3 },
      { label: "Marketing & growth", icon: Target, points: 3 },
      { label: "Other", icon: HelpCircle, points: 2 },
    ],
  },
  {
    id: 7,
    question: "How is your personal credit profile?",
    options: [
      { label: "Excellent", icon: Star, points: 10 },
      { label: "Fair", icon: Gauge, points: 6 },
      { label: "Not the best", icon: AlertTriangle, points: 3 },
    ],
  },
  {
    id: 8,
    question: "Are you a homeowner?",
    subtitle: "Some of our finance products only work with homeowners. No security will be placed on the property.",
    options: [
      { label: "Yes", icon: CheckCircle2, points: 10 },
      { label: "No", icon: XCircle, points: 5 },
    ],
  },
]
