"use client"

import { useState } from "react"
import { ArrowRight, Check, Copy, Sparkles } from "lucide-react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"
import Link from "next/link"

export function HeroSection(){
      const [copied, setCopied] = useState(false)

        const handleCopy = () => {
            navigator.clipboard.writeText("npm install @genz/sdk")
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }

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
         <section className="relative container px-4 pt-20 pb-32 md:pt-32 md:pb-40">
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-neon-blue/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute top-40 right-10 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-neon-blue/30 mb-8 animate-pulse-glow">
          <Sparkles className="h-4 w-4 text-neon-blue" />
          <span className="text-sm font-medium text-neon-blue">Now supporting Unity, Unreal, and Godot</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">
          GenZ Token SDK for <span className="text-neon-blue glow-text">Modern Developers</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed">
          Build scalable in-game economies with blockchain-powered tokens. Integrate in minutes, scale to millions of
          players.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button
            size="lg"
            className="bg-neon-blue text-primary-foreground hover:bg-neon-blue/90 neon-border text-lg px-8 h-14"
            asChild
          >
            <Link href="/onboarding">
              Start Building Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border hover:bg-secondary text-lg px-8 h-14 bg-transparent"
            asChild
          >
            <Link href="/docs">View Documentation</Link>
          </Button>
        </div>

        <div className="inline-flex items-center gap-3 px-6 py-4 rounded-lg bg-card border border-border">
          <code className="font-mono text-sm text-neon-blue">npm install @genz/sdk</code>
          <button onClick={handleCopy} className="p-2 hover:bg-secondary rounded transition-colors">
            {copied ? <Check className="h-4 w-4 text-neon-blue" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </section>
    );
}