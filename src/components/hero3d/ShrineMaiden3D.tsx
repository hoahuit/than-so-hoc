import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface ShrineMaiden3DProps {
  maidenGroupRef: React.RefObject<THREE.Group | null>;
  maidenOpacityRef: React.MutableRefObject<number>;
  auraPointsRef: React.RefObject<THREE.Group | null>;
}

const MAIDEN_VERTEX_SHADER = `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Subtle wind sway on hair/sleeves/skirt (stronger toward bottom & edges, anchored at center)
    float swayMask = smoothstep(0.15, 0.95, 1.0 - uv.y) * 0.45 + abs(uv.x - 0.5) * 0.55;
    pos.x += sin(uTime * 1.65 + uv.y * 4.5) * 0.022 * swayMask;
    pos.z += cos(uTime * 1.35 + uv.x * 3.5) * 0.018 * swayMask;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const MAIDEN_FRAGMENT_SHADER = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uOpacity;
  uniform float uTime;

  void main() {
    vec4 tex = texture2D(uTexture, vUv);

    // Cleanly key out pure black background with smooth anti-aliased edge
    float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    float maxCh = max(tex.r, max(tex.g, tex.b));
    float alphaKey = smoothstep(0.035, 0.14, max(lum, maxCh * 0.85));

    // Softly feather outer frame edges just in case
    float edgeX = smoothstep(0.0, 0.04, vUv.x) * smoothstep(1.0, 0.96, vUv.x);
    float edgeY = smoothstep(0.0, 0.03, vUv.y) * smoothstep(1.0, 0.97, vUv.y);

    // Subtle warm golden shrine rim tint
    vec3 warmTint = mix(tex.rgb, tex.rgb * vec3(1.04, 1.01, 0.96), 0.35);
    float finalAlpha = alphaKey * edgeX * edgeY * uOpacity;

    if (finalAlpha < 0.01) discard;
    gl_FragColor = vec4(warmTint, finalAlpha);
  }
`;

/**
 * AAA 2.5D Anime Shrine Maiden composited into the 3D WebGL scene with custom
 * alpha-key shader, gentle wind cloth/hair sway, breathing, and 3D golden aura particles.
 */
export const ShrineMaiden3D: React.FC<ShrineMaiden3DProps> = ({
  maidenGroupRef,
  maidenOpacityRef,
  auraPointsRef,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const shaderMatRef = useRef<THREE.ShaderMaterial>(null);

  const texture = useTexture('/images/shrine-maiden-aaa.jpg');

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uOpacity: { value: 0 },
      uTime: { value: 0 },
    }),
    [texture]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = t;
      shaderMatRef.current.uniforms.uOpacity.value = maidenOpacityRef.current;
    }

    // Gentle breathing & subtle 3D parallax turn toward cursor
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(t * 1.55) * 0.022;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        0.16 + state.pointer.x * 0.07,
        0.05
      );
    }

    if (auraPointsRef.current) {
      auraPointsRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group ref={maidenGroupRef} position={[-1.45, -0.35, -0.8]}>
      {/* 3:4 Portrait Character Plane (2.55 x 3.4 world units) */}
      <mesh ref={meshRef} rotation={[0, 0.16, 0]}>
        <planeGeometry args={[2.55, 3.4, 20, 28]} />
        <shaderMaterial
          ref={shaderMatRef}
          vertexShader={MAIDEN_VERTEX_SHADER}
          fragmentShader={MAIDEN_FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Orbiting Golden Spirit Particles around the Shrine Maiden */}
      <group ref={auraPointsRef} position={[0, -0.1, 0]}>
        {Array.from({ length: 14 }).map((_, i) => {
          const ang = (i / 14) * Math.PI * 2;
          const r = 0.72 + (i % 3) * 0.16;
          const y = ((i % 7) - 3) * 0.35;
          return (
            <mesh key={i} position={[Math.cos(ang) * r, y, Math.sin(ang) * r]}>
              <octahedronGeometry args={[0.024, 0]} />
              <meshBasicMaterial color="#fde68a" toneMapped={false} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
