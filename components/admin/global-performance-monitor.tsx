'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EnhancedDraggableTestWindow } from './enhanced-draggable-test-window'
import { useRenderTracking } from '@/hooks/use-render-tracker'
import { 
  Activity,
  AlertTriangle,
  Monitor,
  Zap,
  Server
} from 'lucide-react'

export function GlobalPerformanceMonitor() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const { renderData, isTracking, getMetrics } = useRenderTracking()

  const metrics = getMetrics()

  // Auto-hide/show based on scroll or inactivity
  useEffect(() => {
    let hideTimer: NodeJS.Timeout
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show when scrolling up, hide when scrolling down (unless popup is open)
      if (!isPopupOpen) {
        if (currentScrollY < lastScrollY) {
          setIsVisible(true)
        } else if (currentScrollY > lastScrollY + 50) {
          setIsVisible(false)
        }
      }
      
      lastScrollY = currentScrollY
      
      // Clear existing timer
      if (hideTimer) clearTimeout(hideTimer)
      
      // Auto-show after scroll stops
      hideTimer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
    }

    const handleMouseMove = () => {
      setIsVisible(true)
      if (hideTimer) clearTimeout(hideTimer)
      
      if (!isPopupOpen) {
        hideTimer = setTimeout(() => {
          setIsVisible(true) // Keep visible for easier access
        }, 5000)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      if (hideTimer) clearTimeout(hideTimer)
    }
  }, [isPopupOpen])

  const handleTogglePopup = () => {
    if (isPopupOpen) {
      setIsPopupOpen(false)
      setIsMinimized(false)
    } else {
      setIsPopupOpen(true)
      setIsMinimized(false)
    }
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleClose = () => {
    setIsPopupOpen(false)
    setIsMinimized(false)
  }

  const hasIssues = metrics.excessiveRenderComponents.length > 0 || metrics.averageRenderTime > 16

  return (
    <>
      {/* Floating Icon Button */}
      <div className={`fixed bottom-4 right-4 z-[9998] transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      } ${isPopupOpen ? 'transform scale-0' : 'transform scale-100'}`}>
        <div className="relative">
          <Button
            onClick={handleTogglePopup}
            size="lg"
            className={`h-14 w-14 rounded-full shadow-2xl border-2 transition-all duration-200 hover:scale-110 ${
              isTracking 
                ? hasIssues 
                  ? 'bg-red-500 hover:bg-red-600 border-red-300 animate-pulse' 
                  : 'bg-green-500 hover:bg-green-600 border-green-300'
                : 'bg-primary hover:bg-primary/90 border-primary/30'
            }`}
          >
            {isTracking ? (
              hasIssues ? (
                <AlertTriangle className="h-6 w-6 text-white" />
              ) : (
                <Activity className="h-6 w-6 text-white animate-pulse" />
              )
            ) : (
              <Monitor className="h-6 w-6 text-white" />
            )}
          </Button>

          {/* Status Badges */}
          {isTracking && (
            <div className="absolute -top-2 -right-2 flex flex-col gap-1">
              {metrics.totalRenders > 0 && (
                <Badge 
                  variant={hasIssues ? "destructive" : "default"} 
                  className="text-xs px-1 py-0 h-5 min-w-[20px] flex items-center justify-center"
                >
                  {metrics.totalRenders > 999 ? '999+' : metrics.totalRenders}
                </Badge>
              )}
            </div>
          )}

          {/* Pulse Ring Animation */}
          {isTracking && (
            <div className={`absolute inset-0 rounded-full animate-ping ${
              hasIssues ? 'bg-red-400' : 'bg-green-400'
            } opacity-20`} />
          )}

          {/* Tooltip on Hover */}
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
              {isTracking 
                ? `Monitoring: ${metrics.componentsTracked} components` 
                : 'Click to open Performance Monitor'
              }
              <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Draggable Test Window */}
      <EnhancedDraggableTestWindow
        isOpen={isPopupOpen}
        onClose={handleClose}
        onMinimize={handleMinimize}
        isMinimized={isMinimized}
      />
    </>
  )
}
