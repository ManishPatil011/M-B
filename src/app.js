import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@/app.css";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUpRight, CalendarDays, MapPin, Music2, Sparkles, X } from "lucide-react";
import "@/entrance.css";

const config = {
  couple: "Bharath & Madhushri",
  year: 2026,
  date: "05 — 06 December",
  gallery: [
    { src: "https://images.unsplash.com/photo-1600118569960-ea0f09f92d5b?auto=format&fit=crop&w=1400&q=85", alt: "A sunlit palace archway" },
    { src: "https://images.unsplash.com/photo-1561042771-abb14f50b8f4?auto=format&fit=crop&w=1400&q=85", alt: "Ornate palace architecture" },
    { src: "https://images.unsplash.com/photo-1699764681875-dd04ce36b1c3?auto=format&fit=crop&w=1400&q=85", alt: "Warm marigold wedding details" },
  ],
  events: [
    { date: "05", month: "December", weekday: "Saturday", title: "The Wedding Celebration", time: "Ceremony details coming soon", venue: "Venue to be announced" },
    { date: "06", month: "December", weekday: "Sunday", title: "The Grand Reception", time: "Evening celebration", venue: "Venue to be announced" },
  ],
};

function Countdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const remaining = Math.max(0, new Date(`${config.year}-12-05T00:00:00+05:30`).getTime() - now);
  const values = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
  return <div className="countdown" aria-label="Countdown to the wedding">{values.map((value, index) => <div className="countdown-unit" key={index}><strong>{String(value).padStart(2, "0")}</strong><span>{["Days", "Hours", "Minutes", "Seconds"][index]}</span></div>)}</div>;
}

function Reveal({ children, className = "", reducedMotion = false, delay = 0 }) {
  return <motion.div className={className} initial={reducedMotion ? false : { opacity: 0, y: 34, rotateX: 5 }} whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, margin: "-70px" }} transition={reducedMotion ? undefined : { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function ScratchSurface({ revealed, onComplete }) {
  const canvasRef = useRef(null);
  const sampleCanvasRef = useRef(null);
  const lastPoint = useRef(null);
  const isScratching = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bounds = canvas.getBoundingClientRect();
    const width = bounds.width;
    const height = bounds.height;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Unable to initialize the scratch card");
    context.scale(scale, scale);

    if (revealed) {
      context.clearRect(0, 0, width, height);
      return;
    }

    const foil = context.createLinearGradient(0, 0, width, height);
    foil.addColorStop(0, "#eee0c7");
    foil.addColorStop(.42, "#c8ae87");
    foil.addColorStop(.7, "#f5e8d1");
    foil.addColorStop(1, "#b99b70");
    context.fillStyle = foil;
    context.fillRect(0, 0, width, height);
    context.globalAlpha = .18;
    context.strokeStyle = "#fffaf1";
    for (let x = -height; x < width; x += 16) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x + height, height);
      context.stroke();
    }
    context.globalAlpha = 1;
    context.fillStyle = "#78593a";
    context.font = "600 24px Georgia, serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("✧ Scratch to reveal ✧", width / 2, height / 2);
  }, [revealed]);

  const eraseAt = (event) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || revealed) return;

    const bounds = canvas.getBoundingClientRect();
    const point = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
    context.globalCompositeOperation = "destination-out";
    context.lineWidth = 38;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    if (lastPoint.current) {
      context.moveTo(lastPoint.current.x, lastPoint.current.y);
      context.lineTo(point.x, point.y);
    } else {
      context.arc(point.x, point.y, 19, 0, Math.PI * 2);
    }
    context.stroke();
    lastPoint.current = point;

    const sample = sampleCanvasRef.current || document.createElement("canvas");
    sampleCanvasRef.current = sample;
    sample.width = 40;
    sample.height = 20;
    const sampleContext = sample.getContext("2d", { willReadFrequently: true });
    if (!sampleContext) throw new Error("Unable to measure scratch progress");
    sampleContext.drawImage(canvas, 0, 0, sample.width, sample.height);
    const pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data;
    let scratched = 0;
    for (let index = 3; index < pixels.length; index += 4) {
      if (pixels[index] < 128) scratched += 1;
    }

    if (scratched / (sample.width * sample.height) >= .7) {
      context.clearRect(0, 0, bounds.width, bounds.height);
      isScratching.current = false;
      lastPoint.current = null;
      onComplete();
    }
  };

  const handlePointerDown = (event) => {
    if (revealed) return;
    event.preventDefault();
    isScratching.current = true;
    lastPoint.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
    eraseAt(event);
  };

  const handlePointerMove = (event) => {
    if (!isScratching.current) return;
    event.preventDefault();
    eraseAt(event);
  };

  const handlePointerEnd = (event) => {
    isScratching.current = false;
    lastPoint.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return <canvas ref={canvasRef} className="scratch-surface" aria-hidden="true" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerEnd} onPointerCancel={handlePointerEnd} />;
}

function downloadCalendarInvite() {
  const escapeIcsText = (value) => value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
  const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const description = "The Wedding Celebration on 5 December and Grand Reception on 6 December. Times and venue to be announced.";
  const calendarEvent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bharath and Madhushri//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}-bharath-madhushri@wedding-invitation`,
    `DTSTAMP:${timestamp}`,
    "DTSTART;VALUE=DATE:20261205",
    "DTEND;VALUE=DATE:20261207",
    `SUMMARY:${escapeIcsText("Bharath & Madhushri — Wedding Celebrations")}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n") + "\r\n";
  const invite = new Blob([calendarEvent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(invite);
  const link = document.createElement("a");
  link.href = url;
  link.download = "bharath-madhushri-wedding.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function App() {
  const [opened, setOpened] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const eventData = useMemo(() => config.events, []);
  const revealScratchCard = useCallback(() => setRevealed(true), []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update(); query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  return <div className="site-shell">
    {!opened && <section className="envelope-stage" aria-label="Wedding invitation">
      <div className="ambient-orb orb-one" /><div className="ambient-orb orb-two" />
      <div className="ganesh-mark" aria-hidden="true">ॐ</div><p className="sacred-line">Shri Ganeshaya Namah</p>
      <button className="envelope-button" onClick={() => setOpened(true)} aria-label="Open wedding invitation">
        <span className="envelope-paper"><span className="paper-kicker">A royal invitation</span><span className="paper-names">Bharath<br /><i>&amp;</i><br />Madhushri</span><span className="paper-date">{config.date} · {config.year}</span></span>
        <span className="envelope-flap" /><span className="wax-seal">✿</span>
      </button>
      <p className="open-hint"><Sparkles size={14} /> Touch the seal to open</p>
      <div className="stage-bottom">A celebration of love <span>·</span> Chandigarh, India</div>
    </section>}
    <AnimatePresence>{opened && <motion.div className="site-content" initial={reducedMotion ? false : { opacity: 0, rotateX: 5, y: 30 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} transition={{ duration: reducedMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}>
      <nav className="nav"><a className="monogram" href="#home" aria-label="Bharath and Madhushri home">B<span>✦</span>M</a><div className="nav-links">{[["home", "Our story"], ["celebrations", "Celebrations"], ["gallery", "Gallery"]].map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}</div></nav>
      <main>
        <section className="hero-section" id="home">
          <div className="hero-backdrop" />
          <div className="hero-ornament ornament-left" aria-hidden="true">✺</div>          <span className="mandala-symbol" aria-hidden="true"></span><div className="hero-blessing"><img className="ganesha-image" src="/ganesha.png" alt="" /><p className="eyebrow">With the blessings of our families</p></div><div className="hero-ornament ornament-right" aria-hidden="true"></div>
          <Reveal reducedMotion={reducedMotion} className="hero-intro"><h1>Bharath <i>&amp;</i><br />Madhushri</h1><p className="hero-caption">Two hearts, one beautiful beginning.</p><div className="hero-date"><CalendarDays size={15} /> 05 — 06 December · 2026</div><a className="outline-link" href="#story">Discover our invitation <ArrowDown size={14} /></a></Reveal>
          <div className="hero-photo-wrap" aria-label="Wedding portrait artwork"><div className="hero-photo"><img src={config.gallery[0].src} alt={config.gallery[0].alt} /></div><div className="photo-caption">The beginning of forever <span>· 01</span></div></div>
          <span className="hero-side-note">A NEW CHAPTER · 2026</span>
        </section>
        <section className="intro-section section-pad" id="story"><div className="section-index">01 / OUR STORY</div><Reveal reducedMotion={reducedMotion}><p className="eyebrow">A note from our families</p><h2 className="display-title">A love story,<br /><i>written in the stars.</i></h2><p className="intro-copy">With the blessings of Waheguru and the love of our families, we invite you to join us as we celebrate the beautiful union of Bharath and Madhushri.</p><div className="intro-signature">With love <span>✦</span> Bharath &amp; Madhushri</div></Reveal><div className="intro-seal" aria-hidden="true">B<span>&amp;</span>M</div></section>
        <section className="scratch-section section-pad"><div className="section-index">02 / A LITTLE SURPRISE</div><Reveal reducedMotion={reducedMotion}><p className="eyebrow">A keepsake just for you</p><h2 className="script-title">A little surprise</h2><p className="section-subtitle">Scratch with your finger or pointer to reveal our special day</p><button className={`scratch-card ${revealed ? "is-revealed" : ""}`} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); revealScratchCard(); } }} aria-label={revealed ? "Wedding date revealed" : "Scratch to reveal the wedding date"}><span className="scratch-reveal"><small>THE DATE IS SET</small><strong>05 · 06<br />DECEMBER 2026</strong></span><ScratchSurface revealed={revealed} onComplete={revealScratchCard} /></button><button className="reveal-link" onClick={revealScratchCard}>{revealed ? "A date to remember" : "Prefer not to scratch? Reveal here"}</button></Reveal></section>
        <section className="celebrations-section section-pad" id="celebrations"><div className="section-index">03 / THE CELEBRATIONS</div><div className="section-heading"><div><p className="eyebrow">Gather with us</p><h2 className="serif-title">Two days.<br /><i>One beginning.</i></h2></div><p className="heading-note">Every moment made more meaningful<br />with the people we love.</p></div><div className="event-timeline">{eventData.map((item, index) => <Reveal reducedMotion={reducedMotion} className={`event-card event-${index}`} key={item.date} delay={index * 0.12}><div className="timeline-node">✦</div><div className="event-date"><strong>{item.date}</strong><span>{item.month}</span><small>{item.weekday}</small></div><div className="event-details"><span className="event-number">0{index + 1} · CHAPTER</span><h3>{item.title}</h3><p>{item.time}</p><p><MapPin size={14} /> {item.venue}</p></div><div className="event-art" aria-hidden="true">{index === 0 ? "I" : "II"}</div></Reveal>)}</div></section>
        <section className="family-section section-pad"><div className="section-index">04 / OUR FAMILIES</div><Reveal reducedMotion={reducedMotion}><p className="eyebrow">Two families, one home</p><h2 className="serif-title">The soul synced <i>two.</i></h2></Reveal><div className="family-grid">{[{ label: "The bride's family", image: config.gallery[1] }, { label: "The groom's family", image: config.gallery[2] }].map((family, index) => <Reveal reducedMotion={reducedMotion} className="family-card" key={family.label} delay={index * .1}><div className="family-image"><img src={family.image.src} alt={family.image.alt} loading="lazy" /></div><p>{family.label}</p><span>With love and blessings</span></Reveal>)}</div><div className="family-ampersand" aria-hidden="true">&amp;</div></section>
        <section className="gallery-section section-pad" id="gallery"><div className="section-index">05 / MOMENTS TO KEEP</div><div className="section-heading"><div><p className="eyebrow">A glimpse of the feeling</p><h2 className="serif-title">Frames from<br /><i>our story.</i></h2></div><p className="heading-note">Little moments, lasting memories.</p></div><div className="gallery-grid">{config.gallery.map((image, index) => <motion.button className={`gallery-item gallery-${index}`} whileHover={reducedMotion ? undefined : { rotateY: index === 1 ? -4 : 4, rotateX: -3, scale: 1.025, z: 28 }} onClick={() => setLightbox(image)} key={image.src} aria-label={`View photo: ${image.alt}`}><img src={image.src} alt={image.alt} loading="lazy" /><span>0{index + 1} <ArrowUpRight size={13} /></span></motion.button>)}</div></section>
        <section className="countdown-section section-pad"><Reveal reducedMotion={reducedMotion}><div className="countdown-flower" aria-hidden="true">✺</div><p className="eyebrow">Until we meet beneath the lights</p><h2 className="script-title">Counting down to forever</h2><Countdown /><p className="countdown-date">05 December 2026 · India Standard Time</p><button className="calendar-button" type="button" onClick={downloadCalendarInvite}><CalendarDays size={16} /> Add to calendar</button></Reveal></section>
        <footer className="footer"><div className="footer-mark">B<span>✦</span>M</div><p className="eyebrow">With love and blessings</p><h2 className="script-title">Bharath <i>&amp;</i> Madhushri</h2><p>Two hearts. One forever.</p><span className="footer-date">05 — 06 December · 2026</span><Music2 size={15} className="footer-note" /></footer>
      </main>
    </motion.div>}</AnimatePresence>
    {lightbox && <div className="lightbox" role="dialog" aria-modal="true" aria-label={lightbox.alt} onClick={() => setLightbox(null)}><button onClick={() => setLightbox(null)} aria-label="Close image"><X /></button><img src={lightbox.src} alt={lightbox.alt} /></div>}
  </div>;
}

export default App;
