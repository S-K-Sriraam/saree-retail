"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Layers, Eye } from "lucide-react";

export type DrapePreset = "kanchipuram" | "banarasi" | "organza" | "velvet" | "chiffon";

interface PresetConfig {
  name: string;
  category: string;
  color: number;
  emissive: number;
  specular: number;
  shininess: number;
  roughness: number;
  metalness: number;
  borderGold: boolean;
  weavePattern: string;
  description: string;
}

const PRESET_CONFIGS: Record<DrapePreset, PresetConfig> = {
  kanchipuram: {
    name: "Pure Kanchipuram Zari Silk",
    category: "Royal Bridal Saree",
    color: 0x881337,
    emissive: 0x330510,
    specular: 0xffd700,
    shininess: 130,
    roughness: 0.25,
    metalness: 0.45,
    borderGold: true,
    weavePattern: "Korvai Handloom with Gold Brocade",
    description: "Heirloom pure mulberry silk with woven 24k gold zari temple motifs."
  },
  banarasi: {
    name: "Banarasi Kadwa Brocade",
    category: "Heritage Festive Saree",
    color: 0x064e3b,
    emissive: 0x021f18,
    specular: 0xf59e0b,
    shininess: 110,
    roughness: 0.3,
    metalness: 0.35,
    borderGold: true,
    weavePattern: "Authentic Kadwa Floral Meenakari",
    description: "Varanasi hand-engraved floral jaal with rich metallic sheen."
  },
  organza: {
    name: "Pastel Tissue Organza",
    category: "Contemporary Sheer Saree",
    color: 0xa855f7,
    emissive: 0x1e0b36,
    specular: 0xffffff,
    shininess: 160,
    roughness: 0.15,
    metalness: 0.6,
    borderGold: false,
    weavePattern: "Gossamer Sheer with Pearl Luster",
    description: "Lightweight crystalline organza with champagne reflection."
  },
  velvet: {
    name: "Royal Wine Velvet Chudar",
    category: "Haute Couture Salwar Suit",
    color: 0x4c0519,
    emissive: 0x1f020a,
    specular: 0xd4af37,
    shininess: 75,
    roughness: 0.55,
    metalness: 0.2,
    borderGold: true,
    weavePattern: "Micro Velvet with Zardozi Embroidery",
    description: "Plush micro-velvet tailored with antique gold zardozi needlework."
  },
  chiffon: {
    name: "Midnight Obsidian Chiffon",
    category: "Lucknowi Chikankari Saree",
    color: 0x18181b,
    emissive: 0x08080a,
    specular: 0x94a3b8,
    shininess: 90,
    roughness: 0.35,
    metalness: 0.15,
    borderGold: false,
    weavePattern: "Fluid Georgette Chiffon with Mukaish",
    description: "Ethereal flowing drape dotted with sparkling silver mukaish stars."
  }
};

interface SareeDrapeStudioProps {
  initialPreset?: DrapePreset;
  interactive?: boolean;
}

export default function SareeDrapeStudio({
  initialPreset = "kanchipuram",
  interactive = true,
}: SareeDrapeStudioProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePreset, setActivePreset] = useState<DrapePreset>(initialPreset);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(3.8);
  const [isShimmerActive, setIsShimmerActive] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const fabricMeshRef = useRef<THREE.Mesh | null>(null);
  const borderMeshRef = useRef<THREE.Mesh | null>(null);
  const goldLightRef = useRef<THREE.PointLight | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Update material when preset changes
  useEffect(() => {
    if (!fabricMeshRef.current || !borderMeshRef.current) return;
    const config = PRESET_CONFIGS[activePreset];

    const fabricMat = fabricMeshRef.current.material as THREE.MeshStandardMaterial;
    fabricMat.color.setHex(config.color);
    fabricMat.roughness = config.roughness;
    fabricMat.metalness = config.metalness;
    fabricMat.emissive.setHex(config.emissive);

    const borderMat = borderMeshRef.current.material as THREE.MeshStandardMaterial;
    if (config.borderGold) {
      borderMat.color.setHex(0xd4af37);
      borderMat.roughness = 0.2;
      borderMat.metalness = 0.8;
      borderMat.emissive.setHex(0x3a2e0a);
    } else {
      borderMat.color.setHex(0xe2e8f0);
      borderMat.roughness = 0.3;
      borderMat.metalness = 0.7;
      borderMat.emissive.setHex(0x1e293b);
    }
  }, [activePreset]);

  // Three.js Mount
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.4, zoomLevel);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.0);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const goldPointLight = new THREE.PointLight(0xd4af37, 3.2, 12);
    goldPointLight.position.set(-2, 2, 2.5);
    scene.add(goldPointLight);
    goldLightRef.current = goldPointLight;

    const fillLight = new THREE.PointLight(0xf472b6, 1.5, 10);
    fillLight.position.set(2, -2, 2);
    scene.add(fillLight);

    // 3D Saree / Mannequin Drape Geometry
    // We create a sophisticated parametric spiral cylinder representing the pleated saree drape & floating pallu
    const group = new THREE.Group();
    scene.add(group);

    const config = PRESET_CONFIGS[activePreset];

    // Main pleated cylinder body
    const drapeGeo = new THREE.CylinderGeometry(0.55, 0.9, 2.4, 64, 40, true);
    // Displace vertices to create authentic saree pleats & fall
    const pos = drapeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const angle = Math.atan2(pos.getZ(i), pos.getX(i));
      const radius = Math.sqrt(pos.getX(i) ** 2 + pos.getZ(i) ** 2);

      // Add vertical pleats
      const pleatRipple = Math.sin(angle * 16) * 0.035 * (1.2 - y * 0.3);
      // Gentle curve
      const flare = (1.2 - y) * 0.08;

      pos.setX(i, Math.cos(angle) * (radius + pleatRipple + flare));
      pos.setZ(i, Math.sin(angle) * (radius + pleatRipple + flare));
    }
    drapeGeo.computeVertexNormals();

    const drapeMaterial = new THREE.MeshStandardMaterial({
      color: config.color,
      roughness: config.roughness,
      metalness: config.metalness,
      emissive: config.emissive,
      side: THREE.DoubleSide,
    });

    const drapeMesh = new THREE.Mesh(drapeGeo, drapeMaterial);
    drapeMesh.position.y = -0.2;
    group.add(drapeMesh);
    fabricMeshRef.current = drapeMesh;

    // Pallu / Shoulder drape ribbon
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.6, -1.0, 0.7),
      new THREE.Vector3(-0.4, 0.1, 0.65),
      new THREE.Vector3(0.1, 0.7, 0.5),
      new THREE.Vector3(0.5, 0.95, 0.1),
      new THREE.Vector3(0.7, 0.8, -0.4),
      new THREE.Vector3(0.75, 0.2, -0.7),
      new THREE.Vector3(0.65, -0.8, -0.6),
    ]);

    const palluGeo = new THREE.TubeGeometry(curve, 70, 0.25, 20, false);
    const palluMesh = new THREE.Mesh(palluGeo, drapeMaterial);
    group.add(palluMesh);

    // Golden Zari Border Ring at Bottom
    const borderGeo = new THREE.TorusGeometry(0.96, 0.045, 16, 64);
    const borderMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x3a2e0a,
    });
    const borderMesh = new THREE.Mesh(borderGeo, borderMaterial);
    borderMesh.rotation.x = Math.PI / 2;
    borderMesh.position.y = -1.4;
    group.add(borderMesh);
    borderMeshRef.current = borderMesh;

    // Floating Gold Dust Ring
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = 1.1 + Math.random() * 0.5;
      const h = (Math.random() - 0.5) * 2.8;
      dustPositions[i * 3] = Math.cos(ang) * rad;
      dustPositions[i * 3 + 1] = h;
      dustPositions[i * 3 + 2] = Math.sin(ang) * rad;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffe066,
      size: 0.035,
      transparent: true,
      opacity: 0.8,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    group.add(dust);

    // Mouse drag rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      group.rotation.y += deltaX * 0.008;
      group.rotation.x = Math.max(-0.4, Math.min(0.4, group.rotation.x + deltaY * 0.004));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isAutoRotating && !isDragging) {
        group.rotation.y += 0.006;
      }

      if (isShimmerActive && goldLightRef.current) {
        goldLightRef.current.position.x = Math.sin(elapsed * 1.5) * 3;
        goldLightRef.current.position.y = Math.cos(elapsed * 1.2) * 2 + 1;
      }

      dust.rotation.y = -elapsed * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      drapeGeo.dispose();
      drapeMaterial.dispose();
      palluGeo.dispose();
      borderGeo.dispose();
      borderMaterial.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isAutoRotating, isShimmerActive]);

  // Zoom control
  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    const newZoom = Math.max(2.2, Math.min(5.5, zoomLevel + delta));
    setZoomLevel(newZoom);
    cameraRef.current.position.z = newZoom;
  };

  const currentPresetInfo = PRESET_CONFIGS[activePreset];

  return (
    <div className="relative flex h-full min-h-[500px] w-full flex-col overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-b from-[#141217] via-[#0d0c0f] to-[#080709] p-6 text-white shadow-2xl">
      {/* Studio Header Overlay */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-amber-300 uppercase">
            <Sparkles className="h-3.5 w-3.5" /> 3D Virtual Drape & Weave Studio
          </span>
          <h3 className="mt-2 text-2xl font-bold text-white font-serif-luxury">
            {currentPresetInfo.name}
          </h3>
          <p className="text-xs text-amber-200/70">
            {currentPresetInfo.category} &bull; {currentPresetInfo.weavePattern}
          </p>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-md">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
              isAutoRotating ? "bg-amber-500 text-black font-semibold" : "text-white/80 hover:bg-white/10"
            }`}
            title="Toggle 360 Auto-Rotate"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isAutoRotating ? "animate-spin" : ""}`} />
            <span>360°</span>
          </button>

          <button
            onClick={() => handleZoom(-0.5)}
            className="rounded-xl p-1.5 text-white/80 hover:bg-white/10"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleZoom(0.5)}
            className="rounded-xl p-1.5 text-white/80 hover:bg-white/10"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsShimmerActive(!isShimmerActive)}
            className={`rounded-xl p-1.5 transition ${
              isShimmerActive ? "text-amber-400 bg-amber-400/20" : "text-white/60 hover:bg-white/10"
            }`}
            title="Toggle Zari Light Shimmer"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="relative my-auto flex-1 cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="h-full min-h-[360px] w-full" />
        <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-center text-xs text-white/40">
          Drag to rotate 360° &bull; Scroll to inspect weave texture
        </div>
      </div>

      {/* Bottom Fabric Preset Selector */}
      <div className="z-10 border-t border-white/10 pt-4">
        <p className="mb-2.5 flex items-center gap-1.5 text-xs font-medium tracking-wide text-white/70 uppercase">
          <Layers className="h-3.5 w-3.5 text-amber-400" /> Select Fabric & Drape Texture:
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {(Object.keys(PRESET_CONFIGS) as DrapePreset[]).map((key) => {
            const item = PRESET_CONFIGS[key];
            const isSelected = activePreset === key;
            return (
              <button
                key={key}
                onClick={() => setActivePreset(key)}
                className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition ${
                  isSelected
                    ? "border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-white/40"
                    style={{ backgroundColor: `#${item.color.toString(16).padStart(6, "0")}` }}
                  />
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
                </div>
                <span className="mt-1.5 text-xs font-semibold text-white">
                  {key === "kanchipuram" && "Kanchipuram Silk"}
                  {key === "banarasi" && "Banarasi Brocade"}
                  {key === "organza" && "Tissue Organza"}
                  {key === "velvet" && "Velvet Chudar"}
                  {key === "chiffon" && "Chiffon Chikankari"}
                </span>
                <span className="text-[10px] text-white/50">{item.category.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
