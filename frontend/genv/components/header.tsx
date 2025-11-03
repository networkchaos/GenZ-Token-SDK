"use client"


import { Gamepad2, Menu, X } from "lucide-react"
import { useState } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../lib/utils"
import Link from "next/link"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
      variants: {
        variant: {
          default: 'bg-primary text-primary-foreground hover:bg-primary/90',
          destructive:
            'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
          outline:
            'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
          secondary:
            'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          ghost:
            'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
          link: 'text-primary underline-offset-4 hover:underline',
        },
        size: {
          default: 'h-9 px-4 py-2 has-[>svg]:px-3',
          sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
          lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
          icon: 'size-9',
          'icon-sm': 'size-8',
          'icon-lg': 'size-10',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'default',
      },
    },
  )
  function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
  }: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
    }) {
      const Comp = asChild ? Slot : 'button'
      return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
      }
  

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-neon-blue">
            <Gamepad2 className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">GenZ Token SDK</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a href="#demo" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Demo
          </a>
          <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </Link>
          <a href="/demo" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Request Demo
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm" className="bg-neon-blue text-primary-foreground hover:bg-neon-blue/90 neon-border" asChild>
            <Link href="/onboarding">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="container px-4 py-4 flex flex-col gap-4">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#demo"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Demo
            </a>
            <Link
              href="/docs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </Link>
            <a
              href="/demo"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Request Demo
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button size="sm" className="bg-neon-blue text-primary-foreground hover:bg-neon-blue/90" asChild>
                <Link href="/onboarding">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
