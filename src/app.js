import { useEffect, useMemo, useRef, useState } from "react";
import "@/app.css";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import gsap from "gsap";
import Lenis from "lenis";
import { ArrowDown, ArrowUpRight, ChevronDown, ChevronRight, MapPin, X } from "lucide-react";
import { Toaster, toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const config = {
  couple: "Madhushri & Bharath", year: 2026, dates: "05 — 06 December",
  venues: [
    { type: "Marriage", name: "Venue details to be announced", address: "Address to be announced", time: "Time to be announced", date: "05 December" },
    { type: "Reception", name: "Venue details to be announced", address: "Address to be announced", time: "Time to be announced", date: "06 December" },
  ],
  gallery: [
    { src: "https://images.unsplash.com/photo-1600118569960-ea0f09f92d5b?auto=format&fit=crop&w=1200&q=85", alt: "Palace archway" },
    { src: "https://images.unsplash.com/photo-1561042771-abb14f50b8f4?auto=format&fit=crop&w=1200&q=85", alt: "Royal architecture" },
    { src: "https://images.unsplash.com/photo-1699764681875-dd04ce36b1c3?auto=format&fit=crop&w=1200&q=85", alt: "Marigold celebration" },
  ],
};

function Dust() { return <Canvas className="dust-canvas" camera={{ position: [0, 0, 4] }}><Sparkles count={160} scale={[14, 8, 4]} size={2} speed={0.25} color="#e9d8ad" /></Canvas>; }

function DoorScene({ opened, onOpen, reducedMotion }) {
  const scene = useRef(null);
  const open = () => { if (opened) return; if (reducedMotion) { gsap.set(".door-panel.left", { rotateY: -94 }); gsap.set(".door-panel.right", { rotateY: 94 }); gsap.set(".palace-light", { opacity: 1 }); } else { gsap.timeline().to(".door-panel.left", { rotateY: -94, duration: 2.2, ease: "power3.inOut" }).to(".door-panel.right", { rotateY: 94, duration: 2.2, ease: "power3.inOut" }, "<").to(".palace-light", { opacity: 1, duration: 1.5 }, "<0.8").to(scene.current, { scale: 1.08, duration: 2.4, ease: "power2.inOut" }, "<"); } onOpen(true); };
  return <section className={`door-hero ${opened ? "is-open" : ""}`} ref={scene} data-testid="palace-entrance">
    <Dust /><div className="palace-light" />
    <div className="pillars pillar-left" /><div className="pillars pillar-right" />
    <div className="garland garland-top">✦ · ✦ · ✦ · ✦ · ✦ · ✦</div><div className="lamp lamp-left">◉<i /></div><div className="lamp lamp-right">◉<i /></div>
    <div className="door-frame"><div className="door-panel left"><div className="carving">✥<span>◈</span>✥<span>◈</span>✥</div><div className="door-handle" /></div><div className="door-panel right"><div className="carving">✥<span>◈</span>✥<span>◈</span>✥</div><div className="door-handle" /></div></div>
    <div className="hero-copy">
      <p className="eyebrow reveal-line" data-testid="hero-eyebrow">A celebration of love</p>
      <h1 data-testid="hero-couple"><span>Madhushri</span><em>&amp;</em><span>Bharath</span></h1>
      <p className="hero-date" data-testid="hero-date">05 — 06 December · 2026</p>
      <button className="open-button" onClick={open} data-testid="open-royal-invitation"><span>{opened ? "Entering the palace" : "Open the royal invitation"}</span><ArrowDown size={16} /></button>
    </div><div className="scroll-cue">Scroll to enter <ArrowDown size={14} /></div>
  </section>;
}

const Reveal = ({ children, className = "", reducedMotion = false }) => <motion.div className={className} initial={reducedMotion ? false : { opacity: 0, y: 34 }} whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={reducedMotion ? undefined : { duration: .9, ease: [0.22, 1, .36, 1] }}>{children}</motion.div>;

function Countdown() { const [now, setNow] = useState(Date.now()); useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []); const diff = Math.max(0, new Date(`${config.year}-12-05T00:00:00+05:30`).getTime() - now); const vals = [Math.floor(diff / 86400000), Math.floor(diff / 3600000) % 24, Math.floor(diff / 60000) % 60, Math.floor(diff / 1000) % 60]; return <div className="countdown" data-testid="countdown">{vals.map((v, i) => <div key={i} className="count-unit"><strong>{String(v).padStart(2, "0")}</strong><span>{["days", "hours", "minutes", "seconds"][i]}</span></div>)}</div>; }

function App() {
  const [opened, setOpened] = useState(false); const [lightbox, setLightbox] = useState(null); const [rsvp, setRsvp] = useState({}); const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => { const query = window.matchMedia("(prefers-reduced-motion: reduce)"); const update = () => setReducedMotion(query.matches); update(); query.addEventListener?.("change", update); return () => query.removeEventListener?.("change", update); }, []);
  useEffect(() => { if (reducedMotion) return undefined; const lenis = new Lenis({ duration: 1.2, smoothWheel: true }); let raf; const tick = (t) => { lenis.raf(t); raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); return () => { cancelAnimationFrame(raf); lenis.destroy(); }; }, [reducedMotion]);
  useEffect(() => { if (opened) window.setTimeout(() => document.querySelector("#home")?.scrollIntoView({ behavior: "smooth" }), 900); }, [opened]);
  const submit = async (e) => { e.preventDefault(); try { await axios.post(`${API}/rsvp`, rsvp); toast.success("Your response has been received", { description: "We cannot wait to celebrate with you." }); e.target.reset(); } catch { toast.error("Please try again shortly"); } };
  const eventData = useMemo(() => [{ day: "05", month: "December", title: "The Wedding Celebration", note: "Ceremonies and timings will be announced", icon: "I" }, { day: "06", month: "December", title: "The Grand Reception", note: "Celebration details will be announced", icon: "II" }], []);
  return <div className="site-shell"><Toaster theme="dark" position="bottom-center" />
    <DoorScene opened={opened} onOpen={setOpened} reducedMotion={reducedMotion} />
    <AnimatePresence>{opened && <motion.div className="site-content" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={reducedMotion ? undefined : { delay: .4, duration: 1 }}>
      <nav className="nav" data-testid="main-navigation"><a className="monogram" href="#home" data-testid="brand-link">M<span>✦</span>B</a><div className="nav-links">{[["home", "Home"], ["celebrations", "Celebrations"], ["venue", "Venue"], ["gallery", "Gallery"], ["rsvp", "RSVP"]].map(([id, label]) => <a href={`#${id}`} key={id} data-testid={`nav-${id}`}>{label}</a>)}</div><button className="nav-cta" onClick={() => document.querySelector("#rsvp").scrollIntoView({ behavior: "smooth" })} data-testid="nav-rsvp-button">RSVP <ArrowUpRight size={14} /></button></nav>
      <main>
        <section className="intro-section" id="home"><div className="section-index">01 / 05</div><Reveal reducedMotion={reducedMotion}><p className="eyebrow">With the blessings of our families</p><h2 className="display-title">Two souls,<br /><i>one forever.</i></h2><p className="intro-copy">Together with our families, we joyfully invite you to witness and celebrate the beginning of our forever.</p><div className="gold-rule" /><div className="intro-signature">Madhushri <span>&amp;</span> Bharath</div></Reveal><div className="mandala" aria-hidden="true">✺</div></section>
        <div className="marquee" aria-label="wedding date"><div>THE ROYAL PALACE <span>✦</span> A JOURNEY INTO FOREVER <span>✦</span> 05 — 06 DECEMBER <span>✦</span>&nbsp;</div><div>THE ROYAL PALACE <span>✦</span> A JOURNEY INTO FOREVER <span>✦</span> 05 — 06 DECEMBER <span>✦</span></div></div>
        <section className="chapters-section" id="celebrations"><div className="section-heading"><div><p className="eyebrow">The wedding story</p><h2 className="serif-title">Two days.<br /><i>One beginning.</i></h2></div><p className="heading-note">A celebration in two chapters,<br />held close to the heart.</p></div><div className="chapter-grid">{eventData.map((item, i) => <Reveal reducedMotion={reducedMotion} className={`chapter-card chapter-${i}`} key={item.day}><div className="chapter-art"><span className="roman">{item.icon}</span><div className="arch-glow" /><span className="art-label">{i === 0 ? "The sacred beginning" : "An evening in gold"}</span></div><div className="chapter-info"><div><span className="chapter-date">{item.day} <small>{item.month}</small></span><h3>{item.title}</h3><p>{item.note}</p></div><button className="circle-arrow" data-testid={`chapter-${item.day}-button`} aria-label={`View ${item.title}`}><ChevronRight /></button></div></Reveal>)}</div></section>
        <section className="venue-section" id="venue"><div className="section-index">03 / 05</div><div className="section-heading"><div><p className="eyebrow">Where we gather</p><h2 className="serif-title">A place<br /><i>to remember.</i></h2></div><p className="heading-note">Venue details will be updated<br />as the celebration takes shape.</p></div><div className="venue-grid">{config.venues.map((venue, i) => <Reveal reducedMotion={reducedMotion} className="venue-card" key={venue.type}><div className={`venue-image venue-image-${i}`}><span>{venue.type === "Marriage" ? "I" : "II"}</span></div><div className="venue-details"><p className="eyebrow">{venue.date} · {venue.type}</p><h3>{venue.name}</h3><p><MapPin size={14} /> {venue.address}</p><p className="venue-time">{venue.time}</p><button className="text-button" onClick={() => toast.info("Location details will be added soon", { description: "The venue address is still being finalised." })} data-testid={`venue-${i}-location-button`}>View location <ArrowUpRight size={14} /></button></div></Reveal>)}</div></section>
        <section className="gallery-section" id="gallery"><div className="section-heading"><div><p className="eyebrow">A glimpse of the feeling</p><h2 className="serif-title">Frames from<br /><i>our palace.</i></h2></div><p className="heading-note">Inspired by light, silk,<br />and old-world romance.</p></div><div className="gallery-grid">{config.gallery.map((img, i) => <motion.button className={`gallery-item gallery-${i}`} whileHover={reducedMotion ? undefined : { scale: .98 }} onClick={() => setLightbox(img)} key={img.src} data-testid={`gallery-image-${i}`}><img src={img.src} alt={img.alt} loading="lazy" /><span>0{i + 1}</span></motion.button>)}</div></section>
        <section className="countdown-section"><Reveal reducedMotion={reducedMotion}><p className="eyebrow">The moment we have been waiting for</p><h2 className="serif-title">Until we meet<br /><i>under the lights.</i></h2><Countdown /><p className="countdown-date">05 December 2026 · India Standard Time</p></Reveal></section>
        <section className="rsvp-section" id="rsvp"><div className="rsvp-orb">✺</div><Reveal reducedMotion={reducedMotion}><p className="eyebrow">Your presence will make our celebration complete.</p><h2 className="display-title">Will you<br /><i>join us?</i></h2><form onSubmit={submit} data-testid="rsvp-form"><input required placeholder="Your name" onChange={e => setRsvp({ ...rsvp, name: e.target.value })} data-testid="rsvp-name-input" /><input required placeholder="Mobile number" onChange={e => setRsvp({ ...rsvp, mobile: e.target.value })} data-testid="rsvp-mobile-input" /><div className="form-row"><select required onChange={e => setRsvp({ ...rsvp, attending: e.target.value })} data-testid="rsvp-attendance-select"><option value="">Will you be joining?</option><option>Joyfully accepts</option><option>Regretfully declines</option></select><select onChange={e => setRsvp({ ...rsvp, guests: e.target.value })} data-testid="rsvp-guests-select"><option value="">Guests</option><option>1 guest</option><option>2 guests</option><option>3+ guests</option></select></div><textarea placeholder="Leave a note for the couple (optional)" onChange={e => setRsvp({ ...rsvp, message: e.target.value })} data-testid="rsvp-message-input" /><button className="submit-button" type="submit" data-testid="rsvp-submit-button">Send my response <ArrowUpRight size={16} /></button></form></Reveal></section>
        <footer className="footer"><div className="footer-mandala">✺</div><p className="eyebrow">With love and blessings</p><h2 className="serif-title">Madhushri <i>&amp; Bharath</i></h2><p className="footer-line">Two hearts. One forever.</p><p className="footer-date">05 — 06 December · 2026</p></footer>
      </main>
    </motion.div>}</AnimatePresence>
    {lightbox && <div className="lightbox" onClick={() => setLightbox(null)} data-testid="gallery-lightbox"><button onClick={() => setLightbox(null)} data-testid="close-lightbox"><X /></button><img src={lightbox.src} alt={lightbox.alt} /></div>}
  </div>;
}

export default App;
