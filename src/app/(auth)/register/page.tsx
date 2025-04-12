"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { register } from "@/lib/auth"
import toast from "react-hot-toast"
import { Eye, EyeOff, Loader2, UserPlus, Lock, CheckCircle, AlertCircle, MailIcon } from "lucide-react"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()

  // Password validation
  const hasMinLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  const passwordsMatch = password === confirmPassword && password !== ""

  // Calculate password strength
  useEffect(() => {
    let strength = 0
    if (hasMinLength) strength += 1
    if (hasUpperCase) strength += 1
    if (hasLowerCase) strength += 1
    if (hasNumber) strength += 1
    if (hasSpecialChar) strength += 1
    setPasswordStrength(strength)
  }, [password, hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar])

  const getStrengthText = () => {
    if (passwordStrength === 0) return "Very Weak"
    if (passwordStrength === 1) return "Weak"
    if (passwordStrength === 2) return "Fair"
    if (passwordStrength === 3) return "Good"
    if (passwordStrength === 4) return "Strong"
    return "Very Strong"
  }

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500"
    if (passwordStrength === 2) return "bg-orange-500"
    if (passwordStrength === 3) return "bg-yellow-500"
    if (passwordStrength >= 4) return "bg-avocado-500"
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    if (passwordStrength < 3) {
      toast.error("Please use a stronger password.")
      return
    }

    if (!agreeToTerms) {
      toast.error("You must agree to the Terms of Service.")
      return
    }

    setIsLoading(true)

    try {
      await register(email, password)
      toast.success("Registered successfully! Please log in.")
      router.push("/login")
    } catch (error) {
      toast.error("Registration failed. Email may already be taken.")
      console.log("Registration failed: ", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-start px-4 py-12 ">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="bg-avocado-600 dark:bg-avocado-700 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-avocado-100 mt-2">Join our URL shortener service</p>
          </div>

          {/* Form */}
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-avocado-500 focus:border-avocado-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    placeholder="Choose a email"
                    required
                    disabled={isLoading}
                    minLength={3}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-avocado-500 focus:border-avocado-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    placeholder="Create a password"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Password strength indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Password strength:</span>
                      <span
                        className={`text-xs font-medium ${passwordStrength <= 1
                            ? "text-red-500"
                            : passwordStrength === 2
                              ? "text-orange-500"
                              : passwordStrength === 3
                                ? "text-yellow-500"
                                : "text-avocado-500"
                          }`}
                      >
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStrengthColor()} transition-all duration-300`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center text-xs">
                        {hasMinLength ? (
                          <CheckCircle className="h-3 w-3 text-avocado-500 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-gray-400 mr-1" />
                        )}
                        <span className={hasMinLength ? "text-avocado-500" : "text-gray-500"}>8+ characters</span>
                      </div>
                      <div className="flex items-center text-xs">
                        {hasUpperCase ? (
                          <CheckCircle className="h-3 w-3 text-avocado-500 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-gray-400 mr-1" />
                        )}
                        <span className={hasUpperCase ? "text-avocado-500" : "text-gray-500"}>Uppercase letter</span>
                      </div>
                      <div className="flex items-center text-xs">
                        {hasLowerCase ? (
                          <CheckCircle className="h-3 w-3 text-avocado-500 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-gray-400 mr-1" />
                        )}
                        <span className={hasLowerCase ? "text-avocado-500" : "text-gray-500"}>Lowercase letter</span>
                      </div>
                      <div className="flex items-center text-xs">
                        {hasNumber ? (
                          <CheckCircle className="h-3 w-3 text-avocado-500 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-gray-400 mr-1" />
                        )}
                        <span className={hasNumber ? "text-avocado-500" : "text-gray-500"}>Number</span>
                      </div>
                      <div className="flex items-center text-xs">
                        {hasSpecialChar ? (
                          <CheckCircle className="h-3 w-3 text-avocado-500 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-gray-400 mr-1" />
                        )}
                        <span className={hasSpecialChar ? "text-avocado-500" : "text-gray-500"}>Special character</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-3 border ${confirmPassword && !passwordsMatch
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-avocado-500 focus:border-avocado-500"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white transition-colors duration-200`}
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 text-avocado-600 focus:ring-avocado-500 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-avocado-600 hover:text-avocado-500 dark:text-avocado-400 transition-colors duration-200"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-avocado-600 hover:text-avocado-500 dark:text-avocado-400 transition-colors duration-200"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={
                    isLoading || !passwordsMatch || passwordStrength < 3 || !agreeToTerms || email.length < 3
                  }
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-avocado-600 hover:bg-avocado-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-avocado-500 transition-colors duration-200 ${isLoading || !passwordsMatch || passwordStrength < 3 || !agreeToTerms || email.length < 3
                      ? "opacity-70 cursor-not-allowed"
                      : "cursor-pointer"
                    }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-avocado-600 hover:text-avocado-500 dark:text-avocado-400 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
