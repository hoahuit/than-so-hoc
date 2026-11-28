import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, LockOpen, QrCode, HeartHandshake } from 'lucide-react';
import type { PlanType } from '../data/omikujiData';
import { shrineAudio } from '../utils/sound';

interface UnlockDonateModalProps {
  isOpen: boolean;
  selectedPlan: PlanType;
  onClose: () => void;
  onConfirmUnlock: (amount: number) => void;
}

/**
 * Cấu hình VietQR cho chủ website: thay BANK_BIN và ACCOUNT_NO bằng tài khoản thật.
 * Hỗ trợ chuẩn VietQR (VD: MB, VCB, TCB, ACB, TPB, VPB, MOMO...).
 */
const VIETQR_CONFIG = {
  bankId: 'MB',
  accountNo: '0900000000',
  accountName: 'KAMI NO SU',
};

const DONATE_TIERS: {
  id: PlanType;
  label: string;
  amount: number;
  desc: string;
  popular?: boolean;
}[] = [
  {
    id: 'mini',
    label: 'Gieo Duyên Nhẹ',
    amount: 10000,
    desc: 'Mở phần giải mã gốc rễ & 30 ngày tới cho quẻ hiện tại',
  },
  {
    id: 'love',
    label: 'Mở Khóa Trọn Vẹn',
    amount: 15000,
    desc: 'Mở full quẻ xăm + Trải bài Tarot 3 lá chuyên sâu',
    popular: true,
  },
  {
    id: 'destiny',
    label: 'Trọn Gói Khai Thông',
    amount: 20000,
    desc: 'Mở toàn bộ tính năng web + Ưu tiên phiên hỏi Tarot 1:1',
  },
];

export const UnlockDonateModal: React.FC<UnlockDonateModalProps> = ({
  isOpen,
  selectedPlan,
  onClose,
  onConfirmUnlock,
}) => {
  const defaultTier = DONATE_TIERS.find((t) => t.id === selectedPlan) ?? DONATE_TIERS[1];
  const [selectedAmount, setSelectedAmount] = useState<number>(defaultTier.amount);
  const [qrFailed, setQrFailed] = useState<boolean>(false);
  const [sessionCode] = useState<string>(() => `KNS${Math.floor(1000 + Math.random() * 9000)}`);

  if (!isOpen) return null;

  const transferNote = `GIEODUYEN ${sessionCode}`;
  const qrUrl = `https://img.vietqr.io/image/${VIETQR_CONFIG.bankId}-${VIETQR_CONFIG.accountNo}-compact2.png?amount=${selectedAmount}&addInfo=${encodeURIComponent(
    transferNote
  )}&accountName=${encodeURIComponent(VIETQR_CONFIG.accountName)}`;

  const handleConfirm = () => {
    shrineAudio.playShrineBell();
    onConfirmUnlock(selectedAmount);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c060a]/75 p-4 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="washi-card relative my-4 w-full max-w-2xl overflow-hidden rounded-3xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center rounded-full border border-rose-200 bg-white text-ink-muted hover:border-crimson-400 hover:text-crimson-600 transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 pr-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8b2a18]">
            <HeartHandshake className="h-3 w-3" />
            <span>Chặng 3 · Gieo Duyên Mở Khóa</span>
          </span>
          <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-[#3d1a15]">
            Mở Khóa Lời Giải Sâu &amp; Trải Bài 3 Lá
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Chỉ một khoản gieo duyên nhỏ để mở toàn bộ nút thắt 30 ngày tới và bộ trải bài Tarot 3 lá.
          </p>
        </div>

        {/* Tier Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
          {DONATE_TIERS.map((tier) => {
            const active = selectedAmount === tier.amount;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedAmount(tier.amount)}
                className={`relative rounded-2xl border p-3.5 text-left transition ${
                  active
                    ? 'border-[#8b2a18] bg-[#faeee9] ring-1 ring-[#8b2a18]'
                    : 'border-[#e6d3be] bg-white hover:bg-[#fcf8f2]'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-2.5 right-3 rounded-full bg-[#8b2a18] px-2 py-0.5 text-[9px] font-bold text-amber-100">
                    Phổ biến
                  </span>
                )}
                <p className="text-xs font-bold text-[#3d1a15]">{tier.label}</p>
                <p className="mt-0.5 font-display text-lg font-black text-[#8b2a18]">
                  {tier.amount.toLocaleString('vi-VN')}đ
                </p>
                <p className="mt-1 text-[11px] leading-snug text-ink-muted">{tier.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Benefits + QR Section */}
        <div className="grid gap-5 sm:grid-cols-[190px_1fr] items-center rounded-2xl border border-[#e6d3be] bg-[#faf4ea] p-4">
          <div className="mx-auto flex flex-col items-center">
            {!qrFailed ? (
              <img
                src={qrUrl}
                alt="Mã VietQR Gieo Duyên"
                onError={() => setQrFailed(true)}
                className="h-44 w-44 rounded-xl border border-[#e6d3be] bg-white object-contain p-1.5 shadow-sm"
              />
            ) : (
              <div className="flex h-44 w-44 flex-col items-center justify-center rounded-xl border border-dashed border-[#cba135] bg-white p-3 text-center">
                <QrCode className="h-12 w-12 text-[#8b2a18] mb-2" />
                <span className="text-[11px] font-bold text-[#3d1a15]">
                  {VIETQR_CONFIG.bankId} · {VIETQR_CONFIG.accountNo}
                </span>
                <span className="text-[10px] text-ink-muted mt-0.5">
                  Nội dung: {transferNote}
                </span>
              </div>
            )}
            <span className="mt-1.5 text-[10px] font-semibold text-[#6b3a24]">
              Nội dung CK: <strong>{transferNote}</strong>
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#3d1a15]">
            <p className="font-bold text-sm text-[#8b2a18]">Quyền lợi mở khóa ngay lập tức:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  Mở khóa phần <strong>Nguyên nhân gốc rễ &amp; Dự báo 30 ngày tới</strong> cho tất cả các quẻ.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  Mở chế độ <strong>Trải bài Tarot 3 lá</strong> (Hiện tại – Góc khuất – Hướng xoay chuyển).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  Lưu lại không giới hạn và mang theo ngữ cảnh vào phiên <strong>Hỏi Tarot 1:1</strong>.
                </span>
              </li>
            </ul>

            <button
              type="button"
              onClick={handleConfirm}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#a33a24] via-[#8b2a18] to-[#6e1e12] py-3 text-xs sm:text-sm font-bold text-amber-50 shadow-temple-red transition hover:brightness-110 active:scale-[0.99]"
            >
              <LockOpen className="h-4 w-4 text-amber-200" />
              <span>Tôi đã gieo duyên · Mở khóa ngay</span>
            </button>
          </div>
        </div>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-muted">
          <Sparkles className="h-3.5 w-3.5 text-[#cba135]" />
          <span>Lưu ý: Tích hợp webhook SePay/PayOS ở backend để tự động xác nhận QR theo thời gian thực.</span>
        </p>
      </div>
    </div>
  );
};
