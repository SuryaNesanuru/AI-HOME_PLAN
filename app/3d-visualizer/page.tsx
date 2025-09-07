'use client';

import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Plane, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Cuboid as Cube, RotateCcw, ZoomIn, ZoomOut, Download, Camera, Sun, Move3D, Eye, Settings } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { toast } from 'sonner';

interface Room3D {
  id: string;
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  type: string;
}

const mockRooms: Room3D[] = [
  {
    id: '1',
    name: 'Living Room',
    position: [0, 0.5, 0],
    size: [6, 1, 4],
    color: '#3B82F6',
    type: 'living-room',
  },
  {
    id: '2',
    name: 'Kitchen',
    position: [7, 0.5, 0],
    size: [4, 1, 3],
    color: '#F59E0B',
    type: 'kitchen',
  },
  {
    id: '3',
    name: 'Master Bedroom',
    position: [0, 0.5, -5],
    size: [5, 1, 4],
    color: '#10B981',
    type: 'bedroom',
  },
  {
    id: '4',
    name: 'Bathroom',
    position: [6, 0.5, -5],
    size: [2.5, 1, 2.5],
    color: '#8B5CF6',
    type: 'bathroom',
  },
];

function Room({ room, isSelected, onClick }: { room: Room3D; isSelected: boolean; onClick: () => void }) {
  return (
    <group onClick={onClick}>
      <Box
        position={room.position}
        args={room.size}
        onClick={onClick}
      >
        <meshStandardMaterial 
          color={room.color} 
          opacity={isSelected ? 0.8 : 0.6}
          transparent
        />
      </Box>
      <Text
        position={[room.position[0], room.position[1] + room.size[1]/2 + 0.3, room.position[2]]}
        fontSize={0.3}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {room.name}
      </Text>
    </group>
  );
}

function Floor() {
  return (
    <Plane
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      args={[20, 20]}
    >
      <meshStandardMaterial color="#E5E7EB" opacity={0.8} transparent />
    </Plane>
  );
}

function Scene({ rooms, selectedRoom, onRoomClick }: { 
  rooms: Room3D[];
  selectedRoom: string | null;
  onRoomClick: (roomId: string) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Floor />
      {rooms.map((room) => (
        <Room
          key={room.id}
          room={room}
          isSelected={selectedRoom === room.id}
          onClick={() => onRoomClick(room.id)}
        />
      ))}
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={50}
      />
    </>
  );
}

export default function Visualizer3D() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [rooms] = useState<Room3D[]>(mockRooms);
  const [lightIntensity, setLightIntensity] = useState([1]);
  const [cameraView, setCameraView] = useState('perspective');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedRoomData = selectedRoom ? rooms.find(r => r.id === selectedRoom) : null;

  const takeScreenshot = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = '3d-house-view.png';
      link.href = canvas.toDataURL();
      link.click();
      toast.success('Screenshot saved!');
    }
  };

  const resetView = () => {
    // In a real implementation, this would reset the camera position
    toast.success('View reset to default');
  };

  const exportModel = () => {
    // In a real implementation, this would export to glTF/OBJ
    toast.success('3D model exported successfully!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">3D Visualizer</h1>
            <p className="text-gray-600 dark:text-gray-300">Explore your house design in immersive 3D</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={takeScreenshot} variant="outline">
              <Camera className="mr-2 h-4 w-4" />
              Screenshot
            </Button>
            <Button onClick={exportModel}>
              <Download className="mr-2 h-4 w-4" />
              Export Model
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls */}
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Controls</span>
              </CardTitle>
              <CardDescription>Customize your 3D view</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* View Controls */}
              <div className="space-y-3">
                <Label>Camera Views</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={cameraView === 'perspective' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setCameraView('perspective')}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    3D
                  </Button>
                  <Button 
                    variant={cameraView === 'top' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setCameraView('top')}
                  >
                    <Move3D className="mr-1 h-3 w-3" />
                    Top
                  </Button>
                </div>
              </div>

              {/* Lighting */}
              <div className="space-y-3">
                <Label>Lighting Intensity</Label>
                <Slider
                  value={lightIntensity}
                  onValueChange={setLightIntensity}
                  max={2}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Dark</span>
                  <span>{lightIntensity[0].toFixed(1)}</span>
                  <span>Bright</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={resetView}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset View
                </Button>
              </div>

              {/* Navigation Tips */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Navigation</h4>
                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  <p><strong>Left click + drag:</strong> Rotate view</p>
                  <p><strong>Right click + drag:</strong> Pan view</p>
                  <p><strong>Scroll wheel:</strong> Zoom in/out</p>
                  <p><strong>Click room:</strong> Select and inspect</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3D Canvas */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>3D View</CardTitle>
                    <CardDescription>Interactive 3D model of your house</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    <Cube className="mr-1 h-4 w-4" />
                    Real-time 3D
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden">
                  <Canvas
                    ref={canvasRef}
                    camera={{ position: [15, 10, 15], fov: 60 }}
                    shadows
                  >
                    <Scene
                      rooms={rooms}
                      selectedRoom={selectedRoom}
                      onRoomClick={setSelectedRoom}
                    />
                  </Canvas>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{rooms.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Rooms</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {rooms.reduce((total, room) => total + (room.size[0] * room.size[2]), 0).toFixed(0)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Area</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.max(...rooms.map(room => Math.max(...room.size))).toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Max Height</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {lightIntensity[0].toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Light Level</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Room Info */}
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cube className="h-5 w-5" />
                <span>Room Details</span>
              </CardTitle>
              <CardDescription>
                {selectedRoomData ? `Inspecting ${selectedRoomData.name}` : 'Click a room to inspect'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedRoomData ? (
                <>
                  {/* Room Info */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Room Name</Label>
                      <p className="text-lg font-semibold">{selectedRoomData.name}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Type</Label>
                      <p className="capitalize">{selectedRoomData.type.replace('-', ' ')}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Dimensions</Label>
                      <p>
                        {selectedRoomData.size[0]}m × {selectedRoomData.size[2]}m × {selectedRoomData.size[1]}m
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Floor Area</Label>
                      <p>{(selectedRoomData.size[0] * selectedRoomData.size[2]).toFixed(1)} m²</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Volume</Label>
                      <p>
                        {(selectedRoomData.size[0] * selectedRoomData.size[1] * selectedRoomData.size[2]).toFixed(1)} m³
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Position</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        X: {selectedRoomData.position[0]}, Y: {selectedRoomData.position[1]}, Z: {selectedRoomData.position[2]}
                      </p>
                    </div>
                  </div>

                  {/* Room Color */}
                  <div className="p-3 rounded-lg" style={{ backgroundColor: selectedRoomData.color + '20' }}>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: selectedRoomData.color }}
                      />
                      <span className="text-sm font-medium">Room Color</span>
                    </div>
                  </div>

                  {/* Suggested Features */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Suggested Features</Label>
                    <div className="flex flex-wrap gap-1">
                      {selectedRoomData.type === 'living-room' && (
                        <>
                          <Badge variant="secondary">Large Windows</Badge>
                          <Badge variant="secondary">Entertainment Unit</Badge>
                          <Badge variant="secondary">Accent Lighting</Badge>
                        </>
                      )}
                      {selectedRoomData.type === 'kitchen' && (
                        <>
                          <Badge variant="secondary">Island Counter</Badge>
                          <Badge variant="secondary">Under-cabinet Lights</Badge>
                          <Badge variant="secondary">Ventilation</Badge>
                        </>
                      )}
                      {selectedRoomData.type === 'bedroom' && (
                        <>
                          <Badge variant="secondary">Walk-in Closet</Badge>
                          <Badge variant="secondary">Reading Nook</Badge>
                          <Badge variant="secondary">Ensuite Access</Badge>
                        </>
                      )}
                      {selectedRoomData.type === 'bathroom' && (
                        <>
                          <Badge variant="secondary">Skylight</Badge>
                          <Badge variant="secondary">Heated Floors</Badge>
                          <Badge variant="secondary">Double Vanity</Badge>
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Cube className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Click on any room in the 3D view to inspect its details
                  </p>
                  <p className="text-xs text-gray-400">
                    You can rotate, zoom, and pan the view for better angles
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}