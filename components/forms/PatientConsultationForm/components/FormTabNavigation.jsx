import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2 } from "lucide-react"

export function FormTabNavigation({ activeTab, completedTabs, isFormDisabled, tabs }) {
  return (
    <TabsList className="grid w-full grid-cols-4 h-20 bg-white border-2 border-gray-100 rounded-2xl p-2 shadow-lg">
      {tabs.map((tab) => {
        const isCompleted = completedTabs.has(tab.id)
        const isActive = activeTab === tab.id
        const IconComponent = tab.icon

        return (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={`
              flex flex-col items-center space-y-2 p-4 rounded-xl transition-all duration-300
              ${isActive ? `bg-${tab.color}-50 text-${tab.color}-700 shadow-md` : "hover:bg-gray-50"}
              ${isCompleted ? "ring-2 ring-green-200" : ""}
            `}
            disabled={isFormDisabled}
          >
            <div className="flex items-center space-x-2">
              <div
                className={`
                p-2 rounded-lg transition-colors
                ${isActive ? `bg-${tab.color}-100` : isCompleted ? "bg-green-100" : "bg-gray-100"}
              `}
              >
                <IconComponent
                  className={`
                  h-5 w-5 
                  ${isActive ? `text-${tab.color}-600` : isCompleted ? "text-green-600" : "text-gray-500"}
                `}
                />
              </div>
              {isCompleted && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            </div>
            <div className="text-center">
              <div className="font-semibold text-sm">{tab.label}</div>
              <div className="text-xs text-muted-foreground hidden lg:block">{tab.description}</div>
            </div>
          </TabsTrigger>
        )
      })}
    </TabsList>
  )
}
