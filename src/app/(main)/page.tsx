 
import ShortenForm from "@/components/ShortenForm"
import { ArrowRight, Link, Clock, Shield, BarChart } from "lucide-react"

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-avocado-100 dark:bg-avocado-600 rounded-full mb-4">
              <Link className="h-6 w-6 text-avocado-600 dark:text-avocado-100" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
              Shorten Your <span className="text-avocado-600 dark:text-avocado-400">Links</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Create short, memorable links in seconds. Perfect for social media, marketing campaigns, or sharing with
              friends.
            </p>
          </div>

          {/* Form Section */}
          <div className="mb-16 transition-all duration-300 transform hover:translate-y-[-4px]">
            <ShortenForm />
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate short links instantly with our optimized service.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Secure & Reliable</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your links are secure and will never expire unless you want them to.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Detailed Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track clicks, geographic data, and referrers with our analytics dashboard.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <a
              href="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-avocado-600 hover:bg-avocado-700 transition-colors duration-200"
            >
              Create an Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              No credit card required. Start shortening URLs for free.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
