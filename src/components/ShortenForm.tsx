"use client"

import type React from "react"

import { useState } from "react"
import { shortenUrl } from "@/lib/api"
import toast from "react-hot-toast"
import { Copy, LinkIcon, Loader2 } from "lucide-react"

export default function ShortenForm() {
    const [url, setUrl] = useState<string>("")
    const [shortUrl, setShortUrl] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isCopied, setIsCopied] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!url) return

        setIsLoading(true)
        try {
            const response = await shortenUrl(url)
            setShortUrl(response.short_url)
            toast.success("URL shortened successfully!")
        } catch (error) {
            toast.error("Failed to shorten URL. Please try again.")
            console.error("Failed to shorten URL: ", error);
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shortUrl)
            setIsCopied(true)
            toast.success("Copied to clipboard!")

            // Reset the copied state after 2 seconds
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err: unknown) {
            toast.error("Failed to copy. Please try manually.")
            console.error("Failed to copy. Please try manually:", err)
        }
    }

    const isValidUrl = (url: string): boolean => {
        try {
            if (url == "") return false;
            new URL(url)
            return true
        } catch (e) {
            console.error("Invalid URL: ", e)
            return false
        }
    }

    return (
        <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-avocado-100 dark:bg-avocado-600 mx-auto mb-4">
                    <LinkIcon className="w-6 h-6 text-avocado-600 dark:text-avocado-400" />
                </div>

                <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-6">Shorten Your URL</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Enter URL
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <input
                                id="url-input"
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className={`block w-full px-4 py-3 border ${url && !isValidUrl(url)
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 dark:border-gray-600 focus:ring-avocado-500 focus:border-avocado-500"
                                    } rounded-md shadow-sm placeholder-gray-400 dark:bg-gray-700 dark:text-white transition-colors duration-200`}
                                placeholder="https://example.com"
                                required
                                disabled={isLoading}
                            />
                            {url && !isValidUrl(url) && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-red-500">!</span>
                                </div>
                            )}
                        </div>
                        {url && !isValidUrl(url) && (
                            <p className="mt-1 text-sm text-red-600">Please enter a valid URL including http:// or https://</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || (!isValidUrl(url))}
                        className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-avocado-600 hover:bg-avocado-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-avocado-500 transition-colors duration-200 ${isLoading || (!isValidUrl(url)) ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Shorten URL"
                        )}
                    </button>
                </form>

                {shortUrl && (
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-300 animate-fadeIn">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your shortened URL:</p>
                        <div className="flex items-center">
                            <a
                                href={shortUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-avocado-600 dark:text-avocado-400 font-medium mr-2 hover:underline truncate"
                            >
                                {shortUrl}
                            </a>
                            <button
                                onClick={copyToClipboard}
                                className={`ml-auto p-2 rounded-md ${isCopied
                                        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                                    } transition-colors duration-200`}
                                aria-label="Copy to clipboard"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
