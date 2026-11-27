import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { ShrineEnvironment3D } from './ShrineEnvironment3D';
import { Angel3D, type AngelPoseMode } from './Angel3D';
import { ShrineAltar3D, type DrawPhase3D } from './ShrineAltar3D';
import { createSakuraPetalGeometry } from './pbrTextures';

export type CeremonyPhase =
  | 'arrival'
  | 'speak1'
  | 'speak2'
  | 'speak3'
  | 'fly'
  | 'present'
  | 'complete';

type DeviceTier = 'high' | 'medium' | 'low';

function detectDeviceTier(): { tier: DeviceTier; isMobile: boolean } {
  if (typeof window === 'undefined') return { tier: 'high', isMobile: false };
  const isMobile = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8;

  if (isMobile || cores <= 4 || mem <= 4) {
    return { tier: isMobile ? 'low' : 'medium', isMobile };
  }
  if (cores >= 6 && mem >= 8) {
    return { tier: 'high', isMobile: false };
  }
  return { tier: 'medium', isMobile: false };
}

interface SacredHeroCanvasProps {
  drawPhase: DrawPhase3D;
  skipRequested: boolean;
  onAltarClick: () => void;
  onPhaseChange?: (phase: CeremonyPhase) => void;
  onSceneReady?: () => void;
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
  tier: DeviceTier;
  drawPhase: DrawPhase3D;
  skipRequested: boolean;
  onAltarClick: () => void;
  onPhaseChange?: (phase: CeremonyPhase) => void;
}

const CinematicSceneDirector: React.FC<DirectorProps> = ({
  isMobile,
  tier,
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

  const angelGroupRef = useRef<THREE.Group | null>(null);
  const angelPoseRef = useRef<AngelPoseMode>('arrival');
  const angelOpacityRef = useRef<number>(1);

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
  const orbitStateRef = useRef<{ progress: number }>({ progress: 0 });
  const ringSpeedMultRef = useRef<number>(1);
  const introDoneRef = useRef<boolean>(false);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const targetQuat = useMemo(() => new THREE.Quaternion(), []);
  const lookMatrix = useMemo(() => new THREE.Matrix4(), []);
  const upVec = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const prevPosVec = useMemo(() => new THREE.Vector3(), []);
  const nextPosVec = useMemo(() => new THREE.Vector3(), []);

  const petalCount = tier === 'low' ? 16 : tier === 'medium' ? 26 : 42;
  const sakuraSeeds = useMemo(() => createSakuraSeeds(petalCount), [petalCount]);

  const petalGeometry = useMemo(() => createSakuraPetalGeometry(), []);
  useEffect(() => {
    return () => {
      petalGeometry.dispose();
    };
  }, [petalGeometry]);

  // Allow user to skip intro immediately
  useEffect(() => {
    if (skipRequested && timelineRef.current && !introDoneRef.current) {
      timelineRef.current.progress(1);
    }
  }, [skipRequested]);

  // 8-Second Coordinated 5-Phase Cinematic Angel Intro
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const angelGroup = angelGroupRef.current;
    const altarGroup = altarGroupRef.current;
    const ringsGroup = ringsGroupRef.current;
    const scrollGroup = scrollGroupRef.current;
    const lidGroup = lidGroupRef.current;
    const innerGlow = innerGlowRef.current;
    const backdropMat = backdropMatRef.current;
    const burstLight = burstLightRef.current;
    const waterRipple = waterRippleRef.current;
    const waterRippleMat = waterRippleMatRef.current;

    if (
      !angelGroup ||
      !altarGroup ||
      !ringsGroup ||
      !scrollGroup ||
      !lidGroup ||
      !backdropMat ||
      !burstLight
    ) {
      return;
    }

    const jarCenter = isMobile
      ? { x: 0, y: -0.82, z: 0.35 }
      : { x: 0.32, y: -1.48, z: 0.35 };
    const finalCamPos = isMobile
      ? { x: 0, y: 0.28, z: 5.9 }
      : { x: -0.25, y: 0.28, z: 6.15 };
    const angelRestPos = isMobile
      ? { x: -1.05, y: -0.68, z: 0.05 }
      : { x: -1.55, y: -1.25, z: 0.05 };
    const angelScale = isMobile ? 0.72 : 0.92;

    if (prefersReducedMotion) {
      camera.position.set(finalCamPos.x, finalCamPos.y, finalCamPos.z);
      backdropMat.opacity = 1;
      lanternLightsRef.current.forEach((l) => {
        if (l) {
          l.intensity = 1.65;
          l.userData.awakened = true;
        }
      });
      angelPoseRef.current = 'present';
      angelOpacityRef.current = 1;
      angelGroup.position.set(angelRestPos.x, angelRestPos.y, angelRestPos.z);
      angelGroup.scale.set(angelScale, angelScale, angelScale);
      angelGroup.quaternion.setFromEuler(new THREE.Euler(0, 0.32, 0));
      altarGroup.visible = true;
      altarGroup.position.set(jarCenter.x, jarCenter.y, jarCenter.z);
      ringsGroup.scale.set(1, 1, 1);
      lidGroup.position.set(-0.18, 0.88, 0);
      lidGroup.rotation.set(0, 0, 0.55);
      scrollGroup.position.set(0, 1.88, 0);
      scrollGroup.scale.set(1, 1, 1);
      if (innerGlow) innerGlow.intensity = 2.0;
      burstLight.intensity = 2.6;
      introDoneRef.current = true;
      onPhaseChange?.('complete');
      return;
    }

    // Initial Frame Setup: Omikuji Jar is the Centerpiece from start; Angel glides in smoothly
    introDoneRef.current = false;
    angelPoseRef.current = 'fly';
    angelOpacityRef.current = 1;
    orbitStateRef.current.progress = 0;

    camera.position.set(finalCamPos.x, finalCamPos.y + 0.12, finalCamPos.z + 0.45);
    backdropMat.opacity = 0.35;

    lanternLightsRef.current.forEach((l) => {
      if (l) {
        l.intensity = 0;
        l.userData.awakened = false;
      }
    });

    angelGroup.position.set(jarCenter.x + 2.2, 1.35, -1.4);
    angelGroup.scale.set(angelScale, angelScale, angelScale);
    angelGroup.quaternion.setFromEuler(new THREE.Euler(0, -0.3, 0));

    altarGroup.visible = true;
    altarGroup.position.set(jarCenter.x, jarCenter.y, jarCenter.z);
    ringsGroup.scale.set(0.75, 0.75, 0.75);
    ringMatsRef.current.forEach((m) => {
      if (m) m.opacity = 0.65;
    });
    symbolMatsRef.current.forEach((m) => {
      if (m) m.opacity = 0.65;
    });

    lidGroup.position.set(0, 0.6, 0);
    lidGroup.rotation.set(0, 0, 0);
    if (innerGlow) innerGlow.intensity = 0.8;
    scrollGroup.position.set(0, 0.72, 0);
    scrollGroup.scale.set(0.01, 0.01, 0.01);
    burstLight.intensity = 1.6;
    ringSpeedMultRef.current = 1;

    const tl = gsap.timeline({
      onComplete: () => {
        introDoneRef.current = true;
        angelPoseRef.current = 'present';
        onPhaseChange?.('complete');
      },
    });
    timelineRef.current = tl;

    // ===== PHASE 1: SMOOTH ARRIVAL & JAR GLOW (0.0 – 1.8s) =====
    tl.call(() => onPhaseChange?.('arrival'), [], 0)
      .to(backdropMat, { opacity: 1, duration: 1.4, ease: 'power2.out' }, 0)
      .to(
        angelGroup.position,
        {
          x: jarCenter.x + (isMobile ? 1.15 : 1.75),
          y: jarCenter.y + 0.65,
          z: jarCenter.z + 0.35,
          duration: 1.7,
          ease: 'sine.inOut',
        },
        0
      )
      .to(
        ringsGroup.scale,
        { x: 1, y: 1, z: 1, duration: 1.4, ease: 'power2.out' },
        0.2
      )
      .to(ringMatsRef.current.filter(Boolean), { opacity: 1, duration: 1.0 }, 0.2)
      .to(symbolMatsRef.current.filter(Boolean), { opacity: 1, duration: 1.0 }, 0.3);

    lanternLightsRef.current.forEach((light, idx) => {
      if (light) {
        tl.to(
          light,
          {
            intensity: 1.65,
            duration: 0.45,
            onStart: () => {
              light.userData.awakened = true;
            },
          },
          0.2 + idx * 0.15
        );
      }
    });

    // ===== PHASE 2-3: SLOW, SILKY-SMOOTH WING-FLAPPING FLIGHT AROUND THE JAR (1.8 – 6.2s) =====
    tl.call(
      () => {
        angelPoseRef.current = 'fly';
        onPhaseChange?.('speak1');
      },
      [],
      1.8
    )
      .call(() => onPhaseChange?.('speak2'), [], 3.0)
      .call(() => onPhaseChange?.('fly'), [], 4.2)
      .to(
        orbitStateRef.current,
        {
          progress: 1,
          duration: 4.4,
          ease: 'sine.inOut',
          onUpdate: () => {
            const p = orbitStateRef.current.progress;
            const rx = isMobile ? 1.25 : 1.85;
            const rz = isMobile ? 1.2 : 1.75;
            const angle = p * Math.PI * 2.15;

            const x = jarCenter.x + Math.cos(angle) * rx;
            const z = jarCenter.z - Math.sin(angle) * rz;
            const y = jarCenter.y + 0.52 + Math.sin(p * Math.PI * 2) * 0.16;

            prevPosVec.copy(angelGroup.position);
            nextPosVec.set(x, y, z);
            angelGroup.position.copy(nextPosVec);

            if (nextPosVec.distanceToSquared(prevPosVec) > 0.00001) {
              lookMatrix.lookAt(nextPosVec, prevPosVec, upVec);
              targetQuat.setFromRotationMatrix(lookMatrix);
              angelGroup.quaternion.slerp(targetQuat, 0.08);
            }
          },
        },
        1.8
      )
      .to(ringSpeedMultRef, { current: 1.8, duration: 1.2, ease: 'sine.inOut' }, 2.2);

    // ===== PHASE 4: GENTLE DESCENT BESIDE THE JAR & JAR ACTIVATION (6.2 – 7.8s) =====
    tl.call(
      () => {
        onPhaseChange?.('present');
        angelPoseRef.current = 'present';
      },
      [],
      6.2
    )
      .to(
        angelGroup.position,
        {
          x: angelRestPos.x,
          y: angelRestPos.y,
          z: angelRestPos.z,
          duration: 1.3,
          ease: 'sine.inOut',
          onUpdate: () => {
            targetQuat.setFromEuler(new THREE.Euler(0, 0.34, 0));
            angelGroup.quaternion.slerp(targetQuat, 0.08);
          },
        },
        6.2
      )
      .to(innerGlow || {}, { intensity: 4.0, duration: 0.7, ease: 'power2.inOut' }, 6.3)
      .to(
        lidGroup.position,
        { y: 0.88, x: -0.18, duration: 0.85, ease: 'power2.out' },
        6.4
      )
      .to(lidGroup.rotation, { z: 0.55, duration: 0.85, ease: 'power2.out' }, 6.4)
      .to(scrollGroup.position, { y: 1.88, duration: 0.95, ease: 'power3.out' }, 6.5)
      .to(scrollGroup.scale, { x: 1, y: 1, z: 1, duration: 0.85, ease: 'back.out(1.4)' }, 6.5);

    // ===== PHASE 5: SMOOTH SETTLE INTO IDLE (7.8 – 8.5s) =====
    tl.call(
      () => {
        if (waterRipple && waterRippleMat) {
          waterRipple.visible = true;
          waterRipple.scale.set(0.4, 0.4, 0.4);
          waterRippleMat.opacity = 0.8;
        }
      },
      [],
      7.5
    )
      .to(
        burstLight,
        { intensity: 6.5, duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut' },
        7.5
      )
      .to(
        waterRipple ? waterRipple.scale : {},
        { x: 3.6, y: 3.6, z: 3.6, duration: 0.9, ease: 'power2.out' },
        7.5
      )
      .to(waterRippleMat || {}, { opacity: 0, duration: 0.85, ease: 'power2.out' }, 7.55)
      .to(
        camera.position,
        { x: finalCamPos.x, y: finalCamPos.y, z: finalCamPos.z, duration: 0.9, ease: 'sine.inOut' },
        7.5
      )
      .to(ringSpeedMultRef, { current: 1.0, duration: 0.9, ease: 'power2.out' }, 7.5)
      .to(innerGlow || {}, { intensity: 2.0, duration: 0.6, ease: 'power2.out' }, 7.8)
      .to(burstLight, { intensity: 2.6, duration: 0.6, ease: 'power2.out' }, 7.8);

    return () => {
      tl.kill();
    };
  }, [camera, isMobile, lookMatrix, nextPosVec, onPhaseChange, prevPosVec, targetQuat, upVec]);

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
      <ambientLight intensity={0.42} color="#fff1dc" />
      <directionalLight
        position={[4, 7, 5]}
        intensity={1.55}
        color="#fde68a"
        castShadow={!isMobile}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 4, -8]} intensity={1.15} color="#fbcfe8" />
      <pointLight
        ref={burstLightRef}
        position={[0.45, -0.45, 0.45]}
        color="#fde68a"
        intensity={2.6}
        distance={10}
      />

      <ShrineEnvironment3D
        highQuality={tier === 'high'}
        lanternLightsRef={lanternLightsRef}
        backdropMatRef={backdropMatRef}
        waterRippleRef={waterRippleRef}
        waterRippleMatRef={waterRippleMatRef}
      />

      {/* Articulated 3D Celestial Angel */}
      <Angel3D
        angelGroupRef={angelGroupRef}
        poseModeRef={angelPoseRef}
        opacityRef={angelOpacityRef}
      />

      {/* Center Omikuji Jar & Altar */}
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
        args={[petalGeometry, undefined, petalCount]}
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
  onSceneReady,
}) => {
  const [{ tier, isMobile }, setDeviceInfo] = useState<{ tier: DeviceTier; isMobile: boolean }>(
    () => detectDeviceTier()
  );
  const [isPageHidden, setIsPageHidden] = useState<boolean>(false);

  useEffect(() => {
    const onResize = () => setDeviceInfo(detectDeviceTier());
    const onVisibilityChange = () => {
      const hidden = document.hidden;
      setIsPageHidden(hidden);
      if (hidden) {
        gsap.globalTimeline.pause();
      } else {
        gsap.globalTimeline.resume();
      }
    };
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const dprRange: [number, number] =
    tier === 'low' ? [1, 1.15] : tier === 'medium' ? [1, 1.25] : [1, 1.5];

  return (
    <WebGLErrorBoundary>
      <div className="absolute inset-0 h-full w-full">
        <Canvas
          frameloop={isPageHidden ? 'never' : 'always'}
          shadows={tier === 'high'}
          camera={{ position: [0, 0.35, 4.3], fov: isMobile ? 48 : 42 }}
          dpr={dprRange}
          gl={{
            antialias: tier !== 'low',
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
          onCreated={() => {
            onSceneReady?.();
          }}
        >
          <color attach="background" args={['#0d0307']} />

          <Environment resolution={64}>
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
            tier={tier}
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

          {tier === 'high' && (
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
