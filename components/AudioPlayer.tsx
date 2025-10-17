"use client";
import { useEffect, useRef, useState } from "react";

export default function AudioPlayer({
  src,
  title,
  accentA = "#6ea8ff",
  accentB = "#9b6dff",
}: { src:string; title?:string; accentA?:string; accentB?:string }) {
  const audioRef = useRef<HTMLAudioElement|null>(null);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setProgress((a.currentTime / a.duration) || 0);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", () => setPlaying(false));
    return () => {
      a.removeEventListener("timeupdate", onTime);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) { a.play(); setPlaying(true); }
    else { a.pause(); setPlaying(false); }
  };

  return (
    <div className="card" style={{ display:"grid", gap:12 }}>
      {title && <strong>{title}</strong>}
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <button className="btn" onClick={toggle}>{playing ? "Pausa" : "Play"}</button>
        <div style={{ flex:1 }}>
          <div style={{
            height:10, width:"100%",
            background:"linear-gradient(90deg, rgba(255,255,255,.1), rgba(255,255,255,.05))",
            borderRadius:999, position:"relative", border:"1px solid rgba(255,255,255,.08)"
          }}>
            <div style={{
              position:"absolute", inset:0, width:`${progress*100}%`,
              background:`linear-gradient(90deg, ${accentA}, ${accentB})`,
              borderRadius:999, transition:"width .15s linear"
            }} />
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}
