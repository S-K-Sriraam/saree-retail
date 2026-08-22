"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface LuxuryMandalaParticlesProps {
  theme?: "gold" | "rose" | "emerald";
}

export default function LuxuryMandalaParticles({ theme = "gold" }: LuxuryMandalaParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Color palettes
    const mainColor = theme === "gold" ? 0xd4af37 : theme === "rose" ? 0xf43f5e : 0x10b981;
    const secondColor = theme === "gold" ? 0xfef08a : theme === "rose" ? 0xfda4af : 0x6ee7b7;

    // Create Nested Mandala Rings
    const group = new THREE.Group();
    scene.add(group);

    const ringCount = 4;
    for (let r = 0; r < ringCount; r++) {
      const radius = 1.2 + r * 0.9;
      const count = 48 + r * 24;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2;
        pos[i * 3] = Math.cos(theta) * radius;
        pos[i * 3 + 1] = Math.sin(theta) * radius;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      }

      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: r % 2 === 0 ? mainColor : secondColor,
        size: 0.045 - r * 0.005,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      });

      const ring = new THREE.Points(geo, mat);
      ring.rotation.x = 0.4 * r;
      ring.rotation.y = 0.2 * r;
      group.add(ring);
    }

    // Floating Gold Dust Starfield
    const starCount = 150;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 14;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xfffbeb,
      size: 0.025,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      group.rotation.z = t * 0.04;
      group.rotation.x = Math.sin(t * 0.05) * 0.2;
      group.rotation.y = Math.cos(t * 0.04) * 0.2;

      group.children.forEach((child, idx) => {
        child.rotation.z = (idx % 2 === 0 ? 1 : -1) * t * 0.08;
      });

      starField.rotation.y = t * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
