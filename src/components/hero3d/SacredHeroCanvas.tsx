import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { ShrineEnvironment3D } from './ShrineEnvironment3D';
import { ShrineMaiden3D } from './ShrineMaiden3D';
import { ShrineAltar3D, type DrawPhase3D } from './ShrineAltar3D';
import { createProceduralPBRTextures, disposePBRTextures } from './pbrTextures';

export type CeremonyPhase =
  | 'arrival'
  | 'circulation'
  | 'activation'
  | 'message'
  | 'complete';

interface SacredHeroCanvasProps {
  drawPhase: DrawPhase3D;
  skipRequested: boolean;
  onAltarClick: () => void;
  onPhaseChange?: (phase: CeremonyPhase) => void;
}

class WebGLErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/shrine-backdrop-aaa.jpg)' }}
        />
      );
    }
    return this.props.children;
  }
}

interface SakuraPetalSeed {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  speedY: number;
  speedZ: number;
  scale: number;
}

function createSakuraSeeds(count: number): SakuraPetalSeed[] {
  const seeds: SakuraPetalSeed[] = [];
  for (let i = 0; i < count; i++) {
    seeds.push({
      x: ((i % 11) - 5) * 1.15,
      y: ((i % 7) - 2) * 0.85,
      z: ((i % 9) - 4) * 1.25,
      rx: (i % 5) * 0.7,
      ry: (i % 6) * 0.5,
      rz: (i % 4) * 0.6,
      speedY: 0.22 + (i % 4) * 0.08,
      speedZ: 0.14 + (i % 3) * 0.05,
      scale: 0.045 + (i % 3) * 0.018,
    });
  }
  return seeds;
}

interface DirectorProps {
  isMobile: boolean;
  drawPhase: DrawPhase3D;
  skipRequested: boolean;
  onAltarClick: () => void;
  onPhaseChange?: (phase: CeremonyPhase) => void;
}

const CinematicSceneDirector: React.FC<DirectorProps> = ({
  isMobile,
  drawPhase,
  skipRequested,
  onAltarClick,
  onPhaseChange,
}) => {
  const { camera } = useThree();

  const sceneParallaxRef = useRef<THREE.Group | null>(null);
  const lanternLightsRef = useRef<(THREE.PointLight | null)[]>([]);
  const backdropMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const waterRippleRef = useRef<THREE.Mesh | null>(null);
  const waterRippleMatRef = useRef<THREE.MeshBasicMaterial | null>(null);

  const maidenGroupRef = useRef<THREE.Group | null>(null);
  const maidenOpacityRef = useRef<number>(0);
  const auraPointsRef = useRef<THREE.Group | null>(null);
  const handBeamRef = useRef<THREE.Mesh | null>(null);

  const altarGroupRef = useRef<THREE.Group | null>(null);
  const ringsGroupRef = useRef<THREE.Group | null>(null);
  const ring1Ref = useRef<THREE.Group | null>(null);
  const ring2Ref = useRef<THREE.Group | null>(null);
  const ring3Ref = useRef<THREE.Group | null>(null);
  const ringMatsRef = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const symbolMatsRef = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const boxGroupRef = useRef<THREE.Group | null>(null);
  const lidGroupRef = useRef<THREE.Group | null>(null);
  const innerGlowRef = useRef<THREE.PointLight | null>(null);
  const scrollGroupRef = useRef<THREE.Group | null>(null);
  const stickRef = useRef<THREE.Mesh | null>(null);

  const burstLightRef = useRef<THREE.PointLight | null>(null);
  const sakuraMeshRef = useRef<THREE.InstancedMesh | null>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const orbitStateRef = useRef<{ active: boolean; angle: number }>({
    active: false,
    angle: 0,
  });
  const ringSpeedMultRef = useRef<number>(1);
  const introDoneRef = useRef<boolean>(false);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const petalCount = isMobile ? 18 : 42;
  const sakuraSeeds = useMemo(() => createSakuraSeeds(petalCount), [petalCount]);

  const petalAssets = useMemo(() => createProceduralPBRTextures(), []);
  useEffect(() => {
    return () => {
      disposePBRTextures(petalAssets);
    };
  }, [petalAssets]);

  // Allow user to skip straight to complete state immediately
  useEffect(() => {
    if (skipRequested && timelineRef.current && !introDoneRef.current) {
      timelineRef.current.progress(1);
    }
  }, [skipRequested]);

  // 5-Phase Coordinated Cinematic Ceremony (~5.5 seconds)
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const maidenGroup = maidenGroupRef.current;
    const altarGroup = altarGroupRef.current;
    const ringsGroup = ringsGroupRef.current;
    const scrollGroup = scrollGroupRef.current;
    const lidGroup = lidGroupRef.current;
    const innerGlow = innerGlowRef.current;
    const handBeam = handBeamRef.current;
    const backdropMat = backdropMatRef.current;
    const burstLight = burstLightRef.current;
    const waterRipple = waterRippleRef.current;
    const waterRippleMat = waterRippleMatRef.current;

    if (
      !maidenGroup ||
      !altarGroup ||
      !ringsGroup ||
      !scrollGroup ||
      !lidGroup ||
      !backdropMat ||
      !burstLight
    ) {
      return;
    }

    const jarCenter = isMobile ? { x: 0, y: -0.82, z: 0.45 } : { x: 0.45, y: -1.52, z: 0.45 };
    const finalCamPos = isMobile ? { x: 0, y: 0.25, z: 5.5 } : { x: -0.25, y: 0.25, z: 5.75 };
    const angelRestPos = isMobile ? { x: -1.15, y: 0.22, z: -0.2 } : { x: -1.65, y: 0.15, z: -0.25 };
    const angelScale = isMobile ? 0.62 : 0.88;

    if (prefersReducedMotion) {
      camera.position.set(finalCamPos.x, finalCamPos.y, finalCamPos.z);
      backdropMat.opacity = 1;
      lanternLightsRef.current.forEach((l) => {
        if (l) {
          l.intensity = 1.65;
          l.userData.awakened = true;
        }
      });
      maidenOpacityRef.current = 1;
      maidenGroup.position.set(angelRestPos.x, angelRestPos.y, angelRestPos.z);
      maidenGroup.scale.set(angelScale, angelScale, angelScale);
      maidenGroup.rotation.set(0, 0.25, 0);
      altarGroup.position.set(jarCenter.x, jarCenter.y, jarCenter.z);
      ringsGroup.scale.set(1, 1, 1);
      lidGroup.position.set(0, 0.72, 0);
      lidGroup.rotation.set(0, 0, -0.35);
      scrollGroup.position.set(0, 1.85, 0);
      scrollGroup.scale.set(1, 1, 1);
      if (innerGlow) innerGlow.intensity = 2.2;
      burstLight.intensity = 2.6;
      introDoneRef.current = true;
      onPhaseChange?.('complete');
      return;
    }

    // Initial Pre-Ceremony Setup
    introDoneRef.current = false;
    orbitStateRef.current = { active: false, angle: 0.3 };
    camera.position.set(0, 0.65, 7.6);
    backdropMat.opacity = 0;

    lanternLightsRef.current.forEach((l) => {
      if (l) {
        l.intensity = 0;
        l.userData.awakened = false;
      }
    });

    maidenOpacityRef.current = 0;
    maidenGroup.position.set(jarCenter.x + 2.4, 1.8, -1.6);
    maidenGroup.scale.set(angelScale * 0.75, angelScale * 0.75, angelScale * 0.75);
    maidenGroup.rotation.set(0, -0.35, 0);

    altarGroup.position.set(jarCenter.x, jarCenter.y - 1.1, jarCenter.z);
    ringsGroup.scale.set(0.35, 0.35, 0.35);
    ringMatsRef.current.forEach((m) => {
      if (m) m.opacity = 0;
    });
    symbolMatsRef.current.forEach((m) => {
      if (m) m.opacity = 0;
    });

    lidGroup.position.set(0, 0.6, 0);
    lidGroup.rotation.set(0, 0, 0);
    if (innerGlow) innerGlow.intensity = 0.2;
    if (handBeam) handBeam.visible = false;

    scrollGroup.position.set(0, 0.72, 0);
    scrollGroup.scale.set(0.01, 0.01, 0.01);
    burstLight.intensity = 0.6;
    ringSpeedMultRef.current = 1;

    const tl = gsap.timeline({
      onComplete: () => {
        introDoneRef.current = true;
        onPhaseChange?.('complete');
      },
    });
    timelineRef.current = tl;

    // ===== PHASE 1: ANGEL ARRIVAL (0.0 – 1.2s) =====
    tl.call(() => onPhaseChange?.('arrival'), [], 0)
      .to(backdropMat, { opacity: 1, duration: 0.75, ease: 'power2.out' }, 0)
      .to(
        camera.position,
        { x: finalCamPos.x, y: finalCamPos.y + 0.18, z: finalCamPos.z + 0.5, duration: 1.1, ease: 'power2.out' },
        0
      )
      .to(
        altarGroup.position,
        { y: jarCenter.y, duration: 1.0, ease: 'back.out(1.2)' },
        0.15
      )
      .to(
        maidenOpacityRef,
        { current: 1, duration: 0.85, ease: 'power2.out' },
        0.25
      )
      .to(
        maidenGroup.position,
        {
          x: jarCenter.x + (isMobile ? 1.05 : 1.55),
          y: 0.25,
          z: jarCenter.z + 0.35,
          duration: 1.05,
          ease: 'power3.out',
        },
        0.2
      )
      .to(
        maidenGroup.scale,
        { x: angelScale, y: angelScale, z: angelScale, duration: 1.0, ease: 'power2.out' },
        0.2
      );

    lanternLightsRef.current.forEach((light, idx) => {
      if (light) {
        tl.to(
          light,
          {
            intensity: 1.65,
            duration: 0.35,
            onStart: () => {
              light.userData.awakened = true;
            },
          },
          0.1 + idx * 0.08
        );
      }
    });

    // ===== PHASE 2: DIVINE CIRCULATION (1.2 – 2.6s) =====
    tl.call(
      () => {
        onPhaseChange?.('circulation');
        orbitStateRef.current.active = true;
        orbitStateRef.current.angle = 0.2;
      },
      [],
      1.2
    )
      .to(
        orbitStateRef.current,
        {
          angle: Math.PI * 1.15,
          duration: 1.4,
          ease: 'power1.inOut',
          onUpdate: () => {
            const ang = orbitStateRef.current.angle;
            const rx = isMobile ? 1.1 : 1.65;
            const rz = isMobile ? 0.85 : 1.15;
            maidenGroup.position.x = jarCenter.x + Math.cos(ang) * rx;
            maidenGroup.position.z = jarCenter.z + Math.sin(ang) * rz;
            maidenGroup.position.y = 0.22 + Math.sin(ang * 2) * 0.14;
            // Face gently toward the jar
            maidenGroup.rotation.y = -ang + Math.PI * 0.5;
          },
        },
        1.2
      )
      .to(ringsGroup.scale, { x: 1, y: 1, z: 1, duration: 0.85, ease: 'back.out(1.3)' }, 1.25)
      .to(ringMatsRef.current.filter(Boolean), { opacity: 1, duration: 0.6 }, 1.25)
      .to(symbolMatsRef.current.filter(Boolean), { opacity: 1, duration: 0.6 }, 1.35)
      .to(ringSpeedMultRef, { current: 2.3, duration: 0.6, ease: 'power2.inOut' }, 1.3);

    // ===== PHASE 3: DESTINY ACTIVATION (2.6 – 3.8s) =====
    tl.call(
      () => {
        onPhaseChange?.('activation');
        orbitStateRef.current.active = false;
        if (handBeam) handBeam.visible = true;
      },
      [],
      2.6
    )
      .to(
        maidenGroup.rotation,
        { y: 0.35, duration: 0.5, ease: 'power2.out' },
        2.6
      )
      .to(innerGlow || {}, { intensity: 5.5, duration: 0.6, ease: 'power2.in' }, 2.65)
      .to(
        lidGroup.position,
        { y: 0.88, x: -0.18, duration: 0.7, ease: 'power2.out' },
        2.85
      )
      .to(
        lidGroup.rotation,
        { z: 0.55, duration: 0.7, ease: 'power2.out' },
        2.85
      )
      .to(
        scrollGroup.position,
        { y: 1.88, duration: 0.9, ease: 'power3.out' },
        3.0
      )
      .to(
        scrollGroup.scale,
        { x: 1, y: 1, z: 1, duration: 0.8, ease: 'back.out(1.5)' },
        3.0
      );

    // ===== PHASE 4: DESTINY MESSAGE & GOLDEN PULSE (3.8 – 4.8s) =====
    tl.call(
      () => {
        onPhaseChange?.('message');
        if (handBeam) handBeam.visible = false;
        if (waterRipple && waterRippleMat) {
          waterRipple.visible = true;
          waterRipple.scale.set(0.4, 0.4, 0.4);
          waterRippleMat.opacity = 0.85;
        }
      },
      [],
      3.8
    )
      .to(
        burstLight,
        { intensity: 8.0, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' },
        3.8
      )
      .to(
        waterRipple ? waterRipple.scale : {},
        { x: 3.6, y: 3.6, z: 3.6, duration: 0.9, ease: 'power3.out' },
        3.8
      )
      .to(
        waterRippleMat || {},
        { opacity: 0, duration: 0.85, ease: 'power2.out' },
        3.82
      );

    // ===== PHASE 5: RESULT TRANSITION & IDLE (4.8 – 5.6s) =====
    tl.to(
      maidenGroup.position,
      {
        x: angelRestPos.x,
        y: angelRestPos.y,
        z: angelRestPos.z,
        duration: 0.8,
        ease: 'power3.out',
      },
      4.8
    )
      .to(maidenGroup.rotation, { y: 0.22, duration: 0.75, ease: 'power2.out' }, 4.8)
      .to(
        camera.position,
        { x: finalCamPos.x, y: finalCamPos.y, z: finalCamPos.z, duration: 0.8, ease: 'power3.out' },
        4.8
      )
      .to(ringSpeedMultRef, { current: 1.0, duration: 0.75, ease: 'power2.out' }, 4.8)
      .to(innerGlow || {}, { intensity: 2.0, duration: 0.6, ease: 'power2.out' }, 4.85)
      .to(burstLight, { intensity: 2.6, duration: 0.6, ease: 'power2.out' }, 4.85);

    return () => {
      tl.kill();
    };
  }, [camera, isMobile, onPhaseChange]);

  // Handle 3D Omikuji Box Shake & Stick Ejection on "Gieo Quẻ Ngay"
  useEffect(() => {
    const boxGroup = boxGroupRef.current;
    const stick = stickRef.current;
    if (!boxGroup) return;

    if (drawPhase === 'shaking') {
      if (stick) {
        stick.visible = false;
        stick.position.set(0, 0.36, 0);
      }
      const shakeTl = gsap.timeline({ repeat: -1, yoyo: true });
      shakeTl
        .to(boxGroup.position, { y: 0.92, duration: 0.08, ease: 'power1.inOut' })
        .to(boxGroup.rotation, { z: 0.2, x: 0.16, duration: 0.08, ease: 'power1.inOut' }, '<')
        .to(boxGroup.position, { y: 0.66, duration: 0.08, ease: 'power1.inOut' })
        .to(boxGroup.rotation, { z: -0.2, x: 0.05, duration: 0.08, ease: 'power1.inOut' }, '<');

      return () => {
        shakeTl.kill();
      };
    }

    if (drawPhase === 'ejecting') {
      gsap.to(boxGroup.position, { y: 0.78, duration: 0.25 });
      gsap.to(boxGroup.rotation, { z: -0.25, x: 0.22, duration: 0.4, ease: 'power2.out' });
      if (stick) {
        stick.visible = true;
        stick.position.set(0, 0.36, 0);
        gsap.to(stick.position, {
          y: 1.15,
          duration: 0.65,
          ease: 'back.out(1.35)',
        });
      }
    } else {
      gsap.to(boxGroup.rotation, { z: 0, x: 0, duration: 0.4, ease: 'power2.out' });
      if (stick && drawPhase === 'idle') {
        stick.visible = false;
      }
    }
  }, [drawPhase]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (sakuraMeshRef.current) {
      for (let i = 0; i < petalCount; i++) {
        const p = sakuraSeeds[i];
        const cycleY = ((p.y - t * p.speedY + 3.0) % 6.0) - 2.2;
        const cycleZ = ((p.z + t * p.speedZ + 5.0) % 10.0) - 5.0;
        const px = p.x + Math.sin(t * 0.7 + i) * 0.35;

        dummy.position.set(px, cycleY, cycleZ);
        dummy.rotation.set(p.rx + t * 0.9, p.ry + t * 0.65, p.rz + Math.sin(t + i) * 0.45);
        dummy.scale.set(p.scale, p.scale, p.scale);
        dummy.updateMatrix();
        sakuraMeshRef.current.setMatrixAt(i, dummy.matrix);
      }
      sakuraMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    if (introDoneRef.current && sceneParallaxRef.current) {
      sceneParallaxRef.current.rotation.y = THREE.MathUtils.lerp(
        sceneParallaxRef.current.rotation.y,
        state.pointer.x * 0.045,
        0.035
      );
      sceneParallaxRef.current.rotation.x = THREE.MathUtils.lerp(
        sceneParallaxRef.current.rotation.x,
        -state.pointer.y * 0.025 + Math.sin(t * 0.55) * 0.006,
        0.035
      );
    }
  });

  return (
    <group ref={sceneParallaxRef}>
      <ambientLight intensity={0.38} color="#fff1dc" />
      <directionalLight
        position={[4, 7, 5]}
        intensity={1.45}
        color="#fde68a"
        castShadow={!isMobile}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 4, -8]} intensity={1.1} color="#fbcfe8" />
      <pointLight
        ref={burstLightRef}
        position={[0.45, -0.45, 0.45]}
        color="#fde68a"
        intensity={2.6}
        distance={10}
      />

      <ShrineEnvironment3D
        isMobile={isMobile}
        lanternLightsRef={lanternLightsRef}
        backdropMatRef={backdropMatRef}
        waterRippleRef={waterRippleRef}
        waterRippleMatRef={waterRippleMatRef}
      />

      <ShrineMaiden3D
        maidenGroupRef={maidenGroupRef}
        maidenOpacityRef={maidenOpacityRef}
        auraPointsRef={auraPointsRef}
        handBeamRef={handBeamRef}
      />

      <ShrineAltar3D
        isMobile={isMobile}
        altarGroupRef={altarGroupRef}
        ringsGroupRef={ringsGroupRef}
        ring1Ref={ring1Ref}
        ring2Ref={ring2Ref}
        ring3Ref={ring3Ref}
        ringMatsRef={ringMatsRef}
        symbolMatsRef={symbolMatsRef}
        boxGroupRef={boxGroupRef}
        lidGroupRef={lidGroupRef}
        innerGlowRef={innerGlowRef}
        scrollGroupRef={scrollGroupRef}
        stickRef={stickRef}
        ringSpeedMultRef={ringSpeedMultRef}
        drawPhase={drawPhase}
        onAltarClick={onAltarClick}
      />

      <instancedMesh
        ref={sakuraMeshRef}
        args={[petalAssets.petalGeometry, undefined, petalCount]}
      >
        <meshStandardMaterial
          color="#fbcfe8"
          emissive="#f472b6"
          emissiveIntensity={0.35}
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
          roughness={0.45}
        />
      </instancedMesh>
    </group>
  );
};

export const SacredHeroCanvas: React.FC<SacredHeroCanvasProps> = ({
  drawPhase,
  skipRequested,
  onAltarClick,
  onPhaseChange,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <WebGLErrorBoundary>
      <div className="absolute inset-0 h-full w-full">
        <Canvas
          shadows={!isMobile}
          camera={{ position: [0, 0.65, 7.6], fov: isMobile ? 48 : 42 }}
          dpr={isMobile ? [1, 1.35] : [1, 1.75]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
        >
          <color attach="background" args={['#0d0307']} />

          <Environment resolution={128}>
            <group rotation={[-Math.PI / 3, 0, 0]}>
              <Lightformer
                form="ring"
                intensity={2.2}
                color="#fde7b0"
                scale={12}
                position={[0, 6, -6]}
              />
              <Lightformer
                form="rect"
                intensity={1.6}
                color="#f59e0b"
                scale={[8, 3, 1]}
                position={[-6, 2, 3]}
              />
              <Lightformer
                form="rect"
                intensity={1.3}
                color="#881337"
                scale={[8, 4, 1]}
                position={[6, -2, 3]}
              />
            </group>
          </Environment>

          <CinematicSceneDirector
            isMobile={isMobile}
            drawPhase={drawPhase}
            skipRequested={skipRequested}
            onAltarClick={onAltarClick}
            onPhaseChange={onPhaseChange}
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.06}
            rotateSpeed={0.5}
            minPolarAngle={Math.PI * 0.36}
            maxPolarAngle={Math.PI * 0.52}
            minAzimuthAngle={-Math.PI * 0.16}
            maxAzimuthAngle={Math.PI * 0.16}
          />

          {!isMobile && (
            <EffectComposer multisampling={0}>
              <Bloom
                mipmapBlur
                luminanceThreshold={0.95}
                luminanceSmoothing={0.25}
                intensity={0.75}
              />
            </EffectComposer>
          )}
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
};
