import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function safeParseJSON(jsonString) {
  try {
    return jsonString ? JSON.parse(jsonString) : []
  } catch (error) {
    console.warn("Failed to parse JSON:", error)
    return []
  }
}

export function formatDate(date) {
  if (!date) return ""
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateTime(date) {
  if (!date) return ""
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatCurrency(amount) {
  if (!amount) return "ৰ0.00"
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function generatePatientId() {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `P${timestamp}${random}`
}

export function calculateAge(birthDate) {
  if (!birthDate) return 0
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function validatePhoneNumber(phone) {
  const phoneRegex = /^(\+880|880|0)?1[3-9]\d{8}$/
  return phoneRegex.test(phone.replace(/\s+/g, ""))
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function truncateText(text, maxLength = 100) {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

export function capitalizeFirst(str) {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function isValidDate(date) {
  return date instanceof Date && !isNaN(date)
}

export function getInitials(name) {
  if (!name) return ""
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .substring(0, 2)
}

export function generateRandomColor() {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand("copy")
      document.body.removeChild(textArea)
      return Promise.resolve()
    } catch (err) {
      document.body.removeChild(textArea)
      return Promise.reject(err)
    }
  }
}

export function downloadAsJSON(data, filename = "data.json") {
  const jsonStr = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonStr], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function getRelativeTime(date) {
  if (!date) return ""
  const now = new Date()
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`

  return formatDate(date)
}
