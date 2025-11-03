import { cn } from "../lib/utils"
import { Zap, Shield, Boxes, Gauge, Coins, Globe } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Integration",
    description: "Get up and running in under 5 minutes with our intuitive SDK. No blockchain expertise required.",
    color: "text-neon-blue",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption and multi-signature wallets keep your game economy secure and compliant.",
    color: "text-neon-purple",
  },
  {
    icon: Boxes,
    title: "Multi-Engine Support",
    description: "Works seamlessly with Unity, Unreal Engine, Godot, and custom game engines.",
    color: "text-neon-gold",
  },
  {
    icon: Gauge,
    title: "Real-Time Analytics",
    description: "Monitor token flows, player behavior, and economy health with our powerful dashboard.",
    color: "text-neon-blue",
  },
  {
    icon: Coins,
    title: "Flexible Token Models",
    description: "Support for fungible tokens, NFTs, and hybrid economies. Your game, your rules.",
    color: "text-neon-purple",
  },
  {
    icon: Globe,
    title: "Global Scalability",
    description: "Built on enterprise infrastructure to handle millions of transactions per second.",
    color: "text-neon-gold",
  },
]
function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}


export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Everything you need to power your <span className="text-neon-purple glow-text">game economy</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Built by game developers, for game developers. No compromises on performance or security.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-border transition-all hover:shadow-lg hover:shadow-neon-blue/10"
              >
                <div className={`inline-flex p-3 rounded-lg bg-secondary/50 mb-4 ${feature.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
