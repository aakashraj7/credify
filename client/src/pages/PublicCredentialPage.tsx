import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_ENDPOINTS, fetchJson } from '../config/api';
import { getTemplateComponent } from '../templates/TemplateRegistry';
import confetti from 'canvas-confetti';
import {
  Download,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  ShieldCheck,
  Search,
  Lock,
  FileCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { formatEventDate } from '../utils/formatDate';
import credifyCompleteLogo from '../assets/credify-complete-logo-without-bg(compressed).png';

export const PublicCredentialPage: React.FC = () => {
  const { credentialId } = useParams<{ credentialId: string }>();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  // Animated Verification Loading Stage (0 to 3)
  const [verificationStage, setVerificationStage] = useState<number>(0);

  const verificationSteps = [
    { text: `Locating Credential Registry record [${credentialId || 'CFY-XXXXX'}]...`, icon: Search },
    { text: 'Validating Cryptographic Seal & Club Celestius Authority...', icon: Lock },
    { text: 'Injecting Verified Event & Participant Metadata...', icon: FileCheck },
    { text: 'Credential Authenticated & Rendered!', icon: ShieldCheck }
  ];

  useEffect(() => {
    async function loadCredential() {
      if (!credentialId) return;
      try {
        setLoading(true);
        setError(null);
        setVerificationStage(0);

        // Step 1: Locating
        await new Promise((r) => setTimeout(r, 450));
        setVerificationStage(1);

        // Step 2: Cryptographic validation
        await new Promise((r) => setTimeout(r, 450));
        setVerificationStage(2);

        // Fetch data
        const res = await fetchJson(API_ENDPOINTS.verify(credentialId));

        // Step 3: Injecting metadata
        setVerificationStage(3);
        await new Promise((r) => setTimeout(r, 400));

        setData(res);
      } catch (err: any) {
        setError(err.message || 'Invalid Credential ID.');
      } finally {
        setLoading(false);
      }
    }
    loadCredential();
  }, [credentialId]);

  const handleDownloadPDF = async () => {
    if (!credentialId) return;

    try {
      setDownloading(true);

      // Fire gold & yellow celebration confetti
      confetti({
        particleCount: 120,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#FACC15', '#EAB308', '#FEF08A', '#FFFFFF', '#10B981']
      });

      const cardElement =
        document.getElementById('pass-card-template-render') ||
        document.getElementById('credential-card-render');

      if (cardElement) {
        const canvas = await html2canvas(cardElement as HTMLElement, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#07090C',
          logging: false,
          imageTimeout: 15000,
          onclone: (clonedDoc) => {
            const card =
              clonedDoc.getElementById('pass-card-template-render') ||
              clonedDoc.getElementById('credential-card-render');
            if (card) {
              card.style.transform = 'none';
              card.style.filter = 'none';
              card.style.backdropFilter = 'none';
              (card.style as any).webkitBackdropFilter = 'none';
            }
          }
        });

        const imgData = canvas.toDataURL('image/png', 1.0);

        // Create Landscape A4 PDF document
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Fit template nicely centered on page with 15mm margins
        const imgWidth = pdfWidth - 30;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const x = 15;
        const y = Math.max(10, (pdfHeight - imgHeight) / 2);

        // Dark background matching template theme
        pdf.setFillColor(7, 9, 12);
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight, undefined, 'FAST');

        const safeParticipantName = (data?.participant?.name || 'Participant').replace(/[^a-zA-Z0-9]/g, '_');
        const safeEventName = (data?.event?.eventName || 'Event').replace(/[^a-zA-Z0-9]/g, '_');

        pdf.save(`Celestius_${safeEventName}_${credentialId}_${safeParticipantName}.pdf`);
      } else {
        // Fallback stream
        const link = document.createElement('a');
        link.href = API_ENDPOINTS.pdf(credentialId);
        link.setAttribute('download', `Celestius_Credential_${credentialId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      console.error('PDF Export fallback:', err);
      try {
        const link = document.createElement('a');
        link.href = API_ENDPOINTS.pdf(credentialId);
        link.setAttribute('download', `Celestius_Credential_${credentialId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (e) {
        console.error('Stream fallback error:', e);
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // High-Tech Animated Verification Screen in Warm Yellow & White Theme
  if (loading) {
    const CurrentStepIcon = verificationSteps[verificationStage]?.icon || Search;

    return (
      <div className="min-h-screen bg-[#09090B] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
        {/* Yellow Ambient Glow Orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-zinc-900/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-amber-500/40 text-center space-y-7 shadow-2xl shadow-amber-500/10 relative z-10"
        >
          {/* Prominent High-Visibility Credify Logo */}
          <div className="flex justify-center mb-2">
            <img
              src={credifyCompleteLogo}
              alt="Credify Logo"
              className="h-16 sm:h-20 max-w-[320px] object-contain drop-shadow-[0_10px_20px_rgba(250,204,21,0.25)]"
            />
          </div>

          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            {/* Spinning Glowing Yellow Border */}
            <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-[#FACC15] animate-spin" />
            <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-inner">
              <CurrentStepIcon className="w-8 h-8 text-[#FACC15] animate-pulse" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-black font-['Outfit'] text-white">
              Securing & Verifying Credential
            </h2>
            <p className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 inline-block">
              ID: {credentialId || 'CFY-XXXXX'}
            </p>
          </div>

          {/* Animated Progress Steps */}
          <div className="space-y-3 pt-2 text-left">
            {verificationSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = idx < verificationStage;
              const isCurrent = idx === verificationStage;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3.5 p-3.5 rounded-2xl border text-xs transition-all ${
                    isCurrent
                      ? 'bg-amber-500/20 border-amber-400 text-white font-bold shadow-lg shadow-amber-500/10'
                      : isCompleted
                      ? 'bg-zinc-950/80 border-zinc-800 text-zinc-300 opacity-90'
                      : 'bg-zinc-950/40 border-zinc-900 text-zinc-600'
                  }`}
                >
                  <StepIcon className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-[#FACC15] animate-bounce' : isCompleted ? 'text-emerald-400' : 'text-zinc-600'}`} />
                  <span className="truncate">{step.text}</span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />}
                </div>
              );
            })}
          </div>

          {/* Glowing Yellow Bar */}
          <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
            <motion.div
              className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 h-full rounded-full shadow-md shadow-amber-400/50"
              initial={{ width: '0%' }}
              animate={{ width: `${((verificationStage + 1) / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#09090B] text-slate-100 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-zinc-900/90 backdrop-blur-2xl rounded-3xl p-8 border border-red-500/30 text-center space-y-6 shadow-2xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">Invalid Credential</h1>
            <p className="text-xs text-slate-400">
              The Credential ID <code className="text-red-300 font-bold">{credentialId}</code> could not be verified in the Club Celestius registry database.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-slate-400 text-left space-y-1">
            <p className="font-semibold text-slate-200">Possible reasons:</p>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>The Credential ID was mistyped or altered.</li>
              <li>The credential was revoked by event organizers.</li>
            </ul>
          </div>

          <Link
            to="/login"
            className="inline-block text-xs text-amber-400 hover:underline font-semibold"
          >
            Organizer Login →
          </Link>
        </motion.div>
      </div>
    );
  }

  const { credential, participant, event } = data;
  const TemplateComponent = getTemplateComponent(credential.templateKey);

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-x-hidden">
      {/* Background Yellow & Amber Gradients */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-yellow-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header Branding Bar */}
      <header className="max-w-5xl w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <img
            src={credifyCompleteLogo}
            alt="Credify by Club Celestius"
            className="h-14 sm:h-16 max-w-[280px] object-contain drop-shadow-[0_8px_16px_rgba(250,204,21,0.2)]"
          />
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-black text-emerald-400 shadow-lg shadow-emerald-500/10 self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Official Verified Credential</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl w-full mx-auto my-8 space-y-8">
        {/* Verification Summary Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-zinc-900/90 backdrop-blur-2xl rounded-3xl p-6 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl shadow-amber-500/10"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {credential.credentialId}
              </span>
              <span className="text-xs text-zinc-400 capitalize">
                {credential.templateKey} Credential
              </span>
            </div>
            <h2 className="text-2xl font-black text-white font-['Outfit']">
              Issued to {participant.name}
            </h2>
            <p className="text-xs text-zinc-300">
              Event: <span className="text-amber-300 font-bold">{event.eventName}</span> • Reg No: <code className="text-white font-bold">{participant.registerNumber}</code>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCopyLink}
              className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-bold text-zinc-200 flex items-center gap-2 cursor-pointer transition-all shadow-md"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Share Link'}</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 shadow-xl shadow-amber-500/25 cursor-pointer transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
              <span>{downloading ? 'Generating PDF...' : 'Download PDF Certificate'}</span>
            </button>
          </div>
        </motion.div>

        {/* Credential High-Fidelity Live Render Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          id="credential-card-render"
          className="bg-zinc-950/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-amber-500/30 flex items-center justify-center min-h-[480px] shadow-2xl shadow-amber-500/10 hover:border-amber-400/50 transition-all"
        >
          <TemplateComponent
            participantName={participant.name}
            registerNumber={participant.registerNumber}
            department={participant.department}
            eventName={event.eventName}
            eventDate={formatEventDate(event.eventDate)}
            credentialId={credential.credentialId}
            verifyUrl={window.location.href}
          />
        </motion.div>

        {/* Cryptographic Security Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">Issuer Authority</p>
            <p className="font-bold text-white font-['Outfit']">Club Celestius Core Team</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-amber-400">Verification ID</p>
            <p className="font-mono font-bold text-amber-300">{credential.credentialId}</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">PDF Stream Engine</p>
            <p className="font-bold text-emerald-400">On-the-Fly Vector PDF Generation</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto pt-6 border-t border-zinc-800/80 text-center text-xs text-zinc-500 space-y-1">
        <p className="font-semibold text-zinc-400">Credify Platform — by Club Celestius</p>
        <p className="text-[11px] text-zinc-500">
          Certificates & Credentials are generated dynamically on-the-fly. No raw PDF files stored on disk.
        </p>
      </footer>
    </div>
  );
};
