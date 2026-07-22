import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Mic, ShieldCheck, Sparkles } from 'lucide-react';

interface TemplateProps {
  participantName: string;
  registerNumber?: string;
  department?: string;
  eventName: string;
  eventDate: string;
  credentialId: string;
  verifyUrl?: string;
}

export const SpeakerPassTemplate: React.FC<TemplateProps> = ({
  participantName = 'AAKASH RAJ',
  registerNumber = 'VIP-SPEAKER',
  department = 'Keynote Speaker',
  eventName = 'PromptVerse 3.0',
  eventDate = 'August 15, 2026',
  credentialId = 'CFY-8A2X7M91',
  verifyUrl = `http://localhost:5173/credential/${credentialId}`
}) => {
  return (
    <div className="relative w-full max-w-sm aspect-[0.65] bg-[#0F172A] text-slate-100 p-6 rounded-2xl shadow-2xl border border-indigo-500/50 overflow-hidden font-sans select-none flex flex-col justify-between mx-auto">
      {/* VIP Lighting Overlay */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-indigo-600/40 via-purple-600/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* Top Event Branding */}
      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-1 text-[10px] font-bold tracking-widest text-indigo-300 uppercase font-['Outfit'] mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>CLUB CELESTIUS</span>
        </div>
        <h2 className="text-xl font-extrabold text-white tracking-tight font-['Outfit']">
          {eventName}
        </h2>
        <div className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-lg shadow-indigo-500/30">
          <Mic className="w-3.5 h-3.5" />
          <span>VIP SPEAKER ACCESS</span>
        </div>
      </div>

      {/* Speaker Information */}
      <div className="relative z-10 my-auto text-center py-4 bg-slate-900/90 rounded-xl border border-indigo-500/30 p-4 backdrop-blur-md">
        <p className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-1">GUEST SPEAKER</p>
        <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 font-['Outfit']">
          {participantName}
        </h3>
        <p className="text-xs text-indigo-300 font-mono mt-1 font-semibold">{department || 'Keynote Speaker'} • {registerNumber || 'VIP'}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">All-Access Pass</p>
      </div>

      {/* QR Code Security Section */}
      <div className="relative z-10 text-center space-y-2">
        <div className="p-2.5 bg-white rounded-xl shadow-xl inline-block border-2 border-indigo-500">
          <QRCodeSVG value={verifyUrl} size={110} level="M" />
        </div>
        <div>
          <p className="text-xs font-mono font-bold text-indigo-300 tracking-wider">{credentialId}</p>
          <p className="text-[10px] text-slate-400 font-medium">VIP Access Granted • {eventDate}</p>
        </div>
      </div>

      {/* Security Tag */}
      <div className="relative z-10 flex items-center justify-center gap-1 text-[10px] text-slate-400 pt-2 border-t border-slate-800">
        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
        <span>Credify Platform Authenticated</span>
      </div>
    </div>
  );
};
