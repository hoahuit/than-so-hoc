import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type AngelPoseMode = 'arrival' | 'speak' | 'fly' | 'present' | 'idle';

interface Angel3DProps {
  angelGroupRef: React.RefObject<THREE.Group | null>;
  poseModeRef: React.MutableRefObject<AngelPoseMode>;
  opacityRef: React.MutableRefObject<number>;
}

function createFeatherWingGeometry(): THREE.ShapeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.28, 0.52, 0.85, 0.82, 1.18, 0.62);
  shape.bezierCurveTo(0.98, 0.34, 0.8, 0.22, 0.96, 0.04);
  shape.bezierCurveTo(0.7, -0.14, 0.52, -0.22, 0.66, -0.44);
  shape.bezierCurveTo(0.35, -0.46, 0.16, -0.28, 0, -0.14);
  shape.closePath();

  const geo = new THREE.ShapeGeometry(shape, 12);
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    pos.setZ(i, -Math.pow(x, 1.45) * 0.16);
  }
  geo.computeVertexNormals();
  return geo;
}

/**
 * Articulated 3D Celestial Angelic Shrine Maiden (procedural skeletal hierarchy)
 * with real depth testing/occlusion, feathered white-and-gold wings, flowing silver hair,
 * blinking eyes, hand gestures, and flight/idle animations.
 */
export const Angel3D: React.FC<Angel3DProps> = ({
  angelGroupRef,
  poseModeRef,
  opacityRef,
}) => {
  const bodyFloatRef = useRef<THREE.Group>(null);
  const upperBodyRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);
  const backHairRef = useRef<THREE.Group>(null);
  const skirtRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Group>(null);

  const wingGeo = useMemo(() => createFeatherWingGeometry(), []);
  useEffect(() => {
    return () => {
      wingGeo.dispose();
    };
  }, [wingGeo]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mode = poseModeRef.current;

    if (angelGroupRef.current) {
      angelGroupRef.current.visible = opacityRef.current > 0.02;
    }

    // Subtle vertical float
    if (bodyFloatRef.current) {
      const floatAmp = mode === 'fly' ? 0.05 : 0.032;
      bodyFloatRef.current.position.y = Math.sin(t * 2.1) * floatAmp;
    }

    // Upper body pitch (lean forward slightly during flight)
    if (upperBodyRef.current) {
      const targetPitch = mode === 'fly' ? 0.22 : 0.02;
      upperBodyRef.current.rotation.x = THREE.MathUtils.lerp(
        upperBodyRef.current.rotation.x,
        targetPitch + Math.sin(t * 1.6) * 0.02,
        0.08
      );
    }

    // Head orientation & natural blinking
    if (headGroupRef.current) {
      const targetHeadY =
        mode === 'speak'
          ? state.pointer.x * 0.08
          : mode === 'present'
            ? 0.14
            : Math.sin(t * 0.8) * 0.06;
      headGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        headGroupRef.current.rotation.y,
        targetHeadY,
        0.08
      );
    }

    const blinkCycle = t % 3.6;
    const isBlinking = blinkCycle > 3.45 && blinkCycle < 3.58;
    const eyeY = isBlinking ? 0.08 : 1.0;
    if (leftEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, eyeY, 0.45);
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, eyeY, 0.45);
    }

    // Wing flapping (energetic during flight, serene in idle/present)
    const flapSpeed = mode === 'fly' ? 6.2 : 2.6;
    const flapAmp = mode === 'fly' ? 0.42 : 0.16;
    const flap = Math.sin(t * flapSpeed) * flapAmp;
    if (leftWingRef.current) {
      leftWingRef.current.rotation.y = -0.35 - flap;
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.y = 0.35 + flap;
    }

    // Arm gestures: speak (gesture toward viewer), present (extend right hand toward jar), fly (swept back)
    if (leftArmRef.current && rightArmRef.current) {
      let targetLeftZ = 0.22;
      let targetLeftX = 0.1;
      let targetRightZ = -0.22;
      let targetRightX = 0.1;

      if (mode === 'speak') {
        targetRightX = -0.78 + Math.sin(t * 2.5) * 0.06;
        targetRightZ = -0.32;
        targetLeftX = -0.25;
      } else if (mode === 'fly') {
        targetLeftX = 0.45;
        targetRightX = 0.45;
        targetLeftZ = 0.38;
        targetRightZ = -0.38;
      } else if (mode === 'present') {
        targetRightX = -0.68;
        targetRightZ = -0.58;
        targetLeftX = 0.08;
      }

      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, targetLeftX, 0.08);
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, targetLeftZ, 0.08);
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, targetRightX, 0.08);
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, targetRightZ, 0.08);
    }

    // Flowing silver hair & skirt sway
    if (backHairRef.current) {
      const hairPitch = mode === 'fly' ? 0.38 : 0.12;
      backHairRef.current.rotation.x = THREE.MathUtils.lerp(
        backHairRef.current.rotation.x,
        hairPitch + Math.sin(t * 2.1) * 0.05,
        0.08
      );
    }
    if (skirtRef.current) {
      skirtRef.current.rotation.z = Math.sin(t * 1.4) * 0.025;
    }
    if (auraRef.current) {
      auraRef.current.rotation.y = t * 0.65;
    }
  });

  return (
    <group ref={angelGroupRef} position={[0, 0, 2.2]}>
      <group ref={bodyFloatRef}>
        {/* ===== LOWER ROBE (WHITE & ANTIQUE GOLD CELESTIAL HAKAMA) ===== */}
        <mesh ref={skirtRef} position={[0, 0.48, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.21, 0.44, 0.98, 20]} />
          <meshStandardMaterial color="#fdf8ec" roughness={0.48} metalness={0.12} />
        </mesh>
        {/* Gold Lower Hem Trim */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.425, 0.445, 0.09, 20]} />
          <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.22} />
        </mesh>

        {/* Gold Obi Waist Sash */}
        <mesh position={[0, 0.96, 0]} castShadow>
          <cylinderGeometry args={[0.21, 0.22, 0.14, 18]} />
          <meshStandardMaterial color="#d4af37" metalness={0.88} roughness={0.2} />
        </mesh>

        {/* ===== UPPER BODY SKELETAL GROUP ===== */}
        <group ref={upperBodyRef} position={[0, 1.02, 0]}>
          {/* White & Gold Kimono Torso */}
          <mesh position={[0, 0.24, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.2, 0.48, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
          {/* Gold Collar Trim */}
          <mesh position={[0, 0.45, 0.05]} rotation={[0.25, 0, 0]}>
            <torusGeometry args={[0.13, 0.022, 10, 24]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.18} />
          </mesh>

          {/* Left Arm & Flowing Celestial Sleeve */}
          <group ref={leftArmRef} position={[-0.22, 0.36, 0.02]}>
            <mesh position={[-0.06, -0.18, 0]} castShadow>
              <boxGeometry args={[0.12, 0.42, 0.22]} />
              <meshStandardMaterial color="#fdf8ec" roughness={0.5} />
            </mesh>
            <mesh position={[-0.06, -0.37, 0]}>
              <boxGeometry args={[0.13, 0.05, 0.23]} />
              <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.22} />
            </mesh>
            <mesh position={[-0.06, -0.41, 0.02]}>
              <sphereGeometry args={[0.045, 10, 10]} />
              <meshStandardMaterial color="#fff1e6" roughness={0.55} />
            </mesh>
          </group>

          {/* Right Arm & Flowing Celestial Sleeve (Gesturing Hand) */}
          <group ref={rightArmRef} position={[0.22, 0.36, 0.02]}>
            <mesh position={[0.06, -0.18, 0]} castShadow>
              <boxGeometry args={[0.12, 0.42, 0.22]} />
              <meshStandardMaterial color="#fdf8ec" roughness={0.5} />
            </mesh>
            <mesh position={[0.06, -0.37, 0]}>
              <boxGeometry args={[0.13, 0.05, 0.23]} />
              <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.22} />
            </mesh>
            <mesh position={[0.06, -0.41, 0.02]}>
              <sphereGeometry args={[0.045, 10, 10]} />
              <meshStandardMaterial color="#fff1e6" roughness={0.55} />
            </mesh>
          </group>

          {/* Feathered White & Gold Celestial Wings */}
          <group ref={leftWingRef} position={[-0.12, 0.34, -0.14]} scale={[-1.05, 1.05, 1]}>
            <mesh geometry={wingGeo}>
              <meshStandardMaterial
                color="#fffbeb"
                emissive="#fde68a"
                emissiveIntensity={0.45}
                roughness={0.25}
                metalness={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
          <group ref={rightWingRef} position={[0.12, 0.34, -0.14]} scale={[1.05, 1.05, 1]}>
            <mesh geometry={wingGeo}>
              <meshStandardMaterial
                color="#fffbeb"
                emissive="#fde68a"
                emissiveIntensity={0.45}
                roughness={0.25}
                metalness={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>

          {/* ===== HEAD, EYES, SILVER HAIR & CELESTIAL HALO ===== */}
          <group ref={headGroupRef} position={[0, 0.64, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.195, 24, 24]} />
              <meshStandardMaterial color="#fff1e6" roughness={0.52} />
            </mesh>

            {/* Expressive Anime Eyes */}
            <mesh ref={leftEyeRef} position={[-0.068, 0.01, 0.178]}>
              <sphereGeometry args={[0.025, 12, 12]} />
              <meshStandardMaterial color="#3b1d22" emissive="#d4af37" emissiveIntensity={0.35} />
            </mesh>
            <mesh ref={rightEyeRef} position={[0.068, 0.01, 0.178]}>
              <sphereGeometry args={[0.025, 12, 12]} />
              <meshStandardMaterial color="#3b1d22" emissive="#d4af37" emissiveIntensity={0.35} />
            </mesh>

            {/* Silver Hair Crown & Side Locks */}
            <mesh position={[0, 0.05, -0.02]}>
              <sphereGeometry args={[0.212, 22, 22]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[-0.16, -0.14, 0.07]} rotation={[0, 0, 0.08]}>
              <cylinderGeometry args={[0.04, 0.018, 0.34, 10]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
            </mesh>
            <mesh position={[0.16, -0.14, 0.07]} rotation={[0, 0, -0.08]}>
              <cylinderGeometry args={[0.04, 0.018, 0.34, 10]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
            </mesh>

            {/* Long Flowing Silver Back Hair */}
            <group ref={backHairRef} position={[0, 0.04, -0.16]}>
              <mesh position={[0, -0.36, -0.04]}>
                <coneGeometry args={[0.23, 0.88, 16]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.32} metalness={0.18} />
              </mesh>
            </group>

            {/* Sakura & Gold Ornament */}
            <mesh position={[-0.16, 0.12, 0.1]}>
              <dodecahedronGeometry args={[0.05, 0]} />
              <meshStandardMaterial color="#f9a8d4" emissive="#db2777" emissiveIntensity={0.35} />
            </mesh>

            {/* Golden Celestial Halo */}
            <mesh position={[0, 0.32, -0.04]} rotation={[Math.PI * 0.42, 0, 0]}>
              <torusGeometry args={[0.25, 0.014, 12, 48]} />
              <meshStandardMaterial
                color="#fde68a"
                emissive="#f59e0b"
                emissiveIntensity={1.5}
                metalness={0.92}
                roughness={0.15}
                toneMapped={false}
              />
            </mesh>
          </group>
        </group>

        {/* Golden Magical Particles Orbiting Angel */}
        <group ref={auraRef} position={[0, 0.9, 0]}>
          {Array.from({ length: 10 }).map((_, i) => {
            const ang = (i / 10) * Math.PI * 2;
            const r = 0.58 + (i % 3) * 0.12;
            const y = ((i % 5) - 2) * 0.25;
            return (
              <mesh key={i} position={[Math.cos(ang) * r, y, Math.sin(ang) * r]}>
                <octahedronGeometry args={[0.022, 0]} />
                <meshBasicMaterial color="#fde68a" toneMapped={false} />
              </mesh>
            );
          })}
        </group>
      </group>
    </group>
  );
};
