"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

type DatePickerProps = {
  value?: string
  onChange: (date: string) => void
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [internalDate, setInternalDate] = useState<Date | undefined>(
    value ? new Date(value + "T00:00") : undefined
  )
  const [open, setOpen] = useState(false) // 👈 controlar el estado del Popover

  useEffect(() => {
    if (value) {
      setInternalDate(new Date(value + "T00:00"))
    }
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {internalDate ? format(internalDate, "PPP") : <span>Elegí una fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={internalDate}
          onSelect={(date) => {
            if (!date) return
            const formatted = date.toISOString().slice(0, 10)
            setInternalDate(date)
            onChange(formatted)
            setOpen(false) // cerrar el popover al seleccionar
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}