"use client"

import { Book, FileText, Pencil, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SessionTabsProps {
  selectedTab: string
  onTabChange: (tab: string) => void
}

export function SessionTabs({ selectedTab, onTabChange }: SessionTabsProps) {
  const tabs = [
    { id: "overview", label: "Overview", icon: Book },
    { id: "transcript", label: "Transcript", icon: FileText },
    { id: "level-up", label: "Level Up Planning", icon: ChevronRight },
    { id: "your-notes", label: "Your Notes", icon: Pencil },
  ]

  return (
    <div className="flex justify-between w-full border-b px-4">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            role="tab"
            aria-selected={selectedTab === tab.id}
            className={cn(
              "flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent transition-colors duration-200 flex-1",
              selectedTab === tab.id && "text-[#5b06be] border-[#5b06be]",
            )}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
