import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Trophy, Crown, Sparkles } from 'lucide-react';

interface TemplateProps {
  participantName: string;
  registerNumber?: string;
  department?: string;
  eventName: string;
  eventDate: string;
  credentialId: string;
  verifyUrl?: string;
}

export const WinnerTemplate: React.FC<TemplateProps> = ({
  participantName = 'AAKASH RAJ',
  registerNumber = '21CS001',
  department = 'Computer Science & Engineering',
  eventName = 'PromptVerse 3.0',
  eventDate = 'August 15, 2026',
  credentialId = 'CFY-8A2X7M91',
  verifyUrl = `http://localhost:5173/credential/${credentialId}`
}) => {
  return (
    <div className="relative w-full max-w-4xl aspect-[1.414/1] bg-[#0F172A] text-slate-100 p-8 sm:p-12 rounded-2xl shadow-2xl border border-amber-500/40 overflow-hidden font-sans select-none flex flex-col justify-between">
      {/* Background Gold Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl -z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
      <div className="absolute inset-4 rounded-xl border border-amber-500/40 pointer-events-none" />
      <div className="absolute inset-5 rounded-lg border border-amber-500/20 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/25 text-slate-950 font-bold">
            <Trophy className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-widest text-amber-400 uppercase font-['Outfit']">CLUB CELESTIUS</h4>
            <p className="text-xs text-amber-200/80 font-medium">CERTIFICATE OF EXCELLENCE</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-xs font-bold text-amber-300">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>WINNER / TOP PERFORMER</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="relative z-10 my-auto text-center py-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 tracking-wider font-bold mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>OUTSTANDING ACHIEVEMENT AWARD</span>
        </div>

        <p className="text-xs uppercase tracking-widest text-amber-200/70 font-medium mb-1">THIS HONOR IS AWARDED TO</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 tracking-tight font-['Outfit'] my-2">
          {participantName}
        </h1>

        <p className="text-xs text-amber-200/90 font-mono mb-4">
          Reg No: {registerNumber} • Dept: {department}
        </p>

        <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
          In recognition of securing top honors and demonstrating exceptional technical mastery in <span className="text-amber-300 font-semibold">{eventName}</span> organized by Club Celestius on {eventDate}.
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-end justify-between border-t border-amber-500/20 pt-4 mt-auto">
        <div className="text-left space-y-1">
          <div className="w-32 border-b border-amber-500/40 pb-1 mb-1">
            <span className="text-xs font-serif italic text-amber-200/80">Celestius Chair</span>
          </div>
          <p className="text-xs font-bold text-slate-100">Dr. Celestius Chief</p>
          <p className="text-[10px] text-slate-400">Faculty Coordinator</p>
        </div>

        <div className="text-center">
          <div className="p-2 bg-white rounded-xl shadow-lg inline-block border-2 border-amber-400">
            <QRCodeSVG value={verifyUrl} size={64} level="M" />
          </div>
          <p className="text-[10px] font-mono text-amber-400 font-bold mt-1">{credentialId}</p>
        </div>

        <div className="text-right space-y-1">
          <div className="w-32 border-b border-amber-500/40 pb-1 mb-1 ml-auto">
            <span className="text-xs font-serif italic text-amber-200/80">Club President</span>
          </div>
          <p className="text-xs font-bold text-slate-100">Celestius Event Lead</p>
          <p className="text-[10px] text-slate-400">Club Celestius President</p>
        </div>
      </div>
    </div>
  );
};
