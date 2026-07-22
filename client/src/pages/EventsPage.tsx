import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS, fetchJson } from '../config/api';
import {
  Plus,
  Search,
  Calendar,
  ArrowRight,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New Event Form State
  const [eventName, setEventName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('2026-08-15');
  const [creating, setCreating] = useState<boolean>(false);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchJson(API_ENDPOINTS.events);
      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) return;

    try {
      setCreating(true);
      await fetchJson(API_ENDPOINTS.events, {
        method: 'POST',
        body: JSON.stringify({
          eventName,
          description,
          eventDate,
          createdBy: 'Club Celestius Organizer'
        })
      });

      setEventName('');
      setDescription('');
      setIsModalOpen(false);
      await loadEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to create event');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this event and all associated credentials?')) return;

    try {
      await fetchJson(`${API_ENDPOINTS.events}/${eventId}`, { method: 'DELETE' });
      await loadEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to delete event');
    }
  };

  const filteredEvents = events.filter((ev) =>
    ev.eventName.toLowerCase().includes(search.toLowerCase()) ||
    ev.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleSeedDatabase = async () => {
    try {
      setLoading(true);
      await fetchJson(`${API_ENDPOINTS.events}/seed`, { method: 'POST' });
      await loadEvents();
      alert('Database seeded with sample events and participants!');
    } catch (err: any) {
      alert(err.message || 'Failed to seed database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Outfit']">Events Management</h1>
          <p className="text-xs text-slate-400">Configure Club Celestius events & associated code templates</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedDatabase}
            className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-400 text-amber-300 hover:text-zinc-950 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Seed Sample Data</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="gradient-button px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by event name or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
        />
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-56 bg-slate-800/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800 space-y-3">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-base font-bold text-slate-300 font-['Outfit']">No Events Found</p>
          <p className="text-xs text-slate-500">Create a new event to start importing participants and issuing credentials.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((ev) => (
            <motion.div
              key={ev._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center text-zinc-950 font-black text-sm font-['Outfit'] shadow-md">
                    {ev.eventName.charAt(0)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                      {ev.slug}
                    </span>
                    <button
                      onClick={(e) => handleDeleteEvent(ev._id, e)}
                      className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors font-['Outfit']">
                  {ev.eventName}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 min-h-[32px]">
                  {ev.description || 'No event description provided.'}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                    <p className="font-bold text-white">{ev.stats?.participants || 0}</p>
                    <p className="text-[10px] text-slate-500">Participants</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                    <p className="font-bold text-purple-400">{ev.stats?.templates || 5}</p>
                    <p className="text-[10px] text-slate-500">Templates</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                    <p className="font-bold text-emerald-400">{ev.stats?.credentials || 0}</p>
                    <p className="text-[10px] text-slate-500">Issued</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to={`/dashboard/events/${ev._id}`}
                  className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-400 text-amber-300 hover:text-zinc-950 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <span>Manage Event Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-panel-gold rounded-3xl p-6 sm:p-8 border border-amber-500/40 relative shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h2 className="text-xl font-extrabold text-white font-['Outfit']">Create Event</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PromptVerse 3.0"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the event..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 space-y-1">
                  <p className="font-semibold">Code Templates Included:</p>
                  <p className="text-[11px] text-slate-400">
                    Creates default registered templates: Participation Certificate, Winner Certificate, Volunteer Certificate, Entry Pass, Speaker Pass.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="gradient-button px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg cursor-pointer"
                  >
                    {creating ? 'Creating...' : 'Create Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
