"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, PlayCircle } from "lucide-react";
import Link from "next/link";

export default function EventPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id);
  const [eventData, setEventData] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const eventRes = await fetch(`/api/spotlight?id=${encodeURIComponent(id)}`);
        const eventJson = await eventRes.json();

        // ✅ Fallback se l'API non restituisce dati
        if (!eventJson.data) {
          setEventData({
            artist: id,
            venue: "Hi Ibiza",
            city: "Ibiza",
            country: "Spain",
            date: "2025-10-11",
            url: "https://www.instagram.com/tekkin.music/",
            thumbnail:
              "https://tekkin-assets.s3.eu-central-1.amazonaws.com/spotlight-placeholder.jpg",
          });
        } else {
          setEventData(eventJson.data);
        }

        const mediaRes = await fetch(`/api/instagram?user=${encodeURIComponent(id)}`);
        const mediaJson = await mediaRes.json();

        if (mediaJson.success && Array.isArray(mediaJson.data)) {
          setMedia(mediaJson.data);
        } else {
          setMedia([]);
        }
      } catch (err) {
        console.error("Errore nel caricamento:", err);
        setMedia([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-neutral-400">
        Loading event details...
      </div>
    );

  const eventDate = eventData?.date ? new Date(eventData.date) : null;
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const today = new Date();
  let status = "Archived";
  if (eventDate) {
    if (eventDate.toDateString() === today.toDateString()) status = "Live";
    else if (eventDate > today) status = "Upcoming";
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-[Inter]">
      {/* HERO */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={
            eventData?.thumbnail ||
            "https://tekkin-assets.s3.eu-central-1.amazonaws.com/spotlight-live.jpg"
          }
          alt={eventData?.artist || ""}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="absolute top-6 left-6">
          <Link
            href="/spotlight"
            className="flex items-center gap-2 text-neutral-300 hover:text-[#a855f7] transition"
          >
            <ArrowLeft size={18} /> Back
          </Link>
        </div>

        <div className="absolute bottom-10 left-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-2 bg-gradient-to-r from-[#a855f7] to-[#6366f1] text-transparent bg-clip-text"
          >
            {eventData?.artist || id}
          </motion.h1>

          <p className="text-neutral-300 text-sm md:text-base mb-3">
            {eventData?.venue} • {formattedDate} • {eventData?.city}
          </p>

          <div
            className={`inline-block px-4 py-1 rounded-full text-xs font-semibold ${
              status === "Live"
                ? "bg-[#7c4dff]/20 text-[#b388ff]"
                : status === "Upcoming"
                ? "bg-[#333]/40 text-neutral-400"
                : "bg-[#111]/60 text-neutral-500"
            }`}
          >
            {status}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#a855f7] to-[#6366f1] text-transparent bg-clip-text">
            Instagram Highlights
          </h2>
          <p className="text-sm text-neutral-500">{media.length} media</p>
        </div>

        {media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
            <AlertCircle size={40} className="mb-3 text-neutral-600" />
            <p className="text-center text-sm">
              Nessuna storia o post trovata per questo profilo.
              <br />
              {status === "Upcoming"
                ? "L'evento non è ancora iniziato."
                : status === "Live"
                ? "Le stories vengono aggiornate ogni 30 minuti."
                : "Nessuna storia salvata per questa data."}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {media.map((m, i) => (
              <motion.a
                key={m.id || i}
                href={m.permalink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                className="group relative rounded-2xl overflow-hidden border border-[#1a1a1a] hover:border-[#7c4dff]/60 transition-all shadow-[0_0_15px_-5px_rgba(124,77,255,0.2)]"
              >
                {m.media_type === "VIDEO" ? (
                  <video
                    src={m.media_url}
                    className="w-full h-64 object-cover"
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={m.media_url}
                    alt={m.caption || ""}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition" />
                <div className="absolute bottom-3 left-4 right-4 text-sm text-neutral-300 truncate">
                  {m.caption?.slice(0, 80) || "No caption"}
                </div>
              </motion.a>
            ))}
          </div>
        )}

        {/* Track Detected Placeholder */}
        <div className="mt-20 text-center border-t border-[#1a1a1a] pt-10">
          <PlayCircle className="mx-auto text-[#7c4dff]" size={42} />
          <p className="text-sm text-neutral-400 mt-2">
            Coming soon: riconoscimento automatico della tua traccia 💿
          </p>
        </div>

        {/* Link evento IG (discreto) */}
        {eventData?.url && (
          <div className="text-center mt-8">
            <a
              href={eventData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#7c4dff] hover:text-[#b388ff] underline transition"
            >
              View Instagram Event ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
