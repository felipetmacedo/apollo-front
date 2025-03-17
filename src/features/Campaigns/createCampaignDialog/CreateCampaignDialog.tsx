import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileUploader } from "@/components/ui/file-uploader";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { platformIcons } from "./icons";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'basic' | 'review' | 'edit';

interface FormData {
  url: string;
  platform: string;
  budget: string;
  dailyBudget: string;
  image: File | null;
  audience: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  ageMin?: string;
  ageMax?: string;
  primaryAudience?: string;
  secondaryAudience?: string;
  reachMin?: string;
  reachMax?: string;
  primaryText?: string;
  headline?: string;
  description?: string;
  interests?: string;
  campaignName?: string;
  adSetName?: string;
}

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [formData, setFormData] = useState<FormData>({
    url: '',
    platform: '',
    budget: '',
    dailyBudget: '',
    image: null,
    audience: '',
  });

  const [showNamingDetails, setShowNamingDetails] = useState(false);

  const handleNext = () => {
    if (currentStep === 'basic') {
      setCurrentStep('review');
    } else if (currentStep === 'review') {
      console.log('Create campaign:', formData);
      onOpenChange(false);
    } else if (currentStep === 'edit') {
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    if (currentStep === 'edit') {
      setCurrentStep('review');
    } else if (currentStep === 'review') {
      setCurrentStep('basic');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full h-screen p-0">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header com Steps */}
          <div className="p-6 pb-0">
            <div className="mb-6">
              <div className="flex items-center justify-center">
                {currentStep === 'edit' ? (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-white shadow-md shadow-primary/25 flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <p className="mt-2 text-xs font-medium text-neutral-600">
                      Edit
                    </p>
                  </div>
                ) : (
                  (['basic', 'review'] as Step[]).map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                          transition-all duration-200
                          ${currentStep === step
                            ? 'bg-primary text-white shadow-md shadow-primary/25'
                            : index < ['basic', 'review'].indexOf(currentStep)
                              ? 'bg-primary/20 text-primary'
                              : 'bg-neutral-100 text-neutral-400'
                          }
                        `}>
                          {index + 1}
                        </div>
                        <p className="mt-2 text-xs font-medium text-neutral-600">
                          {step === 'basic' ? 'Create' : 'Review'}
                        </p>
                      </div>
                      {index < 1 && (
                        <div className="w-32 mx-4 flex items-center">
                          <div className={`h-[2px] w-full ${
                            index < ['basic', 'review'].indexOf(currentStep)
                              ? 'bg-primary/60'
                              : 'bg-neutral-200'
                          }`} />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            <Separator className="mb-6" />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="min-h-[calc(100vh-200px)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 'basic' ? (
                    <div className="p-8 max-w-3xl mx-auto">
                      <div className="space-y-8">
                        <div>
                          <Label htmlFor="url">Where should your ad send people?</Label>
                          <Input
                            id="url"
                            placeholder="Enter your URL, and we'll use it to generate ad copy and suggest a target audience"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="platform">Where will this ad run?</Label>
                          <Select
                            value={formData.platform}
                            onValueChange={(value) => setFormData({ ...formData, platform: value })}
                          >
                            <SelectTrigger id="platform" className="mt-2">
                              {formData.platform ? (
                                <div className="flex items-center gap-2">
                                  {platformIcons[formData.platform as keyof typeof platformIcons]}
                                  <span className="capitalize">{formData.platform}</span>
                                </div>
                              ) : (
                                <SelectValue placeholder="Choose a platform (e.g., Facebook, Instagram, Google)" />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(platformIcons).map(([platform, icon]) => (
                                <SelectItem
                                  key={platform}
                                  value={platform}
                                  className="cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 py-1">
                                    {icon}
                                    <span className="capitalize">{platform}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="budget">How much do you want to spend?</Label>
                          <div className="relative mt-2">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                            <Input
                              id="budget"
                              placeholder="Set a budget (e.g., $50/day) or leave blank—we'll recommend one for you!"
                              value={formData.budget}
                              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                              className="pl-7"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Upload Image</Label>
                          <div className="mt-2">
                            <FileUploader
                              value={formData.image}
                              onChange={(file) => setFormData({ ...formData, image: file })}
                              accept="image/*"
                              maxSize={5 * 1024 * 1024}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="audience">Who is your ideal audience?</Label>
                          <Textarea
                            id="audience"
                            placeholder="Want to target a specific audience? Tell us their age, interests, or location—or skip, and we'll handle it for you!"
                            value={formData.audience}
                            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                            className="mt-2 min-h-[100px]"
                          />
                        </div>
                      </div>
                    </div>
                  ) : currentStep === 'review' ? (
                    <div className="flex h-full">
                      {/* Coluna da Esquerda */}
                      <div className="w-1/2 p-8">
                        <div className="flex flex-col space-y-8">
                          {/* Primary Text */}
                          <div>
                            <Label className="text-sm text-neutral-900">Primary Text</Label>
                            <div className="relative">
                              <Textarea
                                value={formData.primaryText}
                                onChange={(e) => {
                                  if (e.target.value.length <= 125) {
                                    setFormData({ ...formData, primaryText: e.target.value })
                                  }
                                }}
                                placeholder="Enter your ad's main message (max 125 characters)"
                                className="mt-2 resize-none"
                                rows={3}
                                disabled={currentStep === 'review'}
                              />
                              <div className="absolute bottom-2 right-2 text-xs text-neutral-500">
                                {formData.primaryText?.length || 0}/125
                              </div>
                            </div>
                          </div>

                          {/* Container da Imagem */}
                          <div className="h-96 rounded-lg overflow-hidden bg-neutral-100">
                            {formData.image ? (
                              <img
                                src={URL.createObjectURL(formData.image)}
                                alt="Ad preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <p className="text-neutral-500 text-lg">No image uploaded</p>
                              </div>
                            )}
                          </div>

                          {/* Headline e Description */}
                          <div className="space-y-8">
                            <div>
                              <Label className="text-sm text-neutral-900">Headline</Label>
                              <div className="relative">
                                <Input
                                  value={formData.headline}
                                  onChange={(e) => {
                                    if (e.target.value.length <= 40) {
                                      setFormData({ ...formData, headline: e.target.value })
                                    }
                                  }}
                                  placeholder="Enter a short, attention-grabbing headline"
                                  className="mt-2"
                                  disabled={currentStep === 'review'}
                                />
                                <div className="absolute right-2 top-1/2 text-xs text-neutral-500">
                                  {formData.headline?.length || 0}/40
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm text-neutral-900">Description</Label>
                              <div className="relative">
                                <Input
                                  value={formData.description}
                                  onChange={(e) => {
                                    if (e.target.value.length <= 30) {
                                      setFormData({ ...formData, description: e.target.value })
                                    }
                                  }}
                                  placeholder="Add a brief description"
                                  className="mt-2"
                                  disabled={currentStep === 'review'}
                                />
                                <div className="absolute right-2 top-1/2 text-xs text-neutral-500">
                                  {formData.description?.length || 0}/30
                                </div>
                              </div>
                            </div>

                            {/* Campaign Naming Details - Colapsável */}
                            <div className="bg-white rounded-lg border overflow-hidden">
                              <button
                                onClick={() => setShowNamingDetails(!showNamingDetails)}
                                className="w-full p-4 flex items-center justify-between hover:bg-neutral-50"
                              >
                                <div className="flex items-center gap-2">
                                  <svg
                                    className={`w-5 h-5 text-neutral-500 transition-transform ${showNamingDetails ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                  <span className="font-medium">Campaign Naming Details</span>
                                </div>
                              </button>

                              {showNamingDetails && (
                                <div className="p-8 border-t space-y-8">
                                  <div>
                                    <Label className="text-sm text-neutral-900">Campaign Name</Label>
                                    <Input
                                      value={formData.campaignName}
                                      onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                                      placeholder="Laleur - Skincare Awareness - Feb 2025"
                                      className="mt-2"
                                      disabled={currentStep === 'review'}
                                    />
                                  </div>

                                  <div>
                                    <Label className="text-sm text-neutral-900">Ad Set Name</Label>
                                    <Input
                                      value={formData.adSetName}
                                      onChange={(e) => setFormData({ ...formData, adSetName: e.target.value })}
                                      placeholder="Women 18-45 | Skincare Enthusiasts"
                                      className="mt-2"
                                      disabled={currentStep === 'review'}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Coluna da Direita */}
                      <div className="w-1/2 p-8">
                        <div className="space-y-8">
                          {/* Target Details */}
                          <div className="bg-white rounded-lg border p-9 mt-[31px]">
                            <h3 className="text-lg font-semibold mb-8">Target Details</h3>
                            <div className="space-y-8">
                              <div>
                                <Label className="text-sm text-neutral-900">Audience</Label>
                                <Textarea
                                  value={formData.audience}
                                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                                  className="mt-2"
                                  placeholder="Describe your target audience"
                                  disabled={currentStep === 'review'}
                                />
                              </div>

                              <div>
                                <Label className="text-sm text-neutral-900">Interests</Label>
                                <Textarea
                                  value={formData.interests}
                                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                                  className="mt-2"
                                  placeholder="What are your audience's interests? (e.g., Skincare, Beauty & Personal Care, Self-Care)"
                                  disabled={currentStep === 'review'}
                                />
                              </div>

                              <div className="pt-6 border-t">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm text-neutral-600">Estimated Daily Reach</p>
                                    <p className="text-lg font-semibold mt-1">5,000 - 10,000 people/day</p>
                                  </div>
                                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Campaign Details Card */}
                          <div className="bg-white rounded-lg border p-8">
                            <h3 className="text-lg font-semibold mb-8">Campaign Details</h3>
                            <div className="space-y-8">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm text-neutral-900">Start Date</Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className={`w-full mt-2 justify-start text-left font-normal ${!formData.startDate && "text-neutral-500"}`}
                                        disabled={currentStep === 'review'}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.startDate ? format(new Date(formData.startDate), "PPP") : "Pick a date"}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={formData.startDate ? new Date(formData.startDate) : undefined}
                                        onSelect={(date) => setFormData({ ...formData, startDate: date?.toISOString() })}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>

                                <div>
                                  <Label className="text-sm text-neutral-900">End Date</Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className={`w-full mt-2 justify-start text-left font-normal ${!formData.endDate && "text-neutral-500"}`}
                                        disabled={currentStep === 'review'}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.endDate ? format(new Date(formData.endDate), "PPP") : "Pick a date"}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={formData.endDate ? new Date(formData.endDate) : undefined}
                                        onSelect={(date) => setFormData({ ...formData, endDate: date?.toISOString() })}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm text-neutral-900">Total Budget</Label>
                                  <div className="relative mt-2">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                                    <Input
                                      value={formData.budget}
                                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                      className="pl-7"
                                      disabled={currentStep === 'review'}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm text-neutral-900">Daily Budget</Label>
                                  <div className="relative mt-2">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                                    <Input
                                      value={formData.dailyBudget}
                                      onChange={(e) => setFormData({ ...formData, dailyBudget: e.target.value })}
                                      className="pl-7"
                                      disabled={currentStep === 'review'}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 max-w-3xl mx-auto">
                      <div className="space-y-8">
                        <div className="bg-white rounded-lg border p-8">
                          <h3 className="text-lg font-semibold mb-8">Campaign Information</h3>
                          <div className="space-y-8">
                            <div>
                              <Label className="text-sm text-neutral-900">Campaign URL</Label>
                              <Input
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                className="mt-2"
                                disabled={currentStep !== 'edit'}
                              />
                            </div>

                            <div>
                              <Label className="text-sm text-neutral-900">Platform</Label>
                              <Select
                                value={formData.platform}
                                onValueChange={(value) => setFormData({ ...formData, platform: value })}
                              >
                                <SelectTrigger className="mt-2">
                                  {formData.platform ? (
                                    <div className="flex items-center gap-2">
                                      {platformIcons[formData.platform as keyof typeof platformIcons]}
                                      <span className="capitalize">{formData.platform}</span>
                                    </div>
                                  ) : (
                                    <SelectValue placeholder="Choose a platform" />
                                  )}
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(platformIcons).map(([platform, icon]) => (
                                    <SelectItem key={platform} value={platform}>
                                      <div className="flex items-center gap-2">
                                        {icon}
                                        <span className="capitalize">{platform}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>


                        <div className="bg-white rounded-lg border p-8">
                          <h3 className="text-lg font-semibold mb-8">Creative</h3>
                          <div className="space-y-8">
                            <div>
                              <Label className="text-sm text-neutral-900">Primary Text</Label>
                              <div className="relative">
                                <Textarea
                                  value={formData.primaryText}
                                  onChange={(e) => {
                                    if (e.target.value.length <= 125) {
                                      setFormData({ ...formData, primaryText: e.target.value })
                                    }
                                  }}
                                  placeholder="Enter your ad's main message (max 125 characters)"
                                  className="mt-2 resize-none"
                                  rows={3}
                                  disabled={currentStep !== 'edit'}
                                />
                                <div className="absolute bottom-2 right-2 text-xs text-neutral-500">
                                  {formData.primaryText?.length || 0}/125
                                </div>
                              </div>
                            </div>

                            {/* Image */}
                            <div>
                              <Label className="text-sm text-neutral-900">Campaign Image</Label>
                              <div className="mt-2">
                                {formData.image ? (
                                  <div className="space-y-4">
                                    <div className="h-96 rounded-lg overflow-hidden bg-neutral-100">
                                      <img
                                        src={URL.createObjectURL(formData.image)}
                                        alt="Ad preview"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <Button
                                      variant="outline"
                                      onClick={() => setFormData({ ...formData, image: null })}
                                      className="text-red-500 hover:text-red-600"
                                    >
                                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      Remove Image
                                    </Button>
                                  </div>
                                ) : (
                                  <FileUploader
                                    value={formData.image}
                                    onChange={(file) => setFormData({ ...formData, image: file })}
                                    accept="image/*"
                                    maxSize={5 * 1024 * 1024}
                                  />
                                )}
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm text-neutral-900">Headline</Label>
                              <div className="relative">
                                <Input
                                  value={formData.headline}
                                  onChange={(e) => {
                                    if (e.target.value.length <= 40) {
                                      setFormData({ ...formData, headline: e.target.value })
                                    }
                                  }}
                                  placeholder="Enter a short, attention-grabbing headline"
                                  className="mt-2"
                                  disabled={currentStep !== 'edit'}
                                />
                                <div className="absolute right-2 top-1/2 text-xs text-neutral-500">
                                  {formData.headline?.length || 0}/40
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm text-neutral-900">Description</Label>
                              <div className="relative">
                                <Input
                                  value={formData.description}
                                  onChange={(e) => {
                                    if (e.target.value.length <= 30) {
                                      setFormData({ ...formData, description: e.target.value })
                                    }
                                  }}
                                  placeholder="Add a brief description"
                                  className="mt-2"
                                  disabled={currentStep !== 'edit'}
                                />
                                <div className="absolute right-2 top-1/2 text-xs text-neutral-500">
                                  {formData.description?.length || 0}/30
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border p-8">
                          <h3 className="text-lg font-semibold mb-8">Campaign Details</h3>
                          <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm text-neutral-900">Start Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={`w-full mt-2 justify-start text-left font-normal ${!formData.startDate && "text-neutral-500"}`}
                                      disabled={currentStep !== 'edit'}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {formData.startDate ? format(new Date(formData.startDate), "PPP") : "Pick a date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={formData.startDate ? new Date(formData.startDate) : undefined}
                                      onSelect={(date) => setFormData({ ...formData, startDate: date?.toISOString() })}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>

                              <div>
                                <Label className="text-sm text-neutral-900">End Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={`w-full mt-2 justify-start text-left font-normal ${!formData.endDate && "text-neutral-500"}`}
                                      disabled={currentStep !== 'edit'}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {formData.endDate ? format(new Date(formData.endDate), "PPP") : "Pick a date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={formData.endDate ? new Date(formData.endDate) : undefined}
                                      onSelect={(date) => setFormData({ ...formData, endDate: date?.toISOString() })}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm text-neutral-900">Total Budget</Label>
                                <div className="relative mt-2">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                                  <Input
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    className="pl-7"
                                    disabled={currentStep !== 'edit'}
                                  />
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm text-neutral-900">Daily Budget</Label>
                                <div className="relative mt-2">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                                  <Input
                                    value={formData.dailyBudget}
                                    onChange={(e) => setFormData({ ...formData, dailyBudget: e.target.value })}
                                    className="pl-7"
                                    disabled={currentStep !== 'edit'}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border p-8">
                          <h3 className="text-lg font-semibold mb-8">Target Details</h3>
                          <div className="space-y-8">
                            <div>
                              <Label className="text-sm text-neutral-900">Audience</Label>
                              <Textarea
                                value={formData.audience}
                                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                                className="mt-2"
                                placeholder="Describe your target audience"
                                disabled={currentStep !== 'edit'}
                              />
                            </div>

                            <div>
                              <Label className="text-sm text-neutral-900">Interests</Label>
                              <Textarea
                                value={formData.interests}
                                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                                className="mt-2"
                                placeholder="What are your audience's interests? (e.g., Skincare, Beauty & Personal Care, Self-Care)"
                                disabled={currentStep !== 'edit'}
                              />
                            </div>

                            <div className="pt-6 border-t">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-neutral-600">Estimated Daily Reach</p>
                                  <p className="text-lg font-semibold mt-1">5,000 - 10,000 people/day</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border p-8">
                          <h3 className="text-lg font-semibold mb-8">Campaign Naming</h3>
                          <div className="space-y-8">
                            <div>
                              <Label className="text-sm text-neutral-900">Campaign Name</Label>
                              <Input
                                value={formData.campaignName}
                                onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                                placeholder="Laleur - Skincare Awareness - Feb 2025"
                                className="mt-2"
                                disabled={currentStep !== 'edit'}
                              />
                            </div>

                            <div>
                              <Label className="text-sm text-neutral-900">Ad Set Name</Label>
                              <Input
                                value={formData.adSetName}
                                onChange={(e) => setFormData({ ...formData, adSetName: e.target.value })}
                                placeholder="Women 18-45 | Skincare Enthusiasts"
                                className="mt-2"
                                disabled={currentStep !== 'edit'}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-200 mt-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className={`
                      ${currentStep === 'basic' ? 'invisible' : ''}
                      hover:bg-neutral-100 text-neutral-600
                    `}
                  >
                    Back
                  </Button>
                  <div className="flex gap-3">
                    {currentStep === 'review' ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep('edit')}
                          className="flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Edit All
                        </Button>
                        <Button
                          onClick={handleNext}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Launch Campaign
                        </Button>
                      </>
                    ) : currentStep === 'edit' ? (
                      <Button
                        onClick={handleNext}
                        className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Continue
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}