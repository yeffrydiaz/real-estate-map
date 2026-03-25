"use client";

import { useEffect, useRef, useState } from "react";
import { Property } from "@/lib/types";

interface VirtualTourProps {
  property: Property;
}

interface Room {
  id: string;
  name: string;
  color: string;
  description: string;
}

const ROOMS: Room[] = [
  {
    id: "living",
    name: "Living Room",
    color: "#e8d5b7",
    description: "Spacious open-concept living area with natural light",
  },
  {
    id: "kitchen",
    name: "Kitchen",
    color: "#c8e6c9",
    description: "Gourmet kitchen with modern appliances",
  },
  {
    id: "master",
    name: "Master Suite",
    color: "#bbdefb",
    description: "Luxurious master bedroom with en-suite bathroom",
  },
  {
    id: "office",
    name: "Home Office",
    color: "#f8bbd9",
    description: "Dedicated workspace with built-in storage",
  },
  {
    id: "outdoor",
    name: "Outdoor",
    color: "#a5d6a7",
    description: "Private outdoor space and entertaining areas",
  },
];

export default function VirtualTour({ property }: VirtualTourProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const rotationRef = useRef(0);
  const [currentRoom, setCurrentRoom] = useState<Room>(ROOMS[0]);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [pitch, setPitch] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  // Incremented on each drag frame so the canvas effect re-runs even when pitch doesn't change
  const [drawTick, setDrawTick] = useState(0);
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);

  // 3D-perspective canvas render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      ctx.clearRect(0, 0, W, H);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.6);
      skyGrad.addColorStop(0, "#1a237e");
      skyGrad.addColorStop(1, currentRoom.color);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Floor
      const floorGrad = ctx.createLinearGradient(0, H * 0.6, 0, H);
      floorGrad.addColorStop(0, "#795548");
      floorGrad.addColorStop(1, "#4e342e");
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, H * 0.6, W, H * 0.4);

      const rot = rotationRef.current;
      const pitchOffset = pitch * 0.5;

      // Draw 3D walls using perspective projection
      const wallCount = 6;
      const radius = 180;
      for (let i = 0; i < wallCount; i++) {
        const angle = (i / wallCount) * Math.PI * 2 + rot;
        const nextAngle = ((i + 1) / wallCount) * Math.PI * 2 + rot;

        const x1 = cx + Math.cos(angle) * radius;
        const y1 = cy - 80 + pitchOffset + Math.sin(angle) * 20;
        const x2 = cx + Math.cos(nextAngle) * radius;
        const y2 = cy - 80 + pitchOffset + Math.sin(nextAngle) * 20;

        const xb1 = cx + Math.cos(angle) * radius * 0.95;
        const yb1 = cy + 80 + pitchOffset + Math.sin(angle) * 20;
        const xb2 = cx + Math.cos(nextAngle) * radius * 0.95;
        const yb2 = cy + 80 + pitchOffset + Math.sin(nextAngle) * 20;

        // Wall brightness varies with angle
        const brightness = 0.6 + 0.4 * Math.cos(angle - rot);
        const hue = currentRoom.color;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(xb2, yb2);
        ctx.lineTo(xb1, yb1);
        ctx.closePath();
        ctx.fillStyle = adjustBrightness(hue, brightness);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Window/door feature on front wall
        if (i === 0) {
          const wx = (x1 + x2) / 2;
          const wy = (y1 + y2) / 2 - 10;
          ctx.fillStyle = "rgba(173,216,230,0.7)";
          ctx.fillRect(wx - 20, wy - 25, 40, 35);
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.strokeRect(wx - 20, wy - 25, 40, 35);
          // Window cross
          ctx.beginPath();
          ctx.moveTo(wx, wy - 25);
          ctx.lineTo(wx, wy + 10);
          ctx.moveTo(wx - 20, wy - 8);
          ctx.lineTo(wx + 20, wy - 8);
          ctx.stroke();
        }
      }

      // Ceiling perspective
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy - 80 + pitchOffset);
      ctx.lineTo(cx + radius, cy - 80 + pitchOffset);
      ctx.lineTo(cx + radius * 0.3, cy - 140 + pitchOffset);
      ctx.lineTo(cx - radius * 0.3, cy - 140 + pitchOffset);
      ctx.closePath();
      const ceilGrad = ctx.createRadialGradient(cx, cy - 100, 0, cx, cy - 100, radius);
      ceilGrad.addColorStop(0, "#ffffff");
      ceilGrad.addColorStop(1, adjustBrightness(currentRoom.color, 0.9));
      ctx.fillStyle = ceilGrad;
      ctx.fill();

      // Ceiling light fixture
      ctx.beginPath();
      ctx.arc(cx, cy - 115 + pitchOffset, 12, 0, Math.PI * 2);
      ctx.fillStyle = "#fffde7";
      ctx.fill();
      // Glow
      const lightGrad = ctx.createRadialGradient(cx, cy - 115 + pitchOffset, 0, cx, cy - 115 + pitchOffset, 60);
      lightGrad.addColorStop(0, "rgba(255,253,200,0.4)");
      lightGrad.addColorStop(1, "rgba(255,253,200,0)");
      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.arc(cx, cy - 115 + pitchOffset, 60, 0, Math.PI * 2);
      ctx.fill();

      // Furniture silhouette (couch)
      if (currentRoom.id === "living" || currentRoom.id === "master") {
        const furnitureColor = adjustBrightness("#8d6e63", 0.9);
        ctx.fillStyle = furnitureColor;
        // Back of sofa
        ctx.fillRect(cx - 55, cy + 40 + pitchOffset, 110, 22);
        // Seat
        ctx.fillRect(cx - 60, cy + 55 + pitchOffset, 120, 16);
        // Legs
        ctx.fillRect(cx - 58, cy + 71 + pitchOffset, 8, 8);
        ctx.fillRect(cx + 50, cy + 71 + pitchOffset, 8, 8);
      }

      // Overlay: room name
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 0, W, 40);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(currentRoom.name, cx, 26);
      ctx.textAlign = "left";

      if (isAutoRotate) {
        rotationRef.current += 0.005;
        animFrameRef.current = requestAnimationFrame(draw);
      }
    }

    animFrameRef.current = requestAnimationFrame(draw);
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [currentRoom, isAutoRotate, pitch, drawTick]);

  function handleMouseDown(e: React.MouseEvent) {
    setIsDragging(true);
    setIsAutoRotate(false);
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging || !lastMouseRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    rotationRef.current += dx * 0.005;
    setPitch((p) => Math.max(-30, Math.min(30, p + dy * 0.3)));
    // Always increment drawTick so horizontal-only drags (no pitch change) still redraw
    setDrawTick((t) => t + 1);
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  }

  function handleMouseUp() {
    setIsDragging(false);
    lastMouseRef.current = null;
  }

  return (
    <div className="space-y-4">
      {/* Canvas */}
      <div className="relative rounded-xl overflow-hidden bg-gray-900">
        <canvas
          ref={canvasRef}
          width={560}
          height={320}
          className="w-full cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ display: "block" }}
        />
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={() => setIsAutoRotate((v) => !v)}
            className="flex items-center gap-1 text-xs bg-black/60 text-white px-2.5 py-1.5 rounded-full hover:bg-black/80 transition-colors"
          >
            {isAutoRotate ? "⏸ Pause" : "▶ Rotate"}
          </button>
        </div>
        <div className="absolute bottom-3 left-3 text-xs text-white/70 bg-black/40 px-2 py-1 rounded-full">
          Drag to explore
        </div>
      </div>

      {/* Room description */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-sm text-gray-600 italic">{currentRoom.description}</p>
      </div>

      {/* Room selector */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
          Rooms
        </p>
        <div className="flex flex-wrap gap-2">
          {ROOMS.map((room) => (
            <button
              key={room.id}
              onClick={() => setCurrentRoom(room)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                currentRoom.id === room.id
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
              style={{
                borderLeftColor:
                  currentRoom.id === room.id ? undefined : room.color,
                borderLeftWidth: currentRoom.id === room.id ? undefined : 3,
              }}
            >
              {room.name}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        3D Virtual Tour — {property.address}
      </p>
    </div>
  );
}

/** Lighten or darken a hex color by a brightness factor (0–2) */
function adjustBrightness(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v * factor)));
  return `rgb(${clamp(r)},${clamp(g)},${clamp(b)})`;
}
