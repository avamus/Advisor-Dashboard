"use client"

import { cn } from "@/lib/utils"

interface SessionTabsProps {
  selectedTab: string
  onTabChange: (tab: string) => void
}

export function SessionTabs({ selectedTab, onTabChange }: SessionTabsProps) {
  const tabs = [
    { 
      id: "overview", 
      label: "Overview", 
      icon: () => <img src="https://res.cloudinary.com/drkudvyog/image/upload/v1739739815/Session_overview_icon_duha_k6ul4i.png" alt="Overview icon" className="w-3 h-3" />
    },
    { 
      id: "transcript", 
      label: "Transcript", 
      icon: () => <img src="https://res.cloudinary.com/drkudvyog/image/upload/v1739739869/Transcript_icon_duha_qtvfqy.png" alt="Transcript icon" className="w-3 h-3" />
    },
    { 
      id: "level-up", 
      label: "Level Up Planning", 
      icon: () => <img src="https://res.cloudinary.com/drkudvyog/image/upload/v1739739984/Level_up_plan_icon_duha_i2zqfj.png" alt="Level Up Planning icon" className="w-3 h-3" />
    },
    { 
      id: "your-notes", 
      label: "Your Notes", 
      icon: () => <img src="https://res.cloudinary.com/drkudvyog/image/upload/v1739740055/User_s_notes_icon_duha_cfevs9.png" alt="Your Notes icon" className="w-3 h-3" />
    },
  ]

  return (
    <div className="flex justify-between w-full border-b border-[#ddd] px-2">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            role="tab"
            aria-selected={selectedTab === tab.id}
            className={cn(
              "flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-gray-600 border-b-2 border-transparent transition-colors duration-200 flex-1",
              selectedTab === tab.id && "text-[#5b06be] border-[#5b06be]",
            )}
          >
            <Icon />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
