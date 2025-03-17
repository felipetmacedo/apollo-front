import { useState, useEffect } from "react";
import { Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CampaignCard } from "./CampaignCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SubscriptionDialog } from "@/features/Profile/SubscriptionDialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CreateCampaignDialog } from "./createCampaignDialog/CreateCampaignDialog";
import { useUserStore } from "@/stores/user.store";

interface Campaign {
  id: string;
  title: string;
  platform: "facebook" | "google" | "instagram";
  status: "draft" | "in_progress" | "archived";
  startDate?: string;
  endDate?: string;
  lastUpdated: string;
  budget?: {
    spent: number;
    total: number;
  };
}

interface Metric {
  title: string;
  subtitle: string;
  value: number;
  change: number;
  trend: "up" | "down";
  comparison: string;
}

interface Insight {
  message: string;
  recommendation: string;
  campaign?: string;
  type: 'budget' | 'performance' | 'optimization';
  isPro?: boolean;
}

export function CampaignsAnalytics() {
  const [revenue] = useState(90239.00);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [showInsight, setShowInsight] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isInsightChanging, setIsInsightChanging] = useState(false);
  const [campaignsCreated] = useState(2);
  const [campaignsLimit] = useState(3);
  const [aiGenerationsUsed] = useState(1);
  const [aiGenerationsLimit] = useState(1);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);

  const userInfo = useUserStore((state) => state.userInfo)

  const isProPlan = userInfo?.isProPlan;

  const metrics: Metric[] = [
    {
      title: "People Reached",
      subtitle: "How many people saw your ad?",
      value: 22,
      change: 15,
      trend: "up",
      comparison: "compared to last week"
    },
    {
      title: "Link Clicks",
      subtitle: "How many people clicked your ad?",
      value: 320,
      change: 4,
      trend: "down",
      comparison: "compared to last week"
    },
    {
      title: "Sales from Ads",
      subtitle: "How much revenue came from ads?",
      value: 1080,
      change: 8,
      trend: "up",
      comparison: "compared to last week"
    }
  ];

  const campaigns = [
    {
      id: "1",
      title: "10 Simple steps to revolutionise workflows with our product",
      platform: "facebook",
      status: "draft",
      startDate: undefined,
      budget: {
        spent: 0,
        total: 250
      }
    },
    {
      id: "2",
      title: "Boost your performance: start using our amazing product",
      platform: "google",
      status: "in_progress",
      startDate: "Jun 1, 2023",
      endDate: "Aug 1, 2023",
      budget: {
        spent: 250,
        total: 500
      }
    },
    {
      id: "3",
      title: "The power of our product: A new era in SaaS",
      platform: "google",
      status: "archived",
      startDate: "Jun 1, 2023",
      endDate: "Jun 11, 2023",
      budget: {
        spent: 1000,
        total: 1000
      }
    },
    {
      id: "4",
      title: "Beyond Boundaries: Explore our new product",
      platform: "instagram",
      status: "draft",
      startDate: undefined,
      budget: {
        spent: 0,
        total: 250
      }
    },
    {
      id: "5",
      title: "Skyrocket your productivity: our product is revealed",
      platform: "facebook",
      status: "in_progress",
      startDate: "Jul 1, 2023",
      endDate: "Sep 30, 2023",
      budget: {
        spent: 250,
        total: 500
      }
    }
  ] as Campaign[];

  const campaignsByStatus = {
    draft: campaigns.filter(c => c.status === "draft"),
    in_progress: campaigns.filter(c => c.status === "in_progress"),
    archived: campaigns.filter(c => c.status === "archived")
  };

  const insights: Insight[] = [
    {
      message: "Your \"Winter Sale\" campaign is performing well, but you're close to your budget limit.",
      recommendation: "Increase your budget by $50 to reach 2,500 more people.",
      campaign: "Winter Sale",
      type: 'budget'
    },
    {
      message: "Your ad engagement rate has increased by 15% this week.",
      recommendation: "Consider creating similar content to maintain momentum.",
      type: 'performance',
      isPro: true
    },
    {
      message: "Best performing time for your ads is between 2PM - 5PM.",
      recommendation: "Adjust your ad schedule to maximize reach during peak hours.",
      type: 'optimization',
      isPro: true
    }
  ];

  const handleCloseInsight = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowInsight(false);
      setIsClosing(false);
    }, 300);
  };

  useEffect(() => {
    if (!showInsight) return;

    const rotateInsight = () => {
      setIsInsightChanging(true);

      setTimeout(() => {
        setCurrentInsightIndex((current) =>
          current === insights.length - 1 ? 0 : current + 1
        );
        setIsInsightChanging(false);
      }, 300);
    };

    const intervalId = setInterval(rotateInsight, 5000);

    return () => clearInterval(intervalId);
  }, [showInsight, insights.length]);

  const renderMetricCard = (metric: Metric, index: number, isProPlan: boolean) => (
    <Card key={index} className="relative overflow-hidden group hover:border-primary/50 transition-all">
      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            {metric.title.includes("People") && (
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
            {metric.title.includes("Link") && (
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            )}
            {metric.title.includes("Sales") && (
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">{metric.title}</h3>
            {isProPlan && (
              <p className="text-sm text-neutral-500">{metric.subtitle}</p>
            )}
          </div>
        </div>

        {isProPlan ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-neutral-900">
                {metric.title.includes("Sales")
                  ? `$${metric.value.toLocaleString()}`
                  : metric.value.toLocaleString()}
              </span>
              <Badge
                className={`
                  ${metric.trend === "up"
                    ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                  }
                  px-3 py-1.5 text-sm font-medium
                `}
              >
                {metric.trend === "up" ? "↑" : "↓"} {metric.change}%
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${metric.trend === "up" ? "bg-emerald-500" : "bg-rose-500"
                }`} />
              <p className="text-sm text-neutral-600">
                {metric.trend === "up" ? "Increased" : "Decreased"} {metric.comparison}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-neutral-900">
              {metric.title.includes("Sales")
                ? `$${metric.value.toLocaleString()}`
                : metric.value.toLocaleString()}
            </span>
            <Badge
              variant="outline"
              className="bg-primary/5 text-neutral-900 hover:bg-primary/10 cursor-pointer text-xs"
              onClick={() => setShowSubscriptionModal(true)}
            >
              See more details with Pro
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-lg font-medium text-neutral-900">Revenue from Ads</h1>
        <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
          ${revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {!isProPlan && (
        <Card className="bg-neutral-50 border border-neutral-200">
          <div className="p-4">
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-neutral-900">Free Plan Limits</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="rounded-full cursor-default">
                          <Info className="w-4 h-4 text-neutral-900" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-screen-sm p-3 ml-16">
                        <p className="text-sm font-bold">Free Plan includes:</p>
                        <ul className="mt-2 space-y-1 text-sm text-neutral-600">
                          <li>• {campaignsLimit} campaigns</li>
                          <li>• {aiGenerationsLimit} AI generation per campaign</li>
                          <li>• Basic metrics tracking</li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-black text-white hover:bg-black/90"
                  onClick={() => setShowSubscriptionModal(true)}
                >
                  Upgrade to Pro
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-4 relative">
                <div className="space-y-2 flex flex-col justify-center">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="space-y-0.5">
                      <span className="text-neutral-900 font-medium">Campaigns</span>
                      <p className="text-neutral-500 text-xs">Create up to {campaignsLimit} campaigns</p>
                    </div>
                    <span className="font-medium text-neutral-900">
                      {campaignsCreated}/{campaignsLimit}
                    </span>
                  </div>
                  <Progress
                    value={(campaignsCreated / campaignsLimit) * 100}
                    className="h-2 bg-neutral-200"
                  />
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 h-16 mt-1">
                  <Separator orientation="vertical" className="h-full bg-neutral-300" />
                </div>

                <div className="space-y-2 flex flex-col justify-center">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="space-y-0.5">
                      <span className="text-neutral-900 font-medium">AI Generations</span>
                      <p className="text-neutral-500 text-xs">{aiGenerationsLimit} generation per campaign</p>
                    </div>
                    <span className="font-medium text-neutral-900">
                      {aiGenerationsUsed}/{aiGenerationsLimit}
                    </span>
                  </div>
                  <Progress
                    value={(aiGenerationsUsed / aiGenerationsLimit) * 100}
                    className="h-2 bg-neutral-200"
                  />
                </div>
              </div>
            </>
          </div>
        </Card>
      )}

      <div className="space-y-6">
        {showInsight && !isProPlan && (
          <Card
            className={`
              bg-neutral-50 border border-neutral-200 relative overflow-hidden
              transition-all duration-300 ease-in-out
              ${isClosing ? 'opacity-0 transform -translate-y-4' : 'opacity-100 transform translate-y-0'}
            `}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h3 className="font-medium text-neutral-900">AI Insight</h3>
                    <Badge variant="outline" className="bg-primary/5 text-xs">
                      1 free insight/month
                    </Badge>
                  </div>

                  <div
                    className={`
                      space-y-2 transition-all duration-300 ease-in-out
                      ${isInsightChanging ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'}
                    `}
                  >
                    <p className="text-neutral-900 font-medium">
                      {insights[currentInsightIndex].message}
                    </p>
                    <p className="text-neutral-600">
                      <span className="font-medium">Recommendation:</span> {insights[currentInsightIndex].recommendation}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-black text-white hover:bg-black/90"
                      onClick={() => setShowSubscriptionModal(true)}
                    >
                      Apply
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseInsight}
                    >
                      Ignore
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, index) => renderMetricCard(metric, index, isProPlan))}
        </div>
      </div>

      <div className="mt-8">
        <div className="items-center mb-4">
          <h2 className="text-2xl font-bold">Recent campaigns</h2>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-500">
            <span>Draft</span>
            <Badge variant="outline">{campaignsByStatus.draft.length}</Badge>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span>In Progress</span>
            <Badge variant="outline">{campaignsByStatus.in_progress.length}</Badge>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span>Archived</span>
            <Badge variant="outline">{campaignsByStatus.archived.length}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              isProUser={isProPlan}
            />
          ))}

          {(!isProPlan && campaignsCreated < campaignsLimit) || isProPlan ? (
            <Button
              variant="outline"
              className="h-full w-full border-dashed flex flex-col gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors"
              onClick={() => setShowCreateCampaign(true)}
            >
              <Plus className="w-6 h-6" />
              Add campaign
            </Button>
          ) : null}
        </div>
      </div>

      <SubscriptionDialog
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
      />

      <CreateCampaignDialog
        open={showCreateCampaign}
        onOpenChange={setShowCreateCampaign}
        isProUser={isProPlan}
      />
    </div>
  );
}