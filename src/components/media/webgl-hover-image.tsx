"use client";

import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useCursor } from "@/components/animations/custom-cursor";

const fragmentShader = `
  uniform float time;
  uniform float progress;
  uniform sampler2D tex1;
  uniform sampler2D tex2;
  uniform sampler2D disp;

  varying vec2 vUv;

  void main() {
    vec4 dispColor = texture2D(disp, vUv);
    
    // Smooth displacement transition
    vec2 distortedPosition = vec2(vUv.x, vUv.y + progress * (dispColor.r * 0.2));
    vec2 distortedPosition2 = vec2(vUv.x, vUv.y - (1.0 - progress) * (dispColor.r * 0.2));
    
    vec4 _tex1 = texture2D(tex1, distortedPosition);
    vec4 _tex2 = texture2D(tex2, distortedPosition2);
    
    gl_FragColor = mix(_tex1, _tex2, progress);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

interface ShaderMaterialProps {
  image1: string;
  image2: string;
  dispImage: string;
  hovered: boolean;
}

function Scene({ image1, image2, dispImage, hovered }: ShaderMaterialProps) {
  const [tex1, tex2, disp] = useTexture([image1, image2, dispImage]);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      progress: { value: 0 },
      tex1: { value: tex1 },
      tex2: { value: tex2 },
      disp: { value: disp },
    }),
    [tex1, tex2, disp]
  );

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value += delta;
      
      // Smoothly interpolate progress based on hover state
      const target = hovered ? 1 : 0;
      materialRef.current.uniforms.progress.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.progress.value,
        target,
        0.1
      );
    }
  });

  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

interface WebGLHoverImageProps {
  image1: string;
  image2: string;
  dispImage?: string; // Optional displacement map
  className?: string;
}

export function WebGLHoverImage({ 
  image1, 
  image2, 
  dispImage = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80", // valid displacement map url
  className = "w-full h-full aspect-[4/5]" 
}: WebGLHoverImageProps) {
  const [hovered, setHovered] = useState(false);
  const { setCursorType } = useCursor();

  return (
    <div 
      className={`relative overflow-hidden cursor-none ${className}`}
      onMouseEnter={() => {
        setHovered(true);
        setCursorType("pointer");
      }}
      onMouseLeave={() => {
        setHovered(false);
        setCursorType("default");
      }}
    >
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
        <Suspense fallback={null}>
          <Scene image1={image1} image2={image2} dispImage={dispImage} hovered={hovered} />
        </Suspense>
      </Canvas>
    </div>
  );
}
