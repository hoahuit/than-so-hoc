import { useState, useEffect, useCallback } from 'react';
import { Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { PetalsCanvas } from './components/PetalsCanvas';
import { Header } from './components/Header';
import { MarqueeBanner } from './components/MarqueeBanner';
import { PlansCarousel } from './components/PlansCarousel';
import { OmikujiBoxInteractive } from './components/OmikujiBoxInteractive';
import { OmikujiShakeModal } from './components/OmikujiShakeModal';
import { TarotOmikujiDeck } from './components/TarotOmikujiDeck';
import { FortuneCardDisplay } from './components/FortuneCardDisplay';
import { DailyFortune } from './components/DailyFortune';
import { NumerologyCalculatorModal } from './components/NumerologyCalculatorModal';
import { SavedFortunesDrawer, type SavedFortuneEntry } from './components/SavedFortunesDrawer';
import { FloatingBottomNav } from './components/FloatingBottomNav';
import { OMIKUJI_DATABASE, type OmikujiFortune, type PlanType } from './data/omikujiData';
import { shrineAudio } from './utils/sound';

const STORAGE_KEY = 'kami_no_su_saved_fortunes_v1';

export function App() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('love');
  const [currentFortune, setCurrentFortune] = useState<OmikujiFortune>(OMIKUJI_DATABASE[0]);
  const [flipVersion, setFlipVersion] = useState<number>(0);

  const [isShakeModalOpen, setIsShakeModalOpen] = useState<boolean>(false);
  const [isNumerologyOpen, setIsNumerologyOpen] = useState<boolean>(false);
  const [isSavedOpen, setIsSavedOpen] = useState<boolean>(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'home' | 'plans' | 'numerology' | 'saved'>('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [savedFortunes, setSavedFortunes] = useState<SavedFortuneEntry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedFortunes));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedFortunes]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleOpenShakeModal = useCallback(() => {
    setIsShakeModalOpen(true);
  }, []);

  const handleFortuneDrawnFromModal = useCallback((fortune: OmikujiFortune) => {
    setCurrentFortune(fortune);
    setFlipVersion((prev) => prev + 1);
  }, []);

  const handleFortunePickedFromTarot = useCallback((fortune: OmikujiFortune) => {
    setCurrentFortune(fortune);
    setFlipVersion((prev) => prev + 1);
    setTimeout(() => {
      const el = document.getElementById('fortune-result-section');
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 280);
  }, []);

  const isFortuneSaved = useCallback(
    (fortune: OmikujiFortune) => savedFortunes.some((entry) => entry.fortune.id === fortune.id),
    [savedFortunes]
  );

  const isCurrentSaved = isFortuneSaved(currentFortune);

  const handleSaveFortune = (fortune: OmikujiFortune) => {
    if (isFortuneSaved(fortune)) {
      showToast('Lá quẻ này đã có trong bộ sưu tập của bạn!');
      return;
    }

    shrineAudio.playShrineBell();
    const newEntry: SavedFortuneEntry = {
      uid: `${fortune.id}-${Date.now()}`,
      savedAt: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
      }),
      fortune,
    };
    setSavedFortunes((prev) => [newEntry, ...prev]);
    showToast(`Đã lưu quẻ ${fortune.rank} (#${fortune.stickNumber}) vào bộ sưu tập!`);
  };

  const handleRemoveSaved = (uid: string) => {
    setSavedFortunes((prev) => prev.filter((item) => item.uid !== uid));
    showToast('Đã xóa lá quẻ khỏi bộ sưu tập.');
  };

  const handleShareFortune = async (fortune: OmikujiFortune) => {
    const shareText = `🌸 Kami no Sū (神の数) - Quẻ Omikuji & Tarot của tôi:\n✦ Cấp độ: ${fortune.rank} (${fortune.kanjiRank}) - Thẻ #${fortune.stickNumber}\n✦ "${fortune.title}"\n📜 ${fortune.poem.join(' / ')}\n❤️ Tình duyên: ${fortune.scores.love}% | 💼 Sự nghiệp: ${fortune.scores.career}% | 💰 Tài lộc: ${fortune.scores.wealth}%\nRút quẻ may mắn hôm nay tại Kami no Sū!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Kami no Sū – Quẻ ${fortune.rank} (${fortune.kanjiRank})`,
          text: shareText,
          url: window.location.href,
        });
        showToast('Đã chia sẻ kết quả quẻ thành công!');
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      showToast('Đã sao chép kết quả quẻ & liên kết vào bộ nhớ tạm!');
    } catch {
      showToast('Không thể sao chép tự động, bạn có thể chụp màn hình lá quẻ nhé!');
    }
  };

  return (
    <div className="relative min-h-screen seigaiha-bg text-ink selection:bg-crimson-500 selection:text-white">
      {/* Gentle Floating Sakura Petals */}
      <PetalsCanvas />

      {/* Sticky Top Header */}
      <Header
        onOpenNumerology={() => setIsNumerologyOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        onScrollToOmikuji={handleOpenShakeModal}
        onOpenTarotDraw={() => scrollToElement('tarot-omikuji-section')}
        savedCount={savedFortunes.length}
      />

      {/* ================= HERO BANNER (ANIME SHRINE MAIDEN & TORII) ================= */}
      <section className="relative overflow-hidden bg-[#38131d]">
        {/* Custom Anime Key Visual Background */}
        <img
          src="/images/hero-shrine.jpg"
          alt="Thiếu nữ đền thần Kami no Sū bên cổng Torii dưới trăng rằm và hoa anh đào"
          className="absolute inset-0 h-full w-full object-cover object-right md:object-[center_20%]"
        />

        {/* Soft Rose-Burgundy Scrim on Left & Subtle Top Vignette for Floating Transparent Header */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#38131d]/95 via-[#491926]/70 to-transparent md:via-[#491926]/55" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#2b0d16]/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#38131d]/50 to-transparent" />

        {/* Hero Foreground Content */}
        <div className="relative z-20 w-full px-5 pt-28 pb-14 sm:px-8 sm:pt-32 md:pt-36 md:pb-20 lg:px-12 lg:pt-40 lg:pb-24 xl:px-16">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-200/35 bg-white/10 px-3.5 py-1 backdrop-blur-sm">
              <span className="font-jp text-xs font-semibold tracking-[0.28em] text-amber-100">
                おみくじ × 数秘術 · タロット
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold tracking-tight text-amber-50 sm:text-5xl md:text-[54px] leading-[1.12] drop-shadow-[0_4px_18px_rgba(0,0,0,0.35)]">
              Kami no Sū{' '}
              <span className="font-jp font-medium text-rose-200">– 神の数</span>
            </h1>

            <p className="mt-3 text-base sm:text-lg font-semibold text-rose-100">
              Thế giới rút quẻ Omikuji, Tarot &amp; thần số học Nhật Bản
            </p>

            <p className="mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-rose-100/85">
              Khám phá con số định mệnh, lắc hũ thẻ tre Omikuji tràn viền hoặc chọn lá bài Tarot thu hút bạn nhất để nhận thông điệp tươi sáng từ vũ trụ.
            </p>

            {/* Youthful Glowing Pill CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                onClick={handleOpenShakeModal}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f26979] via-[#e64b5e] to-[#d93d50] px-7 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(232,83,102,0.5)] transition-all hover:-translate-y-0.5 hover:brightness-105 active:scale-95"
              >
                <span>Rút quẻ ngay</span>
                <Sparkles className="h-4 w-4 text-amber-200" />
              </button>

              <button
                onClick={() => setIsNumerologyOpen(true)}
                className="inline-flex items-center justify-center gap-1 rounded-full border border-amber-200/75 bg-white/15 px-6 py-3 text-sm font-semibold text-amber-50 backdrop-blur-sm transition-all hover:bg-white/25 hover:border-amber-200"
              >
                <span>Khám phá thần số học</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SOFT SAKURA-RED KANJI MARQUEE ================= */}
      <MarqueeBanner />

      {/* ================= MAIN BENTO DASHBOARD (FULL-WIDTH EDGE-TO-EDGE) ================= */}
      <main className="relative z-20 w-full space-y-6 px-3 py-6 pb-28 sm:space-y-7 sm:px-6 sm:py-8 lg:px-10 xl:px-14 md:pb-14">
        {/* TOP ROW: Plans (Left) + Omikuji Box (Right) */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-7 lg:items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <PlansCarousel
              selectedPlan={selectedPlan}
              onSelectPlan={setSelectedPlan}
              onScrollToDraw={handleOpenShakeModal}
            />
          </div>

          <div className="lg:col-span-6 flex">
            <div className="w-full flex">
              <OmikujiBoxInteractive
                selectedPlan={selectedPlan}
                onOpenShakeModal={handleOpenShakeModal}
                onScrollToTarot={() => scrollToElement('tarot-omikuji-section')}
              />
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: Interactive Lively Tarot-Omikuji Card Fan */}
        <TarotOmikujiDeck
          selectedPlan={selectedPlan}
          onCardPicked={handleFortunePickedFromTarot}
        />

        {/* BOTTOM ROW: Daily Lucky Number (Left) + Fortune Result Card (Right) */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-7 lg:items-stretch">
          <div className="lg:col-span-4 flex">
            <div className="w-full flex">
              <DailyFortune onOpenNumerology={() => setIsNumerologyOpen(true)} />
            </div>
          </div>

          <div className="lg:col-span-8 flex">
            <div className="w-full flex">
              <FortuneCardDisplay
                fortune={currentFortune}
                plan={selectedPlan}
                isSaved={isCurrentSaved}
                onSave={handleSaveFortune}
                onShare={handleShareFortune}
                onRedraw={handleOpenShakeModal}
                flipVersion={flipVersion}
              />
            </div>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-20 hidden border-t border-rose-200/80 bg-[#fff8f6] py-6 text-center text-xs text-ink-muted md:block">
        <div className="flex w-full flex-col items-center justify-between gap-2 px-6 lg:px-10 xl:px-14 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-jp text-sm font-bold text-crimson-600">神の数</span>
            <span>· Kami no Sū © 2026 · Rút quẻ Omikuji &amp; Tarot Nhật Bản</span>
          </div>
          <p>Mang lại năng lượng tích cực, niềm vui và cảm hứng mỗi ngày 🌸</p>
        </div>
      </footer>

      {/* ================= MOBILE FLOATING BOTTOM BAR ================= */}
      <FloatingBottomNav
        activeTab={activeMobileTab}
        onHome={() => {
          setActiveMobileTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onPlans={() => {
          setActiveMobileTab('plans');
          scrollToElement('plans-section');
        }}
        onQuickDraw={() => {
          setActiveMobileTab('home');
          handleOpenShakeModal();
        }}
        onNumerology={() => {
          setActiveMobileTab('numerology');
          setIsNumerologyOpen(true);
        }}
        onSaved={() => {
          setActiveMobileTab('saved');
          setIsSavedOpen(true);
        }}
        savedCount={savedFortunes.length}
      />

      {/* ================= FULL-SCREEN OMIKUJI SHAKE RITUAL MODAL ================= */}
      <OmikujiShakeModal
        isOpen={isShakeModalOpen}
        selectedPlan={selectedPlan}
        isFortuneSaved={isFortuneSaved}
        onClose={() => setIsShakeModalOpen(false)}
        onFortuneRevealed={handleFortuneDrawnFromModal}
        onSaveFortune={handleSaveFortune}
        onShareFortune={handleShareFortune}
      />

      {/* ================= MODALS & DRAWERS ================= */}
      <NumerologyCalculatorModal
        isOpen={isNumerologyOpen}
        onClose={() => setIsNumerologyOpen(false)}
      />

      <SavedFortunesDrawer
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        entries={savedFortunes}
        onRemove={handleRemoveSaved}
        onSelectFortune={(fortune) => {
          setCurrentFortune(fortune);
          setFlipVersion((prev) => prev + 1);
          scrollToElement('fortune-result-section');
        }}
      />

      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="fixed left-1/2 top-20 z-[60] -translate-x-1/2 w-[90%] max-w-md">
          <div className="flex items-center gap-2.5 rounded-full border border-rose-300 bg-white/95 px-4 py-2.5 text-xs sm:text-sm font-semibold text-crimson-700 shadow-washi-hover backdrop-blur-md">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-crimson-500" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
