import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface ShrineEnvironment3DProps {
  highQuality: boolean;
  lanternLightsRef: React.MutableRefObject<(THREE.PointLight | null)[]>;
  backdropMatRef: React.MutableRefObject<THREE.MeshBasicMaterial | null>;
  waterRippleRef: React.MutableRefObject<THREE.Mesh | null>;
  waterRippleMatRef: React.MutableRefObject<THREE.MeshBasicMaterial | null>;
}

// Reduced from 6 to 2 strategic point lights for 3x faster PBR shader performance
const LANTERN_LIGHT_POSITIONS: [number, number, number][] = [
  [-2.8, -0.6, -1.8],
  [2.8, -0.6, -1.8],
];

export const ShrineEnvironment3D: React.FC<ShrineEnvironment3DProps> = ({
  highQuality,
  lanternLightsRef,
  backdropMatRef,
  waterRippleRef,
  waterRippleMatRef,
}) => {
  const backdropTexture = useTexture('/images/shrine-backdrop-aaa.jpg');

  const lanternSeeds = useMemo(
    () => LANTERN_LIGHT_POSITIONS.map((pos, idx) => ({ pos, phase: idx * 1.15 })),
    []
  );

  // Subtle warm lantern flickering
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    lanternSeeds.forEach((l, idx) => {
      const light = lanternLightsRef.current[idx];
      if (light && light.userData.awakened) {
        light.intensity = 1.65 + Math.sin(t * 4.0 + l.phase) * 0.25;
      }
    });
  });

  return (
    <group>
      {/* Atmospheric Depth Fog */}
      <fogExp2 attach="fog" args={['#100308', 0.022]} />

      {/* ===== AAA CINEMATIC SHRINE BACKDROP (FULL-SCREEN COVERAGE) ===== */}
      <mesh position={[0, 1.4, -10.5]}>
        <planeGeometry args={[34, 19.2]} />
        <meshBasicMaterial
          ref={backdropMatRef}
          map={backdropTexture}
          transparent
          opacity={0}
          toneMapped={true}
        />
      </mesh>

      {/* Subtle Volumetric Moonlight Cone */}
      <mesh position={[0, 3.2, -5.2]} rotation={[0.28, 0, 0]}>
        <coneGeometry args={[4.5, 11, 24, 1, true]} />
        <meshBasicMaterial
          color="#fde68a"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ===== DYNAMIC WARM LANTERN POINT LIGHTS ===== */}
      {lanternSeeds.map((item, idx) => (
        <pointLight
          key={idx}
          ref={(el) => {
            lanternLightsRef.current[idx] = el;
          }}
          position={item.pos}
          color="#fbbf24"
          intensity={0}
          distance={7.5}
          decay={2}
        />
      ))}

      {/* ===== FOREGROUND REFLECTIVE SHRINE WATER SURFACE ===== */}
      <mesh position={[0, -1.94, 0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 18]} />
        {!highQuality ? (
          <meshStandardMaterial
            color="#0d0307"
            roughness={0.48}
            metalness={0.32}
          />
        ) : (
          <MeshReflectorMaterial
            blur={[180, 60]}
            resolution={256}
            mixBlur={0.85}
            mixStrength={34}
            roughness={0.2}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#10050a"
            metalness={0.78}
            mirror={0.55}
          />
        )}
      </mesh>

      {/* Animated Golden Water Ripple Ring */}
      <mesh
        ref={waterRippleRef}
        position={[0.78, -1.91, 0.35]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <ringGeometry args={[1.2, 1.42, 48]} />
        <meshBasicMaterial
          ref={waterRippleMatRef}
          color="#fde68a"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
