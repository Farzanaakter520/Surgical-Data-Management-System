/**
 * Utility functions for device identification and management
 */

// Generate a unique device ID or retrieve an existing one from localStorage
export function getDeviceId(): string {
    if (typeof window === "undefined") {
      return "server-side"
    }
  
    // Try to get existing device ID from localStorage
    const existingDeviceId = localStorage.getItem("device_id")
  
    if (existingDeviceId) {
      return existingDeviceId
    }
  
    // Generate a new device ID if none exists
    const newDeviceId = generateDeviceId()
    localStorage.setItem("device_id", newDeviceId)
  
    return newDeviceId
  }
  
  // Generate a unique device ID based on timestamp and random values
  function generateDeviceId(): string {
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 10)
    return `${timestamp}-${randomStr}`
  }
  
  // Get basic device information for analytics and debugging
  export function getDeviceInfo(): Record<string, string> {
    if (typeof window === "undefined") {
      return { type: "server" }
    }
  
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      deviceId: getDeviceId(),
      screenWidth: window.screen.width.toString(),
      screenHeight: window.screen.height.toString(),
    }
  }
  
  // Check if the current device is a mobile device
  export function isMobileDevice(): boolean {
    if (typeof window === "undefined") {
      return false
    }
  
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }
  
  // Get the client's IP address
  export async function getClientIpAddress(): Promise<string> {
    try {
      const response = await fetch("/api/get-ip")
  
      if (!response.ok) {
        console.error("Failed to fetch IP address")
        return "unknown"
      }
  
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.error("Error fetching IP address:", error)
      return "unknown"
    }
  }
  