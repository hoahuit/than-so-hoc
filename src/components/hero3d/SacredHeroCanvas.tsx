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

interface SacredHeroCanvasProps {
  drawPhase: DrawPhase3D;
  onAltarClick: () => void;
  onIntroComplete?: () => void;
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
      speedY: 0.24 + (i % 4) * 0.08,
      speedZ: 0.14 + (i % 3) * 0.05,
      scale: 0.045 + (i % 3) * 0.02,
    });
  }
  return seeds;
}

interface DirectorProps {
  isMobile: boolean;
  drawPhase: DrawPhase3D;
  onAltarClick: () => void;
  onIntroComplete?: () => void;
}

const CinematicSceneDirector: React.FC<DirectorProps> = ({
  isMobile,
  drawPhase,
  onAltarClick,
  onIntroComplete,
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

  const altarGroupRef = useRef<THREE.Group | null>(null);
  const ringsGroupRef = useRef<THREE.Group | null>(null);
  const ring1Ref = useRef<THREE.Group | null>(null);
  const ring2Ref = useRef<THREE.Group | null>(null);
  const ring3Ref = useRef<THREE.Group | null>(null);
  const ringMatsRef = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const symbolMatsRef = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const boxGroupRef = useRef<THREE.Group | null>(null);
  const scrollGroupRef = useRef<THREE.Group | null>(null);
  const stickRef = useRef<THREE.Mesh | null>(null);

  const burstLightRef = useRef<THREE.PointLight | null>(null);
  const sakuraMeshRef = useRef<THREE.InstancedMesh | null>(null);

  const ringSpeedMultRef = useRef<number>(1);
  const introDoneRef = useRef<boolean>(false);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const petalCount = isMobile ? 20 : 44;
  const sakuraSeeds = useMemo(() => createSakuraSeeds(petalCount), [petalCount]);

  // Curved Sakura Petal Geometry
  const petalAssets = useMemo(() => createProceduralPBRTextures(), []);
  useEffect(() => {
    return () => {
      disposePBRTextures(petalAssets);
    };
  }, [petalAssets]);

  // Coordinated 3-Second GSAP Cinematic Opening Timeline
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const maidenGroup = maidenGroupRef.current;
    const altarGroup = altarGroupRef.current;
    const ringsGroup = ringsGroupRef.current;
    const scrollGroup = scrollGroupRef.current;
    const backdropMat = backdropMatRef.current;
    const burstLight = burstLightRef.current;
    const waterRipple = waterRippleRef.current;
    const waterRippleMat = waterRippleMatRef.current;

    if (
      !maidenGroup ||
      !altarGroup ||
      !ringsGroup ||
      !scrollGroup ||
      !backdropMat ||
      !burstLight
    ) {
      return;
    }

    const finalCamPos = isMobile
      ? { x: 0, y: 0.25, z: 6.6 }
      : { x: -0.42, y: 0.28, z: 5.75 };

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
      maidenGroup.scale.set(isMobile ? 0.78 : 1, isMobile ? 0.78 : 1, isMobile ? 0.78 : 1);
      maidenGroup.position.set(isMobile ? -0.85 : -1.45, isMobile ? -0.15 : -0.35, isMobile ? -1.0 : -0.8);
      altarGroup.position.set(isMobile ? 0.42 : 0.82, isMobile ? -1.15 : -1.58, isMobile ? 0.55 : 0.45);
      ringsGroup.scale.set(1, 1, 1);
      scrollGroup.scale.set(1, 1, 1);
      burstLight.intensity = 2.6;
      introDoneRef.current = true;
      onIntroComplete?.();
      return;
    }

    // Initial Dark Frame Setup
    introDoneRef.current = false;
    camera.position.set(0, 0.85, 8.2);
    backdropMat.opacity = 0;

    lanternLightsRef.current.forEach((l) => {
      if (l) {
        l.intensity = 0;
        l.userData.awakened = false;
      }
    });

    maidenOpacityRef.current = 0;
    maidenGroup.position.set(isMobile ? -0.85 : -1.45, isMobile ? -0.55 : -0.75, isMobile ? -1.0 : -0.8);
    maidenGroup.scale.set(isMobile ? 0.7 : 0.9, isMobile ? 0.7 : 0.9, isMobile ? 0.7 : 0.9);

    altarGroup.position.set(isMobile ? 0.42 : 0.82, -2.85, isMobile ? 0.55 : 0.45);
    ringsGroup.scale.set(0.25, 0.25, 0.25);
    ringMatsRef.current.forEach((m) => {
      if (m) m.opacity = 0;
    });
    symbolMatsRef.current.forEach((m) => {
      if (m) m.opacity = 0;
    });
    scrollGroup.scale.set(0.01, 0.01, 0.01);
    burstLight.intensity = 0.4;
    ringSpeedMultRef.current = 1;

    const tl = gsap.timeline({
      onComplete: () => {
        introDoneRef.current = true;
        onIntroComplete?.();
      },
    });

    // 0.0 – 0.5s: Reveal AAA Shrine Backdrop & Moon, Camera pushes forward, Lanterns ignite sequentially
    tl.to(
      backdropMat,
      {
        opacity: 1,
        duration: 0.55,
        ease: 'power2.out',
      },
      0
    ).to(
      camera.position,
      {
        x: 0,
        y: 0.48,
        z: 4.8,
        duration: 0.55,
        ease: 'power2.out',
      },
      0
    );

    lanternLightsRef.current.forEach((light, idx) => {
      const staggerAt = 0.08 + idx * 0.065;
      if (light) {
        tl.to(
          light,
          {
            intensity: 1.65,
            duration: 0.28,
            onStart: () => {
              light.userData.awakened = true;
            },
          },
          staggerAt
        );
      }
    });

    // 0.5 – 1.3s: Reveal AAA Shrine Maiden smoothly
    tl.to(
      maidenOpacityRef,
      {
        current: 1,
        duration: 0.75,
        ease: 'power2.out',
      },
      0.5
    )
      .to(
        maidenGroup.position,
        {
          y: isMobile ? -0.15 : -0.35,
          duration: 0.75,
          ease: 'power3.out',
        },
        0.5
      )
      .to(
        maidenGroup.scale,
        {
          x: isMobile ? 0.78 : 1,
          y: isMobile ? 0.78 : 1,
          z: isMobile ? 0.78 : 1,
          duration: 0.75,
          ease: 'power3.out',
        },
        0.5
      );

    // 1.3 – 2.2s: Omikuji Altar rises, 3 orbital rings & scroll activate
    tl.to(
      altarGroup.position,
      {
        y: isMobile ? -1.15 : -1.58,
        duration: 0.85,
        ease: 'back.out(1.2)',
      },
      1.3
    )
      .to(
        ringsGroup.scale,
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.8,
          ease: 'back.out(1.3)',
        },
        1.35
      )
      .to(
        ringMatsRef.current.filter(Boolean),
        {
          opacity: 1,
          duration: 0.6,
        },
        1.35
      )
      .to(
        symbolMatsRef.current.filter(Boolean),
        {
          opacity: 1,
          duration: 0.6,
        },
        1.45
      )
      .to(
        scrollGroup.scale,
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.65,
          ease: 'back.out(1.5)',
        },
        1.55
      )
      .to(
        ringSpeedMultRef,
        {
          current: 2.5,
          duration: 0.45,
          ease: 'power2.inOut',
        },
        1.35
      );

    // 2.2 – 3.0s: Controlled magical energy burst, water ripple, camera pulls back to full composition
    if (waterRipple && waterRippleMat) {
      tl.call(
        () => {
          waterRipple.visible = true;
          waterRipple.scale.set(0.4, 0.4, 0.4);
          waterRippleMat.opacity = 0.85;
        },
        [],
        2.2
      )
        .to(
          waterRipple.scale,
          {
            x: 3.6,
            y: 3.6,
            z: 3.6,
            duration: 0.8,
            ease: 'power3.out',
          },
          2.2
        )
        .to(
          waterRippleMat,
          {
            opacity: 0,
            duration: 0.78,
            ease: 'power2.out',
          },
          2.22
        );
    }

    tl.to(
      burstLight,
      {
        intensity: 7.5,
        duration: 0.25,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      },
      2.2
    )
      .to(
        camera.position,
        {
          x: finalCamPos.x,
          y: finalCamPos.y,
          z: finalCamPos.z,
          duration: 0.8,
          ease: 'power3.out',
        },
        2.2
      )
      .to(
        ringSpeedMultRef,
        {
          current: 1.0,
          duration: 0.75,
          ease: 'power2.out',
        },
        2.25
      )
      .to(
        burstLight,
        {
          intensity: 2.6,
          duration: 0.35,
          ease: 'power2.out',
        },
        2.65
      );

    return () => {
      tl.kill();
    };
  }, [camera, isMobile, onIntroComplete]);

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
          y: 1.12,
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

  // Continuous Idle: Curved Sakura petals at multiple depths + subtle scene parallax
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
      <ambientLight intensity={0.35} color="#fff1dc" />
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
        position={[0.78, -0.45, 0.35]}
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
        scrollGroupRef={scrollGroupRef}
        stickRef={stickRef}
        ringSpeedMultRef={ringSpeedMultRef}
        drawPhase={drawPhase}
        onAltarClick={onAltarClick}
      />

      {/* Multi-depth Curved 3D Sakura Petals */}
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
  onAltarClick,
  onIntroComplete,
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
          camera={{ position: [0, 0.85, 8.2], fov: isMobile ? 48 : 42 }}
          dpr={isMobile ? [1, 1.35] : [1, 1.75]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
        >
          <color attach="background" args={['#0d0307']} />

          {/* Procedural HDR Environment Lighting */}
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
            onAltarClick={onAltarClick}
            onIntroComplete={onIntroComplete}
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
