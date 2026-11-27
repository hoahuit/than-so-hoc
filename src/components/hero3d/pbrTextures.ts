import * as THREE from 'three';

/**
 * Generates procedural PBR CanvasTextures (wood grain, stone, engraved kanji gold plaque)
 * and a realistic curved Sakura petal geometry so no 3D object looks untextured or primitive.
 */

export interface PBRTextureSet {
  woodMap: THREE.CanvasTexture;
  woodRoughness: THREE.CanvasTexture;
  stoneMap: THREE.CanvasTexture;
  stoneRoughness: THREE.CanvasTexture;
  plaqueMap: THREE.CanvasTexture;
  plaqueEmissive: THREE.CanvasTexture;
  scrollMap: THREE.CanvasTexture;
  petalGeometry: THREE.BufferGeometry;
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

export function createProceduralPBRTextures(): PBRTextureSet {
  // 1. Deep Burgundy Lacquered Wood Grain (Diffuse + Roughness)
  const [woodCanvas, wCtx] = makeCanvas(512, 512);
  const [woodRoughCanvas, wrCtx] = makeCanvas(512, 512);

  wCtx.fillStyle = '#4a0e14';
  wCtx.fillRect(0, 0, 512, 512);
  wrCtx.fillStyle = '#555555';
  wrCtx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 180; i++) {
    const x = (i / 180) * 512;
    const alpha = 0.04 + (i % 7) * 0.015;
    wCtx.fillStyle = i % 2 === 0 ? `rgba(20, 4, 6, ${alpha})` : `rgba(120, 28, 36, ${alpha})`;
    wCtx.fillRect(x, 0, 2 + (i % 3), 512);

    const rVal = 65 + (i % 9) * 10;
    wrCtx.fillStyle = `rgb(${rVal},${rVal},${rVal})`;
    wrCtx.fillRect(x, 0, 2 + (i % 3), 512);
  }

  const woodMap = new THREE.CanvasTexture(woodCanvas);
  woodMap.colorSpace = THREE.SRGBColorSpace;
  woodMap.wrapS = woodMap.wrapT = THREE.RepeatWrapping;

  const woodRoughness = new THREE.CanvasTexture(woodRoughCanvas);
  woodRoughness.wrapS = woodRoughness.wrapT = THREE.RepeatWrapping;

  // 2. Obsidian Carved Stone (Diffuse + Roughness)
  const [stoneCanvas, sCtx] = makeCanvas(512, 512);
  const [stoneRoughCanvas, srCtx] = makeCanvas(512, 512);

  sCtx.fillStyle = '#141016';
  sCtx.fillRect(0, 0, 512, 512);
  srCtx.fillStyle = '#888888';
  srCtx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 1200; i++) {
    const x = (i * 73) % 512;
    const y = (i * 137) % 512;
    const size = 1 + (i % 4);
    const shade = 14 + (i % 22);
    sCtx.fillStyle = `rgb(${shade}, ${shade - 2}, ${shade + 4})`;
    sCtx.fillRect(x, y, size, size);

    const r = 110 + (i % 70);
    srCtx.fillStyle = `rgb(${r},${r},${r})`;
    srCtx.fillRect(x, y, size, size);
  }

  const stoneMap = new THREE.CanvasTexture(stoneCanvas);
  stoneMap.colorSpace = THREE.SRGBColorSpace;
  stoneMap.wrapS = stoneMap.wrapT = THREE.RepeatWrapping;

  const stoneRoughness = new THREE.CanvasTexture(stoneRoughCanvas);
  stoneRoughness.wrapS = stoneRoughness.wrapT = THREE.RepeatWrapping;

  // 3. Engraved Japanese Kanji Talisman Plaque ("御神籤")
  const [plaqueCanvas, pCtx] = makeCanvas(256, 512);
  const [plaqueEmCanvas, peCtx] = makeCanvas(256, 512);

  pCtx.fillStyle = '#f8f0dc';
  pCtx.fillRect(0, 0, 256, 512);
  pCtx.strokeStyle = '#c89d32';
  pCtx.lineWidth = 14;
  pCtx.strokeRect(16, 16, 224, 480);
  pCtx.lineWidth = 4;
  pCtx.strokeRect(30, 30, 196, 452);

  peCtx.fillStyle = '#000000';
  peCtx.fillRect(0, 0, 256, 512);
  peCtx.strokeStyle = '#d4af37';
  peCtx.lineWidth = 8;
  peCtx.strokeRect(16, 16, 224, 480);

  const kanjiChars = ['御', '神', '籤'];
  pCtx.fillStyle = '#5c1218';
  pCtx.font = 'bold 92px "Noto Serif JP", serif';
  pCtx.textAlign = 'center';
  pCtx.textBaseline = 'middle';

  peCtx.fillStyle = '#f59e0b';
  peCtx.font = 'bold 92px "Noto Serif JP", serif';
  peCtx.textAlign = 'center';
  peCtx.textBaseline = 'middle';

  kanjiChars.forEach((ch, idx) => {
    const cy = 128 + idx * 128;
    pCtx.fillText(ch, 128, cy);
    peCtx.fillText(ch, 128, cy);
  });

  const plaqueMap = new THREE.CanvasTexture(plaqueCanvas);
  plaqueMap.colorSpace = THREE.SRGBColorSpace;
  const plaqueEmissive = new THREE.CanvasTexture(plaqueEmCanvas);
  plaqueEmissive.colorSpace = THREE.SRGBColorSpace;

  // 4. Glowing Fortune Scroll Texture ("大吉 · 神の数")
  const [scrollCanvas, scCtx] = makeCanvas(256, 384);
  scCtx.fillStyle = '#fdf6e4';
  scCtx.fillRect(0, 0, 256, 384);
  scCtx.strokeStyle = '#d4af37';
  scCtx.lineWidth = 10;
  scCtx.strokeRect(12, 12, 232, 360);
  scCtx.fillStyle = '#8b1e16';
  scCtx.font = 'bold 74px "Noto Serif JP", serif';
  scCtx.textAlign = 'center';
  scCtx.textBaseline = 'middle';
  scCtx.fillText('大', 128, 132);
  scCtx.fillText('吉', 128, 250);

  const scrollMap = new THREE.CanvasTexture(scrollCanvas);
  scrollMap.colorSpace = THREE.SRGBColorSpace;

  // 5. Realistic Curved Sakura Petal Geometry (teardrop/notched petal shape)
  const petalShape = new THREE.Shape();
  petalShape.moveTo(0, 0);
  petalShape.bezierCurveTo(0.42, 0.28, 0.48, 0.95, 0.14, 1.28);
  petalShape.lineTo(0, 1.12); // classic sakura notch
  petalShape.lineTo(-0.14, 1.28);
  petalShape.bezierCurveTo(-0.48, 0.95, -0.42, 0.28, 0, 0);

  const petalGeometry = new THREE.ShapeGeometry(petalShape, 8);
  // Add gentle 3D cup curvature to the petal
  const posAttr = petalGeometry.getAttribute('position');
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = Math.sin((y / 1.28) * Math.PI) * 0.12 - Math.abs(x) * 0.15;
    posAttr.setZ(i, z);
  }
  petalGeometry.computeVertexNormals();

  return {
    woodMap,
    woodRoughness,
    stoneMap,
    stoneRoughness,
    plaqueMap,
    plaqueEmissive,
    scrollMap,
    petalGeometry,
  };
}

export function disposePBRTextures(set: PBRTextureSet): void {
  set.woodMap.dispose();
  set.woodRoughness.dispose();
  set.stoneMap.dispose();
  set.stoneRoughness.dispose();
  set.plaqueMap.dispose();
  set.plaqueEmissive.dispose();
  set.scrollMap.dispose();
  set.petalGeometry.dispose();
}
