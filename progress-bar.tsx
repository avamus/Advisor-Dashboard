"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

const ProgressBar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    const date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    date.setHours(9, 0, 0, 0)
    return date
  })
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | undefined>(selectedDate)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const addToCalendar = () => {
    console.log("Adding to Google Calendar...")
    setTimeout(() => {
      console.log("Added to Google Calendar")
    }, 1000)
  }

  const handleDateChange = (date: Date | undefined) => {
    setTempSelectedDate(date)
  }

  const handleConfirm = () => {
    setSelectedDate(tempSelectedDate)
    setIsCalendarOpen(false)
  }

  return (
    <div className="w-full bg-white rounded-3xl p-8 shadow-lg border border-purple-200 mb-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-300 via-orange-300 to-red-300 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="flex items-center justify-between space-x-6 relative z-10">
        <div className="flex flex-row items-center space-x-4">
          <h1 className="text-purple-800 text-3xl font-extrabold tracking-tight">
            <span className="font-black">Next</span> Session:
          </h1>
          <div className="text-purple-700 text-xl bg-white rounded-2xl px-6 py-3 shadow-md font-bold">
            {selectedDate?.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            at{" "}
            {selectedDate?.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>
          <Button
            onClick={() => setIsCalendarOpen(true)}
            className="bg-white text-purple-700 hover:bg-purple-50 transition-all duration-200 rounded-2xl px-6 py-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-bold flex items-center space-x-2 h-[52px]"
          >
            <CalendarIcon className="w-5 h-5" />
            <span>Reschedule</span>
          </Button>
        </div>
        <Button
          onClick={addToCalendar}
          className="bg-[#fbb350] hover:bg-[#faa238] text-white rounded-2xl flex items-center justify-center transition-all duration-200 hover:shadow-lg px-6 py-3 transform hover:-translate-y-0.5 font-bold h-[52px]"
        >
          <Image
            src="https://res.cloudinary.com/drkudvyog/image/upload/v1738083703/2365233_yylsf6.webp"
            alt="Calendar Icon"
            width={24}
            height={24}
            className="mr-2"
          />
          <Image
            src="https://res.cloudinary.com/drkudvyog/image/upload/v1737572247/Google_Calendar_icon__2020_.svg_omzep1.png"
            alt="Google Calendar Icon"
            width={24}
            height={24}
            className="mr-2"
          />
          Add to Calendar
        </Button>
      </div>

      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="p-6 gap-0 bg-white rounded-3xl border-none shadow-2xl max-w-[400px]">
          <div className="flex items-center mb-6">
            <h2 className="text-[#5b06be] text-3xl font-bold whitespace-nowrap w-full text-center">
              Choose a new date
            </h2>
          </div>

          <div className="space-y-6">
            <CalendarComponent
              mode="single"
              selected={tempSelectedDate}
              onSelect={(date) => {
                if (date) {
                  const newDate = new Date(date)
                  newDate.setHours(tempSelectedDate?.getHours() || 9, tempSelectedDate?.getMinutes() || 0, 0, 0)
                  handleDateChange(newDate)
                }
              }}
              className="p-0"
              classNames={{
                months: "space-y-2 mx-0",
                month: "space-y-2",
                caption: "flex justify-center relative items-center",
                caption_label: "text-2xl font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse",
                head_row: "flex w-full gap-0.5",
                head_cell: "text-gray-500 rounded-md w-8 font-normal text-[0.8rem] h-8 flex-1",
                row: "flex w-full mt-1 gap-0.5",
                cell: "text-center text-sm p-0 relative hover:bg-gray-100 flex-1",
                day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 rounded-full mx-auto flex items-center justify-center",
                day_today: "bg-black text-white hover:bg-black/90",
                day_selected: "bg-[#5b06be] text-white hover:bg-[#5b06be]/90",
                day_outside: "text-gray-300",
                day_disabled: "text-gray-300",
                day_hidden: "invisible",
              }}
              components={{
                IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                IconRight: () => <ChevronRight className="h-4 w-4" />,
              }}
            />

            <div className="space-y-3">
              <h3 className="text-2xl font-bold">Select Time</h3>
              <div className="relative">
                <select
                  value={`${tempSelectedDate?.getHours().toString().padStart(2, "0")}:${tempSelectedDate?.getMinutes().toString().padStart(2, "0")}`}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":").map(Number)
                    const newDate = new Date(tempSelectedDate || Date.now())
                    newDate.setHours(hours, minutes, 0, 0)
                    handleDateChange(newDate)
                  }}
                  className="w-full text-xl py-2 px-4 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5b06be] focus:border-transparent transition-all duration-200 cursor-pointer appearance-none bg-white hover:border-[#5b06be] text-center"
                >
                  {Array.from({ length: 24 * 4 }).map((_, index) => {
                    const hours = Math.floor(index / 4)
                    const minutes = (index % 4) * 15
                    return (
                      <option
                        key={index}
                        value={`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`}
                      >
                        {`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsCalendarOpen(false)}
                className="flex-1 rounded-full py-4 text-xl hover:bg-gray-100 transition-colors duration-200 border-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-[#5b06be] text-white hover:bg-[#5b06be]/90 rounded-full py-4 text-xl flex items-center justify-center gap-2"
                disabled={!tempSelectedDate}
              >
                <Check className="w-4 h-4" />
                Confirm Date
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProgressBar
