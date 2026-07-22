import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import celestiusLogo from '../assets/Club_logo(compressed).png';
import promptVerseLogo from '../assets/prompt-verse-2-dark-logo-wbg-minimal(compressed).png';
import { formatEventDate } from '../utils/formatDate';

interface TemplateProps {
  participantName?: string;
  registerNumber?: string;
  department?: string;
  year?: string;
  email?: string;
  phone?: string;
  eventDate?: string;
  location?: string;
  credentialId?: string;
}

export const PromptVerse2EntryPass: React.FC<TemplateProps> = ({
  participantName = 'Aakash Raj S',
  registerNumber = '210425205139',
  department = 'ECE',
  year = 'II YEAR',
  email = 'saakashraj.it2025@citchennai.edu.in',
  phone = '6875546133',
  eventDate = 'July 10, 2026',
  location = 'CIT Campus',
  credentialId = '2ZEEHTCA'
}) => {
  // Format event date nicely (e.g. July 10, 2026)
  const displayDate = formatEventDate(eventDate);

  // Truncate email if long
  const displayEmail = email.length > 24 ? `${email.substring(0, 21)}...` : email;

  // Barcode pattern widths
  const barcodePattern = [
    2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 1, 3, 2, 4, 1, 2, 1, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2
  ];

  return (
    <div
      id="pass-card-template-render"
      className="relative w-full h-full bg-[#07090C] text-slate-100 p-6 sm:p-7 rounded-3xl shadow-2xl border border-slate-800/80 overflow-hidden font-sans select-none flex flex-col justify-between mx-auto"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Inner Decorative Border */}
      <div className="absolute inset-3 rounded-2xl border border-slate-800/40 pointer-events-none" />

      {/* Top Header Bar with Logos */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-4">
        {/* Celestius Club Logo with Curved Edges */}
        <div className="flex items-center p-1 rounded-xl bg-[#FACC15] shadow-md shadow-amber-500/20 overflow-hidden">
          <img
            src={celestiusLogo}
            alt="Celestius Logo"
            crossOrigin="anonymous"
            className="h-8 sm:h-9 max-w-[130px] object-contain rounded-lg"
            style={{ display: 'block' }}
          />
        </div>

        {/* PromptVerse 2.0 Branding Logo */}
        <div className="flex items-center">
          <img
            src={promptVerseLogo}
            alt="PromptVerse 2.0 Logo"
            crossOrigin="anonymous"
            className="h-9 sm:h-10 max-w-[160px] object-contain drop-shadow-md"
            style={{ display: 'block' }}
          />
        </div>
      </div>

      {/* Main Content Body (Flexbox layout for 100% canvas export stability) */}
      <div className="relative z-10 flex items-center justify-between gap-4 my-auto py-3">
        {/* Left Side (65% width) */}
        <div className="w-[65%] space-y-3 pr-2">
          {/* Row 1 */}
          <div className="flex items-start justify-between gap-2">
            <div className="w-1/2">
              <p className="text-[10px] font-mono font-semibold tracking-wider text-[#10B981] uppercase">PASS HOLDER</p>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] truncate">{participantName}</h3>
            </div>
            <div className="w-1/2">
              <p className="text-[10px] font-mono font-semibold tracking-wider text-[#10B981] uppercase">REG NUMBER</p>
              <p className="text-sm sm:text-base font-bold font-mono text-white tracking-wide">{registerNumber}</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex items-start justify-between gap-2">
            <div className="w-1/2">
              <p className="text-[10px] font-mono font-semibold tracking-wider text-[#10B981] uppercase">DEPARTMENT</p>
              <p className="text-xs sm:text-sm font-bold text-white truncate">{department}</p>
            </div>
            <div className="w-1/2">
              <p className="text-[10px] font-mono font-semibold tracking-wider text-[#10B981] uppercase">YEAR</p>
              <p className="text-xs sm:text-sm font-bold text-white">{year}</p>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex items-start justify-between gap-2">
            <div className="w-1/2">
              <p className="text-[10px] font-mono font-semibold tracking-wider text-[#10B981] uppercase">EMAIL</p>
              <p className="text-[11px] font-mono font-medium text-slate-300 truncate" title={email}>{displayEmail}</p>
            </div>
            <div className="w-1/2">
              <p className="text-[10px] font-mono font-semibold tracking-wider text-[#10B981] uppercase">MOBILE</p>
              <p className="text-[11px] font-mono font-bold text-white">{phone}</p>
            </div>
          </div>

          {/* Row 4 (Registration Date & Secure Tag) */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-[#059669]">
            <span>REG DATE: 20 JUL 2026, 5:43 PM</span>
            <span>[GATEWAY_SECURE]</span>
          </div>
        </div>

        {/* Right Side (35% width with left border) */}
        <div className="w-[35%] border-l border-dashed border-slate-800/90 pl-5 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-[#10B981] shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">{displayDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-[#10B981] shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">{location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Barcode Section */}
      <div className="relative z-10 pt-2 text-center border-t border-slate-800/80 space-y-1">
        {/* Barcode Lines */}
        <div className="flex items-center justify-center gap-[2px] h-9 py-0.5">
          {barcodePattern.map((widthPx, idx) => (
            <div
              key={idx}
              className="h-full bg-[#10B981]"
              style={{ width: `${widthPx * 1.5}px`, display: 'inline-block' }}
            />
          ))}
        </div>

        {/* Barcode Reg Text */}
        <p className="text-[10px] font-mono font-bold tracking-widest text-[#10B981] uppercase">
          PV2 - REG - {registerNumber} - {credentialId}
        </p>
      </div>
    </div>
  );
};
