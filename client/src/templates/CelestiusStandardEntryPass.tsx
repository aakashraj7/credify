import React from 'react';
import { Calendar, MapPin, Sparkles } from 'lucide-react';
import celestiusLogo from '../assets/Club_logo(compressed).png';

interface TemplateProps {
  participantName?: string;
  registerNumber?: string;
  department?: string;
  year?: string;
  email?: string;
  phone?: string;
  eventName?: string;
  eventDate?: string;
  location?: string;
  credentialId?: string;
}

export const CelestiusStandardEntryPass: React.FC<TemplateProps> = ({
  participantName = 'Aakash Raj S',
  registerNumber = '210425205139',
  department = 'ECE',
  year = 'II YEAR',
  email = 'saakashraj.it2025@citchennai.edu.in',
  phone = '6875546133',
  eventName = 'Celestius TechSummit',
  eventDate = '10 July 2026',
  location = 'CIT Campus',
  credentialId = '2ZEEHTCA'
}) => {
  const displayEmail = email.length > 24 ? `${email.substring(0, 21)}...` : email;

  const barcodePattern = [
    2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 1, 3, 2, 4, 1, 2, 1, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2
  ];

  return (
    <div
      id="pass-card-template-render"
      className="relative w-full h-full bg-[#090D16] text-slate-100 p-6 sm:p-7 rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden font-sans select-none flex flex-col justify-between mx-auto"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Inner Decorative Border */}
      <div className="absolute inset-3 rounded-2xl border border-amber-500/20 pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-4">
        {/* Curved Celestius Logo */}
        <div className="flex items-center p-1 rounded-xl bg-[#FACC15] shadow-md shadow-amber-500/20 overflow-hidden">
          <img
            src={celestiusLogo}
            alt="Celestius Logo"
            crossOrigin="anonymous"
            className="h-8 sm:h-9 max-w-[130px] object-contain rounded-lg"
            style={{ display: 'block' }}
          />
        </div>

        {/* Dynamic Event Name Badge */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-extrabold text-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{eventName.toUpperCase()}</span>
        </div>
      </div>

      {/* Main Content Body (Flexbox layout) */}
      <div className="relative z-10 flex items-center justify-between gap-4 my-auto py-3">
        {/* Left Side (65% width) */}
        <div className="w-[65%] space-y-3 pr-2">
          {/* Row 1 */}
          <div className="flex items-start justify-between gap-2">
            <div className="w-1/2">
              <p className="text-[10px] font-mono font-semibold tracking-wider text-amber-400 uppercase">PASS HOLDER</p>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] truncate">{participantName}</h3>
            </div>
            <div className="w-1/2">
              <p className="text-[10px] font-mono font-semibold tracking-wider text-amber-400 uppercase">REG NUMBER</p>
              <p className="text-sm sm:text-base font-bold font-mono text-white tracking-wide">{registerNumber}</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex items-start justify-between gap-2">
            <div className="w-1/2">
              <p className="text-[10px] font-mono font-semibold tracking-wider text-amber-400 uppercase">DEPARTMENT</p>
              <p className="text-xs sm:text-sm font-bold text-white truncate">{department}</p>
            </div>
            <div className="w-1/2">
              <p className="text-[10px] font-mono font-semibold tracking-wider text-amber-400 uppercase">YEAR</p>
              <p className="text-xs sm:text-sm font-bold text-white">{year}</p>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex items-start justify-between gap-2">
            <div className="w-1/2">
              <p className="text-[10px] font-mono font-semibold tracking-wider text-amber-400 uppercase">EMAIL</p>
              <p className="text-[11px] font-mono font-medium text-slate-300 truncate" title={email}>{displayEmail}</p>
            </div>
            <div className="w-1/2">
              <p className="text-[10px] font-mono font-semibold tracking-wider text-amber-400 uppercase">MOBILE</p>
              <p className="text-[11px] font-mono font-bold text-white">{phone}</p>
            </div>
          </div>

          {/* Row 4 */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-amber-400">
            <span>REG DATE: 20 JUL 2026, 5:43 PM</span>
            <span>[CELESTIUS_SECURE]</span>
          </div>
        </div>

        {/* Right Side (35% width with left border) */}
        <div className="w-[35%] border-l border-dashed border-slate-800/90 pl-5 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">{eventDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
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
        <div className="flex items-center justify-center gap-[2px] h-9 py-0.5">
          {barcodePattern.map((widthPx, idx) => (
            <div
              key={idx}
              className="h-full bg-amber-400"
              style={{ width: `${widthPx * 1.5}px`, display: 'inline-block' }}
            />
          ))}
        </div>

        <p className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
          CFY - PASS - {registerNumber} - {credentialId}
        </p>
      </div>
    </div>
  );
};
