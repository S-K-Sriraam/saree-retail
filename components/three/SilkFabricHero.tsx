"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface SilkFabricHeroProps {
  tintColor?: string; // default crimson/gold
}

export default function SilkFabricHero({ tintColor = "#881337" }: SilkFabricHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0d, 0.035);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 4.5);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 1.2);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xd4af37, 3.5, 20);
    goldLight.position.set(2, 3, 2);
    scene.add(goldLight);

    const roseLight = new THREE.PointLight(0xff4477, 2.5, 15);
    roseLight.position.set(-3, -1, 2);
    scene.add(roseLight);

    const rimLight = new THREE.DirectionalLight(0xffdf88, 1.8);
    rimLight.position.set(0, 4, -2);
    scene.add(rimLight);

    // Create 3D Silk Plane
    const width = 6.5;
    const height = 4.5;
    const segmentsW = 70;
    const segmentsH = 50;
    const geometry = new THREE.PlaneGeometry(width, height, segmentsW, segmentsH);

    // Silk Phong Material with high specular shine
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(tintColor),
      emissive: new THREE.Color(0x22050b),
      specular: new THREE.Color(0xd4af37),
      shininess: 120,
      side: THREE.DoubleSide,
      flatShading: false,
      wireframe: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 4.2;
    mesh.position.y = -0.3;
    scene.add(mesh);

    // Floating Golden Sparkles / Zari Glitter
    const particlesCount = 200;
    const pGeometry = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particlesCount * 3);
    const pScales = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 8;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      pScales[i] = Math.random() * 0.06 + 0.02;
    }

    pGeometry.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));

    // Particle Material
    const pMaterial = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.04,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(pGeometry, pMaterial);
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.5;
      targetY = y * 0.4;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      goldLight.position.x = Math.sin(time * 0.8) * 3 + mouseX * 2;
      goldLight.position.y = Math.cos(time * 0.6) * 2 + 1.5;

      // Animate silk vertex positions
      const positions = geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const u = positions.getX(i);
        const v = positions.getY(i);

        // Fluid multi-sine wave displacement simulating delicate silk drape
        const wave1 = Math.sin(u * 1.8 + time * 1.5) * 0.22;
        const wave2 = Math.cos(v * 2.2 + time * 1.2) * 0.18;
        const wave3 = Math.sin((u + v) * 1.5 + time * 2.0) * 0.12;
        const ripple = Math.sin(Math.sqrt(u * u + v * v) * 4 - time * 3) * 0.06 * (1 + mouseX);

        positions.setZ(i, wave1 + wave2 + wave3 + ripple);
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();

      // Subtle mesh rotation with mouse
      mesh.rotation.z = mouseX * 0.12 + Math.sin(time * 0.3) * 0.04;
      mesh.rotation.x = -Math.PI / 4.2 + mouseY * 0.15;

      // Sparkles floating
      particles.rotation.y = time * 0.08;
      particles.rotation.x = Math.sin(time * 0.05) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      pGeometry.dispose();
      pMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [tintColor]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80" />
    </div>
  );
}
