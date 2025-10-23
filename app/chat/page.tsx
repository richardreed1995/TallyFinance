"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { consultationQuestions } from "@/lib/consultation-data"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Send, Mail, Phone, User } from "lucide-react"
import { createChatRecord, updateChatRecord } from "@/app/actions/update-chat"

type MessageRole = "assistant" | "user"

interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
  options?: Array<{ label: string; value: string }>
  inputType?: "text" | "email" | "tel"
  inputPlaceholder?: string
}

interface Answer {
  questionId: number
  answer: string
  points: number
  disqualify?: boolean
  hotLead?: boolean
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [currentInput, setCurrentInput] = useState("")
  const [showInput, setShowInput] = useState(false)
  const [inputType, setInputType] = useState<"text" | "email" | "tel">("text")
  const [inputPlaceholder, setInputPlaceholder] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [collectingDetails, setCollectingDetails] = useState(false)
  const [detailStep, setDetailStep] = useState(0)
  const [askedEmploymentStatus, setAskedEmploymentStatus] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showInput])

  useEffect(() => {
    if (isInitialized || !isMounted) return
    setIsInitialized(true)

    const welcomeMessages: ChatMessage[] = [
      {
        id: "welcome-1",
        role: "assistant",
        content: "Thanks for your interest in finding the right wealth advisor for your needs.",
        timestamp: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      {
        id: "welcome-2",
        role: "assistant",
        content:
          "I'd like to ask you a few quick questions so we can match you with the perfect advisor. This will only take a couple of minutes.",
        timestamp: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      {
        id: "welcome-3",
        role: "assistant",
        content: "What best describes you?",
        timestamp: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        options: [
          { label: "Business owner", value: "Business owner" },
          { label: "Retired", value: "Retired" },
          { label: "Employed", value: "Employed" },
        ],
      },
    ]

    let messageIndex = 0
    const addMessage = () => {
      if (messageIndex < welcomeMessages.length) {
        const currentMessage = welcomeMessages[messageIndex]
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          setMessages((prev) => [...prev, currentMessage])
          messageIndex++
          if (messageIndex < welcomeMessages.length) {
            setTimeout(addMessage, 800)
          }
        }, 600)
      }
    }

    setTimeout(addMessage, 300)
  }, [isInitialized, isMounted])

  const addBotMessage = (content: string, options?: Array<{ label: string; value: string }>) => {
    return new Promise<void>((resolve) => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const message: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content,
          timestamp: new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          options,
        }
        setMessages((prev) => [...prev, message])
        setTimeout(resolve, 300)
      }, 600)
    })
  }

  const addUserMessage = (content: string) => {
    const message: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
    setMessages((prev) => [...prev, message])
  }

  const handleEmploymentStatus = async (status: string) => {
    addUserMessage(status)
    setAskedEmploymentStatus(true)

    const result = await createChatRecord()

    if (result.success && result.id) {
      setSubmissionId(result.id)
      // Update with employment status
      updateChatRecord(result.id, {
        employment_status: status,
        updated_at: new Date().toISOString(),
      })
    }

    await addBotMessage("Great! Before we continue, what's your first name?")
    setShowInput(true)
    setInputType("text")
    setInputPlaceholder("Enter your first name")
  }

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentInput.trim()) return

    const value = currentInput.trim()
    setCurrentInput("")
    setShowInput(false)

    addUserMessage(value)

    if (!firstName) {
      setFirstName(value)
      if (submissionId) {
        updateChatRecord(submissionId, {
          first_name: value,
          updated_at: new Date().toISOString(),
        })
      }
      await addBotMessage(`Great to meet you, ${value}!`)
      showQuestion(0)
    } else if (collectingDetails) {
      handleDetailInput(value)
    }
  }

  const handleDetailInput = async (value: string) => {
    if (detailStep === 0) {
      setLastName(value)
      if (submissionId) {
        updateChatRecord(submissionId, {
          last_name: value,
          updated_at: new Date().toISOString(),
        })
      }
      setDetailStep(1)
      await addBotMessage(`Thanks, ${firstName}! What's your email address?`)
      setShowInput(true)
      setInputType("email")
      setInputPlaceholder("Your email address")
    } else if (detailStep === 1) {
      setEmail(value)
      if (submissionId) {
        updateChatRecord(submissionId, {
          email: value,
          updated_at: new Date().toISOString(),
        })
      }
      setDetailStep(2)
      await addBotMessage("Perfect! And finally, what's your phone number?")
      setShowInput(true)
      setInputType("tel")
      setInputPlaceholder("Your phone number")
    } else if (detailStep === 2) {
      setPhone(value)
      setShowInput(false)
      await submitAndRedirect(value)
    }
  }

  const submitAndRedirect = async (phoneNumber: string) => {
    setIsLoading(true)

    const totalScore = answers.reduce((sum, ans) => sum + ans.points, 0)
    const isDisqualified = answers.some((ans) => ans.disqualify)
    const isHotLead = answers.some((ans) => ans.hotLead)
    const qualified = !isDisqualified

    if (submissionId) {
      updateChatRecord(submissionId, {
        phone: phoneNumber,
        wealth_manager_status: answers[0]?.answer || "",
        investable_assets: answers[1]?.answer || "",
        primary_goal: answers[2]?.answer || "",
        timeline: answers[3]?.answer || "",
        qualified,
        hot_lead: isHotLead,
        score: totalScore,
        updated_at: new Date().toISOString(),
      })
    }

    await addBotMessage(`Thank you, ${firstName}! Let me find the best advisor match for you...`)
    await addBotMessage("Analysing your profile and preferences...")

    setTimeout(() => {
      if (qualified) {
        router.push("/consultation/book")
      } else {
        router.push("/consultation/not-qualified")
      }
    }, 1000)
  }

  const showQuestion = (index: number) => {
    if (index >= consultationQuestions.length) {
      setCollectingDetails(true)
      setDetailStep(0)
      setTimeout(async () => {
        await addBotMessage(
          `Excellent, ${firstName}! Just a few more details so we can connect you with the right advisor.`,
        )
        await addBotMessage("What's your last name?")
        setShowInput(true)
        setInputType("text")
        setInputPlaceholder("Enter your last name")
      }, 400)
      return
    }

    const question = consultationQuestions[index]
    setTimeout(async () => {
      let questionText = question.question
      if (firstName && index === 0) {
        questionText = `${firstName}, ${questionText.charAt(0).toLowerCase()}${questionText.slice(1)}`
      }

      await addBotMessage(
        questionText,
        question.options.map((opt) => ({
          label: opt.label,
          value: opt.label,
        })),
      )
    }, 300)

    setCurrentQuestionIndex(index)
  }

  const handleAnswer = (answer: string) => {
    if (!askedEmploymentStatus && !firstName) {
      handleEmploymentStatus(answer)
      return
    }

    const question = consultationQuestions[currentQuestionIndex]
    const selectedOption = question.options.find((opt) => opt.label === answer)

    if (!selectedOption) return

    addUserMessage(answer)

    const newAnswer = {
      questionId: question.id,
      answer,
      points: selectedOption.points,
      disqualify: selectedOption.disqualify,
      hotLead: selectedOption.hotLead,
    }

    setAnswers((prev) => {
      const updatedAnswers = [...prev, newAnswer]
      if (submissionId) {
        const updateData: Record<string, any> = {
          updated_at: new Date().toISOString(),
        }
        if (currentQuestionIndex === 0) {
          updateData.wealth_manager_status = answer
        } else if (currentQuestionIndex === 1) {
          updateData.investable_assets = answer
        } else if (currentQuestionIndex === 2) {
          updateData.primary_goal = answer
        } else if (currentQuestionIndex === 3) {
          updateData.timeline = answer
        }
        updateChatRecord(submissionId, updateData)
      }
      return updatedAnswers
    })

    setTimeout(() => {
      showQuestion(currentQuestionIndex + 1)
    }, 400)
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="bg-primary text-primary-foreground px-4 py-3 shadow-md">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <Image
              src="/images/design-mode/86c98842-fc79-4478-aca5-55f1d11df1b0_1_20.png"
              alt="Jane"
              width={36}
              height={36}
              className="rounded-full object-cover w-9 h-9"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">Jane @ Vista Private Office</h1>
            <p className="text-sm text-primary-foreground/80">Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4 pb-64">
          {messages.filter(Boolean).map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message?.role === "user" ? "justify-end" : ""} animate-in fade-in duration-300`}
            >
              {message?.role === "assistant" && (
                <Image
                  src="/images/design-mode/86c98842-fc79-4478-aca5-55f1d11df1b0_1_20.png"
                  alt="Jane"
                  width={28}
                  height={28}
                  className="rounded-full flex-shrink-0 mt-1 object-cover w-7 h-7"
                />
              )}
              <div className={`flex flex-col ${message?.role === "user" ? "items-end" : ""} max-w-[75%]`}>
                <div className="flex items-end gap-2 mb-1">
                  {message?.role === "assistant" && (
                    <span className="text-xs text-muted-foreground">{message?.timestamp}</span>
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-2.5 ${
                    message?.role === "assistant"
                      ? "bg-muted text-foreground rounded-tl-none"
                      : "bg-primary text-primary-foreground rounded-tr-none"
                  }`}
                >
                  <p className="text-base leading-relaxed">{message?.content}</p>
                </div>
                {message?.role === "user" && (
                  <span className="text-xs text-muted-foreground mt-1">{message?.timestamp}</span>
                )}
                {message?.options && message.options.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.options.map((option, idx) => (
                      <Button
                        key={idx}
                        onClick={() => handleAnswer(option.value)}
                        variant="default"
                        size="default"
                        className="rounded-lg px-6 py-2.5 hover:scale-105 transition-transform"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 animate-in fade-in duration-300">
              <Image
                src="/images/design-mode/86c98842-fc79-4478-aca5-55f1d11df1b0_1_20.png"
                alt="Jane"
                width={28}
                height={28}
                className="rounded-full flex-shrink-0 object-cover w-7 h-7"
              />
              <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          {showInput && (
            <div className="flex gap-3 animate-in fade-in duration-300 mt-4 mb-48">
              <div className="w-8" />
              <form onSubmit={handleInputSubmit} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  {inputType === "email" && (
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  )}
                  {inputType === "tel" && (
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  )}
                  {inputType === "text" && (
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  )}
                  <Input
                    ref={inputRef}
                    type={inputType}
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder={inputPlaceholder}
                    className="flex-1 rounded-full pl-10 text-base"
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" size="icon" className="rounded-full flex-shrink-0" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}
