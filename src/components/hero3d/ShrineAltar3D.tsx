import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createProceduralPBRTextures, disposePBRTextures } from './pbrTextures';

export type DrawPhase3D = 'idle' | 'shaking' | 'ejecting' | 'finished';

interface ShrineAltar3DProps {
  isMobile: boolean;
  altarGroupRef: React.RefObject<THREE.Group | null>;
  ringsGroupRef: React.RefObject<THREE.Group | null>;
  ring1Ref: React.RefObject<THREE.Group | null>;
  ring2Ref: React.RefObject<THREE.Group | null>;
  ring3Ref: React.RefObject<THREE.Group | null>;
  ringMatsRef: React.MutableRefObject<(THREE.MeshStandardMaterial | null)[]>;
  symbolMatsRef: React.MutableRefObject<(THREE.MeshStandardMaterial | null)[]>;
  boxGroupRef: React.RefObject<THREE.Group | null>;
  scrollGroupRef: React.RefObject<THREE.Group | null>;
  stickRef: React.RefObject<THREE.Mesh | null>;
  ringSpeedMultRef: React.MutableRefObject<number>;
  drawPhase: DrawPhase3D;
  onAltarClick: () => void;
}

export const ShrineAltar3D: React.FC<ShrineAltar3DProps> = ({
  isMobile,
  altarGroupRef,
  ringsGroupRef,
  ring1Ref,
  ring2Ref,
  ring3Ref,
  ringMatsRef,
  symbolMatsRef,
  boxGroupRef,
  scrollGroupRef,
  stickRef,
  ringSpeedMultRef,
  drawPhase,
  onAltarClick,
}) => {
  const hoveredRef = useRef(false);
  const boxGlowMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const pointerDownRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const pbr = useMemo(() => createProceduralPBRTextures(), []);

  useEffect(() => {
    return () => {
      disposePBRTextures(pbr);
    };
  }, [pbr]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const mult = ringSpeedMultRef.current;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.55 * mult;
      ring1Ref.current.rotation.y += delta * 0.25 * mult;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 0.68 * mult;
      ring2Ref.current.rotation.z += delta * 0.32 * mult;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z -= delta * 0.48 * mult;
      ring3Ref.current.rotation.x += delta * 0.36 * mult;
    }

    if (boxGroupRef.current && drawPhase === 'idle') {
      boxGroupRef.current.position.y = 0.78 + Math.sin(t * 1.5) * 0.055;
    }
    if (scrollGroupRef.current) {
      scrollGroupRef.current.position.y = 1.85 + Math.sin(t * 1.9 + 0.7) * 0.05;
      scrollGroupRef.current.rotation.y = Math.sin(t * 0.8) * 0.22;
    }

    if (boxGlowMatRef.current) {
      const targetEmissive = hoveredRef.current ? 0.95 : 0.32;
      boxGlowMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        boxGlowMatRef.current.emissiveIntensity,
        targetEmissive,
        0.1
      );
    }
  });

  return (
    <group
      ref={altarGroupRef}
      position={isMobile ? [0.42, -1.15, 0.55] : [0.82, -1.58, 0.45]}
      scale={isMobile ? 1.24 : 1.38}
      onPointerOver={(e) => {
        e.stopPropagation();
        hoveredRef.current = true;
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        hoveredRef.current = false;
        document.body.style.cursor = 'auto';
      }}
      onPointerDown={(e) => {
        pointerDownRef.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        const dx = e.clientX - pointerDownRef.current.x;
        const dy = e.clientY - pointerDownRef.current.y;
        if (Math.hypot(dx, dy) < 7) {
          onAltarClick();
        }
      }}
    >
      {/* ===== CARVED OBSIDIAN STONE ALTAR WITH PBR STONE TEXTURE ===== */}
      <mesh position={[0, -0.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.92, 1.12, 0.24, 32]} />
        <meshStandardMaterial
          map={pbr.stoneMap}
          roughnessMap={pbr.stoneRoughness}
          roughness={0.72}
          metalness={0.22}
        />
      </mesh>
      <mesh position={[0, 0.04, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.76, 0.86, 0.12, 32]} />
        <meshStandardMaterial
          map={pbr.stoneMap}
          roughnessMap={pbr.stoneRoughness}
          roughness={0.68}
          metalness={0.26}
        />
      </mesh>
      {/* Engraved Gold Seal Ring on Altar */}
      <mesh position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.58, 0.66, 48]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d97706"
          emissiveIntensity={0.9}
          metalness={0.94}
          roughness={0.18}
        />
      </mesh>

      {/* ===== DETAILED LACQUERED WOOD OMIKUJI BOX WITH KANJI PLAQUE ===== */}
      <group ref={boxGroupRef} position={[0, 0.78, 0]}>
        {/* Deep Burgundy Wood Grain Hexagonal Body */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.45, 1.18, 6]} />
          <meshStandardMaterial
            map={pbr.woodMap}
            roughnessMap={pbr.woodRoughness}
            roughness={0.38}
            metalness={0.25}
          />
        </mesh>

        {/* Top & Bottom Antique Brass-Gold Collars */}
        <mesh position={[0, 0.54, 0]} castShadow>
          <cylinderGeometry args={[0.485, 0.485, 0.11, 6]} />
          <meshStandardMaterial
            ref={boxGlowMatRef}
            color="#d4af37"
            emissive="#f59e0b"
            emissiveIntensity={0.32}
            metalness={0.94}
            roughness={0.16}
          />
        </mesh>
        <mesh position={[0, -0.54, 0]} castShadow>
          <cylinderGeometry args={[0.485, 0.485, 0.11, 6]} />
          <meshStandardMaterial
            color="#d4af37"
            emissive="#92400e"
            emissiveIntensity={0.25}
            metalness={0.94}
            roughness={0.16}
          />
        </mesh>

        {/* Crimson Fabric Tassel / Cord Band */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.468, 0.468, 0.065, 6]} />
          <meshStandardMaterial color="#9f1239" roughness={0.78} metalness={0.05} />
        </mesh>

        {/* Top Stick Dispenser Cap */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.035, 18]} />
          <meshStandardMaterial color="#0e090d" roughness={0.75} />
        </mesh>

        {/* Front Engraved Kanji Talisman Plaque ("御神籤") */}
        <mesh position={[0, 0.02, 0.395]}>
          <boxGeometry args={[0.25, 0.54, 0.028]} />
          <meshStandardMaterial
            map={pbr.plaqueMap}
            emissiveMap={pbr.plaqueEmissive}
            emissive="#f59e0b"
            emissiveIntensity={0.55}
            roughness={0.32}
            metalness={0.2}
          />
        </mesh>

        {/* Ejecting Golden Bamboo Stick */}
        <mesh ref={stickRef} position={[0, 0.36, 0]} visible={false}>
          <boxGeometry args={[0.06, 0.9, 0.03]} />
          <meshStandardMaterial
            color="#fde68a"
            emissive="#f59e0b"
            emissiveIntensity={1.7}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ===== FLOATING TEXTURED FORTUNE SCROLL ("大吉") ===== */}
      <group ref={scrollGroupRef} position={[0, 1.85, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.26, 0.36, 0.015]} />
          <meshStandardMaterial
            map={pbr.scrollMap}
            emissive="#f59e0b"
            emissiveIntensity={0.22}
            roughness={0.48}
          />
        </mesh>
        <mesh position={[0, 0.19, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.32, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.94} roughness={0.16} />
        </mesh>
        <mesh position={[0, -0.19, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.32, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.94} roughness={0.16} />
        </mesh>
      </group>

      {/* ===== THREE ROTATING CELESTIAL GOLD RINGS ===== */}
      <group ref={ringsGroupRef} position={[0, 0.72, 0]}>
        <group ref={ring1Ref} rotation={[0.45, 0.2, 0]}>
          <mesh>
            <torusGeometry args={[0.9, 0.022, 16, 80]} />
            <meshStandardMaterial
              ref={(el) => {
                ringMatsRef.current[0] = el;
              }}
              color="#d4af37"
              emissive="#92400e"
              emissiveIntensity={0.4}
              metalness={0.96}
              roughness={0.14}
              transparent
            />
          </mesh>
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
            <mesh key={i} position={[Math.cos(ang) * 0.9, Math.sin(ang) * 0.9, 0]}>
              <octahedronGeometry args={[0.045, 0]} />
              <meshStandardMaterial
                ref={(el) => {
                  symbolMatsRef.current[i] = el;
                }}
                color="#fef3c7"
                emissive="#fbbf24"
                emissiveIntensity={1.6}
                toneMapped={false}
                transparent
              />
            </mesh>
          ))}
        </group>

        <group ref={ring2Ref} rotation={[-0.6, 0.8, 0.3]}>
          <mesh>
            <torusGeometry args={[1.08, 0.02, 16, 80]} />
            <meshStandardMaterial
              ref={(el) => {
                ringMatsRef.current[1] = el;
              }}
              color="#f3c64f"
              emissive="#b45309"
              emissiveIntensity={0.45}
              metalness={0.96}
              roughness={0.14}
              transparent
            />
          </mesh>
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, i) => (
            <mesh key={i} position={[Math.cos(ang) * 1.08, Math.sin(ang) * 1.08, 0]}>
              <octahedronGeometry args={[0.042, 0]} />
              <meshStandardMaterial
                ref={(el) => {
                  symbolMatsRef.current[4 + i] = el;
                }}
                color="#fde68a"
                emissive="#f59e0b"
                emissiveIntensity={1.6}
                toneMapped={false}
                transparent
              />
            </mesh>
          ))}
        </group>

        <group ref={ring3Ref} rotation={[1.1, -0.35, 0.75]}>
          <mesh>
            <torusGeometry args={[1.26, 0.018, 16, 80]} />
            <meshStandardMaterial
              ref={(el) => {
                ringMatsRef.current[2] = el;
              }}
              color="#dfb84b"
              emissive="#78350f"
              emissiveIntensity={0.35}
              metalness={0.96}
              roughness={0.16}
              transparent
            />
          </mesh>
          {[Math.PI / 4, (5 * Math.PI) / 4].map((ang, i) => (
            <mesh key={i} position={[Math.cos(ang) * 1.26, Math.sin(ang) * 1.26, 0]}>
              <octahedronGeometry args={[0.042, 0]} />
              <meshStandardMaterial
                ref={(el) => {
                  symbolMatsRef.current[7 + i] = el;
                }}
                color="#fffbeb"
                emissive="#fbbf24"
                emissiveIntensity={1.6}
                toneMapped={false}
                transparent
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};
