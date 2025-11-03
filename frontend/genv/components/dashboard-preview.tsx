
import { TrendingUp, Users, Coins, Activity } from "lucide-react"
import {cn} from "../lib/utils"

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


export function DashboardPreview() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Monitor your economy in <span className="text-neon-purple glow-text">real-time</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Powerful analytics dashboard to track every transaction and optimize your game economy
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Transactions</span>
                <TrendingUp className="h-4 w-4 text-neon-blue" />
              </div>
              <div className="text-3xl font-bold text-neon-blue">2.4M</div>
              <p className="text-xs text-muted-foreground mt-1">+12.5% from last month</p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Players</span>
                <Users className="h-4 w-4 text-neon-purple" />
              </div>
              <div className="text-3xl font-bold text-neon-purple">847K</div>
              <p className="text-xs text-muted-foreground mt-1">+8.2% from last month</p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Tokens Minted</span>
                <Coins className="h-4 w-4 text-neon-gold" />
              </div>
              <div className="text-3xl font-bold text-neon-gold">156M</div>
              <p className="text-xs text-muted-foreground mt-1">+23.1% from last month</p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">API Uptime</span>
                <Activity className="h-4 w-4 text-neon-blue" />
              </div>
              <div className="text-3xl font-bold text-neon-blue">99.99%</div>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </Card>
          </div>

          <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Transaction Volume</h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-neon-blue" />
                  <span className="text-muted-foreground">Mints</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-neon-purple" />
                  <span className="text-muted-foreground">Transfers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-neon-gold" />
                  <span className="text-muted-foreground">Burns</span>
                </div>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-2">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col gap-1">
                  <div
                    className="w-full bg-neon-blue/80 rounded-t transition-all hover:bg-neon-blue"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4 text-xs text-muted-foreground">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
