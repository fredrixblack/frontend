"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { login } from "@/lib/auth"
import toast from "react-hot-toast"
import { Eye, EyeOff, Loader2, LogIn, User, Lock } from "lucide-react"
import axios from "axios"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email.toLowerCase(), password, rememberMe)
      toast.success("Logged in successfully!")
      router.push("/dashboard")
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;

        if (responseData?.error) {
          toast.error(responseData.error);
        } else if (Array.isArray(responseData?.errors)) {
          toast.error(responseData.errors.map((x: { msg: string }) => x.msg).join('\n'));
        } else {
          toast.error("Login failed. Please check your credentials.")
        }

        console.log("Login failed:", error)
      } else {
        toast.error("Login failed. Please check your credentials.")
        console.log("Login failed:", error)
      }

      setIsLoading(false);

    }
  }

  return (
    <div className="min-h-screen flex items-center   px-4 py-12 ">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="bg-avocado-600 dark:bg-avocado-700 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-avocado-100 mt-2">Sign in to your account</p>
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
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-avocado-500 focus:border-avocado-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-avocado-600 hover:text-avocado-500 dark:text-avocado-400 transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
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
                    placeholder="Enter your password"
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
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-avocado-600 focus:ring-avocado-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-avocado-600 hover:bg-avocado-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-avocado-500 transition-colors duration-200 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-avocado-600 hover:text-avocado-500 dark:text-avocado-400 transition-colors duration-200"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Additional information */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gray-700 dark:hover:text-gray-300">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-gray-700 dark:hover:text-gray-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
