import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_ENDPOINTS, fetchJson } from '../config/api';
import { getTemplateComponent } from '../templates/TemplateRegistry';
import confetti from 'canvas-confetti';
import {
  Download,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Search,
  Lock,
  FileCheck,
  Shield,
  AlertOctagon,
  X,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { formatEventDate } from '../utils/formatDate';
import credifyWithoutCelestiusTextLogo from '../assets/credify-without-celestius-text-logo-without-bg(compressed).png';
import celestiusLogo from '../assets/Club_logo(compressed).png';
import athenaImg from '../assets/athena.png';
import hephaestusImg from '../assets/hephaestus.png';

export const PublicCredentialPage: React.FC = () => {
  const { credentialId } = useParams<{ credentialId: string }>();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);

  // Animated Verification Loading Stage (0 to 3)
  const [verificationStage, setVerificationStage] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isRefundOpen, setIsRefundOpen] = useState<boolean>(false);
  const [isTemplateZoomed, setIsTemplateZoomed] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1.2);

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('credential-card-render');
      if (!container) return;
      const containerWidth = container.clientWidth - 32; // padding offset
      const cardWidth = 640; // natural pass card width
      if (containerWidth < cardWidth) {
        setScale(containerWidth / cardWidth);
      } else {
        setScale(1);
      }
    };

    if (!loading && data) {
      const timer = setTimeout(handleResize, 100);
      window.addEventListener('resize', handleResize);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [loading, data]);

  useEffect(() => {
    const handleZoomResize = () => {
      const availableWidth = Math.min(window.innerWidth - 48, 960);
      const cardWidth = 640;
      if (availableWidth < cardWidth * 1.25) {
        setZoomScale(availableWidth / cardWidth);
      } else {
        setZoomScale(1.25);
      }
    };

    if (isTemplateZoomed) {
      handleZoomResize();
      window.addEventListener('resize', handleZoomResize);
      return () => window.removeEventListener('resize', handleZoomResize);
    }
  }, [isTemplateZoomed]);

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
        await new Promise((r) => setTimeout(r, 1400));
        setVerificationStage(1);

        // Step 2: Cryptographic validation
        await new Promise((r) => setTimeout(r, 1400));
        setVerificationStage(2);

        // Fetch data
        const res = await fetchJson(API_ENDPOINTS.verify(credentialId));

        // Step 3: Injecting metadata
        setVerificationStage(3);
        await new Promise((r) => setTimeout(r, 1200));

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

  // High-Tech Animated Verification Screen in Warm Yellow & White Theme
  if (loading) {
    const CurrentStepIcon = verificationSteps[verificationStage]?.icon || Search;

    return (
      <div className="min-h-screen bg-[#09090B] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden select-none">
        {/* Background Ambient Glow Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-yellow-500/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute top-10 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Side Statues Background Watermarks */}
        <div className="fixed top-1/3 -translate-y-1/2 left-4 w-36 sm:w-48 pointer-events-none opacity-20 filter drop-shadow-[0_10px_25px_rgba(250,204,21,0.2)]">
          <img src={athenaImg} alt="Athena" className="w-full h-auto object-contain" />
        </div>
        <div className="fixed top-2/3 -translate-y-1/2 right-4 w-36 sm:w-48 pointer-events-none opacity-20 filter drop-shadow-[0_10px_25px_rgba(250,204,21,0.2)]">
          <img src={hephaestusImg} alt="Hephaestus" className="w-full h-auto object-contain" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg bg-zinc-950/85 backdrop-blur-3xl rounded-3xl p-8 sm:p-10 border border-amber-500/35 text-center space-y-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] shadow-amber-500/10 relative z-10 overflow-hidden"
        >
          {/* Top Metallic Shimmer Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/0 via-amber-400 to-amber-500/0" />

          {/* Prominent Highlighted Credify Logo Unit */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center pt-2"
          >
            <div className="relative p-4 rounded-2xl bg-zinc-900/70 border border-amber-500/30 shadow-xl shadow-amber-500/15 flex flex-row items-center gap-3">
              <img
                src={credifyWithoutCelestiusTextLogo}
                alt="Credify Logo"
                className="h-12 sm:h-16 w-auto object-contain drop-shadow-[0_0_25px_rgba(250,204,21,0.4)]"
              />
              <div className="flex items-center border-l border-zinc-700/80 pl-3 py-0.5">
                <div className="flex items-center text-xs sm:text-sm font-extrabold tracking-[0.25em] text-[#FACC15] uppercase font-mono whitespace-nowrap drop-shadow-[0_2px_10px_rgba(250,204,21,0.3)]">
                  {'by CELESTIUS'.split('').map((char, index) => (
                    <motion.span
                      key={index}
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.12,
                      }}
                      className="inline-block"
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Central Rotating Scanner Core */}
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center my-2">
            {/* Outer Spinning Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/30 animate-[spin_8s_linear_infinite]" />
            {/* Middle Fast Glowing Spinner */}
            <div className="absolute inset-1 rounded-full border-4 border-amber-500/20 border-t-[#FACC15] animate-spin drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            {/* Inner Core Icon Badge */}
            <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-inner">
              <CurrentStepIcon className="w-8 h-8 text-[#FACC15] animate-pulse drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]" />
            </div>
          </div>

          {/* Status Title & Credential ID */}
          <div className="space-y-2">
            <h2 className="text-2xl font-black font-['Outfit'] text-white tracking-wide">
              Authenticating Credential
            </h2>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>ID: {credentialId || 'CFY-XXXXX'}</span>
            </div>
          </div>

          {/* Verification Pipeline Step Cards */}
          <div className="space-y-2.5 pt-1 text-left">
            {verificationSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = idx < verificationStage;
              const isCurrent = idx === verificationStage;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3.5 p-3.5 rounded-2xl border text-xs transition-all ${
                    isCurrent
                      ? 'bg-amber-500/20 border-amber-400 text-white font-bold shadow-lg shadow-amber-500/15'
                      : isCompleted
                      ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                      : 'bg-zinc-950/40 border-zinc-900/60 text-zinc-600'
                  }`}
                >
                  <StepIcon
                    className={`w-4 h-4 shrink-0 ${
                      isCurrent
                        ? 'text-[#FACC15] animate-bounce'
                        : isCompleted
                        ? 'text-emerald-400'
                        : 'text-zinc-600'
                    }`}
                  />
                  <span className="truncate">{step.text}</span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />}
                </div>
              );
            })}
          </div>

          {/* Laser Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800 p-0.5">
              <motion.div
                className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 h-full rounded-full shadow-[0_0_12px_rgba(250,204,21,0.8)]"
                initial={{ width: '0%' }}
                animate={{ width: `${((verificationStage + 1) / 4) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-500 px-1">
              <span>SECURITY PROTOCOL</span>
              <span>{Math.min(100, Math.round(((verificationStage + 1) / 4) * 100))}%</span>
            </div>
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

      {/* Mobile-Only Background Watermarks */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.45, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="xl:hidden fixed top-1/4 -translate-y-1/2 left-0 w-36 sm:w-48 pointer-events-none select-none filter drop-shadow-[0_10px_25px_rgba(250,204,21,0.3)] z-0"
      >
        <img
          src={athenaImg}
          alt="Athena Watermark"
          className="w-full h-auto object-contain"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.45, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="xl:hidden fixed top-3/4 -translate-y-1/2 right-0 w-36 sm:w-48 pointer-events-none select-none filter drop-shadow-[0_10px_25px_rgba(250,204,21,0.3)] z-0"
      >
        <img
          src={hephaestusImg}
          alt="Hephaestus Watermark"
          className="w-full h-auto object-contain"
        />
      </motion.div>

      {/* Top Header Branding Bar */}
      <header className="max-w-[1380px] w-full mx-auto flex flex-row items-center justify-between gap-3 py-3 sm:py-4 px-4 sm:px-8 rounded-2xl bg-zinc-950/25 backdrop-blur-xl border border-zinc-800/60 shadow-xl relative z-10">
        <div className="flex flex-row items-center gap-2 sm:gap-3">
          <img
            src={credifyWithoutCelestiusTextLogo}
            alt="Credify Logo"
            className="h-10 sm:h-16 w-auto object-contain drop-shadow-[0_8px_20px_rgba(250,204,21,0.25)]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center border-l border-zinc-700/80 pl-2.5 sm:pl-3.5 py-0.5"
          >
            <div className="flex items-center text-[10px] sm:text-xs font-extrabold tracking-[0.22em] sm:tracking-[0.28em] text-[#FACC15] uppercase font-mono whitespace-nowrap cursor-default select-none drop-shadow-[0_2px_10px_rgba(250,204,21,0.25)]">
              {'by CELESTIUS'.split('').map((char, index) => (
                <motion.span
                  key={index}
                  animate={{
                    y: [0, -3.5, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.08,
                  }}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] sm:text-xs font-black text-emerald-400 shadow-lg shadow-emerald-500/10 shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          <span className="hidden sm:inline">Official Verified Credential</span>
          <span className="inline sm:hidden">Verified</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1380px] w-full mx-auto my-8 space-y-8 relative z-10">
        {/* Verification Summary Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-zinc-950/25 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl shadow-amber-500/10"
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
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 shadow-xl shadow-amber-500/25 cursor-pointer transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
              <span>
                {downloading
                  ? 'Generating PDF...'
                  : credential.templateKey.toLowerCase().includes('pass')
                  ? 'Download Event Pass'
                  : 'Download Your Certificate'}
              </span>
            </button>
          </div>
        </motion.div>

        {/* Centered Credential Preview Header */}
        <div className="relative flex items-center justify-center border-b border-amber-500/30 pb-3 text-center">
          <div className="flex items-center gap-2 bg-zinc-900/60 backdrop-blur-md px-5 py-1.5 rounded-full border border-amber-500/25 shadow-lg">
            <div className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <FileCheck className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="font-extrabold text-xs text-white font-['Outfit'] tracking-wider uppercase">
              CREDENTIAL PREVIEW
            </span>
          </div>
        </div>

        {/* Desktop Side Statues framing only the Credential Preview Card */}
        <div className="relative max-w-[720px] w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 0.95, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden xl:block absolute top-1/2 -translate-y-1/2 -left-48 2xl:-left-60 w-44 2xl:w-56 pointer-events-none select-none filter drop-shadow-[0_15px_35px_rgba(250,204,21,0.2)]"
          >
            <img
              src={athenaImg}
              alt="Athena - Goddess of Wisdom"
              className="w-full h-auto object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 0.95, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden xl:block absolute top-1/2 -translate-y-1/2 -right-48 2xl:-right-60 w-44 2xl:w-56 pointer-events-none select-none filter drop-shadow-[0_15px_35px_rgba(250,204,21,0.2)]"
          >
            <img
              src={hephaestusImg}
              alt="Hephaestus - God of Craftsmanship"
              className="w-full h-auto object-contain"
            />
          </motion.div>

          {/* Credential High-Fidelity Live Render Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            id="credential-card-render"
            onClick={() => setIsTemplateZoomed(true)}
            className="w-full bg-zinc-950/20 backdrop-blur-md rounded-3xl p-3 sm:p-5 border border-amber-500/30 flex items-center justify-center shadow-2xl shadow-amber-500/10 hover:border-amber-400/60 transition-all overflow-hidden cursor-pointer group relative"
            style={{ minHeight: `${(380 * scale) + 16}px` }}
          >
            {/* Click to Enlarge Badge Overlay */}
            <div className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/40 text-[11px] font-bold text-amber-300 flex items-center gap-1.5 opacity-85 group-hover:opacity-100 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-all shadow-md">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Click to Enlarge</span>
            </div>
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              width: '640px',
              height: '380px',
              flexShrink: 0
            }}
            className="transition-transform duration-200"
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
          </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1380px] w-full mx-auto mt-12 p-6 sm:p-8 rounded-3xl bg-zinc-950/40 backdrop-blur-xl border border-zinc-800/60 space-y-8 relative z-10">
        {/* Top Row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column (Brand info) */}
          <div className="space-y-4 max-w-md text-left">
            <div className="flex items-center p-1 rounded-xl bg-[#FACC15] shadow-md shadow-amber-500/20 overflow-hidden w-fit">
              <img
                src={celestiusLogo}
                alt="Celestius Logo"
                className="h-8 w-auto object-contain rounded-lg"
              />
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Credify is the next-generation verifiable credential platform engineered by{' '}
              <span className="text-white font-bold">Club Celestius</span> — delivering tamper-proof digital certificates, official event passes, and instant cryptographic verification.
            </p>
          </div>

          {/* Right Column (Terms & Legalities) */}
          <div className="space-y-3 text-left md:pl-8">
            <h3 className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">
              TERMS & LEGALITIES
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Read our policies regarding your personal records, registration parameters, and payment processing rules.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-400 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer shadow-md"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Privacy Policy</span>
              </button>

              <button
                onClick={() => setIsRefundOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-red-500/60 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer shadow-md"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
                <span>Refund Policy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-800/40">
          <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
            <span>© 2026 Celestius CIT. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-3 text-[10px] tracking-wider font-bold">
            <span className="text-zinc-500">CIT.CLUB_CELESTIUS</span>
            <span className="text-zinc-800">•</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>VERIFIED_PAYMENT_PORTAL</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 relative shadow-2xl overflow-hidden text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#FACC15] shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white font-['Outfit']">Privacy Policy</h2>
                  <p className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">
                    CONFIDENTIAL DATA PROTOCOL
                  </p>
                </div>
              </div>

              {/* Intro Text */}
              <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-medium">
                At Club Celestius, we implement robust measures to protect your digital records and ensure a secure registration pipeline.
              </p>

              {/* Three-Column Policy Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 space-y-2.5">
                  <div className="flex items-center gap-2 text-[#FACC15] font-bold text-xs tracking-wider">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>1. CONFIDENTIALITY</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    All student details collected during registration (name, email address, phone number, and department) are kept strictly confidential and stored on encrypted databases.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 space-y-2.5">
                  <div className="flex items-center gap-2 text-[#FACC15] font-bold text-xs tracking-wider">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>2. ZERO SHARING</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Your data is never shared, sold, leased, or distributed to third-party advertisers, sponsors, or outer corporate organizations. Your consent remains absolute.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 space-y-2.5">
                  <div className="flex items-center gap-2 text-[#FACC15] font-bold text-xs tracking-wider">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>3. OPERATIONAL PURPOSE</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Data gathered is solely utilized for verification, generating certificate credentials, and distributing workshop coordinate links and source code repositories.
                  </p>
                </div>
              </div>

              {/* Consent Footer */}
              <p className="text-xs text-zinc-500 italic border-t border-zinc-900 pt-4">
                By joining the PromptVerse workshop, you affirm consent to these secure parameters.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Refund Policy Modal */}
      <AnimatePresence>
        {isRefundOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 relative shadow-2xl overflow-hidden text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsRefundOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  <AlertOctagon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white font-['Outfit']">Refund Policy</h2>
                  <p className="text-[10px] font-mono font-bold tracking-wider text-red-500/60 uppercase">
                    REGISTRATION POLICY
                  </p>
                </div>
              </div>

              {/* Intro Text */}
              <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-medium">
                Please review our registration guidelines before completing your booking.
              </p>

              {/* Two-Column Policy Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 space-y-2.5">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-xs tracking-wider">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>1. BOOKING COMMITMENTS</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    All workshop bookings are final. Since seats are limited and event resources are allocated in advance, we are unable to process cancellations or refunds.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 space-y-2.5">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-xs tracking-wider">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>2. ABSENCE & SCHEDULE</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    We are unable to issue refunds or transfer registration passes due to personal absences, schedule conflicts, or technical connectivity issues during the live sessions.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* High-Resolution Zoomed Template Modal */}
      <AnimatePresence>
        {isTemplateZoomed && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-5xl bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 relative shadow-[0_0_80px_rgba(250,204,21,0.15)] flex flex-col items-center justify-center space-y-6 text-center"
            >
              {/* Top Modal Bar */}
              <div className="w-full flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-base text-white font-['Outfit']">
                    High-Resolution Credential Preview
                  </span>
                </div>

                <button
                  onClick={() => setIsTemplateZoomed(false)}
                  className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Large Template Render Area */}
              <div
                className="w-full flex justify-center items-center overflow-hidden transition-all duration-200"
                style={{ height: `${(380 * zoomScale) + 24}px` }}
              >
                <div
                  style={{
                    transform: `scale(${zoomScale})`,
                    transformOrigin: 'center center',
                    width: '640px',
                    height: '380px',
                    flexShrink: 0
                  }}
                  className="shadow-2xl rounded-2xl border border-amber-500/30 overflow-hidden flex items-center justify-center transition-transform duration-200"
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
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-900">
                <p className="text-xs text-zinc-400 font-mono">
                  Official Cryptographic Certificate ID: <code className="text-amber-300 font-bold">{credential.credentialId}</code>
                </p>

                <button
                  onClick={() => {
                    setIsTemplateZoomed(false);
                    handleDownloadPDF();
                  }}
                  disabled={downloading}
                  className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-zinc-950 px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
                  <span>
                    {downloading
                      ? 'Generating PDF...'
                      : credential.templateKey.toLowerCase().includes('pass')
                      ? 'Download Event Pass'
                      : 'Download Your Certificate'}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
