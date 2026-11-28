import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Download, Sparkles, Upload, Check } from 'lucide-react';
import type { OmikujiFortune } from '../data/omikujiData';
import { shrineAudio } from '../utils/sound';

interface OmamoriGiftModalProps {
  isOpen: boolean;
  fortune: OmikujiFortune;
  onClose: () => void;
}

interface CharmTheme {
  id: string;
  name: string;
  kanji: string;
  subtitle: string;
  bgTop: string;
  bgBottom: string;
  accent: string;
  blessing: string;
  /** Optional artwork path from daughter's illustrations under public/images/charms/<id>.png */
  customArtPath: string;
}

const CHARM_THEMES: CharmTheme[] = [
  {
    id: 'binh-an',
    name: 'Bùa Bình An',
    kanji: '安',
    subtitle: 'Thả lỏng tâm trí · An ổn nội tại',
    bgTop: '#26080d',
    bgBottom: '#5e161d',
    accent: '#fde7b0',
    blessing: 'Giữ tâm tĩnh giữa ồn ào, nhẹ gánh từng ngày.',
    customArtPath: '/images/charms/binh-an.png',
  },
  {
    id: 'khai-thong',
    name: 'Bùa Khai Thông',
    kanji: '開',
    subtitle: 'Gỡ nút thắt · Công việc hanh thông',
    bgTop: '#0d1b2a',
    bgBottom: '#1b3a4b',
    accent: '#f6d365',
    blessing: 'Đủ sáng suốt để chọn đúng nhịp, mở đúng cửa.',
    customArtPath: '/images/charms/khai-thong.png',
  },
  {
    id: 'duyen-lanh',
    name: 'Bùa Duyên Lành',
    kanji: '縁',
    subtitle: 'Kết nối chân thành · Chữa lành',
    bgTop: '#3a0d22',
    bgBottom: '#7a2243',
    accent: '#ffd6e0',
    blessing: 'Gặp người hiểu lòng, giữ được điều thật tâm.',
    customArtPath: '/images/charms/duyen-lanh.png',
  },
  {
    id: 'kim-van',
    name: 'Bùa Kim Vận',
    kanji: '福',
    subtitle: 'Tụ lộc bền vững · Quý nhân trợ lực',
    bgTop: '#1f1606',
    bgBottom: '#4a320b',
    accent: '#f9df8e',
    blessing: 'Chậm mà chắc, công sức âm thầm sớm nở hoa.',
    customArtPath: '/images/charms/kim-van.png',
  },
];

export const OmamoriGiftModal: React.FC<OmamoriGiftModalProps> = ({
  isOpen,
  fortune,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('binh-an');
  const [recipientName, setRecipientName] = useState<string>('');
  const [uploadedArtUrl, setUploadedArtUrl] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const selectedTheme = CHARM_THEMES.find((t) => t.id === selectedThemeId) ?? CHARM_THEMES[0];

  const drawCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 720;
    const H = 1280;
    canvas.width = W;
    canvas.height = H;

    // 1. Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, selectedTheme.bgTop);
    grad.addColorStop(0.55, selectedTheme.bgBottom);
    grad.addColorStop(1, '#120306');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Subtle glowing aura
    const aura = ctx.createRadialGradient(W / 2, H * 0.42, 30, W / 2, H * 0.42, 360);
    aura.addColorStop(0, 'rgba(253, 231, 176, 0.22)');
    aura.addColorStop(1, 'rgba(253, 231, 176, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, W, H);

    // 2. Decorative Gold Double Frame
    ctx.strokeStyle = 'rgba(223, 184, 75, 0.55)';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, W - 72, H - 72);
    ctx.strokeStyle = 'rgba(253, 231, 176, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(52, 52, W - 104, H - 104);

    // 3. Top Header Text
    ctx.textAlign = 'center';
    ctx.fillStyle = selectedTheme.accent;
    ctx.font = 'bold 24px "Be Vietnam Pro", sans-serif';
    ctx.fillText('神の数 · BÙA MAY MẮN CÁ NHÂN', W / 2, 122);

    ctx.fillStyle = 'rgba(255, 248, 231, 0.72)';
    ctx.font = '600 20px "Be Vietnam Pro", sans-serif';
    ctx.fillText(selectedTheme.name.toUpperCase(), W / 2, 162);

    // 4. Center Omamori Pouch / Artwork Slot
    const tryLoadImage = (src: string) =>
      new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    const artImg =
      (uploadedArtUrl ? await tryLoadImage(uploadedArtUrl) : null) ??
      (await tryLoadImage(selectedTheme.customArtPath));

    const centerY = 510;
    if (artImg) {
      // Render daughter's artwork inside sacred rounded medallion
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(140, 230, W - 280, 560, 42);
      ctx.clip();
      const scale = Math.max((W - 280) / artImg.width, 560 / artImg.height);
      const dw = artImg.width * scale;
      const dh = artImg.height * scale;
      ctx.drawImage(artImg, W / 2 - dw / 2, centerY - dh / 2, dw, dh);
      ctx.restore();

      ctx.strokeStyle = selectedTheme.accent;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(140, 230, W - 280, 560, 42);
      ctx.stroke();
    } else {
      // Built-in artistic Omamori pouch & Japanese crest illustration
      // Hanging cord knot
      ctx.strokeStyle = '#f3d179';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(W / 2, 238, 32, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W / 2, 270);
      ctx.lineTo(W / 2, 305);
      ctx.stroke();

      // Omamori Pouch Polygon
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(220, 305);
      ctx.lineTo(500, 305);
      ctx.lineTo(545, 405);
      ctx.lineTo(545, 745);
      ctx.quadraticCurveTo(545, 780, 510, 780);
      ctx.lineTo(210, 780);
      ctx.quadraticCurveTo(175, 780, 175, 745);
      ctx.lineTo(175, 405);
      ctx.closePath();

      const pouchGrad = ctx.createLinearGradient(175, 305, 545, 780);
      pouchGrad.addColorStop(0, '#a33a24');
      pouchGrad.addColorStop(0.5, '#7a1c12');
      pouchGrad.addColorStop(1, '#4a0b07');
      ctx.fillStyle = pouchGrad;
      ctx.fill();

      ctx.strokeStyle = '#e7c567';
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.restore();

      // Inner Gold Crest Circle
      ctx.beginPath();
      ctx.arc(W / 2, 545, 118, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 248, 231, 0.08)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(253, 231, 176, 0.75)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Large Kanji Seal
      ctx.fillStyle = selectedTheme.accent;
      ctx.font = 'bold 132px "Noto Serif JP", serif';
      ctx.fillText(selectedTheme.kanji, W / 2, 592);

      // Decorative Sakura Dots
      const petals = [
        [240, 380],
        [480, 380],
        [235, 705],
        [485, 705],
      ];
      ctx.fillStyle = 'rgba(253, 231, 176, 0.75)';
      petals.forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 5. Personalized Recipient Name
    const cleanName = recipientName.trim();
    ctx.fillStyle = '#fff8e7';
    ctx.font = 'bold 34px "Lora", serif';
    ctx.fillText(cleanName ? `Dành tặng: ${cleanName}` : 'Dành tặng riêng cho bạn', W / 2, 868);

    // 6. Blessing & Fortune Anchor
    ctx.fillStyle = selectedTheme.accent;
    ctx.font = '600 22px "Be Vietnam Pro", sans-serif';
    ctx.fillText(
      `Quẻ #${fortune.stickNumber} · Con số hộ thân: ${fortune.numerology.luckyNumber}`,
      W / 2,
      922
    );

    // Wrap blessing text
    ctx.fillStyle = 'rgba(255, 248, 231, 0.9)';
    ctx.font = 'italic 25px "Lora", serif';
    const words = selectedTheme.blessing.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    words.forEach((word) => {
      const test = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(test).width > 540) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = test;
      }
    });
    if (currentLine) lines.push(currentLine);
    lines.forEach((line, i) => {
      ctx.fillText(line, W / 2, 986 + i * 38);
    });

    // 7. Bottom Footer Stamp
    ctx.fillStyle = 'rgba(253, 231, 176, 0.58)';
    ctx.font = '600 18px "Be Vietnam Pro", sans-serif';
    ctx.fillText('Lưu làm hình nền điện thoại để giữ năng lượng bình an hôm nay', W / 2, 1185);
  }, [selectedTheme, recipientName, uploadedArtUrl, fortune]);

  useEffect(() => {
    if (isOpen) {
      drawCanvas();
    }
  }, [isOpen, drawCanvas]);

  if (!isOpen) return null;

  const handleUploadPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedArtUrl(url);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    shrineAudio.playShrineBell();
    const link = document.createElement('a');
    link.download = `bua-may-man-${selectedTheme.id}-que-${fortune.stickNumber}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setDownloaded(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c060a]/75 p-4 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="washi-card relative my-4 w-full max-w-3xl overflow-hidden rounded-3xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center rounded-full border border-rose-200 bg-white text-ink-muted hover:border-crimson-400 hover:text-crimson-600 transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 pr-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8b2a18]">
            <Sparkles className="h-3 w-3" />
            <span>Quà tặng Chặng 2 · Miễn phí</span>
          </span>
          <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-[#3d1a15]">
            Tấm Bùa &amp; Hình Nền Cá Nhân Dành Riêng Cho Bạn
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Chọn mẫu bùa hợp tâm trạng, ghi tên bạn (tùy chọn) rồi bấm tải về làm hình nền điện thoại.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[240px_1fr] items-start">
          {/* Live Phone Wallpaper Preview */}
          <div className="mx-auto w-[210px] sm:w-[230px] overflow-hidden rounded-[26px] border-4 border-[#3d0e08] bg-[#140407] shadow-xl">
            <canvas ref={canvasRef} className="block h-auto w-full" />
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#3d1a15] mb-2">
                1. Chọn mẫu bùa năng lượng:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CHARM_THEMES.map((theme) => {
                  const active = theme.id === selectedThemeId;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        setSelectedThemeId(theme.id);
                        setDownloaded(false);
                      }}
                      className={`rounded-xl border p-2.5 text-left transition ${
                        active
                          ? 'border-[#8b2a18] bg-[#faeee9] ring-1 ring-[#8b2a18]'
                          : 'border-[#e8d6c3] bg-white hover:bg-[#fcf8f2]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#3d1a15]">{theme.name}</span>
                        <span className="font-jp text-sm font-black text-[#8b2a18]">{theme.kanji}</span>
                      </div>
                      <p className="mt-0.5 text-[10px] text-ink-muted line-clamp-1">{theme.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3d1a15] mb-1.5">
                2. Tên / Biệt danh in lên bùa (tùy chọn):
              </label>
              <input
                type="text"
                maxLength={28}
                value={recipientName}
                onChange={(e) => {
                  setRecipientName(e.target.value);
                  setDownloaded(false);
                }}
                placeholder="VD: Minh Anh, Mèo Con..."
                className="w-full rounded-xl border border-[#e6d3be] bg-white px-3.5 py-2.5 text-sm text-[#3d1a15] focus:border-[#8b2a18] focus:outline-none"
              />
            </div>

            {/* Optional Custom Artwork Preview Slot (for testing daughter's drawings before placing in public/images/charms/) */}
            <div className="rounded-xl border border-dashed border-[#d9bfa9] bg-[#faf4ea] p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-[#6b3a24]">
                  Chủ sở hữu: Có thể thử gắn tranh vẽ tay ngay tại đây (hoặc chép vào{' '}
                  <code className="text-[#8b2a18]">public/images/charms/</code>)
                </span>
                <label className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full border border-[#8b2a18]/40 bg-white px-3 py-1 text-[11px] font-bold text-[#8b2a18] hover:bg-[#faeee9]">
                  <Upload className="h-3 w-3" />
                  <span>Chọn ảnh</span>
                  <input type="file" accept="image/*" onChange={handleUploadPreview} className="hidden" />
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#a33a24] via-[#8b2a18] to-[#6e1e12] py-3.5 text-sm font-bold text-amber-50 shadow-temple-red transition hover:brightness-110 active:scale-[0.99]"
            >
              {downloaded ? (
                <>
                  <Check className="h-4 w-4 text-emerald-300" />
                  <span>Đã tải tấm bùa về máy!</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 text-amber-200" />
                  <span>Lưu Hình Nền Bùa Về Máy (PNG)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
