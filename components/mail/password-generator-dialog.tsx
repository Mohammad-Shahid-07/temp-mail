"use client"

import * as React from "react"
import { Copy, RefreshCw, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface PasswordGeneratorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PasswordGeneratorDialog({ open, onOpenChange }: PasswordGeneratorDialogProps) {
  const [password, setPassword] = React.useState("")
  const [length, setLength] = React.useState([16])
  const [includeUppercase, setIncludeUppercase] = React.useState(true)
  const [includeNumbers, setIncludeNumbers] = React.useState(true)
  const [includeSymbols, setIncludeSymbols] = React.useState(true)
  const [isCopied, setIsCopied] = React.useState(false)

  const generatePassword = React.useCallback(() => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "0123456789"
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"

    let chars = lowercase
    if (includeUppercase) chars += uppercase
    if (includeNumbers) chars += numbers
    if (includeSymbols) chars += symbols

    let result = ""
    for (let i = 0; i < length[0]; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(result)
  }, [length, includeUppercase, includeNumbers, includeSymbols])

  React.useEffect(() => {
    if (open) generatePassword()
  }, [open, generatePassword])

  const handleCopy = () => {
    navigator.clipboard.writeText(password)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-zinc-800 text-zinc-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Password Generator</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Create strong, secure passwords for your temporary accounts.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Display */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-500 to-green-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative bg-black border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="font-mono text-base sm:text-lg text-emerald-400 break-all min-w-0">
                {password}
              </div>
              <div className="flex gap-2 shrink-0 self-end sm:self-auto">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-white/10 hover:text-white"
                  onClick={generatePassword}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-white/10 hover:text-white"
                  onClick={handleCopy}
                >
                  {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Length</Label>
                <span className="text-zinc-400 font-mono">{length[0]}</span>
              </div>
              <Slider
                value={length}
                onValueChange={setLength}
                min={8}
                max={64}
                step={1}
                className="[&_.bg-primary]:bg-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between space-x-2 border border-white/5 p-3 rounded-lg bg-white/2">
                <Label htmlFor="uppercase" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Uppercase</Label>
                <Switch
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
              <div className="flex items-center justify-between space-x-2 border border-white/5 p-3 rounded-lg bg-white/2">
                <Label htmlFor="numbers" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Numbers</Label>
                <Switch
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
              <div className="flex items-center justify-between space-x-2 border border-white/5 p-3 rounded-lg bg-white/2">
                <Label htmlFor="symbols" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Symbols</Label>
                <Switch
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
