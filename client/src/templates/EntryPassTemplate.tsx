import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import celestiusLogo from '../assets/Club_logo(compressed).png';
import promptVerseLogo from '../assets/prompt-verse-2-dark-logo-wbg-minimal(compressed).png';

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

export const EntryPassTemplate: React.FC<TemplateProps> = ({
  participantName = 'Aakash Raj S',
  registerNumber = '210425205139',
  department = 'ECE',
  year = 'II YEAR',
  email = 'saakashraj.it2025@citchennai.edu.in',
  phone = '6875546133',
  eventDate = '21/07/2026',
  location = 'CIT Campus',
  credentialId = '2ZEEHTCA'
}) => {
  // Truncate email if long
  const displayEmail = email.length > 25 ? `${email.substring(0, 22)}...` : email;

  // Fake simulated barcode lines
  const barcodePattern = [
    2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 1, 3, 2, 4, 1, 2, 1, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2
  ];

  return (
    <div className="relative w-full max-w-2xl aspect-[1.58/1] bg-[#07090C] text-slate-100 p-6 sm:p-7 rounded-3xl shadow-2xl border border-slate-800/80 overflow-hidden font-sans select-none flex flex-col justify-between mx-auto">
      {/* Subtle Inner Border Ring */}
      <div className="absolute inset-3 rounded-2xl border border-slate-800/40 pointer-events-none" />

      {/* Top Header Bar with Logos */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-4">
        {/* Celestius Club Logo */}
        <div className="flex items-center">
          <img
            src={celestiusLogo}
            alt="Celestius Logo"
            className="h-9 sm:h-10 max-w-[140px] object-contain drop-shadow-md"
          />
        </div>

        {/* PromptVerse 2.0 Branding Logo */}
        <div className="flex items-center">
          <img
            src={promptVerseLogo}
            alt="PromptVerse 2.0 Logo"
            className="h-9 sm:h-10 max-w-[160px] object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="relative z-10 grid grid-cols-12 gap-6 my-auto py-2">
        {/* Left Column (Participant Details) */}
        <div className="col-span-8 space-y-3.5 pr-2">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] font-mono font-semibold tracking-wider text-[#10B981] uppercase">PASS HOLDER</p>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] truncate">{participantName}</h3>
            </div>
            <div>
              <p className="text-[10px] font-mono font-semibold tracking-wider text-[#10B981] uppercase">REG NUMBER</p>
              <p className="text-sm sm:text-base font-bold font-mono text-white tracking-wide">{registerNumber}</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] font-mono font-semibold tracking-wider text-[#10B981] uppercase">DEPARTMENT</p>
              <p className="text-xs sm:text-sm font-bold text-white">{department}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono font-semibold tracking-wider text-[#10B981] uppercase">YEAR</p>
              <p className="text-xs sm:text-sm font-bold text-white">{year}</p>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] font-mono font-semibold tracking-wider text-[#10B981] uppercase">EMAIL</p>
              <p className="text-[11px] font-mono font-medium text-slate-300 truncate" title={email}>{displayEmail}</p>
            </div>
            <div>
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

        {/* Vertical Dashed Separator & Right Column (Event Info) */}
        <div className="col-span-4 border-l border-dashed border-slate-800/90 pl-6 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-[#10B981] shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">{eventDate}</p>
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
        {/* Simulated Barcode Lines */}
        <div className="flex items-center justify-center gap-[2px] h-9 py-0.5">
          {barcodePattern.map((widthPx, idx) => (
            <div
              key={idx}
              className="h-full bg-[#10B981]"
              style={{ width: `${widthPx * 1.5}px` }}
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
