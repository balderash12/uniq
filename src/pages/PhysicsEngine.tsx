import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Layers,
  Zap,
  Gauge,
  Atom,
  Globe,
  Sliders,
  Info,
  Save,
  Download,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function PhysicsEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [gravity, setGravity] = useState(9.81);
  const [friction, setFriction] = useState(0.5);
  const [density, setDensity] = useState(1.0);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // 3D Sphere rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.3;
    let angle = 0;

    const drawSphere = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw sphere with 3D effect
      const gradient = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        0,
        centerX,
        centerY,
        radius
      );
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.8)");
      gradient.addColorStop(0.5, "rgba(37, 99, 235, 0.6)");
      gradient.addColorStop(1, "rgba(29, 78, 216, 0.4)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw grid lines for 3D effect
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;

      // Horizontal lines
      for (let i = -2; i <= 2; i++) {
        const y = centerY + (i * radius * 0.3);
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.sqrt(radius * radius - (y - centerY) * (y - centerY)), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Vertical lines
      for (let i = 0; i < 8; i++) {
        const a = (angle + (i * Math.PI / 4)) % (Math.PI * 2);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(a) * radius,
          centerY + Math.sin(a) * radius
        );
        ctx.stroke();
      }

      if (isPlaying) {
        angle += rotationSpeed * 0.02;
      }
    };

    const animate = () => {
      drawSphere();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, rotationSpeed]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Atom className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold">Physics Engine</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Physics Parameters */}
        <div className="w-80 border-r border-border bg-card/30 overflow-y-auto shrink-0">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold">Physics Parameters</h2>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Environment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gravity" className="text-xs">
                    Gravity (m/s²)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      id="gravity"
                      value={[gravity]}
                      onValueChange={(value) => setGravity(value[0])}
                      min={0}
                      max={20}
                      step={0.1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={gravity.toFixed(2)}
                      onChange={(e) => setGravity(parseFloat(e.target.value) || 0)}
                      className="w-20 h-8 text-xs"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="friction" className="text-xs">
                    Friction Coefficient
                  </Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      id="friction"
                      value={[friction]}
                      onValueChange={(value) => setFriction(value[0])}
                      min={0}
                      max={1}
                      step={0.01}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={friction.toFixed(2)}
                      onChange={(e) => setFriction(parseFloat(e.target.value) || 0)}
                      className="w-20 h-8 text-xs"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="density" className="text-xs">
                    Density (kg/m³)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      id="density"
                      value={[density]}
                      onValueChange={(value) => setDensity(value[0])}
                      min={0}
                      max={10}
                      step={0.1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={density.toFixed(2)}
                      onChange={(e) => setDensity(parseFloat(e.target.value) || 0)}
                      className="w-20 h-8 text-xs"
                      step="0.1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Dynamics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rotation" className="text-xs">
                    Rotation Speed
                  </Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      id="rotation"
                      value={[rotationSpeed]}
                      onValueChange={(value) => setRotationSpeed(value[0])}
                      min={0}
                      max={2}
                      step={0.1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={rotationSpeed.toFixed(2)}
                      onChange={(e) => setRotationSpeed(parseFloat(e.target.value) || 0)}
                      className="w-20 h-8 text-xs"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Simulation Time</Label>
                  <div className="text-sm font-mono text-muted-foreground">
                    {time.toFixed(2)}s
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Material Properties
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Elasticity</span>
                  <Badge variant="outline">0.8</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Restitution</span>
                  <Badge variant="outline">0.6</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Viscosity</span>
                  <Badge variant="outline">0.1</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Center Viewport - 3D Sphere */}
        <div className="flex-1 relative bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ imageRendering: "crisp-edges" }}
            />
          </div>
          <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm border border-border rounded-lg px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>Viewport: 3D Sphere</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Detailed Associations */}
        <div className="w-80 border-l border-border bg-card/30 overflow-y-auto shrink-0">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold">Properties & Associations</h2>
            </div>

            <Tabs defaultValue="properties" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="properties" className="text-xs">Properties</TabsTrigger>
                <TabsTrigger value="associations" className="text-xs">Associations</TabsTrigger>
              </TabsList>

              <TabsContent value="properties" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Object Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Position</Label>
                      <div className="flex gap-2">
                        <Input placeholder="X" defaultValue="0.0" className="h-7 text-xs" />
                        <Input placeholder="Y" defaultValue="0.0" className="h-7 text-xs" />
                        <Input placeholder="Z" defaultValue="0.0" className="h-7 text-xs" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Rotation</Label>
                      <div className="flex gap-2">
                        <Input placeholder="X" defaultValue="0.0" className="h-7 text-xs" />
                        <Input placeholder="Y" defaultValue="0.0" className="h-7 text-xs" />
                        <Input placeholder="Z" defaultValue="0.0" className="h-7 text-xs" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Scale</Label>
                      <div className="flex gap-2">
                        <Input placeholder="X" defaultValue="1.0" className="h-7 text-xs" />
                        <Input placeholder="Y" defaultValue="1.0" className="h-7 text-xs" />
                        <Input placeholder="Z" defaultValue="1.0" className="h-7 text-xs" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Physical Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mass</span>
                      <span className="font-mono">1.0 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume</span>
                      <span className="font-mono">0.52 m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Surface Area</span>
                      <span className="font-mono">3.14 m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Momentum</span>
                      <span className="font-mono">0.0 N·s</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="associations" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Force Associations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded border border-border">
                      <span>Gravitational Force</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded border border-border">
                      <span>Frictional Force</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded border border-border">
                      <span>Normal Force</span>
                      <Badge variant="outline">Inactive</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Constraint Associations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="p-2 rounded border border-border">
                      <div className="font-medium mb-1">Boundary Constraints</div>
                      <div className="text-muted-foreground">X: [-10, 10]</div>
                      <div className="text-muted-foreground">Y: [-10, 10]</div>
                      <div className="text-muted-foreground">Z: [-10, 10]</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Bottom Control Panel */}
      <div className="h-20 border-t border-border bg-card/50 backdrop-blur flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTime(0);
                setIsPlaying(false);
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Time:</span>
            <span className="font-mono">{time.toFixed(2)}s</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>FPS:</span>
            <span className="font-mono">60</span>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Objects:</span>
            <span className="font-mono">1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
