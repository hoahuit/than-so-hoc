import React from 'react';
import { X, Trash2, Bookmark, Eye } from 'lucide-react';
import { type OmikujiFortune } from '../data/omikujiData';

export interface SavedFortuneEntry {
  uid: string;
  savedAt: string;
  fortune: OmikujiFortune;
}

interface SavedFortunesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entries: SavedFortuneEntry[];
  onRemove: (uid: string) => void;
  onSelectFortune: (fortune: OmikujiFortune) => void;
}

export const SavedFortunesDrawer: React.FC<SavedFortunesDrawerProps> = ({
  isOpen,
  onClose,
  entries,
  onRemove,
  onSelectFortune,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#2c0d14]/45 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full w-full max-w-md flex-col border-l border-rose-200 bg-[#fff9f7] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#ef6676] to-[#d43c50] font-jp text-base font-bold text-white shadow-sm">
              蔵
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-ink">Bộ Sưu Tập Quẻ Đã Lưu</h3>
              <p className="text-[11px] text-ink-muted">{entries.length} lá quẻ được cất giữ</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng"
            className="grid h-8 w-8 place-items-center rounded-full border border-rose-200 text-ink-muted hover:border-crimson-400 hover:text-crimson-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {entries.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-6 py-12 text-ink-muted">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-rose-100 text-crimson-500 mb-3">
                <Bookmark className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-ink">Chưa có lá quẻ nào được lưu</p>
              <p className="mt-1 text-xs leading-relaxed">
                Hãy lắc hộp Omikuji hoặc rút bài Tarot rồi nhấn “Lưu vào bộ sưu tập” để giữ lại những thông điệp may mắn nhé!
              </p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.uid}
                className="washi-card rounded-xl p-3.5 transition-all hover:border-crimson-400"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-rose-300 bg-gradient-to-b from-rose-50 to-rose-100 font-jp text-xl font-black text-crimson-600">
                      {entry.fortune.kanjiRank}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold uppercase text-crimson-600">
                          {entry.fortune.rank}
                        </span>
                        <span className="text-[10px] text-ink-light">
                          · Thẻ #{entry.fortune.stickNumber}
                        </span>
                      </div>
                      <p className="truncate text-sm font-bold text-ink">
                        {entry.fortune.title}
                      </p>
                      <p className="text-[10px] text-ink-muted mt-0.5">Lưu lúc: {entry.savedAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onSelectFortune(entry.fortune);
                        onClose();
                      }}
                      title="Xem lại quẻ"
                      className="grid h-8 w-8 place-items-center rounded-full border border-rose-200 bg-white text-crimson-600 hover:bg-crimson-500 hover:text-white transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onRemove(entry.uid)}
                      title="Xóa"
                      className="grid h-8 w-8 place-items-center rounded-full border border-rose-200 bg-white text-ink-light hover:border-crimson-500 hover:text-crimson-600 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
