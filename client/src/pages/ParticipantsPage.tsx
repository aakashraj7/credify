import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS, fetchJson } from '../config/api';
import { Search, Trash2 } from 'lucide-react';

export const ParticipantsPage: React.FC = () => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const data = await fetchJson(API_ENDPOINTS.participants);
      setParticipants(data.participants || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this participant?')) return;
    try {
      await fetchJson(`${API_ENDPOINTS.participants}/${id}`, { method: 'DELETE' });
      await loadParticipants();
    } catch (err: any) {
      alert(err.message || 'Failed to delete participant');
    }
  };

  const filtered = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.registerNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Outfit']">Participants Directory</h1>
          <p className="text-xs text-slate-400">All registered participants across Club Celestius events</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by name, reg number, department, or email..."
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
            No participants found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">Participant Name</th>
                  <th className="py-3 px-3">Register Number</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Event</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-900/40 text-slate-300">
                    <td className="py-3 px-3 font-bold text-white">{p.name}</td>
                    <td className="py-3 px-3 font-mono text-amber-300 font-bold">{p.registerNumber}</td>
                    <td className="py-3 px-3">{p.department}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{p.email}</td>
                    <td className="py-3 px-3 font-semibold text-slate-200">
                      {p.eventId?.eventName || 'Celestius Event'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                        title="Delete Participant"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
