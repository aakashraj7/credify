import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS, fetchJson } from '../config/api';
import { Search, Copy, Check, ExternalLink, Download } from 'lucide-react';

export const CredentialsPage: React.FC = () => {
  const [credentials, setCredentials] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadCredentials = async () => {
    try {
      setLoading(true);
      const data = await fetchJson(API_ENDPOINTS.credentials);
      setCredentials(data.credentials || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  const copyLink = (credId: string) => {
    const link = `${window.location.origin}/credential/${credId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(credId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = credentials.filter(
    (c) =>
      c.credentialId.toLowerCase().includes(search.toLowerCase()) ||
      c.participantId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.templateKey.toLowerCase().includes(search.toLowerCase()) ||
      c.eventId?.eventName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Outfit']">Issued Credentials</h1>
          <p className="text-xs text-slate-400">Unique Credential IDs generated for Club Celestius events</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by Credential ID (CFY-XXXXX), participant, or event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
        />
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-12 bg-slate-800/40 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No credentials found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">Credential ID</th>
                  <th className="py-3 px-3">Participant</th>
                  <th className="py-3 px-3">Event</th>
                  <th className="py-3 px-3">Template</th>
                  <th className="py-3 px-3">Issued Date</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-900/40 text-slate-300">
                    <td className="py-3 px-3 font-mono font-bold text-amber-300">{c.credentialId}</td>
                    <td className="py-3 px-3 font-bold text-white">{c.participantId?.name || 'N/A'}</td>
                    <td className="py-3 px-3">{c.eventId?.eventName || 'Celestius Event'}</td>
                    <td className="py-3 px-3 capitalize">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                        {c.templateKey}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(c.issuedAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => copyLink(c.credentialId)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Copy Link"
                        >
                          {copiedId === c.credentialId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <a
                          href={`/credential/${c.credentialId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-400 text-amber-300 hover:text-zinc-950 border border-amber-500/40 transition-colors"
                          title="Open Public Credential Page"
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
    </div>
  );
};
