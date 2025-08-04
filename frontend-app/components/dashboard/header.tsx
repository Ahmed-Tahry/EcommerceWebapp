"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface HeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function Header({ title, description, action }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {action && (
          <Button onClick={action.onClick}>
            <Plus className="mr-2 h-4 w-4" />
            {action.label}
          </Button>
        )}
      </div>
    </header>
  )
}
