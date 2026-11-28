import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { FortuneCardDisplay } from './FortuneCardDisplay';
import type { OmikujiFortune, PlanType } from '../data/omikujiData';

interface FortuneResultModalProps {
  isOpen: boolean;
  fortune: OmikujiFortune;
  plan: PlanType;
  isSaved: boolean;
  isUnlocked: boolean;
  flipVersion: number;
  onClose: () => void;
  onSave: (fortune: OmikujiFortune) => void;
  onShare: (fortune: OmikujiFortune) => void;
  onRedraw: () => void;
  onOpenGift: (fortune: OmikujiFortune) => void;
  onOpenUnlock: () => void;
  onConsult1on1: () => void;
}

export const FortuneResultModal: React.FC<FortuneResultModalProps> = ({
  isOpen,
  fortune,
  plan,
  isSaved,
  isUnlocked,
  flipVersion,
  onClose,
  onSave,
  onShare,
  onRedraw,
  onOpenGift,
  onOpenUnlock,
  onConsult1on1,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Chi tiết Quẻ số ${fortune.stickNumber}`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#180408]/75 p-3 sm:p-5 backdrop-blur-sm overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#fbf8f3] p-3 sm:p-5 shadow-[0_28px_80px_rgba(0,0,0,0.65)] border border-[#d4af37]/45"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng quẻ số"
          className="sticky top-1 float-right z-30 grid h-9 w-9 place-items-center rounded-full border border-[#d4af37]/50 bg-[#23060c]/90 text-amber-100 shadow-md backdrop-blur-md transition hover:bg-[#3d0e08] hover:scale-105"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="clear-both">
          <FortuneCardDisplay
            fortune={fortune}
            plan={plan}
            isSaved={isSaved}
            isUnlocked={isUnlocked}
            onSave={onSave}
            onShare={onShare}
            onRedraw={() => {
              onClose();
              onRedraw();
            }}
            onOpenGift={(f) => {
              onOpenGift(f);
            }}
            onOpenUnlock={() => {
              onOpenUnlock();
            }}
            onConsult1on1={() => {
              onConsult1on1();
            }}
            flipVersion={flipVersion}
          />
        </div>
      </div>
    </div>
  );
};
