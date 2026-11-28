import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  CalendarClock,
  MessageCircleHeart,
  CheckCircle2,
  Copy,
  Headphones,
  PhoneCall,
} from 'lucide-react';
import type { OmikujiFortune } from '../data/omikujiData';
import type { DrawnTarotCard } from '../data/tarotData';
import { shrineAudio } from '../utils/sound';

interface TarotConciergeModalProps {
  isOpen: boolean;
  fortune: OmikujiFortune;
  drawnTarotCards: DrawnTarotCard[];
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

const QUICK_PROMPTS = [
  'Công việc hiện tại đang kẹt nhịp, mình có nên đổi hướng không?',
  'Mối quan hệ đang im lặng mập mờ, mình nên chờ hay nói thẳng?',
  'Mình đang phân vân giữa 2 lựa chọn, lá bài nói gì về rủi ro?',
];

export const TarotConciergeModal: React.FC<TarotConciergeModalProps> = ({
  isOpen,
  fortune,
  drawnTarotCards,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'bot' | 'booking'>('bot');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Stage 4 Async/Scheduled 1:1 Human Reader Booking State
  const [userName, setUserName] = useState<string>('');
  const [zaloContact, setZaloContact] = useState<string>('');
  const [deliveryFormat, setDeliveryFormat] = useState<'async_audio' | 'live_slot'>('async_audio');
  const [preferredSlot, setPreferredSlot] = useState<string>('19:30 - 20:30');
  const [bookingQuestion, setBookingQuestion] = useState<string>('');
  const [bookingSubmitted, setBookingSubmitted] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const tarotSummary =
    drawnTarotCards.length > 0
      ? drawnTarotCards
          .map((d) => `${d.card.nameEn} (${d.card.nameVi}${d.isReversed ? ' - Ngược' : ''})`)
          .join(', ')
      : 'Chưa rút lá Tarot riêng';

  const welcomeMessage: ChatMessage = {
    id: 'welcome',
    sender: 'bot',
    text: `Chào bạn, mình đã đọc ngữ cảnh Quẻ #${fortune.stickNumber} (“${fortune.title}”) và bài Tarot của bạn (${tarotSummary}).\n\nBạn đang bận tâm nhất về khía cạnh nào lúc này — Công việc kẹt nhịp, Tình cảm mập mờ hay một Lựa chọn khó nói? Cứ chia sẻ ngắn gọn, mình sẽ soi chiếu ngay giúp bạn.`,
  };

  const displayedMessages = [welcomeMessage, ...messages];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const generateBotReply = (userQuestion: string): string => {
    const q = userQuestion.toLowerCase();
    const primaryCard = drawnTarotCards[0];
    const cardNote = primaryCard
      ? `Kết hợp với lá **${primaryCard.card.nameEn} (${primaryCard.card.nameVi}${
          primaryCard.isReversed ? ' - Ngược' : ''
        })** bạn vừa rút: ${
          primaryCard.isReversed ? primaryCard.card.reversed.advice : primaryCard.card.upright.advice
        }`
      : `Từ tín hiệu Quẻ #${fortune.stickNumber} (${fortune.title}): ${
          fortune.closingAdvice ?? fortune.advice
        }`;

    if (q.includes('việc') || q.includes('làm') || q.includes('tiền') || q.includes('nghề')) {
      return `Về câu chuyện công việc bạn vừa hỏi:\n• Điểm mấu chốt hiện tại: ${
        primaryCard
          ? (primaryCard.isReversed
              ? primaryCard.card.reversed.career
              : primaryCard.card.upright.career)
          : fortune.careerInsight ?? fortune.aspects.career
      }\n• ${cardNote}\n\nNếu bạn đang đứng trước quyết định chuyển việc, ký hợp đồng hoặc chọn giữa 2 cơ hội cụ thể cần xem sâu theo mốc thời gian từng tháng, bạn có thể bấm sang tab **"Đặt lịch Reader 1:1"** — Reader sẽ xem riêng và gửi bản giải chi tiết qua Zalo mà không cần chờ trực tiếp 24/7.`;
    }

    if (
      q.includes('yêu') ||
      q.includes('tình') ||
      q.includes('mập mờ') ||
      q.includes('im lặng') ||
      q.includes('người')
    ) {
      return `Về chuyện tình cảm & khoảng cách bạn đang vướng:\n• Nhìn từ quẻ & bài: ${
        primaryCard
          ? (primaryCard.isReversed ? primaryCard.card.reversed.love : primaryCard.card.upright.love)
          : fortune.loveInsight ?? fortune.aspects.love
      }\n• ${cardNote}\n\nNhững ca có liên quan đến cảm xúc đối phương, người thứ ba hoặc quyết định chờ hay buông thường cần trải bộ bài riêng theo đúng tên & câu chuyện hai người. Bạn có thể chuyển sang tab **"Đặt lịch Reader 1:1"** để Reader trả lời riêng tư qua Audio 10–15 phút nhé.`;
    }

    return `Mình hiểu cảm giác phân vân bạn đang mang.\n• Bức tranh tổng thể lúc này: ${
      primaryCard
        ? (primaryCard.isReversed ? primaryCard.card.reversed.mood : primaryCard.card.upright.mood)
        : fortune.mirrorMood ?? fortune.meaning
    }\n• ${cardNote}\n\nBạn có muốn kể thêm 1 chi tiết cụ thể (tình huống thực tế bạn đang gặp), hoặc đặt suất **Xem Tarot sâu 1:1 (nhận Audio/PDF qua Zalo trong 12–24h)** ở tab bên cạnh không?`;
  };

  const handleSend = (customText?: string) => {
    const text = (customText ?? input).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    if (!bookingQuestion) setBookingQuestion(text);
    setIsTyping(true);

    setTimeout(() => {
      shrineAudio.playStickSlide();
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: generateBotReply(text),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 650);
  };

  const buildBookingSummary = () => {
    const cardText =
      drawnTarotCards.length > 0
        ? drawnTarotCards
            .map((d) => `${d.card.nameEn}${d.isReversed ? ' (Ngược)' : ' (Xuôi)'}`)
            .join(', ')
        : 'Chưa rút';
    return [
      `🔮 ĐĂNG KÝ XEM TAROT SÂU 1:1 - KAMI NO SŪ`,
      `• Khách: ${userName || 'Chưa nhập tên'}`,
      `• Zalo/SĐT: ${zaloContact}`,
      `• Hình thức: ${
        deliveryFormat === 'async_audio'
          ? 'Gửi Audio + PDF giải sâu qua Zalo (12–24h)'
          : `Call/Chat 1:1 khung giờ ${preferredSlot}`
      }`,
      `• Quẻ vừa rút: #${fortune.stickNumber} - ${fortune.title}`,
      `• Lá Tarot: ${cardText}`,
      `• Câu hỏi trọng tâm: ${bookingQuestion || 'Cần tư vấn tổng quan bước ngoặt sắp tới'}`,
    ].join('\n');
  };

  const handleCopyBooking = async () => {
    try {
      await navigator.clipboard.writeText(buildBookingSummary());
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    shrineAudio.playShrineBell();
    setBookingSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c060a]/75 p-4 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="washi-card relative my-4 flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl max-h-[90vh]"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#e6d3be] bg-[#2a080f] px-5 py-4 text-amber-50">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-300/20 text-amber-200 border border-amber-300/40">
              <MessageCircleHeart className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-amber-300">
                Chặng 4 · Đồng hành 24/7 &amp; 1:1
              </span>
              <h2 className="font-display text-base sm:text-lg font-bold">
                Trợ Lý Tarot &amp; Đặt Lịch Xem Sâu 1:1
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="grid h-8 w-8 place-items-center rounded-full border border-amber-200/30 text-amber-100 hover:bg-white/10 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Hybrid Mode Tabs */}
        <div className="grid grid-cols-2 border-b border-[#e6d3be] bg-[#faf4ea] p-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('bot')}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 transition ${
              activeTab === 'bot'
                ? 'bg-[#8b2a18] text-amber-50 shadow-sm'
                : 'text-[#6b3a24] hover:bg-white/60'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Bot Tarot 24/7 (Hỏi nhanh)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('booking')}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 transition ${
              activeTab === 'booking'
                ? 'bg-[#8b2a18] text-amber-50 shadow-sm'
                : 'text-[#6b3a24] hover:bg-white/60'
            }`}
          >
            <CalendarClock className="h-3.5 w-3.5" />
            <span>Đặt Lịch Reader 1:1</span>
          </button>
        </div>

        {/* TAB 1: 24/7 AI TAROT BOT */}
        {activeTab === 'bot' ? (
          <div className="flex flex-1 flex-col overflow-hidden bg-[#fffcf7]">
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {displayedMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#8b2a18] text-amber-50 rounded-br-sm'
                        : 'border border-[#e6d3be] bg-white text-[#3d1a15] rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-[#e6d3be] bg-white px-4 py-2.5 text-xs text-ink-muted italic">
                    Đang kết nối thông điệp từ quẻ và lá bài của bạn...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex gap-2 overflow-x-auto border-t border-[#efe2d2] bg-[#faf4ea] px-4 py-2 [scrollbar-width:none]">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="shrink-0 rounded-full border border-[#d9bfa9] bg-white px-3 py-1 text-[11px] font-medium text-[#6b3a24] hover:border-[#8b2a18] hover:text-[#8b2a18] transition"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 border-t border-[#e6d3be] bg-white p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập điều bạn đang băn khoăn..."
                className="flex-1 rounded-full border border-[#e6d3be] bg-[#fffcf7] px-4 py-2.5 text-xs sm:text-sm text-[#3d1a15] focus:border-[#8b2a18] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#8b2a18] text-amber-100 shadow-sm transition hover:brightness-110 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        ) : (
          /* TAB 2: ASYNC / SCHEDULED 1:1 HUMAN READER BOOKING */
          <div className="flex-1 overflow-y-auto bg-[#fffcf7] p-5 sm:p-6">
            {bookingSubmitted ? (
              <div className="space-y-4 text-center py-4">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-[#3d1a15]">
                    Đã ghi nhận yêu cầu xem 1:1 của bạn!
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-ink-muted">
                    Thông tin quẻ #{fortune.stickNumber} và lá bài của bạn đã được đóng gói sẵn để Reader xử lý đúng khung giờ.
                  </p>
                </div>

                <pre className="rounded-2xl border border-[#e6d3be] bg-[#faf4ea] p-3.5 text-left text-[11px] text-[#3d1a15] whitespace-pre-wrap font-sans">
                  {buildBookingSummary()}
                </pre>

                <button
                  type="button"
                  onClick={handleCopyBooking}
                  className="inline-flex items-center gap-2 rounded-full bg-[#8b2a18] px-6 py-2.5 text-xs font-bold text-amber-50 shadow-sm hover:brightness-110 transition"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copiedSummary ? 'Đã sao chép thông tin đơn!' : 'Sao chép thông tin gửi qua Zalo'}</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-4 text-xs sm:text-sm">
                <div className="rounded-2xl border border-amber-300/70 bg-amber-50/70 p-3.5 text-xs text-[#5c2a21]">
                  <strong>Mô hình trả bài không cần chờ trực 24/7:</strong> Bạn gửi câu hỏi bất cứ lúc nào, Reader sẽ xem sâu riêng theo từng ca và gửi phản hồi qua Zalo đúng hẹn.
                </div>

                {/* Delivery Option */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDeliveryFormat('async_audio')}
                    className={`rounded-2xl border p-3 text-left transition ${
                      deliveryFormat === 'async_audio'
                        ? 'border-[#8b2a18] bg-[#faeee9] ring-1 ring-[#8b2a18]'
                        : 'border-[#e6d3be] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-[#3d1a15]">
                      <Headphones className="h-4 w-4 text-[#8b2a18]" />
                      <span>Gửi Audio + PDF qua Zalo</span>
                    </div>
                    <p className="mt-1 text-[11px] text-ink-muted">
                      Reader thu âm giải sâu 10–15 phút gửi trong 12–24h. Nghe lại nhiều lần.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryFormat('live_slot')}
                    className={`rounded-2xl border p-3 text-left transition ${
                      deliveryFormat === 'live_slot'
                        ? 'border-[#8b2a18] bg-[#faeee9] ring-1 ring-[#8b2a18]'
                        : 'border-[#e6d3be] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-[#3d1a15]">
                      <PhoneCall className="h-4 w-4 text-[#8b2a18]" />
                      <span>Hẹn Call/Chat 1:1 buổi tối</span>
                    </div>
                    <p className="mt-1 text-[11px] text-ink-muted">
                      Trao đổi trực tiếp 30 phút theo khung giờ cố định (19:30 – 22:00).
                    </p>
                  </button>
                </div>

                {deliveryFormat === 'live_slot' && (
                  <div>
                    <label className="block text-xs font-bold text-[#3d1a15] mb-1">
                      Chọn khung giờ mong muốn:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['19:30 - 20:30', '20:30 - 21:30', '21:30 - 22:30'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setPreferredSlot(slot)}
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                            preferredSlot === slot
                              ? 'border-[#8b2a18] bg-[#8b2a18] text-white'
                              : 'border-[#e6d3be] bg-white text-[#3d1a15]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-[#3d1a15] mb-1">
                      Tên / Biệt danh của bạn
                    </label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="VD: Minh Anh (1996)"
                      className="w-full rounded-xl border border-[#e6d3be] bg-white px-3.5 py-2.5 text-sm focus:border-[#8b2a18] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3d1a15] mb-1">
                      Số Zalo liên hệ nhận kết quả
                    </label>
                    <input
                      type="text"
                      required
                      value={zaloContact}
                      onChange={(e) => setZaloContact(e.target.value)}
                      placeholder="VD: 09xx xxx xxx"
                      className="w-full rounded-xl border border-[#e6d3be] bg-white px-3.5 py-2.5 text-sm focus:border-[#8b2a18] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3d1a15] mb-1">
                    Câu hỏi / Bối cảnh bạn muốn Reader soi sâu nhất
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={bookingQuestion}
                    onChange={(e) => setBookingQuestion(e.target.value)}
                    placeholder="VD: Mình đang phân vân có nên nghỉ việc hiện tại vào tháng tới không..."
                    className="w-full rounded-xl border border-[#e6d3be] bg-white px-3.5 py-2.5 text-sm focus:border-[#8b2a18] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#a33a24] via-[#8b2a18] to-[#6e1e12] py-3.5 text-sm font-bold text-amber-50 shadow-temple-red transition hover:brightness-110"
                >
                  <CalendarClock className="h-4 w-4 text-amber-200" />
                  <span>Gửi yêu cầu xem Tarot sâu 1:1</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
