import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_ENDPOINTS, fetchJson } from '../config/api';
import { getTemplateComponent, TEMPLATE_REGISTRY } from '../templates/TemplateRegistry';
import {
  Users,
  Award,
  Layers,
  Upload,
  Copy,
  Check,
  ExternalLink,
  Download,
  Sparkles,
  Eye
} from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'templates' | 'participants' | 'generate' | 'credentials'>('templates');

  // Preview Template State
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('pv2-entry-pass');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Single Add Participant Form State
  const [partName, setPartName] = useState('');
  const [partReg, setPartReg] = useState('');
  const [partDept, setPartDept] = useState('');
  const [partEmail, setPartEmail] = useState('');
  const [csvText, setCsvText] = useState('');
  const [addingPart, setAddingPart] = useState(false);

  // Generate Credential Form State
  const [selectedGenTemplate, setSelectedGenTemplate] = useState('pv2-entry-pass');
  const [generating, setGenerating] = useState(false);

  const loadEventData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await fetchJson(`${API_ENDPOINTS.events}/${id}`);
      setEvent(data.event);
      setParticipants(data.participants || []);
      setTemplates(data.templates || []);
      setCredentials(data.credentials || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventData();
  }, [id]);

  const handleAddSingleParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName || !partReg || !partDept || !partEmail) return;

    try {
      setAddingPart(true);
      await fetchJson(API_ENDPOINTS.participants, {
        method: 'POST',
        body: JSON.stringify({
          eventId: id,
          name: partName,
          registerNumber: partReg,
          department: partDept,
          email: partEmail
        })
      });

      setPartName('');
      setPartReg('');
      setPartDept('');
      setPartEmail('');
      await loadEventData();
      alert('Participant added successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to add participant');
    } finally {
      setAddingPart(false);
    }
  };

  const handleCsvImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    try {
      setAddingPart(true);
      const lines = csvText.trim().split('\n');
      const parsed = lines.map((line) => {
        const [name, registerNumber, department, email] = line.split(',').map((s) => s.trim());
        return {
          name: name || 'Participant',
          registerNumber: registerNumber || 'REG000',
          department: department || 'General',
          email: email || 'participant@celestius.org'
        };
      });

      await fetchJson(`${API_ENDPOINTS.participants}/bulk`, {
        method: 'POST',
        body: JSON.stringify({
          eventId: id,
          participants: parsed
        })
      });

      setCsvText('');
      await loadEventData();
      alert(`Successfully imported ${parsed.length} participants!`);
    } catch (err: any) {
      alert(err.message || 'Failed to import CSV');
    } finally {
      setAddingPart(false);
    }
  };

  const handleGenerateCredentials = async () => {
    if (participants.length === 0) {
      alert('Please import participants first before generating credentials.');
      return;
    }

    try {
      setGenerating(true);
      const res = await fetchJson(`${API_ENDPOINTS.credentials}/generate`, {
        method: 'POST',
        body: JSON.stringify({
          eventId: id,
          templateKey: selectedGenTemplate
        })
      });

      await loadEventData();
      setActiveTab('credentials');
      alert(`Generated ${res.count} unique credentials successfully!`);
    } catch (err: any) {
      alert(err.message || 'Failed to generate credentials');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (credId: string) => {
    const link = `${window.location.origin}/credential/${credId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(credId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-4 py-12">
        <div className="h-10 w-64 bg-slate-800 rounded animate-pulse" />
        <div className="h-64 bg-slate-800/40 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-16">
        <p className="text-base text-slate-400">Event not found.</p>
        <Link to="/dashboard/events" className="text-purple-400 hover:underline mt-2 inline-block">
          Return to Events
        </Link>
      </div>
    );
  }

  const PreviewComponent = getTemplateComponent(selectedTemplateKey);

  return (
    <div className="space-y-6">
      {/* Event Header Banner */}
      <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 border border-amber-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {event.slug}
              </span>
              <span className="text-xs text-slate-400">
                Organized on {new Date(event.eventDate).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              {event.eventName}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">{event.description}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('generate')}
              className="gradient-button px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Credentials</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-800/80 pt-4 mt-6 overflow-x-auto">
          {[
            { id: 'templates', label: 'Code Templates', icon: Layers, count: templates.length },
            { id: 'participants', label: 'Participants', icon: Users, count: participants.length },
            { id: 'generate', label: 'Issue Credentials', icon: Sparkles },
            { id: 'credentials', label: 'Issued Credentials', icon: Award, count: credentials.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FACC15]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Templates Explorer & Live Preview */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selector List */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white font-['Outfit'] border-b border-slate-800 pb-3">
              Available Event Templates
            </h3>
            <p className="text-xs text-slate-400">Developer-defined React components in code.</p>

            <div className="space-y-2 pt-2">
              {Object.values(TEMPLATE_REGISTRY).map((t) => {
                const isSelected = selectedTemplateKey === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setSelectedTemplateKey(t.key)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-200 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{t.displayName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{t.category} • <code className="text-amber-400">{t.componentName}</code></p>
                    </div>
                    {isSelected && <Eye className="w-4 h-4 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview Display */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-['Outfit']">
                  Live Template Preview
                </h3>
                <p className="text-xs text-slate-400">Rendering template with sample event metadata</p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300 px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40">
                {selectedTemplateKey.toUpperCase()}
              </span>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center justify-center min-h-[400px]">
              <PreviewComponent
                participantName="AAKASH RAJ"
                registerNumber="21CS001"
                department="Computer Science & Engineering"
                eventName={event.eventName}
                eventDate={event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'July 10, 2026'}
                credentialId="CFY-8A2X7M91"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Participants Management */}
      {activeTab === 'participants' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Participant Forms */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white font-['Outfit'] mb-1">Single Entry</h3>
              <p className="text-xs text-slate-400">Add a single participant manually</p>
            </div>

            <form onSubmit={handleAddSingleParticipant} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name *"
                required
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
              />
              <input
                type="text"
                placeholder="Register Number *"
                required
                value={partReg}
                onChange={(e) => setPartReg(e.target.value)}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
              />
              <input
                type="text"
                placeholder="Department *"
                required
                value={partDept}
                onChange={(e) => setPartDept(e.target.value)}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
              />
              <input
                type="email"
                placeholder="Email Address *"
                required
                value={partEmail}
                onChange={(e) => setPartEmail(e.target.value)}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
              />

              <button
                type="submit"
                disabled={addingPart}
                className="w-full gradient-button py-2 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer"
              >
                {addingPart ? 'Adding...' : 'Add Participant'}
              </button>
            </form>

            <div className="border-t border-slate-800 pt-4 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-white font-['Outfit'] mb-1">CSV Batch Upload</h3>
                <p className="text-xs text-slate-400">Paste CSV data: Name, RegisterNo, Department, Email</p>
              </div>

              <form onSubmit={handleCsvImport} className="space-y-3">
                <textarea
                  rows={4}
                  placeholder={`John Doe, 21CS001, CSE, john@celestius.org\nJane Smith, 21AI042, AI, jane@celestius.org`}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs font-mono"
                />
                <button
                  type="submit"
                  disabled={addingPart}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-purple-400" />
                  <span>Import CSV Batch</span>
                </button>
              </form>
            </div>
          </div>

          {/* Participants Table */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-['Outfit']">
                Event Participants ({participants.length})
              </h3>
            </div>

            {participants.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No participants imported yet. Use the form on the left to add participants.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Reg No</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {participants.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-900/40 text-slate-300">
                        <td className="py-2.5 px-3 font-bold text-white">{p.name}</td>
                        <td className="py-2.5 px-3 font-mono text-purple-300">{p.registerNumber}</td>
                        <td className="py-2.5 px-3">{p.department}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-400">{p.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Issue Credentials */}
      {activeTab === 'generate' && (
        <div className="max-w-2xl mx-auto glass-panel rounded-3xl p-8 border border-purple-500/30 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400 shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white font-['Outfit']">Generate Credential IDs</h2>
            <p className="text-xs text-slate-400">
              System will issue unique IDs (format <code className="text-purple-300">CFY-8A2X7M91</code>) for all participants in {event.eventName}.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Credential Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.values(TEMPLATE_REGISTRY).map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setSelectedGenTemplate(t.key)}
                    className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      selectedGenTemplate === t.key
                        ? 'bg-purple-600/25 border-purple-500 text-white font-bold shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="font-bold">{t.displayName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t.category}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Target Event:</span>
                <span className="font-bold text-white">{event.eventName}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Target Participants:</span>
                <span className="font-bold text-purple-400">{participants.length} Registered</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Dynamic PDF Stream:</span>
                <span className="font-bold text-emerald-400">On-the-Fly Ready</span>
              </div>
            </div>

            <button
              onClick={handleGenerateCredentials}
              disabled={generating || participants.length === 0}
              className="w-full gradient-button py-3.5 rounded-xl text-sm font-bold text-white shadow-xl cursor-pointer flex items-center justify-center gap-2"
            >
              {generating ? (
                <span>Generating Unique Credential IDs...</span>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Generate Credentials Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Issued Credentials Table */}
      {activeTab === 'credentials' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-['Outfit']">
                Issued Credential Links ({credentials.length})
              </h3>
              <p className="text-xs text-slate-400">Share public verification links with participants</p>
            </div>
          </div>

          {credentials.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No credentials generated yet for this event. Switch to the "Issue Credentials" tab.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Credential ID</th>
                    <th className="py-2.5 px-3">Participant</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Public Link</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {credentials.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-900/40 text-slate-300">
                      <td className="py-2.5 px-3 font-mono font-bold text-purple-400">{c.credentialId}</td>
                      <td className="py-2.5 px-3 font-bold text-white">{c.participantId?.name || 'N/A'}</td>
                      <td className="py-2.5 px-3 capitalize">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-purple-300 border border-slate-700">
                          {c.templateKey}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                        /credential/{c.credentialId}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => copyToClipboard(c.credentialId)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Copy Public Link"
                          >
                            {copiedId === c.credentialId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <a
                            href={`/credential/${c.credentialId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 transition-colors"
                            title="Open Public Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <a
                            href={API_ENDPOINTS.pdf(c.credentialId)}
                            download
                            className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 transition-colors"
                            title="Download Dynamic PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
