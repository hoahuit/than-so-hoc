import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface ShrineMaiden3DProps {
  maidenGroupRef: React.RefObject<THREE.Group | null>;
  maidenOpacityRef: React.MutableRefObject<number>;
  auraPointsRef: React.RefObject<THREE.Group | null>;
  handBeamRef: React.RefObject<THREE.Mesh | null>;
}

const MAIDEN_VERTEX_SHADER = `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Gentle wind sway on hair, sleeves & hakama
    float swayMask = smoothstep(0.15, 0.95, 1.0 - uv.y) * 0.45 + abs(uv.x - 0.5) * 0.55;
    pos.x += sin(uTime * 1.85 + uv.y * 4.5) * 0.025 * swayMask;
    pos.z += cos(uTime * 1.45 + uv.x * 3.5) * 0.02 * swayMask;

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

    float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    float maxCh = max(tex.r, max(tex.g, tex.b));
    float alphaKey = smoothstep(0.035, 0.14, max(lum, maxCh * 0.85));

    float edgeX = smoothstep(0.0, 0.04, vUv.x) * smoothstep(1.0, 0.96, vUv.x);
    float edgeY = smoothstep(0.0, 0.03, vUv.y) * smoothstep(1.0, 0.97, vUv.y);

    // Ethereal celestial white-gold rim glow
    vec3 celestialTint = mix(tex.rgb, tex.rgb * vec3(1.06, 1.03, 0.98), 0.4);
    float finalAlpha = alphaKey * edgeX * edgeY * uOpacity;

    if (finalAlpha < 0.01) discard;
    gl_FragColor = vec4(celestialTint, finalAlpha);
  }
`;

function createWingGeometry(): THREE.ShapeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.35, 0.55, 0.95, 0.85, 1.25, 0.65);
  shape.bezierCurveTo(1.05, 0.35, 0.85, 0.25, 1.02, 0.05);
  shape.bezierCurveTo(0.75, -0.15, 0.55, -0.22, 0.72, -0.45);
  shape.bezierCurveTo(0.38, -0.48, 0.18, -0.3, 0, -0.15);
  shape.closePath();

  const geo = new THREE.ShapeGeometry(shape, 12);
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    pos.setZ(i, -Math.pow(x, 1.5) * 0.18);
  }
  geo.computeVertexNormals();
  return geo;
}

/**
 * Celestial Angelic Shrine Maiden with 3D animated translucent white-and-gold wings,
 * golden celestial halo, wind-animated cloth/hair shader, and orbiting spirit particles.
 */
export const ShrineMaiden3D: React.FC<ShrineMaiden3DProps> = ({
  maidenGroupRef,
  maidenOpacityRef,
  auraPointsRef,
  handBeamRef,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const shaderMatRef = useRef<THREE.ShaderMaterial>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);
  const leftWingMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const rightWingMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const haloMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const texture = useTexture('/images/shrine-maiden-aaa.jpg');
  const wingGeo = useMemo(() => createWingGeometry(), []);

  useEffect(() => {
    return () => {
      wingGeo.dispose();
    };
  }, [wingGeo]);

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
    const op = maidenOpacityRef.current;

    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = t;
      shaderMatRef.current.uniforms.uOpacity.value = op;
    }

    // Gentle mid-air floating & wing flapping
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(t * 1.7) * 0.035;
    }

    const wingFlap = Math.sin(t * 3.1) * 0.22;
    if (leftWingRef.current) {
      leftWingRef.current.rotation.y = -0.35 - wingFlap;
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.y = 0.35 + wingFlap;
    }
    if (leftWingMatRef.current) leftWingMatRef.current.opacity = op * 0.78;
    if (rightWingMatRef.current) rightWingMatRef.current.opacity = op * 0.78;
    if (haloMatRef.current) haloMatRef.current.opacity = op * 0.9;

    if (auraPointsRef.current) {
      auraPointsRef.current.rotation.y = t * 0.65;
    }
  });

  return (
    <group ref={maidenGroupRef} position={[-1.5, 0.1, -0.5]}>
      {/* 3:4 Celestial Maiden Plane */}
      <mesh ref={meshRef}>
        <planeGeometry args={[2.15, 2.86, 20, 28]} />
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

      {/* Delicate Luminous White & Gold Angel Wings */}
      <mesh
        ref={leftWingRef}
        geometry={wingGeo}
        position={[-0.22, 0.38, -0.14]}
        scale={[-0.95, 0.95, 1]}
      >
        <meshStandardMaterial
          ref={leftWingMatRef}
          color="#fffbeb"
          emissive="#fde68a"
          emissiveIntensity={0.65}
          roughness={0.25}
          metalness={0.35}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={rightWingRef}
        geometry={wingGeo}
        position={[0.22, 0.38, -0.14]}
        scale={[0.95, 0.95, 1]}
      >
        <meshStandardMaterial
          ref={rightWingMatRef}
          color="#fffbeb"
          emissive="#fde68a"
          emissiveIntensity={0.65}
          roughness={0.25}
          metalness={0.35}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Celestial Gold Halo */}
      <mesh position={[0, 1.32, -0.06]} rotation={[Math.PI * 0.42, 0, 0]}>
        <torusGeometry args={[0.28, 0.014, 12, 48]} />
        <meshStandardMaterial
          ref={haloMatRef}
          color="#fde68a"
          emissive="#f59e0b"
          emissiveIntensity={1.6}
          metalness={0.9}
          roughness={0.15}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>

      {/* Phase 3 Destiny Activation Energy Beam toward Jar */}
      <mesh
        ref={handBeamRef}
        position={[0.65, 0.05, 0.15]}
        rotation={[0, 0, Math.PI / 2]}
        visible={false}
      >
        <cylinderGeometry args={[0.025, 0.08, 1.35, 12]} />
        <meshBasicMaterial
          color="#fde68a"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting Golden Spirit Particles */}
      <group ref={auraPointsRef} position={[0, -0.1, 0]}>
        {Array.from({ length: 14 }).map((_, i) => {
          const ang = (i / 14) * Math.PI * 2;
          const r = 0.65 + (i % 3) * 0.15;
          const y = ((i % 7) - 3) * 0.32;
          return (
            <mesh key={i} position={[Math.cos(ang) * r, y, Math.sin(ang) * r]}>
              <octahedronGeometry args={[0.022, 0]} />
              <meshBasicMaterial color="#fde68a" toneMapped={false} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
