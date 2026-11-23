import { useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PetalsCanvas } from './components/PetalsCanvas';
import { Header } from './components/Header';
import { MarqueeBanner } from './components/MarqueeBanner';
import { HeroOmikujiSection } from './components/HeroOmikujiSection';
import { PlansCarousel } from './components/PlansCarousel';
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

  // Auto-start music on first genuine user interaction (pointerdown / touchend / click)
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
  }, []);

  const handleOpenShakeModal = useCallback(() => {
    setIsShakeModalOpen(true);
  }, []);

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
    const shareText = `⛩️ XĂM MAY MẮN - Đền Thần Asakusa Nhật Bản:\n✦ Quẻ Số ${fortune.stickNumber} (${fortune.kanjiRank} · ${fortune.rank})\n✦ "${fortune.title}"\n📜 ${fortune.poem.join(' / ')}\n❤️ Tình duyên: ${fortune.scores.love}% | 💰 Tài lộc: ${fortune.scores.wealth}% | 💼 Sự nghiệp: ${fortune.scores.career}%\nXin xăm may mắn ngay hôm nay!`;

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
      {/* Subtle Floating Petals Canvas */}
      <PetalsCanvas />

      {/* Transparent-to-Solid Header */}
      <Header
        onOpenNumerology={() => setIsNumerologyOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        onScrollToOmikuji={() => scrollToElement('hero-omikuji-section')}
        onOpenTarotDraw={() => scrollToElement('tarot-section')}
        savedCount={savedFortunes.length}
        musicOn={musicOn}
        onToggleMusic={handleToggleMusic}
      />

      {/* ================= 1. HERO SECTION: 70% BIG OMIKUJI BOX + 30% TITLE ================= */}
      <div id="hero-omikuji-section">
        <HeroOmikujiSection
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
          onFortuneDrawn={handleFortuneDrawn}
        />
      </div>

      {/* Traditional Temple Marquee Banner */}
      <MarqueeBanner />

      {/* ================= 2. MAIN CONTENT: FOCUS ON LỜI XĂM & SỐ MAY MẮN ================= */}
      <main className="relative z-20 w-full space-y-8 px-4 py-8 pb-28 sm:space-y-10 sm:px-6 sm:py-10 lg:px-10 xl:px-16 md:pb-16">
        {/* LỜI QUẺ XĂM CHI TIẾT (Trọng tâm trải nghiệm) */}
        <div id="fortune-result-section">
          <FortuneCardDisplay
            fortune={currentFortune}
            plan={selectedPlan}
            isSaved={isCurrentSaved}
            onSave={handleSaveFortune}
            onShare={handleShareFortune}
            onRedraw={() => scrollToElement('hero-omikuji-section')}
            flipVersion={flipVersion}
          />
        </div>

        {/* 2 Cột Cân Đối: Chọn Ý Nguyện (Trái) + Con Số May Mắn Hôm Nay (Phải) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <PlansCarousel
              selectedPlan={selectedPlan}
              onSelectPlan={setSelectedPlan}
              onScrollToDraw={() => scrollToElement('hero-omikuji-section')}
            />
          </div>

          <div className="lg:col-span-6 flex">
            <div className="w-full flex">
              <DailyFortune onOpenNumerology={() => setIsNumerologyOpen(true)} />
            </div>
          </div>
        </div>

        {/* Trải Bài Tarot Omikuji (Lựa chọn bổ trợ thú vị) */}
        <div id="tarot-section">
          <TarotOmikujiDeck
            selectedPlan={selectedPlan}
            onCardPicked={(fortune) => {
              handleFortuneDrawn(fortune);
              scrollToElement('fortune-result-section');
            }}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 hidden border-t border-temple-200 bg-[#f8f2e9] py-8 text-center text-xs text-ink-muted md:block">
        <div className="flex w-full flex-col items-center justify-between gap-3 px-6 lg:px-12 xl:px-16 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-jp text-base font-bold text-temple-800">神の数</span>
            <span className="font-semibold text-temple-900">· Xăm May Mắn Asakusa © 2026</span>
          </div>
          <p className="text-ink-muted">
            Lắc xăm mang lại điềm lành, năng lượng tích cực &amp; sự bình an trong tâm hồn 🌸
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

      {/* Full-Screen Omikuji Shake Ritual Modal */}
      <OmikujiShakeModal
        isOpen={isShakeModalOpen}
        selectedPlan={selectedPlan}
        isFortuneSaved={isFortuneSaved}
        onClose={() => setIsShakeModalOpen(false)}
        onFortuneRevealed={handleFortuneDrawn}
        onSaveFortune={handleSaveFortune}
        onShareFortune={handleShareFortune}
      />

      {/* Numerology Modal */}
      <NumerologyCalculatorModal
        isOpen={isNumerologyOpen}
        onClose={() => setIsNumerologyOpen(false)}
      />

      {/* Saved Fortunes Drawer */}
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
