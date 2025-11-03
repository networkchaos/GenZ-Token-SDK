"use client"

import { cn } from "../lib/utils"
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { useState } from "react"



function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

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


const codeExamples = {
  unity: `// Initialize GenZ Token SDK in Unity
using GenZ;

public class TokenManager : MonoBehaviour 
{
    private GenZSDK sdk;
    
    void Start() 
    {
        sdk = new GenZSDK("your-api-key");
        await sdk.Initialize();
    }
    
    // Award tokens to player
    public async void RewardPlayer(string playerId, int amount) 
    {
        var result = await sdk.Tokens.Mint(
            playerId, 
            amount,
            "level_completion"
        );
        
        if (result.Success) 
        {
            Debug.Log($"Awarded {amount} tokens!");
        }
    }
}`,
  unreal: `// Initialize GenZ Token SDK in Unreal Engine
#include "GenZSDK.h"

void ATokenManager::BeginPlay()
{
    Super::BeginPlay();
    
    SDK = UGenZSDK::Create("your-api-key");
    SDK->Initialize();
}

// Transfer tokens between players
void ATokenManager::TransferTokens(
    FString FromPlayer, 
    FString ToPlayer, 
    int32 Amount
)
{
    SDK->Tokens->Transfer(
        FromPlayer,
        ToPlayer,
        Amount,
        [](FTokenResult Result) {
            if (Result.bSuccess) {
                UE_LOG(LogTemp, Log, TEXT("Transfer complete!"));
            }
        }
    );
}`,
  javascript: `// Initialize GenZ Token SDK in JavaScript
import { GenZSDK } from '@genz/sdk';

const sdk = new GenZSDK({
  apiKey: 'your-api-key',
  environment: 'production'
});

await sdk.initialize();

// Create a new token economy
const economy = await sdk.economy.create({
  name: 'Gold Coins',
  symbol: 'GOLD',
  initialSupply: 1000000,
  decimals: 2
});

// Mint tokens to player wallet
const result = await sdk.tokens.mint({
  playerId: 'player_123',
  amount: 100,
  reason: 'quest_completion'
});

console.log('Tokens minted:', result.transactionId);`,
}

export function CodeDemoSection() {
  const [activeTab, setActiveTab] = useState("unity")

  return (
    <section id="demo" className="relative py-24 md:py-32 bg-secondary/20">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Integrate in <span className="text-neon-blue glow-text">minutes</span>, not months
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Simple, intuitive APIs that work with your favorite game engine
          </p>
        </div>

        <Card className="max-w-5xl mx-auto bg-card/80 backdrop-blur border-border/50 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-border/50 bg-secondary/30 px-6">
              <TabsList className="bg-transparent h-14">
                <TabsTrigger
                  value="unity"
                  className="data-[state=active]:bg-secondary data-[state=active]:text-neon-blue"
                >
                  Unity
                </TabsTrigger>
                <TabsTrigger
                  value="unreal"
                  className="data-[state=active]:bg-secondary data-[state=active]:text-neon-blue"
                >
                  Unreal Engine
                </TabsTrigger>
                <TabsTrigger
                  value="javascript"
                  className="data-[state=active]:bg-secondary data-[state=active]:text-neon-blue"
                >
                  JavaScript
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="unity" className="mt-0">
                <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                  <code className="text-foreground">{codeExamples.unity}</code>
                </pre>
              </TabsContent>

              <TabsContent value="unreal" className="mt-0">
                <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                  <code className="text-foreground">{codeExamples.unreal}</code>
                </pre>
              </TabsContent>

              <TabsContent value="javascript" className="mt-0">
                <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                  <code className="text-foreground">{codeExamples.javascript}</code>
                </pre>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </section>
  )
}
