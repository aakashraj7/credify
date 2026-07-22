import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';

interface TemplateProps {
  participantName: string;
  registerNumber?: string;
  department?: string;
  eventName: string;
  eventDate: string;
  credentialId: string;
  verifyUrl?: string;
}

export const ParticipationTemplate: React.FC<TemplateProps> = ({
  participantName = 'AAKASH RAJ',
  registerNumber = '21CS001',
  department = 'Computer Science & Engineering',
  eventName = 'PromptVerse 3.0',
  eventDate = 'August 15, 2026',
  credentialId = 'CFY-8A2X7M91',
  verifyUrl = `http://localhost:5173/credential/${credentialId}`
}) => {
  return (
    <div className="relative w-full max-w-4xl aspect-[1.414/1] bg-[#0F172A] text-slate-100 p-8 sm:p-12 rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden font-sans select-none flex flex-col justify-between">
      {/* Background Decorative Gradients & Mesh */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-0 pointer-events-none" />
      <div className="absolute inset-4 rounded-xl border border-slate-700/60 pointer-events-none" />
      <div className="absolute inset-5 rounded-lg border border-purple-500/20 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-widest text-slate-200 uppercase font-['Outfit']">CLUB CELESTIUS</h4>
            <p className="text-xs text-purple-400 font-medium">OFFICIAL EVENT CREDENTIAL</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-semibold text-purple-300">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>VERIFIED CERTIFICATE</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="relative z-10 my-auto text-center py-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 tracking-wider font-semibold mb-3">
          <Award className="w-3.5 h-3.5 text-purple-400" />
          <span>CERTIFICATE OF PARTICIPATION</span>
        </div>

        <p className="text-xs uppercase tracking-widest text-slate-400 font-medium mb-1">PROUDLY PRESENTED TO</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-purple-200 tracking-tight font-['Outfit'] my-2">
          {participantName}
        </h1>

        <p className="text-xs text-purple-300/90 font-mono mb-4">
          Reg No: {registerNumber} • Dept: {department}
        </p>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          For active participation and successful contribution during <span className="text-white font-semibold">{eventName}</span> organized by Club Celestius on {eventDate}.
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
          <p className="text-[10px] font-mono text-purple-400 font-bold mt-1">{credentialId}</p>
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
