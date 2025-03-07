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
    <div className="w-full bg-white rounded-xl p-5 border border-[#ddd] mb-4 relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-300 via-orange-300 to-red-300 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0 md:space-x-4 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-3 w-full md:w-auto">
          <h1 className="text-purple-800 text-[21px] font-bold tracking-tight">
            <span className="font-black">Next</span> Session:
          </h1>
          <div className="text-purple-700 text-[15px] font-semibold bg-white rounded-lg px-4 py-2 border border-[#ddd] w-full md:w-auto">
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
            className="bg-white text-purple-700 hover:bg-purple-50 transition-all duration-200 rounded-lg px-4 py-2 border border-[#ddd] transform hover:-translate-y-0.5 font-semibold flex items-center space-x-2 h-10 text-[15px] w-full md:w-auto"
          >
            <img 
              src="https://res.cloudinary.com/drkudvyog/image/upload/v1734437402/calendar_icon_2_efgdme.png"
              alt="Calendar icon"
              className="w-4 h-4"
            />
            <span>Reschedule</span>
          </Button>
        </div>
        <Button
          onClick={addToCalendar}
          className="bg-[#fbb350] hover:bg-[#faa238] text-white rounded-lg flex items-center justify-center transition-all duration-200 px-4 py-2 transform hover:-translate-y-0.5 font-semibold h-10 border border-[#ddd] text-[15px] w-full md:w-auto"
        >
          <Image
            src="https://res.cloudinary.com/drkudvyog/image/upload/v1738083703/2365233_yylsf6.webp"
            alt="Calendar Icon"
            width={20}
            height={20}
            className="mr-2"
          />
          <Image
            src="https://res.cloudinary.com/drkudvyog/image/upload/v1737572247/Google_Calendar_icon__2020_.svg_omzep1.png"
            alt="Google Calendar Icon"
            width={20}
            height={20}
            className="mr-2"
          />
          Add to Calendar
        </Button>
      </div>

      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="p-4 gap-0 bg-white rounded-xl border border-[#ddd] max-w-[350px]">
          <div className="flex items-center mb-4">
            <h2 className="text-[#5b06be] text-[21px] font-bold whitespace-nowrap w-full text-center">
              Choose a new date
            </h2>
          </div>

          <div className="space-y-4">
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
                months: "space-y-1 mx-0",
                month: "space-y-1",
                caption: "flex justify-center relative items-center",
                caption_label: "text-lg font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse",
                head_row: "flex w-full gap-0.5",
                head_cell: "text-gray-500 rounded-md w-8 font-normal text-[0.7rem] h-6 flex-1",
                row: "flex w-full mt-1 gap-0.5",
                cell: "text-center text-xs p-0 relative hover:bg-gray-100 flex-1",
                day: "h-7 w-7 p-0 font-normal aria-selected:opacity-100 rounded-full mx-auto flex items-center justify-center",
                day_today: "bg-black text-white hover:bg-black/90",
                day_selected: "bg-[#5b06be] text-white hover:bg-[#5b06be]/90",
                day_outside: "text-gray-300",
                day_disabled: "text-gray-300",
                day_hidden: "invisible",
              }}
              components={{
                IconLeft: () => <ChevronLeft className="h-3 w-3" />,
                IconRight: () => <ChevronRight className="h-3 w-3" />,
              }}
            />

            <div className="space-y-2">
              <h3 className="text-[19px] font-black">Select Time</h3>
              <div className="relative">
                <select
                  value={`${tempSelectedDate?.getHours().toString().padStart(2, "0")}:${tempSelectedDate?.getMinutes().toString().padStart(2, "0")}`}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":").map(Number)
                    const newDate = new Date(tempSelectedDate || Date.now())
                    newDate.setHours(hours, minutes, 0, 0)
                    handleDateChange(newDate)
                  }}
                  className="w-full text-[15px] py-2 px-4 border border-[#ddd] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5b06be] focus:border-transparent transition-all duration-200 cursor-pointer appearance-none bg-white hover:border-[#5b06be] text-center font-semibold"
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

            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsCalendarOpen(false)}
                className="flex-1 rounded-lg py-2 text-[15px] font-semibold hover:bg-gray-100 transition-colors duration-200 border border-[#ddd]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-[#5b06be] text-white hover:bg-[#5b06be]/90 rounded-lg py-2 text-[15px] font-semibold flex items-center justify-center gap-2 border border-[#ddd]"
                disabled={!tempSelectedDate}
              >
                <Check className="w-3 h-3" />
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
