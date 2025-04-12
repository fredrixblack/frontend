"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { logout, isAuthenticated } from "@/lib/auth"
import { Menu, LinkIcon, LogOut, User, Home, X } from "lucide-react"

// Type for NavLink props
interface NavLinkProps {
  href: string
  children: React.ReactNode
  icon: React.ReactNode
  className?: string
  onClick?: () => void
}

// Type for NavButton props
interface NavButtonProps {
  onClick: () => void
  children: React.ReactNode
  icon: React.ReactNode
  className?: string
}

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [auth, setAuth] = useState<boolean>(false)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setAuth(isAuthenticated())

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside as EventListener)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside as EventListener)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setAuth(false)
    router.push("/login")
  }

  const NavLink = ({ href, children, icon, className = "", onClick }: NavLinkProps) => {
    const isActive = pathname === href
    return (
      <Link
        href={href}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          isActive ? "font-bold cursor-default text-white" : "text-gray-200 hover:font-bold"
        } ${className}`}
        onClick={onClick}
      >
        {icon}
        {children}
      </Link>
    )
  }

  const NavButton = ({ onClick, children, icon, className = "" }: NavButtonProps) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-gray-200 hover:bg-gray-700/50 transition-colors ${className}`}
    >
      {icon}
      {children}
    </button>
  )

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-gray-900/95 backdrop-blur-sm shadow-md" : "bg-gray-900"
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <LinkIcon className="h-6 w-6 text-avocado-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              URL Shortener
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <NavLink href="/" icon={<Home size={18} />}>
              Home
            </NavLink>

            {auth ? (
              <>
                <NavLink href="/dashboard" icon={<User size={18} />}>
                  Dashboard
                </NavLink>
                <NavButton onClick={handleLogout} icon={<LogOut size={18} />}>
                  Logout
                </NavButton>
              </>
            ) : (
              <>
                <NavLink
                  href="/login" 
                  icon={null}
                >
                  Login
                </NavLink>
                <NavLink
                  href="/register"
                  icon={null}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-200 hover:bg-gray-700/50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-[250px] bg-gray-900 border-l border-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-md text-gray-200 hover:bg-gray-700/50 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col space-y-4 p-4">
          <NavLink href="/" icon={<Home size={18} />} onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>

          {auth ? (
            <>
              <NavLink href="/dashboard" icon={<User size={18} />} onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </NavLink>
              <NavButton
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                icon={<LogOut size={18} />}
              >
                Logout
              </NavButton>
            </>
          ) : (
            <>
              <NavLink href="/login" icon={<User size={18} />} onClick={() => setMobileMenuOpen(false)}>
                Login
              </NavLink>
              <Link
                href="/register"
                className="flex items-center gap-2 px-3 py-2 bg-avocado-600 text-white rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} />
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
    </nav>
  )
}