 "use client"

import { useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin } from "lucide-react"
import { useChamberStore } from "@/store/chamberStore"

export function ChamberSelector() {
  const { activeChamber, chambers, isLoadingChambers, fetchChambers, setActiveChamberById } = useChamberStore()

  useEffect(() => {
    if (chambers.length === 0 && !isLoadingChambers) {
      fetchChambers()
    }
  }, [chambers.length, isLoadingChambers, fetchChambers])

  if (isLoadingChambers) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Loading chambers...</span>
      </div>
    )
  }

  if (chambers.length === 0) {
    return (
      <Badge variant="outline" className="text-xs">
        <Building2 className="w-3 h-3 mr-1" />
        No Chambers
      </Badge>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <Building2 className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Active Chamber:</span>
      </div>

      <Select value={activeChamber?.$id || ""} onValueChange={setActiveChamberById}>
        <SelectTrigger className="w-[200px] h-8">
          <SelectValue placeholder="Select chamber">
            {activeChamber && (
              <div className="flex items-center space-x-2">
                <span className="font-medium">{activeChamber.chamberName}</span>
                {activeChamber.location && (
                  <Badge variant="secondary" className="text-xs">
                    <MapPin className="w-2 h-2 mr-1" />
                    {activeChamber.location}
                  </Badge>
                )}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {chambers.map((chamber) => (
            <SelectItem key={chamber.$id} value={chamber.$id}>
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="font-medium">{chamber.chamberName}</div>
                  {chamber.location && (
                    <div className="text-xs text-muted-foreground flex items-center">
                      <MapPin className="w-2 h-2 mr-1" />
                      {chamber.location}
                    </div>
                  )}
                </div>
                {chamber.isActive && (
                  <Badge variant="default" className="text-xs ml-2">
                    Active
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
