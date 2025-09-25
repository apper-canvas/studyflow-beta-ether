import React, { useState } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import NavigationItem from "@/components/molecules/NavigationItem"
import Button from "@/components/atoms/Button"

const Sidebar = ({ className }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navigationItems = [
    { to: "/dashboard", icon: "LayoutDashboard", label: "Dashboard" },
    { to: "/courses", icon: "BookOpen", label: "Courses" },
    { to: "/assignments", icon: "FileText", label: "Assignments" },
{ to: "/grades", icon: "Award", label: "Grades" },
{ to: "/calendar", icon: "Calendar", label: "Calendar" },
{ to: "/notes", icon: "StickyNote", label: "Notes" },
{ to: "/students", icon: "Users", label: "Students" },
{ to: "/teachers", icon: "Users", label: "Teachers" }
]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-white/90 backdrop-blur-sm"
        >
          <ApperIcon name={isMobileOpen ? "X" : "Menu"} className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <div className={cn("hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 shadow-sm", className)}>
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gradient">StudyFlow</h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.to}
              to={item.to}
              icon={item.icon}
            >
              {item.label}
            </NavigationItem>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Academic Year 2024-25
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gradient">StudyFlow</h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              onClick={() => setIsMobileOpen(false)}
            >
              {item.label}
            </NavigationItem>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Academic Year 2024-25
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar