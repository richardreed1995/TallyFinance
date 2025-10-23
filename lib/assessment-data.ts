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
  options: QuestionOption[]
}

export const questions: Question[] = [
  {
    id: 1,
    question: "What's your age range?",
    options: [
      { label: "Under 40", icon: User, points: 5 },
      { label: "40-54", icon: Briefcase, points: 5 },
      { label: "55-64", icon: TrendingUp, points: 5 },
      { label: "65+", icon: Home, points: 5 },
    ],
  },
  {
    id: 2,
    question: "How often do you review your investment portfolio?",
    options: [
      { label: "Monthly", icon: Calendar, points: 8 },
      { label: "Quarterly", icon: CalendarDays, points: 8 },
      { label: "Annually", icon: CalendarRange, points: 5 },
      { label: "Every few years", icon: CalendarClock, points: 2 },
      { label: "Rarely or never", icon: CalendarX, points: 0 },
    ],
  },
  {
    id: 3,
    question: "How much do you currently have in liquid, investable assets?",
    subtitle: "This includes cash, investments, and pensions, but excludes your primary residence",
    options: [
      { label: "Under £250k", icon: PoundSterling, points: 0, disqualify: true },
      { label: "£250k - £500k", icon: Wallet, points: 5, disqualify: true },
      { label: "£500k - £1m", icon: Banknote, points: 10, tier: "£200" },
      { label: "£1m - £2m", icon: LandPlot, points: 12, tier: "£300" },
      { label: "£2m - £5m", icon: Building2, points: 15, tier: "£500" },
      { label: "£5m+", icon: Landmark, points: 15, tier: "£500" },
    ],
  },
  {
    id: 4,
    question: "How are your assets currently spread?",
    options: [
      { label: "All in cash/savings accounts", icon: Wallet, points: 2 },
      { label: "Mostly in one property or single asset", icon: Home, points: 4 },
      { label: "Across 2-3 different asset types", icon: BarChart3, points: 6 },
      { label: "Well diversified across 4+ asset types", icon: Globe, points: 10 },
      { label: "I'm not sure", icon: HelpCircle, points: 0 },
    ],
  },
  {
    id: 5,
    question: "What percentage in total fees do you pay annually on your investments?",
    subtitle: "Including platform fees, fund charges, and adviser fees",
    options: [
      { label: "Under 0.5%", icon: CheckCircle, points: 8 },
      { label: "0.5% - 1%", icon: TrendingUp, points: 6 },
      { label: "1% - 1.5%", icon: AlertTriangle, points: 3 },
      { label: "Over 1.5%", icon: AlertCircle, points: 1 },
      { label: "I don't know", icon: HelpCircle, points: 0 },
    ],
  },
  {
    id: 6,
    question: "Which tax-efficient vehicles are you currently using?",
    subtitle: "Select all that apply",
    multiSelect: true,
    options: [
      { label: "ISAs (stocks & shares or cash)", icon: Square, points: 2 },
      { label: "Pension contributions (SIPP/workplace)", icon: Square, points: 2 },
      { label: "VCT/EIS investments", icon: Square, points: 2 },
      { label: "Offshore bonds/structures", icon: Square, points: 2 },
      { label: "Capital gains tax planning", icon: Square, points: 2 },
      { label: "Inheritance tax planning", icon: Square, points: 2 },
      { label: "None of the above", icon: Square, points: 0 },
    ],
  },
  {
    id: 7,
    question: "Do you currently work with a professional wealth manager?",
    options: [
      { label: "Yes, and I have regular reviews", icon: CheckCircle, points: 10 },
      { label: "Yes, but I rarely hear from them", icon: AlertTriangle, points: 4 },
      { label: "No, I manage everything myself", icon: Wrench, points: 3 },
      { label: "No, but I'm actively looking for one", icon: Flame, points: 7, hotLead: true },
      { label: "I used to but stopped", icon: TrendingDown, points: 2 },
    ],
  },
  {
    id: 8,
    question: "How prepared are you for retirement?",
    options: [
      { label: "I have a detailed plan and am on track", icon: CheckCircle, points: 10 },
      { label: "I have a rough plan", icon: FileText, points: 6 },
      { label: "I'm saving but no formal plan", icon: PiggyBank, points: 3 },
      { label: "I haven't really thought about it", icon: HelpCircle, points: 0 },
      { label: "I'm already retired", icon: Palmtree, points: 10 },
    ],
  },
  {
    id: 9,
    question: "Do you have an estate plan in place?",
    subtitle: "For inheritance, trusts, passing wealth to family",
    options: [
      { label: "Yes, comprehensive and recently updated", icon: CheckCircle, points: 8 },
      { label: "Yes, but not reviewed in 5+ years", icon: AlertTriangle, points: 4 },
      { label: "Basic will only", icon: FileText, points: 2 },
      { label: "No, nothing in place", icon: XCircle, points: 0 },
      { label: "Not applicable (too young/no family)", icon: Minus, points: 5 },
    ],
  },
  {
    id: 10,
    question: "How clear are you on your investment strategy and risk tolerance?",
    options: [
      { label: "Very clear - I have documented investment objectives", icon: Target, points: 7 },
      { label: "Fairly clear", icon: ThumbsUp, points: 5 },
      { label: "Somewhat unclear", icon: Gauge, points: 2 },
      { label: "Not clear at all", icon: XCircle, points: 0 },
    ],
  },
  {
    id: 11,
    question: "How many different pension pots do you have?",
    options: [
      { label: "1 consolidated pension", icon: CheckCircle, points: 6 },
      { label: "2 pensions", icon: Layers, points: 5 },
      { label: "3-4 pensions", icon: AlertTriangle, points: 2 },
      { label: "5+ pensions", icon: AlertCircle, points: 0 },
      { label: "I'm not sure", icon: HelpCircle, points: 0 },
    ],
  },
  {
    id: 12,
    question: "What's your current approach to growing your wealth?",
    options: [
      { label: "Active strategy with regular rebalancing", icon: Target, points: 8 },
      { label: "Passive buy-and-hold strategy", icon: TrendingUp, points: 6 },
      { label: "I add money regularly but don't adjust strategy", icon: ArrowUpCircle, points: 4 },
      { label: "Mostly sitting in cash waiting for the 'right time'", icon: Clock, points: 1 },
      { label: "No real strategy", icon: XCircle, points: 0 },
    ],
  },
  {
    id: 13,
    question: "How diversified is your wealth across currencies and markets?",
    options: [
      { label: "Multi-currency holdings across 3+ regions", icon: Globe2, points: 7 },
      { label: "Holdings in 2 currencies/regions", icon: Globe, points: 5 },
      { label: "Mostly GBP/UK focused", icon: MapPin, points: 3 },
      { label: "Everything in one currency and market", icon: Navigation, points: 0 },
      { label: "Not sure", icon: HelpCircle, points: 1 },
    ],
  },
]
