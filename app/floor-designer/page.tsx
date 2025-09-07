'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Layers, 
  Move, 
  RotateCcw, 
  Copy, 
  Trash2, 
  Save, 
  Download, 
  Grid,
  Ruler,
  Plus,
  Minus,
  Home,
  Car,
  Utensils,
  Bed,
  Bath,
  Sofa
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { toast } from 'sonner';

interface Room {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  name: string;
}

const roomTypes = [
  { type: 'living-room', name: 'Living Room', icon: Sofa, color: '#3B82F6' },
  { type: 'bedroom', name: 'Bedroom', icon: Bed, color: '#10B981' },
  { type: 'kitchen', name: 'Kitchen', icon: Utensils, color: '#F59E0B' },
  { type: 'bathroom', name: 'Bathroom', icon: Bath, color: '#8B5CF6' },
  { type: 'garage', name: 'Garage', icon: Car, color: '#6B7280' },
  { type: 'entrance', name: 'Entrance', icon: Home, color: '#EF4444' },
];

export default function FloorDesigner() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [draggedRoom, setDraggedRoom] = useState<string | null>(null);
  const [gridSize] = useState(20);
  const [scale, setScale] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addRoom = (type: string) => {
    const roomType = roomTypes.find(rt => rt.type === type);
    if (!roomType) return;

    const newRoom: Room = {
      id: `room-${Date.now()}`,
      type,
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50,
      width: type === 'bathroom' ? 80 : type === 'kitchen' ? 120 : 150,
      height: type === 'bathroom' ? 80 : type === 'garage' ? 180 : 120,
      color: roomType.color,
      name: `${roomType.name} ${rooms.filter(r => r.type === type).length + 1}`,
    };

    setRooms(prev => [...prev, newRoom]);
    setSelectedRoom(newRoom.id);
    toast.success(`${roomType.name} added to floor plan`);
  };

  const deleteRoom = (roomId: string) => {
    setRooms(prev => prev.filter(r => r.id !== roomId));
    if (selectedRoom === roomId) {
      setSelectedRoom(null);
    }
    toast.success('Room removed from floor plan');
  };

  const updateRoom = (roomId: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, ...updates } : room
    ));
  };

  const duplicateRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const newRoom: Room = {
      ...room,
      id: `room-${Date.now()}`,
      x: room.x + 20,
      y: room.y + 20,
      name: `${room.name} Copy`,
    };

    setRooms(prev => [...prev, newRoom]);
    setSelectedRoom(newRoom.id);
    toast.success('Room duplicated');
  };

  const calculateTotalArea = () => {
    return rooms.reduce((total, room) => {
      const area = (room.width * room.height) / (gridSize * gridSize);
      return total + area;
    }, 0);
  };

  const exportPlan = () => {
    // In a real implementation, this would export to PDF/PNG/CAD
    toast.success('Floor plan exported successfully!');
  };

  const savePlan = () => {
    // In a real implementation, this would save to database
    toast.success('Floor plan saved to your projects!');
  };

  const selectedRoomData = selectedRoom ? rooms.find(r => r.id === selectedRoom) : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Floor Plan Designer</h1>
            <p className="text-gray-600 dark:text-gray-300">Create detailed floor plans with drag-and-drop tools</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={savePlan} variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Plan
            </Button>
            <Button onClick={exportPlan}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Room Palette */}
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layers className="h-5 w-5" />
                <span>Room Types</span>
              </CardTitle>
              <CardDescription>Drag rooms onto the canvas or click to add</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {roomTypes.map((roomType) => (
                <Button
                  key={roomType.type}
                  variant="outline"
                  className="w-full justify-start h-12"
                  onClick={() => addRoom(roomType.type)}
                >
                  <div 
                    className="w-4 h-4 rounded mr-3"
                    style={{ backgroundColor: roomType.color }}
                  />
                  <roomType.icon className="mr-2 h-4 w-4" />
                  {roomType.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Canvas */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Canvas</CardTitle>
                    <CardDescription>Design your floor plan</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium w-16 text-center">
                      {Math.round(scale * 100)}%
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setScale(Math.min(2, scale + 0.1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Grid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  ref={canvasRef}
                  className="relative bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
                  style={{
                    height: '500px',
                    backgroundImage: `
                      linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                      linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                    `,
                    backgroundSize: `${gridSize}px ${gridSize}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                  }}
                >
                  {/* Rooms */}
                  {rooms.map((room) => (
                    <motion.div
                      key={room.id}
                      className={`absolute cursor-move border-2 rounded-lg flex items-center justify-center text-white text-xs font-semibold select-none ${
                        selectedRoom === room.id
                          ? 'border-yellow-400 shadow-lg'
                          : 'border-gray-400'
                      }`}
                      style={{
                        left: room.x,
                        top: room.y,
                        width: room.width,
                        height: room.height,
                        backgroundColor: room.color,
                      }}
                      onClick={() => setSelectedRoom(room.id)}
                      drag
                      dragConstraints={canvasRef}
                      onDragEnd={(_, info) => {
                        updateRoom(room.id, {
                          x: Math.max(0, room.x + info.offset.x),
                          y: Math.max(0, room.y + info.offset.y),
                        });
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileDrag={{ scale: 1.05, zIndex: 10 }}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{room.name}</div>
                        <div className="text-xs opacity-90">
                          {Math.round((room.width * room.height) / (gridSize * gridSize))} sq ft
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Empty State */}
                  {rooms.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Start designing your floor plan</p>
                        <p className="text-sm">Add rooms from the palette on the left</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{rooms.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Rooms</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{Math.round(calculateTotalArea())}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Area (sq ft)</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      ₹{Math.round(calculateTotalArea() * 1200 / 100000 * 100) / 100}L
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Est. Cost</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Properties Panel */}
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Ruler className="h-5 w-5" />
                <span>Properties</span>
              </CardTitle>
              <CardDescription>
                {selectedRoomData ? `Edit ${selectedRoomData.name}` : 'Select a room to edit'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedRoomData ? (
                <>
                  {/* Room Name */}
                  <div className="space-y-2">
                    <Label>Room Name</Label>
                    <Input
                      value={selectedRoomData.name}
                      onChange={(e) => updateRoom(selectedRoomData.id, { name: e.target.value })}
                    />
                  </div>

                  {/* Dimensions */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Width (px)</Label>
                      <Input
                        type="number"
                        value={selectedRoomData.width}
                        onChange={(e) => updateRoom(selectedRoomData.id, { width: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Height (px)</Label>
                      <Input
                        type="number"
                        value={selectedRoomData.height}
                        onChange={(e) => updateRoom(selectedRoomData.id, { height: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  {/* Position */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>X Position</Label>
                      <Input
                        type="number"
                        value={selectedRoomData.x}
                        onChange={(e) => updateRoom(selectedRoomData.id, { x: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Y Position</Label>
                      <Input
                        type="number"
                        value={selectedRoomData.y}
                        onChange={(e) => updateRoom(selectedRoomData.id, { y: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  {/* Room Type */}
                  <div className="space-y-2">
                    <Label>Room Type</Label>
                    <Select 
                      value={selectedRoomData.type} 
                      onValueChange={(value) => {
                        const roomType = roomTypes.find(rt => rt.type === value);
                        if (roomType) {
                          updateRoom(selectedRoomData.id, { 
                            type: value, 
                            color: roomType.color 
                          });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map((roomType) => (
                          <SelectItem key={roomType.type} value={roomType.type}>
                            {roomType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Area Display */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Area:</span>
                      <span className="text-sm">
                        {Math.round((selectedRoomData.width * selectedRoomData.height) / (gridSize * gridSize))} sq ft
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => duplicateRoom(selectedRoomData.id)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate Room
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700"
                      onClick={() => deleteRoom(selectedRoomData.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Room
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Move className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click on a room to view and edit its properties
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