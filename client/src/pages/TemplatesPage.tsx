import React, { useState } from 'react';
import { TEMPLATE_REGISTRY } from '../templates/TemplateRegistry';
import { Eye, Code, Sparkles } from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('pv2-entry-pass');
  const templateList = Object.values(TEMPLATE_REGISTRY);

  const activeTemplate = TEMPLATE_REGISTRY[selectedKey] || templateList[0];
  const PreviewComponent = activeTemplate.component;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Outfit']">Developer Template Registry</h1>
          <p className="text-xs text-slate-400">
            Registered React code templates created manually in code under <code className="text-purple-300">/src/templates</code>
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-semibold text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Developer-Defined Architecture</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Cards List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Registered Templates ({templateList.length})
          </h3>

          {templateList.map((t) => {
            const isSelected = selectedKey === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setSelectedKey(t.key)}
                className={`w-full text-left p-4 rounded-2xl border text-xs transition-all cursor-pointer group ${
                  isSelected
                    ? 'glass-panel-glow border-purple-500/50 text-white shadow-xl'
                    : 'glass-panel border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                    {t.displayName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-purple-300 font-semibold border border-slate-700">
                    {t.category}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-1">{t.description}</p>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Component: {t.componentName}</span>
                  {isSelected && <Eye className="w-3.5 h-3.5 text-purple-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Rendering Container */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white font-['Outfit']">
                  {activeTemplate.displayName}
                </h2>
                <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40">
                  {activeTemplate.key}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{activeTemplate.description}</p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Code className="w-4 h-4 text-amber-400" />
              <span>/src/templates/{activeTemplate.componentName}.tsx</span>
            </div>
          </div>

          <div className="p-6 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center justify-center min-h-[460px]">
            <PreviewComponent
              participantName="AAKASH RAJ"
              registerNumber="21CS001"
              department="Computer Science & Engineering"
              eventName="PromptVerse 2.0"
              eventDate="July 10, 2026"
              credentialId="CFY-8A2X7M91"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
