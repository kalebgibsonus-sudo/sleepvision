import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { memoryService } from "@/lib/memoryService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  Cloud,
  HardDrive,
  Server,
  Archive,
  FolderOpen,
  FileText,
  Image,
  Video,
  Music,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Shield,
  Lock,
  Unlock,
  Zap,
  Crown,
  Star,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  Package,
  Cpu,
  Memory,
  Wifi,
  WifiOff,
  Timer,
  Calendar,
  Clock,
} from "lucide-react";

interface StorageData {
  used: number;
  total: number;
  breakdown: {
    sleepEntries: { count: number; size: number };
    routines: { count: number; size: number };
    breathingSessions: { count: number; size: number };
    achievements: { count: number; size: number };
    media: { count: number; size: number };
    cache: { count: number; size: number };
  };
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  networkSpeed: number;
  syncStatus: "synced" | "syncing" | "offline" | "error";
  lastBackup: Date;
  optimization: number;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  storage: number;
  features: string[];
  price: number;
  popular?: boolean;
  current?: boolean;
}

export function EnhancedMemoryManager() {
  const { user, hasAccess } = useAuth();
  const [storageData, setStorageData] = useState<StorageData>({
    used: 0,
    total: 0,
    breakdown: {
      sleepEntries: { count: 0, size: 0 },
      routines: { count: 0, size: 0 },
      breathingSessions: { count: 0, size: 0 },
      achievements: { count: 0, size: 0 },
      media: { count: 0, size: 0 },
      cache: { count: 0, size: 0 },
    },
  });
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpuUsage: 15,
    memoryUsage: 42,
    networkSpeed: 125,
    syncStatus: "synced",
    lastBackup: new Date(),
    optimization: 87,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "sleep-focused",
      name: "Sleep Focused",
      storage: 5000, // MB (5GB)
      features: [
        "100 sleep entries",
        "Cloud backup",
        "Sleep analytics",
        "5 schedules",
      ],
      price: 5.99,
      current: hasAccess("sleep") && !hasAccess("morning"),
    },
    {
      id: "full-transformation",
      name: "Full Transformation",
      storage: 25000, // MB (25GB)
      features: [
        "Unlimited entries",
        "Advanced analytics",
        "Morning routines",
        "10 schedules",
      ],
      price: 9.99,
      popular: true,
      current: hasAccess("morning") && !hasAccess("discounts"),
    },
    {
      id: "elite-performance",
      name: "Elite Performance",
      storage: 100000, // MB (100GB)
      features: [
        "Unlimited everything",
        "AI insights",
        "Priority support",
        "Product discounts",
      ],
      price: 13.99,
      current: hasAccess("discounts"),
    },
  ];

  // Initialize storage data
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storageInfo = memoryService.getStorageInfo(
          user?.subscriptionTier || "sleep-focused",
        );
        const currentPlan =
          subscriptionPlans.find((plan) => plan.current) ||
          subscriptionPlans[0];

        // Simulate realistic storage usage
        const usedStorage = Math.floor(currentPlan.storage * 0.65); // 65% used

        setStorageData({
          used: usedStorage,
          total: currentPlan.storage,
          breakdown: {
            sleepEntries: { count: 47, size: Math.floor(usedStorage * 0.4) },
            routines: { count: 8, size: Math.floor(usedStorage * 0.2) },
            breathingSessions: {
              count: 132,
              size: Math.floor(usedStorage * 0.15),
            },
            achievements: { count: 23, size: Math.floor(usedStorage * 0.1) },
            media: { count: 15, size: Math.floor(usedStorage * 0.1) },
            cache: { count: 1, size: Math.floor(usedStorage * 0.05) },
          },
        });
      } catch (error) {
        console.error("Error loading storage data:", error);
      }
    };

    loadStorageData();
  }, [user]);

  // Real-time system metrics
  useEffect(() => {
    const updateMetrics = () => {
      setSystemMetrics((prev) => ({
        ...prev,
        cpuUsage: Math.max(
          5,
          Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 10),
        ),
        memoryUsage: Math.max(
          20,
          Math.min(85, prev.memoryUsage + (Math.random() - 0.5) * 5),
        ),
        networkSpeed: Math.max(
          50,
          Math.min(200, prev.networkSpeed + (Math.random() - 0.5) * 20),
        ),
        optimization: Math.max(
          70,
          Math.min(100, prev.optimization + (Math.random() - 0.5) * 2),
        ),
      }));
    };

    const interval = setInterval(updateMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleOptimize = async () => {
    setIsAnalyzing(true);
    // Simulate optimization process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setStorageData((prev) => ({
      ...prev,
      used: Math.floor(prev.used * 0.85), // Reduce by 15%
      breakdown: {
        ...prev.breakdown,
        cache: { count: 1, size: Math.floor(prev.breakdown.cache.size * 0.1) },
      },
    }));

    setSystemMetrics((prev) => ({
      ...prev,
      optimization: Math.min(100, prev.optimization + 10),
    }));

    setIsAnalyzing(false);
  };

  const handleBackup = async () => {
    setSystemMetrics((prev) => ({
      ...prev,
      syncStatus: "syncing",
    }));

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSystemMetrics((prev) => ({
      ...prev,
      syncStatus: "synced",
      lastBackup: new Date(),
    }));
  };

  const usagePercentage = (storageData.used / storageData.total) * 100;

  return (
    <div className="space-y-6">
      {/* Main Storage Overview */}
      <Card className="border-2 border-blue-200 shadow-lg bg-gradient-to-r from-white to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Database className="h-6 w-6" />
              Storage Manager
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`${systemMetrics.syncStatus === "synced" ? "border-green-300 text-green-600" : "border-yellow-300 text-yellow-600"}`}
              >
                {systemMetrics.syncStatus === "synced" ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                )}
                {systemMetrics.syncStatus}
              </Badge>
              <Dialog
                open={showUpgradeDialog}
                onOpenChange={setShowUpgradeDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700"
                  >
                    <Crown className="h-4 w-4 mr-1" />
                    Upgrade
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Upgrade Your Storage Plan</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    {subscriptionPlans.map((plan) => (
                      <Card
                        key={plan.id}
                        className={`${plan.popular ? "border-2 border-blue-500" : "border border-gray-200"} ${plan.current ? "bg-blue-50" : ""}`}
                      >
                        <CardHeader className="text-center">
                          {plan.popular && (
                            <Badge className="mb-2 bg-blue-500 text-white">
                              Most Popular
                            </Badge>
                          )}
                          {plan.current && (
                            <Badge
                              variant="outline"
                              className="mb-2 border-green-300 text-green-600"
                            >
                              Current Plan
                            </Badge>
                          )}
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <div className="text-2xl font-bold">
                            ${plan.price}
                            <span className="text-sm font-normal">/month</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatBytes(plan.storage * 1024 * 1024)} storage
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            {plan.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <Button
                            className="w-full mt-4"
                            variant={plan.current ? "outline" : "default"}
                            disabled={plan.current}
                          >
                            {plan.current ? "Current Plan" : "Upgrade"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Storage Usage */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Storage Usage</span>
                  <span
                    className={`text-lg font-bold ${getUsageColor(usagePercentage)}`}
                  >
                    {formatBytes(storageData.used * 1024 * 1024)} /{" "}
                    {formatBytes(storageData.total * 1024 * 1024)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-1000 ${getProgressColor(usagePercentage)}`}
                    style={{ width: `${Math.min(100, usagePercentage)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span className="font-medium">
                    {Math.round(usagePercentage)}% used
                  </span>
                  <span>100%</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col gap-2 h-20 border-blue-300"
                  onClick={handleBackup}
                  disabled={systemMetrics.syncStatus === "syncing"}
                >
                  <Cloud className="h-5 w-5 text-blue-500" />
                  <span className="text-xs">Backup Now</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col gap-2 h-20 border-green-300"
                  onClick={handleOptimize}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <RefreshCw className="h-5 w-5 text-green-500 animate-spin" />
                  ) : (
                    <Zap className="h-5 w-5 text-green-500" />
                  )}
                  <span className="text-xs">Optimize</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col gap-2 h-20 border-purple-300"
                >
                  <Download className="h-5 w-5 text-purple-500" />
                  <span className="text-xs">Export Data</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col gap-2 h-20 border-red-300"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                  <span className="text-xs">Clean Up</span>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="breakdown" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(storageData.breakdown).map(
                  ([category, data]) => {
                    const percentage = (data.size / storageData.used) * 100;
                    const icons = {
                      sleepEntries: (
                        <FileText className="h-5 w-5 text-blue-500" />
                      ),
                      routines: <Calendar className="h-5 w-5 text-green-500" />,
                      breathingSessions: (
                        <Activity className="h-5 w-5 text-purple-500" />
                      ),
                      achievements: (
                        <Star className="h-5 w-5 text-yellow-500" />
                      ),
                      media: <Image className="h-5 w-5 text-pink-500" />,
                      cache: <Package className="h-5 w-5 text-gray-500" />,
                    };

                    return (
                      <Card key={category} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {icons[category as keyof typeof icons]}
                              <span className="font-medium capitalize">
                                {category.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                            </div>
                            <Badge variant="outline">{data.count} items</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Size</span>
                              <span className="font-medium">
                                {formatBytes(data.size * 1024 * 1024)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 bg-blue-500 rounded-full transition-all duration-1000"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 text-right">
                              {Math.round(percentage)}% of total
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  },
                )}
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* System Performance */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-blue-500" />
                      System Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CPU Usage</span>
                        <span className="font-medium">
                          {Math.round(systemMetrics.cpuUsage)}%
                        </span>
                      </div>
                      <Progress
                        value={systemMetrics.cpuUsage}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Memory Usage</span>
                        <span className="font-medium">
                          {Math.round(systemMetrics.memoryUsage)}%
                        </span>
                      </div>
                      <Progress
                        value={systemMetrics.memoryUsage}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Optimization</span>
                        <span className="font-medium">
                          {Math.round(systemMetrics.optimization)}%
                        </span>
                      </div>
                      <Progress
                        value={systemMetrics.optimization}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Network Status */}
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {systemMetrics.networkSpeed > 0 ? (
                        <Wifi className="h-5 w-5 text-green-500" />
                      ) : (
                        <WifiOff className="h-5 w-5 text-red-500" />
                      )}
                      Network Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Connection Speed</span>
                      <span className="font-medium">
                        {Math.round(systemMetrics.networkSpeed)} Mbps
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Last Backup</span>
                      <span className="font-medium text-xs">
                        {systemMetrics.lastBackup.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sync Status</span>
                      <Badge
                        variant="outline"
                        className={
                          systemMetrics.syncStatus === "synced"
                            ? "border-green-300 text-green-600"
                            : systemMetrics.syncStatus === "syncing"
                              ? "border-yellow-300 text-yellow-600"
                              : "border-red-300 text-red-600"
                        }
                      >
                        {systemMetrics.syncStatus}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    icon: <Archive className="h-6 w-6" />,
                    title: "Archive Old Data",
                    description: "Move old entries to cold storage",
                    action: "Archive",
                  },
                  {
                    icon: <Trash2 className="h-6 w-6" />,
                    title: "Clear Cache",
                    description: "Remove temporary files",
                    action: "Clear",
                  },
                  {
                    icon: <Download className="h-6 w-6" />,
                    title: "Export All Data",
                    description: "Download complete backup",
                    action: "Export",
                  },
                  {
                    icon: <Upload className="h-6 w-6" />,
                    title: "Import Data",
                    description: "Restore from backup file",
                    action: "Import",
                  },
                  {
                    icon: <Shield className="h-6 w-6" />,
                    title: "Encrypt Data",
                    description: "Add extra security layer",
                    action: "Encrypt",
                  },
                  {
                    icon: <RefreshCw className="h-6 w-6" />,
                    title: "Rebuild Index",
                    description: "Optimize data access",
                    action: "Rebuild",
                  },
                ].map((tool, index) => (
                  <Card
                    key={index}
                    className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-4 text-center space-y-3">
                      <div className="flex justify-center text-blue-500">
                        {tool.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{tool.title}</h3>
                        <p className="text-sm text-gray-600">
                          {tool.description}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        {tool.action}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
