"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUrls } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import { Link, RefreshCw, Plus, Loader2, AlertCircle, BarChart2, ExternalLink, Copy } from "lucide-react"
import toast from "react-hot-toast"

// Assuming the URL type based on the code provided
type Url = {
  id: string
  original_url: string
  short_url: string
  clicks: number
  created_at: string
}

export default function Dashboard() {
  const [urls, setUrls] = useState<Url[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  const fetchUrls = async () => {
    try {
      setError(null)
      setIsRefreshing(true)
      const data = await getUrls()
      setUrls(data)
    } catch (error) {
      console.error("Failed to fetch URLs:", error)
      setError("Failed to load your URLs. Please try again.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    fetchUrls()
  }, [router])

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("URL copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy. Please try manually.")
      console.error("Failed to copy: ",err );
    }
  }

  // Calculate total clicks across all URLs
  const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0)

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Dashboard</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Manage and track all your shortened URLs in one place
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={fetchUrls}
              disabled={isRefreshing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-avocado-500 transition-colors duration-200"
            >
              {isRefreshing ? (
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </button>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-avocado-600 hover:bg-avocado-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-avocado-500 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New URL
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-avocado-100 dark:bg-avocado-600 rounded-md p-3">
                  <Link className="h-6 w-6 text-avocado-600 dark:text-avocado-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total URLs</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">{urls.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
                  <BarChart2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Clicks</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">{totalClicks}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-md p-3">
                  <RefreshCw className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Average Clicks per URL
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {urls.length > 0 ? (totalClicks / urls.length).toFixed(1) : "0"}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* URL List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Shortened URLs</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-avocado-500 animate-spin" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading your URLs...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-12 text-red-500">
              <AlertCircle className="h-6 w-6 mr-2" />
              <span>{error}</span>
            </div>
          ) : urls.length === 0 ? (
            <div className="text-center py-12">
              <Link className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No URLs found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating a new shortened URL.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push("/")}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-avocado-600 hover:bg-avocado-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-avocado-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New URL
                </button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {urls.map((url) => (
                <li
                  key={url.id}
                  className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-2 sm:mb-0">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-avocado-600 dark:text-avocado-400 truncate">
                          <a
                            href={url.short_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center"
                          >
                            {url.short_url}
                            <ExternalLink className="h-3 w-3 ml-1 inline" />
                          </a>
                        </h3>
                        <button
                          onClick={() => copyToClipboard(url.short_url)}
                          className="ml-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                          aria-label="Copy URL"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                        Original: {url.original_url}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <BarChart2 className="h-4 w-4 mr-1" />
                        <span>{url.clicks || 0} clicks</span>
                      </div>
                      <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Created: {new Date(url.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
