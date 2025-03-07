"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ChevronDown, ChevronUp, X, History, Play, Pause } from "lucide-react"
import { CheckSquare } from "lucide-react"
import ProgressBar from "@/components/ui/progress-bar"
import { Clock, Pencil, Star, ChevronRight, FileText, MessageCircle, LightbulbIcon, Plus, Minus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { SessionTabs } from "./session-tabs"
import { Checkbox } from "@/components/ui/checkbox"
import confetti from 'canvas-confetti'

declare const confetti: any

const getTopicDescription = (topic: string) => {
  switch (topic) {
    case "Stress Management":
      return "Learn techniques to effectively manage and reduce stress in your daily life."
    case "Confidence Building":
      return "Develop strategies to boost your self-confidence and self-esteem."
    case "Goal Setting":
      return "Learn how to set and achieve meaningful personal and professional goals."
    case "Work-Life Balance":
      return "Discover methods to maintain a healthy balance between your work and personal life."
    case "Time Management":
      return "Master techniques to manage your time more efficiently and productively."
    case "Communication Skills":
      return "Improve your ability to communicate effectively in various situations."
    case "Performance Anxiety":
      return "Learn strategies to overcome anxiety related to performance in work or personal situations."
    case "Handling Rejection":
      return "Develop resilience and coping mechanisms for dealing with rejection."
    case "Decision Making":
      return "Enhance your ability to make confident and effective decisions."
    default:
      return "Explore this topic to improve your mental well-being and personal growth."
  }
}

const mentalHealthTopics = [
  {
    category: "Personal Growth",
    topics: ["Stress Management", "Confidence Building", "Goal Setting"],
  },
  {
    category: "Professional Development",
    topics: ["Work-Life Balance", "Time Management", "Communication Skills"],
  },
  {
    category: "Mental Wellness",
    topics: ["Performance Anxiety", "Handling Rejection", "Decision Making"],
  },
]

type Avatar = "male" | "female" | null
type Session = {
  id: number
  date: string
  topic: string
  advisorNotes: string
  advisor: string
}

type SessionSetup = {
  avatar: Avatar
  topic: string
}

export default function AdvisorDashboard() {
  const [sessionSetup, setSessionSetup] = useState<SessionSetup>({ avatar: null, topic: "" })
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [userNotes, setUserNotes] = useState("")
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [checkedItems, setCheckedItems] = useState({
    "practice-mindfulness": false,
    "time-management": false,
    "communication-skills": false,
  })
  const [selectedTab, setSelectedTab] = useState("overview")
  const [levelUpItems, setLevelUpItems] = useState([
    {
      id: 1,
      problem: "Procrastination",
      solution:
        "Implement the Pomodoro Technique: 25 minutes of focused work, followed by a 5-minute break. This helps break tasks into manageable chunks and improves productivity.",
      completed: false,
    },
    {
      id: 2,
      problem: "Negative self-talk",
      solution:
        "Practice daily positive affirmations and challenge negative thoughts. Keep a journal to track and reframe negative self-talk patterns into more constructive and supportive inner dialogues.",
      completed: false,
    },
    {
      id: 3,
      problem: "Irregular sleep schedule",
      solution:
        "Establish a consistent bedtime and wake-up time, even on weekends. Create a relaxing bedtime routine and avoid screens for at least an hour before sleep to improve sleep quality and overall well-being.",
      completed: false,
    },
  ])
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
  const [visibleSessions, setVisibleSessions] = useState(5)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentStage, setCurrentStage] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [sessionDuration, setSessionDuration] = useState(30)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [audioError, setAudioError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])
  
  const sessions: Session[] = [
    {
      id: 1,
      date: new Date().toLocaleDateString(),
      topic: "Stress Management",
      advisorNotes: "User showed progress in stress management techniques.",
      advisor: "Marcus",
    },
    {
      id: 2,
      date: new Date(Date.now() - 86400000).toLocaleDateString(),
      topic: "Work-Life Balance",
      advisorNotes: "Discussed strategies for improving work-life balance.",
      advisor: "Sarah",
    },
    {
      id: 3,
      date: new Date(Date.now() - 172800000).toLocaleDateString(),
      topic: "Goal Setting",
      advisorNotes: "Set SMART goals for the next month.",
      advisor: "Marcus",
    },
    {
      id: 4,
      date: new Date(Date.now() - 259200000).toLocaleDateString(),
      topic: "Performance Anxiety",
      advisorNotes: "Explored techniques to manage performance anxiety.",
      advisor: "Sarah",
    },
    {
      id: 5,
      date: new Date(Date.now() - 345600000).toLocaleDateString(),
      topic: "Communication Skills",
      advisorNotes: "Practiced active listening and assertive communication.",
      advisor: "Marcus",
    },
    {
      id: 6,
      date: new Date(Date.now() - 432000000).toLocaleDateString(),
      topic: "Time Management",
      advisorNotes: "Introduced prioritization techniques and time-blocking method.",
      advisor: "Sarah",
    },
  ]

  const startSession = () => {
    if (sessionSetup.avatar && sessionSetup.topic) {
      setIsSessionActive(true)
      setCurrentStage(1)
    }
  }

  const handleSessionSelect = (sessionId: number) => {
    const session = sessions.find((s) => s.id === sessionId)
    setSelectedSession(selectedSession?.id === sessionId ? null : session || null)
  }

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"))
  }

  const playVoiceSample = (gender: string) => {
    setAudioError(null)
    if (isPlaying === gender) {
      audioRef.current?.pause()
      setIsPlaying(null)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      const audioPath = gender === "male" ? "/audio/male-voice-sample.mp3" : "/audio/female-voice-sample.mp3"
      audioRef.current = new Audio(audioPath)
      audioRef.current.oncanplaythrough = () => {
        audioRef.current?.play().catch((error) => {
          console.error("Error playing audio:", error)
          setIsPlaying(null)
          setAudioError("Failed to play audio. Please try again.")
        })
      }
      audioRef.current.onerror = (e) => {
        console.error("Error loading audio:", e)
        const errorEvent = e as Event & { target: { error: { code: number; message: string } } }
        if (errorEvent.target && errorEvent.target.error) {
          console.error("Audio error code:", errorEvent.target.error.code)
          console.error("Audio error message:", errorEvent.target.error.message)
          setAudioError(`Failed to load audio: ${errorEvent.target.error.message}`)
        } else {
          setAudioError("Failed to load audio. Please check the file path and try again.")
        }
        setIsPlaying(null)
      }
      setIsPlaying(gender)
    }
  }
  const renderTabContent = () => {
    switch (selectedTab) {
      case "overview":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-3 h-3" />
              <span className="text-sm">15 minutes with {selectedSession?.advisor || "Sarah"}</span>
            </div>
            <div className="space-y-2">
              <h4 className="text-[21px] font-bold text-[#5b06be] mb-4">Session Overview</h4>
              <div className="w-full space-y-3">
                <p className="text-[15px] font-semibold text-gray-700">{selectedSession?.advisorNotes}</p>
                <ul className="list-disc list-inside space-y-1 text-[15px] font-semibold text-gray-600">
                  <li>During this session, we explored various strategies to address the client's concerns.</li>
                  <li>We identified key areas for improvement and set actionable goals for the coming week.</li>
                  <li>The client showed good engagement and openness to trying new approaches.</li>
                  <li>We agreed to follow up on progress in our next session and adjust our plan as needed.</li>
                </ul>
              </div>
            </div>
          </div>
        )
      case "key-moments":
        return (
          <div className="space-y-3">
            <h4 className="text-[19px] font-black text-[#fbb350] mb-2">Key Moments</h4>
            <div className="space-y-2">
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-sm">2:15</span>
                </div>
                <h5 className="font-semibold text-[15px] mb-1">Discussion about Morning Routine</h5>
                <p className="text-gray-600 text-sm">Identified key elements of an effective morning routine</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-sm">5:30</span>
                </div>
                <h5 className="font-semibold text-[15px] mb-1">Time Management Techniques</h5>
                <p className="text-gray-600 text-sm">Explored various methods for better time management</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-sm">8:45</span>
                </div>
                <h5 className="font-semibold text-[15px] mb-1">Setting Boundaries</h5>
                <p className="text-gray-600 text-sm">Strategies for maintaining work-life boundaries</p>
              </div>
            </div>
          </div>
        )
        case "transcript":
        return (
          <div className="space-y-4">
            <div className="max-h-[350px] overflow-y-auto p-4 bg-gray-50">
              <h2 className="text-[#5b06be] text-[21px] font-bold mb-4">Call Transcript</h2>
              {[
                {
                  speaker: "You",
                  text: "Hello, this is Jessica from Premier Real Estate Solutions. Am I speaking with Mr. Anderson?",
                  type: "you",
                },
                {
                  speaker: "Homeowner",
                  text: "Yes, this is Robert Anderson speaking.",
                  type: "homeowner",
                },
                {
                  speaker: "You",
                  text: "Great to connect with you, Mr. Anderson. I noticed your property on Oak Street and wanted to discuss some exciting opportunities in today's market. Would now be a good time to chat?",
                  type: "you",
                },
                {
                  speaker: "Homeowner",
                  text: "Yes, I have a few minutes. What kind of opportunities are you referring to?",
                  type: "homeowner",
                },
                {
                  speaker: "You",
                  text: "What's your timeline for selling the property?",
                  type: "you",
                },
              ].map((message, index) => (
                <div key={index} className="flex items-start gap-3 mb-6">
                  {message.type === "you" && <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />}
                  <div className={`flex flex-col flex-1 ${message.type === "homeowner" ? "items-end" : "items-start"}`}>
                    <span className="text-xs text-gray-600 mb-1">{message.speaker}</span>
                    <div
                      className={`${
                        message.type === "you"
                          ? "bg-[#F3F0FF] rounded-[16px] p-3 max-w-[85%]"
                          : "bg-[#fff5e9] rounded-[16px] p-3 max-w-[85%]"
                      } text-[15px] font-semibold text-gray-700`}
                    >
                      {message.text}
                    </div>
                  </div>
                  {message.type === "homeowner" && <div className="w-6 h-6 rounded-full bg-orange-200 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        )
      case "your-notes":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[21px] font-bold text-[#5b06be]">Your Notes</h2>
              <Button
                variant="ghost"
                className="text-[#5b06be] hover:text-[#5b06be]/90 gap-2 font-medium text-[15px]"
                onClick={() => {
                  setIsEditing(!isEditing)
                  if (!userNotes) {
                    setUserNotes(
                      "No notes added yet. Here are some virtual notes:\n\n• Discussed progress on time management techniques\n• Client showed improvement in stress reduction exercises\n• Set goal to practice mindfulness for 10 minutes daily\n• Explored strategies for better work-life balance",
                    )
                  }
                }}
              >
                <Pencil className="w-3 h-3" />
                {isEditing ? "Save Notes" : "Edit Notes"}
              </Button>
            </div>
            <div className="min-h-[150px]">
              {isEditing ? (
                <textarea
                  className="w-full h-full min-h-[150px] p-2 border border-[#ddd] rounded-md text-[15px]"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                />
              ) : userNotes ? (
                <p className="text-[15px] font-semibold text-gray-600">{userNotes}</p>
              ) : (
                <textarea
                  className="w-full h-full min-h-[150px] p-2 border border-[#ddd] rounded-md bg-gray-50 text-[15px] font-semibold text-gray-600"
                  value="No notes added yet. Here are some virtual notes:

• Discussed progress on time management techniques
• Client showed improvement in stress reduction exercises
• Set goal to practice mindfulness for 10 minutes daily
• Explored strategies for better work-life balance"
                  readOnly
                  onClick={() => setIsEditing(true)}
                />
              )}
            </div>
          </div>
        )
      case "level-up":
        return (
          <div className="space-y-4 pb-3">
            <h2 className="text-[21px] font-bold text-[#5b06be] mb-3">Level Up Planning</h2>
            
            {/* Recommendation card */}
            <div className="bg-white rounded-lg border border-[#ddd] overflow-hidden mb-4">
              <div className="bg-[#5b06be] py-1 px-3">
                <h3 className="text-white font-semibold text-[15px]">Our Recommendation</h3>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <div className="bg-[#f0ebff] p-1.5 rounded-lg flex-shrink-0">
                    <Clock className="w-4 h-4 text-[#5b06be]" />
                  </div>
                  <div>
                    <p className="text-gray-700 text-xs">
                      Based on your progress and goals, we recommend:
                    </p>
                    <p className="text-[#5b06be] font-bold text-[15px]">
                      Weekly sessions for the next month
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Areas to improve section */}
            <div>
              <h3 className="text-[19px] font-black text-gray-900 mb-2">Areas to Improve</h3>
              
              <div className="space-y-3">
                {levelUpItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg border border-[#ddd] overflow-hidden">
                    <div className="flex flex-row">
                      {/* Problem section */}
                      <div className="w-1/3 border-r border-[#ddd] p-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="bg-[#ffebeb] p-1 rounded-lg">
                            <AlertTriangle className="w-3 h-3 text-[#ff5252]" />
                          </div>
                          <h4 className="font-medium text-[15px] text-gray-800">{item.problem}</h4>
                        </div>
                        <p className="text-xs text-gray-500 bg-[#f9f9f9] px-1.5 py-0.5 rounded-lg inline-block">
                          Current challenge
                        </p>
                      </div>
                      
                      {/* Solution section */}
                      <div className="w-2/3 p-3">
                        <div className="flex items-start gap-1.5">
                          <div className="bg-[#e8f7ee] p-1 rounded-lg flex-shrink-0">
                            <LightbulbIcon className="w-3 h-3 text-[#33c27f]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-[15px] text-gray-800 mb-1">Solution</h4>
                            <p className="text-sm text-gray-700">{item.solution}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg p-3 border border-[#ddd] flex flex-col justify-between h-full space-y-3 max-w-full overflow-hidden">
      <ProgressBar />
      <Card className="bg-white rounded-xl border border-[#ddd] w-full mb-3">
        {currentStage === 1 && (
          <h2 className="text-[21px] font-bold text-[#5b06be] mb-2 px-4 pt-3">
            1. Select the avatar you want to speak with.
          </h2>
        )}
        <CardHeader className="text-left space-y-2 py-0" />
        <div className="px-4 space-y-2">
          {currentStage === 1 && (
            <div
              className={`w-full transition-opacity duration-300 ease-in-out ${isTransitioning ? "opacity-0" : "opacity-100"}`}
            >
              <div className="flex flex-col md:flex-row justify-center gap-6 p-3 rounded-lg">
                {[
                  {
                    name: "Marcus",
                    gender: "male",
                    description: "Empathetic and solution-focused counselor with 10+ years of experience.",
                    title: "Specializes in solution-focused therapy, helping clients overcome challenges and achieve their goals efficiently."
                  },
                  {
                    name: "Sarah",
                    gender: "female",
                    description: "Compassionate therapist specializing in cognitive-behavioral techniques.",
                    title: "Expert in cognitive-behavioral techniques, guiding clients to reshape thought patterns and behaviors for improved mental well-being."
                  }
                ].map((avatar) => (
                  <div key={avatar.gender} className="p-4 rounded-xl border border-[#ddd] w-full text-left transition-all duration-300 hover:border-[#ccc] hover:bg-[#fbb350]/10">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Avatar section */}
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-white relative mb-3">
                          <img
                            src={avatar.gender === "male"
                              ? "https://res.cloudinary.com/drkudvyog/image/upload/v1736936837/a-4k-portrait-of-a-welcoming-psychologis_jTEXFrX9RbWYuR_RT-j4cw_pJ49vj_zRoWtsmdXImwTyw_rp9p7y.png"
                              : "https://res.cloudinary.com/drkudvyog/image/upload/v1736936837/a-4k-portrait-of-a-compassionate-psychol_FZgjDzHhSayBd1WXqfn0Yg_JQHL4O8cQJusiVDlrhz11A_xcwa5j.png"
                            }
                            alt={`${avatar.name} avatar`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[19px] font-black text-gray-800">{avatar.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              playVoiceSample(avatar.gender)
                            }}
                            className="p-1.5 rounded-full bg-[#fbb350] text-white hover:bg-[#e5a91f] transition-colors"
                          >
                            {isPlaying === avatar.gender ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
  
                      {/* Text section */}
                      <div className="flex-1 flex flex-col">
                        <div className="mb-3">
                          <h3 className="text-[15px] font-semibold text-gray-800 mb-1.5">{avatar.description}</h3>
                          <p className="text-xs text-gray-600">{avatar.title}</p>
                        </div>
                        <div className="mt-auto">
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsTransitioning(true)
                              setSessionSetup({ ...sessionSetup, avatar: avatar.gender as Avatar })
                              setTimeout(() => {
                                setCurrentStage(2)
                                setIsTransitioning(false)
                              }, 300)
                            }}
                            className="bg-[#fbb350] text-white hover:bg-[#e5a91f] px-6 py-2 text-[15px] font-semibold rounded-full border border-[#ddd] transition-all duration-200"
                          >
                            Select
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {currentStage === 2 && (
            <div
              className={`w-full transition-opacity duration-300 ease-in-out ${isTransitioning ? "opacity-0" : "opacity-100"}`}
            >
              <div className="space-y-6 mt-4 pb-12">
                <div className="flex justify-between">
                  <Button
                    onClick={() => {
                      setIsTransitioning(true)
                      setTimeout(() => {
                        setCurrentStage(1)
                        setIsTransitioning(false)
                      }, 300)
                    }}
                    className="bg-[#5b06be] text-white hover:bg-[#4a05a0] rounded-lg py-1.5 px-3 font-medium transition-colors duration-200 w-32 border border-[#ddd] text-[15px]"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentStage(1)
                      setSessionSetup({ avatar: null, topic: "" })
                    }}
                    className="bg-red-500 text-white hover:bg-red-600 rounded-lg py-1.5 px-3 font-medium transition-colors duration-200 flex items-center justify-center gap-2 border border-[#ddd] text-[15px]"
                  >
                    <X className="w-3 h-3" />
                    Exit
                  </Button>
                </div>
  
                <div className="flex flex-col items-center gap-3 mb-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#5b06be]">
                    <img
                      src={
                        sessionSetup.avatar === "male"
                          ? "https://res.cloudinary.com/drkudvyog/image/upload/v1736936837/a-4k-portrait-of-a-welcoming-psychologis_jTEXFrX9RbWYuR_RT-j4cw_pJ49vj_zRoWtsmdXImwTyw_rp9p7y.png"
                          : "https://res.cloudinary.com/drkudvyog/image/upload/v1736936837/a-4k-portrait-of-a-compassionate-psychol_FZgjDzHhSayBd1WXqfn0Yg_JQHL4O8cQJusiVDlrhz11A_xcwa5j.png"
                      }
                      alt={`${sessionSetup.avatar === "male" ? "Marcus" : "Sarah"} avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[15px] font-semibold text-gray-800">
                    You've chosen to speak with {sessionSetup.avatar === "male" ? "Marcus" : "Sarah"}
                  </p>
                </div>
  
                <h2 className="text-[#5b06be] text-[21px] font-bold mb-4">2. Choose Topic</h2>
  
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {mentalHealthTopics.map((category) => (
                    <div key={category.category} className="space-y-3">
                      <h3 className="text-[19px] font-black text-[#5b06be]">{category.category}</h3>
                      <div className="space-y-2">
                        {category.topics.map((topic) => (
                          <div
                            key={topic}
                            onClick={() => {
                              setSessionSetup((prev) => ({ ...prev, topic }))
                              setIsTransitioning(true)
                              setTimeout(() => {
                                setCurrentStage(3)
                                setIsTransitioning(false)
                              }, 300)
                            }}
                            className="flex items-center justify-between p-3 rounded-lg bg-white border border-[#ddd] hover:border-[#ccc] transition-all duration-200 cursor-pointer group"
                          >
                            <span className="text-[15px] font-semibold text-gray-800 group-hover:text-[#5b06be]">{topic}</span>
                            <div className="text-gray-400 group-hover:text-[#5b06be]">
                              <ChevronRight className="w-3 h-3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {currentStage === 3 && (
            <div
              className={`w-full transition-opacity duration-300 ease-in-out ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="space-y-4 mt-4 pb-12">
                <div className="flex justify-between">
                  <Button
                    onClick={() => {
                      setIsTransitioning(true)
                      setTimeout(() => {
                        setCurrentStage(2)
                        setIsTransitioning(false)
                      }, 300)
                    }}
                    className="bg-[#5b06be] text-white hover:bg-[#4a05a0] rounded-lg py-1.5 px-3 font-medium transition-colors duration-200 w-32 border border-[#ddd] text-[15px]"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentStage(1)
                      setSessionSetup({ avatar: null, topic: "" })
                    }}
                    className="bg-red-500 text-white hover:bg-red-600 rounded-lg py-1.5 px-3 font-medium transition-colors duration-200 w-32 flex items-center justify-center gap-2 border border-[#ddd] text-[15px]"
                  >
                    <X className="w-3 h-3" />
                    Exit
                  </Button>
                </div>
                <div className="text-center mb-4">
                  <div className="mb-3 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-[#fbb350]">
                      <img
                        src={
                          sessionSetup.avatar === "male"
                            ? "https://res.cloudinary.com/drkudvyog/image/upload/v1736936837/a-4k-portrait-of-a-welcoming-psychologis_jTEXFrX9RbWYuR_RT-j4cw_pJ49vj_zRoWtsmdXImwTyw_rp9p7y.png"
                            : "https://res.cloudinary.com/drkudvyog/image/upload/v1736936837/a-4k-portrait-of-a-compassionate-psychol_FZgjDzHhSayBd1WXqfn0Yg_JQHL4O8cQJusiVDlrhz11A_xcwa5j.png"
                        }
                        alt={`${sessionSetup.avatar === "male" ? "Marcus" : "Sarah"} avatar`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <p className="text-[15px] font-semibold">
                    Session with {sessionSetup.avatar === "male" ? "Marcus" : "Sarah"}
                  </p>
                  <p className="text-[19px] font-black text-[#5b06be]">Topic: {sessionSetup.topic}</p>
                </div>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Button
                    onClick={() => setSessionDuration(Math.max(5, sessionDuration - 5))}
                    className="bg-[#5b06be] text-white hover:bg-[#4a05a0] rounded-full w-10 h-10 flex items-center justify-center border border-[#ddd] transition-all duration-200"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <div className="flex flex-col items-center">
                    <span className="text-[21px] font-bold text-[#5b06be] mr-1">{sessionDuration}</span>
                    <span className="text-xs text-gray-500 font-medium">minutes</span>
                  </div>
                  <Button
                    onClick={() => setSessionDuration(Math.min(60, sessionDuration + 5))}
                    className="bg-[#5b06be] text-white hover:bg-[#4a05a0] rounded-full w-10 h-10 flex items-center justify-center border border-[#ddd] transition-all duration-200"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-1 mb-6">
                  <Button
                    onClick={startSession}
                    className="w-full md:w-3/4 bg-gradient-to-r from-[#fbb350] to-[#f89b29] text-white hover:from-[#f89b29] hover:to-[#fbb350] rounded-lg py-6 px-6 font-bold text-[21px] transition-all duration-300 transform hover:scale-105 border border-[#ddd] relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                    <div className="flex items-center justify-center gap-3">
                      <Clock className="w-6 h-6 animate-pulse" />
                      <span>Start Your {sessionDuration}-Minute Journey</span>
                    </div>
                  </Button>
                  <p className="text-xs text-gray-600">
                    1 Minute of Session = 1 Credit
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
      {/* Tasks to complete */}
      <Card className="bg-white rounded-xl border border-[#ddd] w-full mb-4">
        <CardHeader className="text-left space-y-2 pt-4 pb-2">
          <h2 className="text-black text-[21px] font-bold flex items-center gap-2">
            <img 
              src="https://res.cloudinary.com/drkudvyog/image/upload/v1739728212/Tasks_to_complete_until_the_next_session_nctoak.png"
              alt="Tasks icon"
              className="w-5 h-5"
            />
            Tasks to complete until the next session
          </h2>
        </CardHeader>
        <div className="flex flex-col p-4 pt-0">
          <div className="bg-white rounded-lg p-4 border border-[#ddd] mb-4 flex flex-col justify-between h-full">
            <div className="space-y-3">
              {Object.entries(checkedItems).map(([key, checked], index) => (
                <div
                  key={key}
                  className="relative bg-white rounded-lg p-4 border border-[#ddd] transition-all duration-300 hover:border-[#ccc] hover:scale-[1.01] flex items-center"
                >
                  <div className="flex items-start gap-2 flex-1">
                    <div className="flex-shrink-0 text-[#5b06be] bg-purple-100 p-1.5 rounded-full">
                      {index === 0 && <FileText className="w-4 h-4" />}
                      {index === 1 && <Clock className="w-4 h-4" />}
                      {index === 2 && <MessageCircle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-[15px] font-semibold ${checked ? "line-through text-green-500" : "text-gray-800"} block truncate`}
                      >
                        {key === "practice-mindfulness" && "Practice mindfulness techniques"}
                        {key === "time-management" && "Implement time management strategies"}
                        {key === "communication-skills" && "Work on communication skills"}
                      </span>
                      <p className="text-xs text-[#5b06be] font-medium mt-1 line-clamp-2">
                        {key === "practice-mindfulness" && (
                          <>Enhance focus and reduce stress. Improve emotional regulation. Boost overall well-being.</>
                        )}
                        {key === "time-management" && (
                          <>
                            Increase productivity and efficiency. Reduce stress and overwhelm. Achieve better work-life
                            balance.
                          </>
                        )}
                        {key === "communication-skills" && (
                          <>
                            Enhance personal and professional relationships. Resolve conflicts more effectively. Boost
                            confidence in social situations.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
                      if (isChecked) {
                        (window as any).confetti({
                          particleCount: 100,
                          spread: 70,
                          origin: { y: 0.6 },
                          colors: ['#fbb350', '#5b06be', '#00bf63']
                        });
                      }
                    }}
                    className="w-6 h-6 rounded-md border-3 border-[#5b06be] data-[state=checked]:bg-[#5b06be] data-[state=checked]:border-[#5b06be] text-white focus:ring-1 focus:ring-[#5b06be] focus:ring-offset-1 transition-all duration-200 ease-in-out [&>span]:text-white ml-3"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      {/* Dashboard - Sections stacked vertically */}
      <div className="space-y-4 w-full">
        {/* Session Information Card */}
        <Card className="bg-white rounded-xl border border-[#ddd] w-full mb-4">
          <CardHeader className="flex flex-col items-start gap-3 px-4 py-4 space-y-2">
            <div className="w-full">
              <div className="flex justify-between items-center">
                <h2 className="text-black text-[21px] font-bold flex items-center gap-2">
                  <img 
                    src="https://res.cloudinary.com/drkudvyog/image/upload/v1739729499/Session_History_icon_duha_aoeoqv.png"
                    alt="Session History icon"
                    className="w-5 h-5"
                  />
                  Session History
                </h2>
                <Button
                  onClick={toggleSortOrder}
                  variant="outline"
                  className="bg-white text-[#5b06be] hover:bg-[#5b06be] hover:text-white transition-colors duration-200 flex items-center gap-1 rounded-lg px-3 py-1 border border-[#ddd] hover:border-[#ccc] font-semibold text-[15px]"
                >
                  Sort by Date
                  {sortOrder === "desc" ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <div className="w-full px-3">
            <div className="space-y-3">
              {sessions
                .slice()
                .sort((a, b) => {
                  const dateA = new Date(a.date).getTime()
                  const dateB = new Date(b.date).getTime()
                  return sortOrder === "desc" ? dateB - dateA : dateA - dateB
                })
                .slice(0, visibleSessions)
                .map((session) => (
                  <div key={session.id} className="border border-[#ddd] rounded-lg overflow-hidden">
                    <div
                      className="flex items-center justify-between py-2 px-3 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => handleSessionSelect(session.id)}
                    >
                      <div>
                        <h3 className="font-semibold text-[15px] text-[#5b06be]">{session.topic}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(session.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${
                          selectedSession?.id === session.id ? "transform rotate-180" : ""
                        }`}
                      />
                    </div>
                    {selectedSession?.id === session.id && (
                      <div className="p-4 bg-gray-50 rounded-b-lg border-t border-[#ddd]">
                        <div className="bg-white rounded-lg border border-[#ddd] overflow-hidden">
                          <SessionTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />
                          <div className="border-t border-[#ddd]">
                            <div className="p-4">{renderTabContent()}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              {sessions.length > 5 && (
                <Button
                  onClick={() => setVisibleSessions(visibleSessions === sessions.length ? 5 : sessions.length)}
                  className="w-full mt-3 bg-[#5b06be] text-white hover:bg-[#4a05a0] rounded-lg border border-[#ddd] text-[15px] font-semibold py-1.5"
                >
                  {visibleSessions === sessions.length ? "Show Less" : "View More"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
  
      {/* Session Dialog */}
      <Dialog open={isSessionActive} onOpenChange={setIsSessionActive}>
        <DialogContent className="sm:max-w-[360px] bg-white rounded-xl border border-[#ddd] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-[19px] font-black text-[#fbb350]">Session in Progress</DialogTitle>
            <DialogDescription className="text-[15px] font-semibold">Your session is currently active.</DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-3">
            <p className="text-[15px] font-semibold text-[#fbb350]">
              Speaking with {sessionSetup.avatar === "male" ? "Marcus" : "Sarah"} about {sessionSetup.topic}
            </p>
            <Button
              onClick={() => setIsSessionActive(false)}
              className="bg-[#fbb350] text-white hover:bg-[#fbb350]/80 rounded-lg px-5 py-1.5 transition-all duration-300 transform hover:scale-105 border border-[#ddd] text-[15px] font-semibold"
            >
              End Session
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
