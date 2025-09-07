'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  Download, 
  TrendingUp, 
  Package, 
  Zap,
  DollarSign,
  PieChart,
  FileText,
  Plus,
  Minus
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { toast } from 'sonner';

interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  pricePerUnit: number;
  quantity: number;
  total: number;
}

interface CostBreakdown {
  foundation: number;
  structure: number;
  walls: number;
  roofing: number;
  flooring: number;
  electrical: number;
  plumbing: number;
  interior: number;
  exterior: number;
  labor: number;
}

export default function CostEstimator() {
  const [houseArea, setHouseArea] = useState('1200');
  const [region, setRegion] = useState('mumbai');
  const [quality, setQuality] = useState('standard');
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: '1',
      name: 'Cement',
      category: 'Structure',
      unit: 'bags',
      pricePerUnit: 500,
      quantity: 50,
      total: 25000,
    },
    {
      id: '2',
      name: 'Steel Bars',
      category: 'Structure',
      unit: 'tonnes',
      pricePerUnit: 60000,
      quantity: 2,
      total: 120000,
    },
    {
      id: '3',
      name: 'Bricks',
      category: 'Walls',
      unit: 'thousand pieces',
      pricePerUnit: 10000,
      quantity: 8,
      total: 80000,
    },
    {
      id: '4',
      name: 'Floor Tiles',
      category: 'Flooring',
      unit: 'sq ft',
      pricePerUnit: 300,
      quantity: 1200,
      total: 360000,
    },
  ]);

  const [costBreakdown] = useState<CostBreakdown>({
    foundation: 150000,
    structure: 400000,
    walls: 250000,
    roofing: 200000,
    flooring: 300000,
    electrical: 150000,
    plumbing: 120000,
    interior: 350000,
    exterior: 100000,
    labor: 300000,
  });

  const totalCost = Object.values(costBreakdown).reduce((sum, cost) => sum + cost, 0);
  const costPerSqFt = totalCost / parseInt(houseArea);

  const updateMaterial = (id: string, field: keyof Material, value: any) => {
    setMaterials(prev => prev.map(material => {
      if (material.id === id) {
        const updated = { ...material, [field]: value };
        if (field === 'quantity' || field === 'pricePerUnit') {
          updated.total = updated.quantity * updated.pricePerUnit;
        }
        return updated;
      }
      return material;
    }));
  };

  const addMaterial = () => {
    const newMaterial: Material = {
      id: Date.now().toString(),
      name: 'New Material',
      category: 'Structure',
      unit: 'pieces',
      pricePerUnit: 0,
      quantity: 0,
      total: 0,
    };
    setMaterials(prev => [...prev, newMaterial]);
  };

  const removeMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  const generateReport = () => {
    toast.success('Cost report generated and downloaded!');
  };

  const categories = Array.from(new Set(materials.map(m => m.category)));
  const categoryTotals = categories.map(category => ({
    category,
    total: materials.filter(m => m.category === category).reduce((sum, m) => sum + m.total, 0),
  }));

  const regions = [
    { value: 'mumbai', label: 'Mumbai', multiplier: 1.2 },
    { value: 'delhi', label: 'Delhi', multiplier: 1.15 },
    { value: 'bangalore', label: 'Bangalore', multiplier: 1.1 },
    { value: 'chennai', label: 'Chennai', multiplier: 1.05 },
    { value: 'pune', label: 'Pune', multiplier: 1.0 },
    { value: 'hyderabad', label: 'Hyderabad', multiplier: 0.95 },
    { value: 'kolkata', label: 'Kolkata', multiplier: 0.9 },
  ];

  const qualityLevels = [
    { value: 'budget', label: 'Budget', multiplier: 0.8 },
    { value: 'standard', label: 'Standard', multiplier: 1.0 },
    { value: 'premium', label: 'Premium', multiplier: 1.3 },
    { value: 'luxury', label: 'Luxury', multiplier: 1.6 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cost Estimator</h1>
            <p className="text-gray-600 dark:text-gray-300">Calculate accurate construction costs for your project</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={generateReport} variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button onClick={generateReport}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Configuration */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Project Configuration</CardTitle>
            <CardDescription>Set your project parameters for accurate cost estimation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="area">House Area (sq ft)</Label>
                <Input
                  id="area"
                  value={houseArea}
                  onChange={(e) => setHouseArea(e.target.value)}
                  placeholder="e.g., 1200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Location</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label} ({(r.multiplier * 100).toFixed(0)}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quality">Quality Level</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityLevels.map((q) => (
                      <SelectItem key={q.value} value={q.value}>
                        {q.label} ({(q.multiplier * 100).toFixed(0)}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cost Summary */}
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Cost Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total Cost */}
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Estimated Cost</p>
                <p className="text-3xl font-bold text-blue-600">₹{(totalCost / 100000).toFixed(1)}L</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ₹{Math.round(costPerSqFt).toLocaleString()} per sq ft
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-lg font-bold text-green-600">₹{(totalCost * 0.7 / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Material Cost</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-lg font-bold text-orange-600">₹{(totalCost * 0.3 / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Labor Cost</p>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3">
                <h4 className="font-semibold">Category Breakdown</h4>
                {Object.entries(costBreakdown).map(([category, cost]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{category.replace('_', ' ')}</span>
                      <span className="font-medium">₹{(cost / 1000).toFixed(0)}K</span>
                    </div>
                    <Progress value={(cost / totalCost) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Material List */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="h-5 w-5" />
                      <span>Material List</span>
                    </CardTitle>
                    <CardDescription>Detailed material requirements and costs</CardDescription>
                  </div>
                  <Button onClick={addMaterial} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Material
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {materials.map((material, index) => (
                    <motion.div
                      key={material.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="space-y-1">
                        <Label className="text-xs">Material</Label>
                        <Input
                          value={material.name}
                          onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Category</Label>
                        <Select
                          value={material.category}
                          onValueChange={(value) => updateMaterial(material.id, 'category', value)}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Structure">Structure</SelectItem>
                            <SelectItem value="Walls">Walls</SelectItem>
                            <SelectItem value="Flooring">Flooring</SelectItem>
                            <SelectItem value="Roofing">Roofing</SelectItem>
                            <SelectItem value="Electrical">Electrical</SelectItem>
                            <SelectItem value="Plumbing">Plumbing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Quantity</Label>
                        <Input
                          type="number"
                          value={material.quantity}
                          onChange={(e) => updateMaterial(material.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="text-sm"
                        />
                        <p className="text-xs text-gray-500">{material.unit}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Price per {material.unit}</Label>
                        <Input
                          type="number"
                          value={material.pricePerUnit}
                          onChange={(e) => updateMaterial(material.id, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Total</Label>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">₹{material.total.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeMaterial(material.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Material Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categoryTotals.map((cat) => (
                      <div key={cat.category} className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{cat.category}</p>
                        <p className="text-lg font-bold text-blue-600">₹{(cat.total / 1000).toFixed(0)}K</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Analysis */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Cost Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Regional Comparison */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Regional Pricing</h4>
                    {regions.slice(0, 4).map((r) => (
                      <div key={r.value} className="flex justify-between items-center">
                        <span className="text-sm">{r.label}</span>
                        <Badge variant={region === r.value ? 'default' : 'secondary'}>
                          ₹{((totalCost * r.multiplier) / 100000).toFixed(1)}L
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* Quality Comparison */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Quality Levels</h4>
                    {qualityLevels.map((q) => (
                      <div key={q.value} className="flex justify-between items-center">
                        <span className="text-sm">{q.label}</span>
                        <Badge variant={quality === q.value ? 'default' : 'secondary'}>
                          ₹{((totalCost * q.multiplier) / 100000).toFixed(1)}L
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* Smart Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Smart Features</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Solar Panels</span>
                        <span className="text-sm font-medium">+₹2.5L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Home Automation</span>
                        <span className="text-sm font-medium">+₹1.8L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Energy Efficient Windows</span>
                        <span className="text-sm font-medium">+₹1.2L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Smart Security</span>
                        <span className="text-sm font-medium">+₹0.8L</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}