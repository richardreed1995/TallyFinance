import type { LucideIcon } from "lucide-react"
import {
  PoundSterling,
  Wallet,
  Banknote,
  LandPlot,
  Building2,
  Landmark,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Flame,
  TrendingDown,
  Target,
  TrendingUp,
  Shield,
  Home,
  Palmtree,
  BarChart3,
  FileText,
} from "lucide-react"

export interface ConsultationOption {
  label: string
  icon: LucideIcon
  points: number
  disqualify?: boolean
  hotLead?: boolean
}

export interface ConsultationQuestion {
  id: number
  question: string
  subtitle?: string
  options: ConsultationOption[]
}

export const consultationQuestions: ConsultationQuestion[] = [
  {
    id: 1,
    question: "Do you currently work with a wealth manager?",
    options: [
      { label: "Yes, and I'm happy with them", icon: CheckCircle, points: 5 },
      { label: "Yes, but considering a change", icon: AlertTriangle, points: 15, hotLead: true },
      { label: "No, I manage everything myself", icon: Wrench, points: 10 },
      { label: "No, actively looking for one", icon: Flame, points: 20, hotLead: true },
      { label: "I used to but stopped", icon: TrendingDown, points: 12, hotLead: true },
    ],
  },
  {
    id: 2,
    question: "What's your primary wealth goal?",
    options: [
      { label: "Grow my wealth", icon: TrendingUp, points: 10 },
      { label: "Preserve and protect my wealth", icon: Shield, points: 10 },
      { label: "Plan for retirement", icon: Palmtree, points: 10 },
      { label: "Pass wealth to next generation", icon: Home, points: 10 },
      { label: "Reduce tax burden", icon: Target, points: 10 },
    ],
  },
  {
    id: 3,
    question: "What's your biggest wealth management challenge?",
    options: [
      { label: "Investment strategy and performance", icon: BarChart3, points: 10 },
      { label: "Tax efficiency and planning", icon: Target, points: 10 },
      { label: "Retirement planning", icon: Palmtree, points: 10 },
      { label: "Estate planning and inheritance", icon: FileText, points: 10 },
    ],
  },
  {
    id: 4,
    question: "How much do you currently have in investable assets?",
    subtitle: "This includes cash, investments, and pensions, but excludes your primary residence",
    options: [
      { label: "Under £250k", icon: PoundSterling, points: 0, disqualify: true },
      { label: "£250k - £500k", icon: Wallet, points: 5, disqualify: true },
      { label: "£500k - £1m", icon: Banknote, points: 10 },
      { label: "£1m - £2m", icon: LandPlot, points: 15 },
      { label: "£2m - £5m", icon: Building2, points: 20 },
      { label: "£5m+", icon: Landmark, points: 25 },
    ],
  },
]
