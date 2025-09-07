'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Wand2, Download, Eye, Share2, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { toast } from 'sonner';

interface DesignResult {
  floorPlan: string;
  rooms: Array<{ name: string; area: number }>;
  totalArea: number;
  estimatedCost: number;
  materials: Array<{ name: string; quantity: string; cost: number }>;
  features: string[];
}

export default function AIPlanner() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [designResult, setDesignResult] = useState<DesignResult | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    budget: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    style: '',
    features: '',
  });

  const handleGenerate = async () => {
    if (!formData.description || !formData.budget) {
      toast.error('Please fill in the description and budget fields');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Simulate AI generation process
    const steps = [
      { message: 'Analyzing requirements...', progress: 20 },
      { message: 'Generating floor plan...', progress: 40 },
      { message: 'Calculating materials...', progress: 60 },
      { message: 'Estimating costs...', progress: 80 },
      { message: 'Finalizing design...', progress: 100 },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(step.progress);
      toast.info(step.message);
    }

    // Mock generated result
    const mockResult: DesignResult = {
      floorPlan: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800',
      rooms: [
        { name: 'Living Room', area: 250 },
        { name: 'Master Bedroom', area: 180 },
        { name: 'Bedroom 2', area: 150 },
        { name: 'Kitchen', area: 120 },
        { name: 'Bathroom 1', area: 60 },
        { name: 'Bathroom 2', area: 45 },
      ],
      totalArea: parseInt(formData.bedrooms) * 200 + 400,
      estimatedCost: parseInt(formData.budget.replace(/[^\d]/g, '')) || 1500000,
      materials: [
        { name: 'Cement', quantity: '50 bags', cost: 25000 },
        { name: 'Steel Bars', quantity: '2 tons', cost: 120000 },
        { name: 'Bricks', quantity: '8000 pieces', cost: 80000 },
        { name: 'Tiles', quantity: '200 sq ft', cost: 60000 },
        { name: 'Paint', quantity: '100 liters', cost: 30000 },
      ],
      features: [
        'Energy-efficient windows',
        'Smart home automation',
        'Solar panel ready roof',
        'Rainwater harvesting',
        'Modular kitchen design',
      ],
    };

    setDesignResult(mockResult);
    setIsGenerating(false);
    toast.success('AI design generated successfully!');
  };

  const samplePrompts = [
    'Modern 3BHK house under ₹20 lakh in Mumbai with smart home features',
    'Traditional 2BHK villa in Kerala style within ₹15 lakh budget',
    'Contemporary 4BHK duplex with garden in Bangalore for ₹35 lakh',
    'Minimalist 1BHK apartment in Delhi under ₹12 lakh',
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI House Planner</h1>
            <p className="text-gray-600 dark:text-gray-300">Describe your dream home and let AI design it for you</p>
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Sparkles className="mr-1 h-4 w-4" />
            Powered by AI
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wand2 className="h-5 w-5" />
                <span>Describe Your Dream Home</span>
              </CardTitle>
              <CardDescription>
                Provide details about your ideal house and let AI create the perfect design
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sample Prompts */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Quick Start Templates</Label>
                <div className="grid grid-cols-1 gap-2">
                  {samplePrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start h-auto p-3 text-left text-xs leading-relaxed"
                      onClick={() => setFormData(prev => ({ ...prev, description: prompt }))}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Main Description */}
              <div className="space-y-2">
                <Label htmlFor="description">House Description *</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Modern 3BHK house under ₹20 lakh in Mumbai with smart home features, open kitchen, and parking space..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[120px]"
                />
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label htmlFor="budget">Budget *</Label>
                <Input
                  id="budget"
                  placeholder="e.g., ₹20,00,000"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Mumbai, Maharashtra"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>

                {/* Style */}
                <div className="space-y-2">
                  <Label htmlFor="style">Architecture Style</Label>
                  <Select value={formData.style} onValueChange={(value) => setFormData(prev => ({ ...prev, style: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="traditional">Traditional</SelectItem>
                      <SelectItem value="contemporary">Contemporary</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="kerala">Kerala Style</SelectItem>
                      <SelectItem value="punjabi">Punjabi Style</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bedrooms */}
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Select value={formData.bedrooms} onValueChange={(value) => setFormData(prev => ({ ...prev, bedrooms: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 BHK</SelectItem>
                      <SelectItem value="2">2 BHK</SelectItem>
                      <SelectItem value="3">3 BHK</SelectItem>
                      <SelectItem value="4">4 BHK</SelectItem>
                      <SelectItem value="5">5+ BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bathrooms */}
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Select value={formData.bathrooms} onValueChange={(value) => setFormData(prev => ({ ...prev, bathrooms: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Special Features */}
              <div className="space-y-2">
                <Label htmlFor="features">Special Features (Optional)</Label>
                <Textarea
                  id="features"
                  placeholder="e.g., Swimming pool, garden, solar panels, smart home automation, parking..."
                  value={formData.features}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Design...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Design
                  </>
                )}
              </Button>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating your design...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Generated Design</CardTitle>
              <CardDescription>
                Your AI-generated house design with cost estimation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {designResult ? (
                <div className="space-y-6">
                  {/* Floor Plan Preview */}
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={designResult.floorPlan}
                      alt="Generated Floor Plan"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Generated
                      </Badge>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{designResult.totalArea}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Area (sq ft)</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">₹{(designResult.estimatedCost / 100000).toFixed(1)}L</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Estimated Cost</p>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div>
                    <h4 className="font-semibold mb-3">Room Breakdown</h4>
                    <div className="space-y-2">
                      {designResult.rooms.map((room, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <span className="text-sm">{room.name}</span>
                          <span className="text-sm font-medium">{room.area} sq ft</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold mb-3">Recommended Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {designResult.features.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-4 w-4" />
                      View 3D
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-1 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Ready to Generate</h3>
                  <p className="text-gray-500 dark:text-gray-400">Fill in the form and click generate to see your AI-designed house</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}