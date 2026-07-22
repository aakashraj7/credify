import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Heart, ShieldCheck, Star } from 'lucide-react';

interface TemplateProps {
  participantName: string;
  registerNumber?: string;
  department?: string;
  eventName: string;
  eventDate: string;
  credentialId: string;
  verifyUrl?: string;
}

export const VolunteerTemplate: React.FC<TemplateProps> = ({
  participantName = 'AAKASH RAJ',
  registerNumber = '21CS001',
  department = 'Computer Science & Engineering',
  eventName = 'PromptVerse 3.0',
  eventDate = 'August 15, 2026',
  credentialId = 'CFY-8A2X7M91',
  verifyUrl = `http://localhost:5173/credential/${credentialId}`
}) => {
  return (
    <div className="relative w-full max-w-4xl aspect-[1.414/1] bg-[#0F172A] text-slate-100 p-8 sm:p-12 rounded-2xl shadow-2xl border border-sky-500/30 overflow-hidden font-sans select-none flex flex-col justify-between">
      {/* Ambient Silver/Sky Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
      <div className="absolute inset-4 rounded-xl border border-slate-700 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-widest text-slate-200 uppercase font-['Outfit']">CLUB CELESTIUS</h4>
            <p className="text-xs text-sky-400 font-medium">CERTIFICATE OF APPRECIATION</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-semibold text-sky-300">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>EVENT VOLUNTEER</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="relative z-10 my-auto text-center py-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-sky-300 tracking-wider font-semibold mb-3">
          <Star className="w-3.5 h-3.5 text-sky-400" />
          <span>VOLUNTEER CONTRIBUTION</span>
        </div>

        <p className="text-xs uppercase tracking-widest text-slate-400 font-medium mb-1">PRESENTED WITH GRATITUDE TO</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-sky-200 tracking-tight font-['Outfit'] my-2">
          {participantName}
        </h1>

        <p className="text-xs text-sky-300/90 font-mono mb-4">
          Reg No: {registerNumber} • Dept: {department}
        </p>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          For invaluable dedication, leadership, and volunteer service during <span className="text-white font-semibold">{eventName}</span> organized by Club Celestius on {eventDate}.
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-end justify-between border-t border-slate-800 pt-4 mt-auto">
        <div className="text-left space-y-1">
          <div className="w-32 border-b border-slate-600 pb-1 mb-1">
            <span className="text-xs font-serif italic text-slate-300">Celestius Chair</span>
          </div>
          <p className="text-xs font-bold text-slate-200">Dr. Celestius Chief</p>
          <p className="text-[10px] text-slate-400">Faculty Coordinator</p>
        </div>

        <div className="text-center">
          <div className="p-2 bg-white rounded-xl shadow-lg inline-block">
            <QRCodeSVG value={verifyUrl} size={64} level="M" />
          </div>
          <p className="text-[10px] font-mono text-sky-400 font-bold mt-1">{credentialId}</p>
        </div>

        <div className="text-right space-y-1">
          <div className="w-32 border-b border-slate-600 pb-1 mb-1 ml-auto">
            <span className="text-xs font-serif italic text-slate-300">Club President</span>
          </div>
          <p className="text-xs font-bold text-slate-200">Celestius Event Lead</p>
          <p className="text-[10px] text-slate-400">Club Celestius President</p>
        </div>
      </div>
    </div>
  );
};
