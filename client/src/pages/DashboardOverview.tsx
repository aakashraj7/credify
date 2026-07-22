import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS, fetchJson } from '../config/api';
import {
  Calendar,
  Users,
  Award,
  Download,
  Plus,
  ArrowUpRight,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardOverview: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [evData, partData, credData] = await Promise.all([
          fetchJson(API_ENDPOINTS.events).catch(() => ({ events: [] })),
          fetchJson(API_ENDPOINTS.participants).catch(() => ({ participants: [] })),
          fetchJson(API_ENDPOINTS.credentials).catch(() => ({ credentials: [] }))
        ]);

        setEvents(evData.events || []);
        setParticipants(partData.participants || []);
        setCredentials(credData.credentials || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalEvents = events.length;
  const totalParticipants = participants.length;
  const totalCredentials = credentials.length;
  const totalDownloads = totalCredentials * 3 + 12; // Simulated metrics count

  const statsCards = [
    { label: 'Active Events', value: totalEvents, icon: Calendar, color: 'from-amber-400 via-yellow-400 to-amber-500', badge: 'Club Celestius' },
    { label: 'Total Participants', value: totalParticipants, icon: Users, color: 'from-yellow-400 via-amber-400 to-yellow-500', badge: 'Registered' },
    { label: 'Credentials Issued', value: totalCredentials, icon: Award, color: 'from-amber-500 via-yellow-400 to-amber-600', badge: 'Unique IDs' },
    { label: 'PDF Downloads', value: totalDownloads, icon: Download, color: 'from-emerald-500 to-teal-500', badge: 'Dynamic Generated' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative glass-panel-gold rounded-3xl p-6 sm:p-8 border border-amber-500/30 overflow-hidden">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Platform Active • Club Celestius</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
              Celestius Credential Dashboard
            </h1>
            <p className="text-sm text-zinc-300 max-w-xl">
              Manage participation certificates, winner awards, volunteer certificates, and entry passes with dynamic on-the-fly PDF generation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/dashboard/events"
              className="gradient-button px-5 py-3 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
              <span>Create Event</span>
            </Link>
            <Link
              to="/dashboard/templates"
              className="px-4 py-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700 text-sm font-bold text-zinc-200 flex items-center gap-2 transition-colors"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Templates</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="glass-panel rounded-2xl p-5 border border-zinc-800 hover:border-amber-500/40 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                  {card.badge}
                </span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-zinc-950 font-black shadow-md shadow-amber-500/10`}>
                  <Icon className="w-5 h-5 text-zinc-950" />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-3xl font-black text-white font-['Outfit']">
                  {loading ? (
                    <span className="inline-block w-16 h-8 bg-zinc-800 rounded animate-pulse" />
                  ) : (
                    card.value
                  )}
                </h3>
                <p className="text-xs font-bold text-zinc-400 mt-1">{card.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Events Directory Quick View */}
      <div className="glass-panel rounded-3xl p-6 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white font-['Outfit']">Recent Club Events</h2>
            <p className="text-xs text-zinc-400">Events configured in Club Celestius platform</p>
          </div>

          <Link
            to="/dashboard/events"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
          >
            <span>Manage All Events</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {events.length === 0 && !loading ? (
          <div className="text-center py-10 text-xs text-zinc-400">
            No events found. Click "Create Event" above to create your first Club Celestius event.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.slice(0, 4).map((ev) => (
              <Link
                key={ev._id}
                to={`/dashboard/events/${ev._id}`}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/40 hover:bg-zinc-900 transition-all flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {ev.slug}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {new Date(ev.eventDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-white group-hover:text-amber-300 transition-colors">
                    {ev.eventName}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-1">{ev.description}</p>
                </div>

                <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-amber-300 group-hover:bg-amber-500/10 shrink-0 transition-all">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
