import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type AngelPoseMode = 'arrival' | 'speak' | 'fly' | 'present' | 'idle';

interface Angel3DProps {
  angelGroupRef: React.RefObject<THREE.Group | null>;
  poseModeRef: React.MutableRefObject<AngelPoseMode>;
  opacityRef: React.MutableRefObject<number>;
}

/**
 * Large dramatic arched Fallen Angel wing geometry:
 * high shoulder arch sweeping down into layered feathered tips.
 */
function createArchedWingGeometry(): THREE.ShapeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.15);
  shape.bezierCurveTo(0.28, 0.72, 0.72, 0.92, 1.12, 0.55);
  shape.bezierCurveTo(1.38, 0.25, 1.52, -0.35, 1.42, -1.05);
  // Scalloped primary feather tips
  shape.lineTo(1.22, -0.82);
  shape.lineTo(1.12, -1.12);
  shape.lineTo(0.92, -0.78);
  shape.lineTo(0.8, -1.02);
  shape.lineTo(0.6, -0.68);
  shape.lineTo(0.45, -0.85);
  shape.lineTo(0.25, -0.5);
  shape.bezierCurveTo(0.15, -0.32, 0.06, -0.15, 0, 0);
  shape.closePath();

  const geo = new THREE.ShapeGeometry(shape, 14);
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // Natural concave wing camber
    pos.setZ(i, -Math.pow(Math.max(0, x), 1.35) * 0.18 + Math.abs(y) * 0.04);
  }
  geo.computeVertexNormals();
  return geo;
}

/**
 * Articulated 3D Fallen Angel Queen inspired by dark-fantasy anime aesthetics:
 * - Long flowing crimson-magenta hair & sleek obsidian horns
 * - Dual-layered arched wings (obsidian outer + deep crimson inner)
 * - Dark obsidian & antique-gold royal corset, open cape, thigh-high boots
 * - Ornate golden scepter with glowing crimson-amber crystal core
 * - Full skeletal hierarchy with blinking eyes, wing flapping, and 3D flight/present poses
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
  const capeRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Group>(null);

  const wingGeo = useMemo(() => createArchedWingGeometry(), []);
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

    if (bodyFloatRef.current) {
      const floatAmp = mode === 'fly' ? 0.05 : 0.03;
      bodyFloatRef.current.position.y = Math.sin(t * 2.0) * floatAmp;
    }

    if (upperBodyRef.current) {
      const targetPitch = mode === 'fly' ? 0.24 : 0.02;
      upperBodyRef.current.rotation.x = THREE.MathUtils.lerp(
        upperBodyRef.current.rotation.x,
        targetPitch + Math.sin(t * 1.6) * 0.02,
        0.08
      );
    }

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

    // Natural eye blinking
    const blinkCycle = t % 3.6;
    const isBlinking = blinkCycle > 3.45 && blinkCycle < 3.58;
    const eyeY = isBlinking ? 0.08 : 1.0;
    if (leftEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, eyeY, 0.45);
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, eyeY, 0.45);
    }

    // Dramatic wing flapping
    const flapSpeed = mode === 'fly' ? 5.8 : 2.3;
    const flapAmp = mode === 'fly' ? 0.42 : 0.14;
    const flap = Math.sin(t * flapSpeed) * flapAmp;
    if (leftWingRef.current) {
      leftWingRef.current.rotation.y = -0.32 - flap;
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.y = 0.32 + flap;
    }

    // Arm & Scepter gestures
    if (leftArmRef.current && rightArmRef.current) {
      let targetLeftZ = 0.18;
      let targetLeftX = 0.08;
      let targetRightZ = -0.22;
      let targetRightX = -0.15;

      if (mode === 'speak') {
        targetLeftX = -0.72 + Math.sin(t * 2.4) * 0.05;
        targetLeftZ = 0.28;
        targetRightX = -0.22;
      } else if (mode === 'fly') {
        targetLeftX = 0.42;
        targetRightX = 0.25;
        targetLeftZ = 0.35;
        targetRightZ = -0.32;
      } else if (mode === 'present') {
        targetRightX = -0.58;
        targetRightZ = -0.48;
        targetLeftX = 0.12;
      }

      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, targetLeftX, 0.08);
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, targetLeftZ, 0.08);
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, targetRightX, 0.08);
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, targetRightZ, 0.08);
    }

    if (backHairRef.current) {
      const hairPitch = mode === 'fly' ? 0.4 : 0.12;
      backHairRef.current.rotation.x = THREE.MathUtils.lerp(
        backHairRef.current.rotation.x,
        hairPitch + Math.sin(t * 2.0) * 0.05,
        0.08
      );
    }
    if (capeRef.current) {
      capeRef.current.rotation.x = 0.14 + Math.sin(t * 1.5) * 0.04;
    }
    if (auraRef.current) {
      auraRef.current.rotation.y = t * 0.6;
    }
  });

  return (
    <group ref={angelGroupRef} position={[0, 0, 2.2]}>
      <group ref={bodyFloatRef}>
        {/* ===== LEGS & THIGH-HIGH OBSIDIAN BOOTS WITH GOLD GARTERS ===== */}
        <group position={[-0.085, 0.45, 0]}>
          <mesh position={[0, 0.24, 0]} castShadow>
            <cylinderGeometry args={[0.068, 0.058, 0.38, 12]} />
            <meshStandardMaterial color="#ffe8dc" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.08, 0]} castShadow>
            <cylinderGeometry args={[0.056, 0.042, 0.48, 12]} />
            <meshStandardMaterial color="#190e14" roughness={0.35} metalness={0.25} />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <torusGeometry args={[0.058, 0.008, 8, 18]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.18} />
          </mesh>
        </group>

        <group position={[0.085, 0.45, 0]}>
          <mesh position={[0, 0.24, 0]} castShadow>
            <cylinderGeometry args={[0.068, 0.058, 0.38, 12]} />
            <meshStandardMaterial color="#ffe8dc" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.08, 0]} castShadow>
            <cylinderGeometry args={[0.056, 0.042, 0.48, 12]} />
            <meshStandardMaterial color="#190e14" roughness={0.35} metalness={0.25} />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <torusGeometry args={[0.058, 0.008, 8, 18]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.18} />
          </mesh>
        </group>

        {/* ===== DARK ROYAL BELT & FLOWING OPEN CAPE ===== */}
        <mesh position={[0, 0.88, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.2, 0.14, 16]} />
          <meshStandardMaterial color="#180c12" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.9, 0.02]}>
          <torusGeometry args={[0.17, 0.012, 8, 24]} />
          <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.16} />
        </mesh>

        {/* Open Dark Burgundy-Obsidian Royal Cape */}
        <mesh ref={capeRef} position={[0, 0.68, -0.14]} rotation={[0.14, 0, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.48, 1.05, 16, 1, true, Math.PI * 0.65, Math.PI * 1.7]} />
          <meshStandardMaterial
            color="#3d0b18"
            roughness={0.52}
            metalness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* ===== UPPER BODY: DARK CORSET & GOLD EMBELLISHMENTS ===== */}
        <group ref={upperBodyRef} position={[0, 0.96, 0]}>
          {/* Midriff & Corset */}
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.125, 0.145, 0.22, 16]} />
            <meshStandardMaterial color="#ffe8dc" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.155, 0.13, 0.24, 16]} />
            <meshStandardMaterial color="#180c12" roughness={0.38} metalness={0.35} />
          </mesh>
          {/* Gold Chest Emblem & Chains */}
          <mesh position={[0, 0.32, 0.145]}>
            <octahedronGeometry args={[0.032, 0]} />
            <meshStandardMaterial color="#d946ef" emissive="#a21caf" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0, 0.44, 0.04]} rotation={[0.25, 0, 0]}>
            <torusGeometry args={[0.11, 0.016, 10, 24]} />
            <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.16} />
          </mesh>

          {/* Left Arm */}
          <group ref={leftArmRef} position={[-0.19, 0.36, 0.02]}>
            <mesh position={[-0.03, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.042, 0.034, 0.34, 10]} />
              <meshStandardMaterial color="#180c12" roughness={0.4} />
            </mesh>
            <mesh position={[-0.03, -0.35, 0]}>
              <sphereGeometry args={[0.038, 10, 10]} />
              <meshStandardMaterial color="#ffe8dc" roughness={0.5} />
            </mesh>
          </group>

          {/* Right Arm Holding Ornate Golden Scepter */}
          <group ref={rightArmRef} position={[0.19, 0.36, 0.02]}>
            <mesh position={[0.03, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.042, 0.034, 0.34, 10]} />
              <meshStandardMaterial color="#180c12" roughness={0.4} />
            </mesh>
            <mesh position={[0.03, -0.35, 0]}>
              <sphereGeometry args={[0.038, 10, 10]} />
              <meshStandardMaterial color="#ffe8dc" roughness={0.5} />
            </mesh>

            {/* Fallen Angel Queen Scepter */}
            <group position={[0.04, -0.36, 0.06]} rotation={[0.45, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.018, 0.014, 1.45, 10]} />
                <meshStandardMaterial color="#3b0d18" roughness={0.35} metalness={0.4} />
              </mesh>
              {/* Ornate Gold Crown & Glowing Crimson Crystal Head */}
              <mesh position={[0, 0.74, 0]}>
                <torusGeometry args={[0.085, 0.018, 10, 24]} />
                <meshStandardMaterial color="#d4af37" metalness={0.94} roughness={0.15} />
              </mesh>
              <mesh position={[0, 0.74, 0]}>
                <octahedronGeometry args={[0.055, 0]} />
                <meshStandardMaterial
                  color="#fb7185"
                  emissive="#f43f5e"
                  emissiveIntensity={1.8}
                  toneMapped={false}
                />
              </mesh>
            </group>
          </group>

          {/* ===== LARGE ARCHED FALLEN ANGEL WINGS (OBSIDIAN OUTER + CRIMSON INNER) ===== */}
          <group ref={leftWingRef} position={[-0.1, 0.34, -0.14]} scale={[-1.08, 1.08, 1]}>
            <mesh geometry={wingGeo}>
              <meshStandardMaterial
                color="#14090e"
                roughness={0.42}
                metalness={0.25}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh geometry={wingGeo} position={[0.02, -0.04, 0.02]} scale={[0.88, 0.88, 1]}>
              <meshStandardMaterial
                color="#7f1428"
                emissive="#4c0519"
                emissiveIntensity={0.35}
                roughness={0.48}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>

          <group ref={rightWingRef} position={[0.1, 0.34, -0.14]} scale={[1.08, 1.08, 1]}>
            <mesh geometry={wingGeo}>
              <meshStandardMaterial
                color="#14090e"
                roughness={0.42}
                metalness={0.25}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh geometry={wingGeo} position={[0.02, -0.04, 0.02]} scale={[0.88, 0.88, 1]}>
              <meshStandardMaterial
                color="#7f1428"
                emissive="#4c0519"
                emissiveIntensity={0.35}
                roughness={0.48}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>

          {/* ===== HEAD, CRIMSON HAIR & SLEEK OBSIDIAN HORNS ===== */}
          <group ref={headGroupRef} position={[0, 0.62, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.185, 24, 24]} />
              <meshStandardMaterial color="#ffe8dc" roughness={0.5} />
            </mesh>

            {/* Luminous Anime Eyes */}
            <mesh ref={leftEyeRef} position={[-0.065, 0.01, 0.168]}>
              <sphereGeometry args={[0.024, 12, 12]} />
              <meshStandardMaterial color="#2a0a18" emissive="#e11d48" emissiveIntensity={0.55} />
            </mesh>
            <mesh ref={rightEyeRef} position={[0.065, 0.01, 0.168]}>
              <sphereGeometry args={[0.024, 12, 12]} />
              <meshStandardMaterial color="#2a0a18" emissive="#e11d48" emissiveIntensity={0.55} />
            </mesh>

            {/* Crimson-Magenta Hair Crown & Side Locks */}
            <mesh position={[0, 0.045, -0.02]}>
              <sphereGeometry args={[0.205, 22, 22]} />
              <meshStandardMaterial color="#9f1239" roughness={0.34} metalness={0.18} />
            </mesh>
            <mesh position={[-0.155, -0.14, 0.06]} rotation={[0, 0, 0.08]}>
              <cylinderGeometry args={[0.038, 0.016, 0.36, 10]} />
              <meshStandardMaterial color="#9f1239" roughness={0.34} />
            </mesh>
            <mesh position={[0.155, -0.14, 0.06]} rotation={[0, 0, -0.08]}>
              <cylinderGeometry args={[0.038, 0.016, 0.36, 10]} />
              <meshStandardMaterial color="#9f1239" roughness={0.34} />
            </mesh>

            {/* Long Flowing Crimson Back Hair */}
            <group ref={backHairRef} position={[0, 0.04, -0.16]}>
              <mesh position={[0, -0.42, -0.04]}>
                <coneGeometry args={[0.25, 1.02, 16]} />
                <meshStandardMaterial color="#881337" roughness={0.36} metalness={0.16} />
              </mesh>
            </group>

            {/* Sleek Obsidian Horns */}
            <mesh position={[-0.085, 0.23, 0.02]} rotation={[0.15, 0, 0.22]}>
              <coneGeometry args={[0.034, 0.22, 10]} />
              <meshStandardMaterial color="#12090e" roughness={0.22} metalness={0.55} />
            </mesh>
            <mesh position={[0.085, 0.23, 0.02]} rotation={[0.15, 0, -0.22]}>
              <coneGeometry args={[0.034, 0.22, 10]} />
              <meshStandardMaterial color="#12090e" roughness={0.22} metalness={0.55} />
            </mesh>

            {/* Subtle Golden Royal Circlet Halo */}
            <mesh position={[0, 0.34, -0.04]} rotation={[Math.PI * 0.42, 0, 0]}>
              <torusGeometry args={[0.24, 0.012, 12, 48]} />
              <meshStandardMaterial
                color="#fde68a"
                emissive="#f59e0b"
                emissiveIntensity={1.4}
                metalness={0.92}
                roughness={0.15}
                toneMapped={false}
              />
            </mesh>
          </group>
        </group>

        {/* Golden & Crimson Spirit Particles Orbiting Fallen Angel Queen */}
        <group ref={auraRef} position={[0, 0.9, 0]}>
          {Array.from({ length: 10 }).map((_, i) => {
            const ang = (i / 10) * Math.PI * 2;
            const r = 0.62 + (i % 3) * 0.14;
            const y = ((i % 5) - 2) * 0.26;
            return (
              <mesh key={i} position={[Math.cos(ang) * r, y, Math.sin(ang) * r]}>
                <octahedronGeometry args={[0.022, 0]} />
                <meshBasicMaterial
                  color={i % 2 === 0 ? '#fde68a' : '#fb7185'}
                  toneMapped={false}
                />
              </mesh>
            );
          })}
        </group>
      </group>
    </group>
  );
};
