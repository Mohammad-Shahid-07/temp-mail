"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RefreshCw, Copy, User, MapPin, CreditCard } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const FIRST_NAMES = ["Alex", "Jordan", "Casey", "Morgan", "Riley", "Taylor", "Jamie", "Cameron", "Quinn", "Avery", "Sam", "Pat", "Drew", "Skyler"]
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez"]
const CITIES = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"]
const STREETS = ["Main St", "Oak St", "Pine St", "Maple St", "Cedar St", "Elm St", "Washington Ave", "Lake View Dr", "Park Ave", "Broadway"]

function generateIdentity() {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
  return {
    name: `${first} ${last}`,
    address: `${Math.floor(Math.random() * 9999)} ${STREETS[Math.floor(Math.random() * STREETS.length)]}`,
    city: CITIES[Math.floor(Math.random() * CITIES.length)],
    zip: Math.floor(Math.random() * 90000) + 10000,
  }
}

export function FakeIdentityDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [identity, setIdentity] = React.useState(generateIdentity())

  const refresh = () => setIdentity(generateIdentity())

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Fake Identity Generator</span>
            <Button size="sm" variant="ghost" onClick={refresh} className="h-8 w-8 p-0">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Use these details to fill out sign-up forms without revealing your real personal information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Full Name</Label>
            <div className="flex gap-2">
              <Input value={identity.name} readOnly className="bg-zinc-900 border-zinc-800 font-mono" />
              <Button size="icon" variant="outline" className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800" onClick={() => navigator.clipboard.writeText(identity.name)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Address</Label>
            <div className="flex gap-2">
              <Input value={`${identity.address}, ${identity.city} ${identity.zip}`} readOnly className="bg-zinc-900 border-zinc-800 font-mono" />
              <Button size="icon" variant="outline" className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800" onClick={() => navigator.clipboard.writeText(`${identity.address}, ${identity.city} ${identity.zip}`)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
