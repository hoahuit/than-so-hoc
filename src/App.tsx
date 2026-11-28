import { Suspense, lazy, useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PetalsCanvas } from './components/PetalsCanvas';
import { Header } from './components/Header';
import { MarqueeBanner } from './components/MarqueeBanner';
import { HeroOmikujiSection } from './components/HeroOmikujiSection';
import { PlansCarousel } from './components/PlansCarousel';
import { DailyFortune } from './components/DailyFortune';
import { JapaneseBackdropDecor } from './components/JapaneseBackdropDecor';
import { type SavedFortuneEntry } from './components/SavedFortunesDrawer';
import { FloatingBottomNav } from './components/FloatingBottomNav';
import { SealedFortuneIntro } from './components/SealedFortuneIntro';
import { OMIKUJI_DATABASE, getRandomFortune, type OmikujiFortune, type PlanType } from './data/omikujiData';
import type { DrawnTarotCard } from './data/tarotData';
import { shrineAudio } from './utils/sound';

const OmikujiShakeModal = lazy(() =>
  import('./components/OmikujiShakeModal').then((m) => ({ default: m.OmikujiShakeModal }))
);
const TarotOmikujiDeck = lazy(() =>
  import('./components/TarotOmikujiDeck').then((m) => ({ default: m.TarotOmikujiDeck }))
);
const NumerologyCalculatorModal = lazy(() =>
  import('./components/NumerologyCalculatorModal').then((m) => ({ default: m.NumerologyCalculatorModal }))
);
const SavedFortunesDrawer = lazy(() =>
  import('./components/SavedFortunesDrawer').then((m) => ({ default: m.SavedFortunesDrawer }))
);
const OmamoriGiftModal = lazy(() =>
  import('./components/OmamoriGiftModal').then((m) => ({ default: m.OmamoriGiftModal }))
);
const UnlockDonateModal = lazy(() =>
  import('./components/UnlockDonateModal').then((m) => ({ default: m.UnlockDonateModal }))
);
const TarotConciergeModal = lazy(() =>
  import('./components/TarotConciergeModal').then((m) => ({ default: m.TarotConciergeModal }))
);
const FortuneResultModal = lazy(() =>
  import('./components/FortuneResultModal').then((m) => ({ default: m.FortuneResultModal }))
);

const STORAGE_KEY = 'kami_no_su_saved_fortunes_v1';
const UNLOCK_STORAGE_KEY = 'kami_no_su_unlocked_v1';
const INTRO_SESSION_KEY = 'kami_no_su_intro_seen_v1';

export function App() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('love');
  const [currentFortune, setCurrentFortune] = useState<OmikujiFortune>(OMIKUJI_DATABASE[0]);
  const [drawnTarotCards, setDrawnTarotCards] = useState<DrawnTarotCard[]>([]);
  const [flipVersion, setFlipVersion] = useState<number>(0);

  const [isShakeModalOpen, setIsShakeModalOpen] = useState<boolean>(false);
  const [isFortuneModalOpen, setIsFortuneModalOpen] = useState<boolean>(false);
  const [isNumerologyOpen, setIsNumerologyOpen] = useState<boolean>(false);
  const [isSavedOpen, setIsSavedOpen] = useState<boolean>(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState<boolean>(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState<boolean>(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState<boolean>(false);

  const [showSealedIntro, setShowSealedIntro] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(INTRO_SESSION_KEY) !== '1';
    } catch {
      return true;
    }
  });

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(UNLOCK_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

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

  // ===== BACKGROUND MUSIC STATE =====
  const [musicOn, setMusicOn] = useState<boolean>(false);
  const autoStartedRef = useRef(false);

  const handleToggleMusic = useCallback(async () => {
    if (!musicOn) {
      const ok = await shrineAudio.startBackgroundMusic();
      if (ok) setMusicOn(true);
    } else {
      shrineAudio.stopBackgroundMusic();
      setMusicOn(false);
    }
  }, [musicOn]);

  useEffect(() => {
    const startOnInteraction = async () => {
      if (autoStartedRef.current) return;

      const unlocked = await shrineAudio.unlock();
      if (unlocked) {
        autoStartedRef.current = true;
        await shrineAudio.startBackgroundMusic();
        setMusicOn(true);
        window.removeEventListener('pointerdown', startOnInteraction);
        window.removeEventListener('touchend', startOnInteraction);
        window.removeEventListener('click', startOnInteraction);
      }
    };

    window.addEventListener('pointerdown', startOnInteraction, { passive: true });
    window.addEventListener('touchend', startOnInteraction, { passive: true });
    window.addEventListener('click', startOnInteraction, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', startOnInteraction);
      window.removeEventListener('touchend', startOnInteraction);
      window.removeEventListener('click', startOnInteraction);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedFortunes));
    } catch {
      // Ignore quota errors
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
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFortuneDrawn = useCallback((fortune: OmikujiFortune) => {
    setCurrentFortune(fortune);
    setFlipVersion((prev) => prev + 1);
    setIsShakeModalOpen(false);
    setIsFortuneModalOpen(true);
  }, []);

  const markIntroSeen = () => {
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    } catch {
      // Ignore storage errors
    }
  };

  const handleUnsealIntro = useCallback(() => {
    const todayFortune = getRandomFortune(selectedPlan);
    setCurrentFortune(todayFortune);
    setFlipVersion((prev) => prev + 1);
    setShowSealedIntro(false);
    markIntroSeen();
    if (shrineAudio.bgMusicPlaying) {
      setMusicOn(true);
    }
    // Lead smoothly into Stage 2 shake ritual
    setIsShakeModalOpen(true);
  }, [selectedPlan]);

  const handleSkipIntro = useCallback(() => {
    setShowSealedIntro(false);
    markIntroSeen();
  }, []);

  const handleOpenShakeModal = useCallback(() => {
    setIsShakeModalOpen(true);
  }, []);

  const handleConfirmUnlock = useCallback(
    (amount: number) => {
      setIsUnlocked(true);
      try {
        localStorage.setItem(UNLOCK_STORAGE_KEY, '1');
      } catch {
        // Ignore storage errors
      }
      showToast(
        `Cảm ơn bạn đã gieo duyên ${amount.toLocaleString('vi-VN')}đ! Đã mở khóa lời giải sâu & trải bài Tarot 3 lá.`
      );
    },
    [showToast]
  );

  const isFortuneSaved = useCallback(
    (fortune: OmikujiFortune) => savedFortunes.some((entry) => entry.fortune.id === fortune.id),
    [savedFortunes]
  );

  const isCurrentSaved = isFortuneSaved(currentFortune);

  const handleSaveFortune = (fortune: OmikujiFortune) => {
    if (isFortuneSaved(fortune)) {
      showToast('Lá quẻ này đã có trong sổ xăm của bạn!');
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
    showToast(`Đã lưu Quẻ Số ${fortune.stickNumber} (${fortune.rank}) vào sổ xăm!`);
  };

  const handleRemoveSaved = (uid: string) => {
    setSavedFortunes((prev) => prev.filter((item) => item.uid !== uid));
    showToast('Đã xóa quẻ xăm khỏi sổ xăm.');
  };

  const handleShareFortune = async (fortune: OmikujiFortune) => {
    const shareText = `⛩️ XĂM MAY MẮN - Kami no Sū:\n✦ Quẻ Số ${fortune.stickNumber}: "${fortune.title}" (${fortune.rank})\n📜 ${fortune.poem.join(' / ')}\n✨ ${fortune.summary}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Xăm May Mắn – Quẻ Số ${fortune.stickNumber} (${fortune.rank})`,
          text: shareText,
          url: window.location.href,
        });
        showToast('Đã chia sẻ quẻ xăm thành công!');
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      showToast('Đã sao chép lời xăm & liên kết vào bộ nhớ tạm!');
    } catch {
      showToast('Bạn có thể chụp màn hình quẻ xăm để chia sẻ nhé!');
    }
  };

  return (
    <div className="relative min-h-screen temple-bg text-ink selection:bg-temple-800 selection:text-white">
      {/* Stage 1: Curiosity Hook Intro */}
      <SealedFortuneIntro
        isVisible={showSealedIntro}
        onUnseal={handleUnsealIntro}
        onSkip={handleSkipIntro}
      />

      {/* Subtle Floating Petals Canvas */}
      <PetalsCanvas />

      {/* Header */}
      <Header
        onOpenNumerology={() => setIsNumerologyOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        onScrollToOmikuji={() => scrollToElement('hero-omikuji-section')}
        onOpenTarotDraw={() => scrollToElement('tarot-section')}
        onOpenFortuneModal={() => setIsFortuneModalOpen(true)}
        savedCount={savedFortunes.length}
        musicOn={musicOn}
        onToggleMusic={handleToggleMusic}
      />

      {/* ================= 1. HERO SECTION: PROGRESSIVE 3D SHRINE ================= */}
      <div id="hero-omikuji-section">
        <HeroOmikujiSection
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
          onFortuneDrawn={handleFortuneDrawn}
          onOpenFortuneModal={() => setIsFortuneModalOpen(true)}
        />
      </div>

      {/* Traditional Temple Marquee Banner */}
      <MarqueeBanner />

      {/* ================= 2. MAIN CONTENT: LUXURY JAPANESE PACKAGES & DAILY LUCK ================= */}
      <main className="relative z-20 w-full overflow-hidden bg-gradient-to-b from-[#fdf9f2] via-[#fbf4e7] to-[#fbf4e7] space-y-8 px-4 py-10 sm:space-y-10 sm:px-6 sm:py-12 lg:px-10 xl:px-16">
        <JapaneseBackdropDecor />

        {/* 2 Cột Cân Đối: Gói Gieo Duyên (Trái) + Con Số May Mắn Hôm Nay (Phải) */}
        <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <PlansCarousel
              selectedPlan={selectedPlan}
              isUnlocked={isUnlocked}
              onSelectPlan={setSelectedPlan}
              onScrollToDraw={() => scrollToElement('hero-omikuji-section')}
              onOpenUnlock={() => setIsUnlockModalOpen(true)}
            />
          </div>

          <div className="lg:col-span-6 flex">
            <div className="w-full flex">
              <DailyFortune onOpenNumerology={() => setIsNumerologyOpen(true)} />
            </div>
          </div>
        </div>
      </main>

      {/* ================= 3. FULL-SCREEN TAROT SECTION ================= */}
      <div id="tarot-section" className="relative z-20 w-full pb-24 md:pb-0">
        <Suspense fallback={null}>
          <TarotOmikujiDeck
            isUnlocked={isUnlocked}
            onUnlockClick={() => setIsUnlockModalOpen(true)}
            onCardsDrawn={(cards) => setDrawnTarotCards(cards)}
            onConsult1on1={(cards) => {
              setDrawnTarotCards(cards);
              setIsConciergeOpen(true);
            }}
          />
        </Suspense>
      </div>

      {/* Footer */}
      <footer className="relative z-20 hidden border-t border-temple-200 bg-[#f8f2e9] py-8 text-center text-xs text-ink-muted md:block">
        <div className="flex w-full flex-col items-center justify-between gap-3 px-6 lg:px-12 xl:px-16 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-jp text-base font-bold text-temple-800">神の数</span>
            <span className="font-semibold text-temple-900">· Xăm &amp; Tarot Kami no Sū © 2026</span>
          </div>
          <p className="text-ink-muted">
            Lắc xăm &amp; soi chiếu Tarot để tìm lại nhịp bình an và câu trả lời cho riêng mình 🌸
          </p>
        </div>
      </footer>

      {/* Mobile Floating Bottom Bar */}
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

      {/* Lazy-Loaded Modals & Drawers */}
      <Suspense fallback={null}>
        <OmikujiShakeModal
          isOpen={isShakeModalOpen}
          selectedPlan={selectedPlan}
          isFortuneSaved={isFortuneSaved}
          onClose={() => setIsShakeModalOpen(false)}
          onFortuneRevealed={handleFortuneDrawn}
          onSaveFortune={handleSaveFortune}
          onShareFortune={handleShareFortune}
        />

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
            setIsFortuneModalOpen(true);
          }}
        />

        <FortuneResultModal
          isOpen={isFortuneModalOpen}
          fortune={currentFortune}
          plan={selectedPlan}
          isSaved={isCurrentSaved}
          isUnlocked={isUnlocked}
          flipVersion={flipVersion}
          onClose={() => setIsFortuneModalOpen(false)}
          onSave={handleSaveFortune}
          onShare={handleShareFortune}
          onRedraw={() => handleOpenShakeModal()}
          onOpenGift={() => setIsGiftModalOpen(true)}
          onOpenUnlock={() => setIsUnlockModalOpen(true)}
          onConsult1on1={() => setIsConciergeOpen(true)}
        />

        <OmamoriGiftModal
          isOpen={isGiftModalOpen}
          fortune={currentFortune}
          onClose={() => setIsGiftModalOpen(false)}
        />

        <UnlockDonateModal
          isOpen={isUnlockModalOpen}
          selectedPlan={selectedPlan}
          onClose={() => setIsUnlockModalOpen(false)}
          onConfirmUnlock={handleConfirmUnlock}
        />

        <TarotConciergeModal
          isOpen={isConciergeOpen}
          fortune={currentFortune}
          drawnTarotCards={drawnTarotCards}
          onClose={() => setIsConciergeOpen(false)}
        />
      </Suspense>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed left-1/2 top-20 z-[60] -translate-x-1/2 w-[90%] max-w-md">
          <div className="flex items-center gap-2.5 rounded-full border border-brass-400 bg-white/95 px-4 py-2.5 text-xs sm:text-sm font-semibold text-temple-900 shadow-temple-hover backdrop-blur-md">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-temple-700" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
