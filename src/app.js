import { useEffect, useMemo, useState } from "react";
import "@/app.css";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUpRight, CalendarDays, MapPin, Music2, Sparkles, X } from "lucide-react";
import { Toaster, toast } from "sonner";

const config = {
  couple: "Madhushri & Bharath",
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

function App() {
  const [opened, setOpened] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [rsvp, setRsvp] = useState({});
  const eventData = useMemo(() => config.events, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update(); query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!process.env.REACT_APP_BACKEND_URL) {
      toast.info("RSVP details are not connected yet", { description: "Please share your response with the family directly for now." });
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/rsvp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(rsvp) });
      if (!response.ok) throw new Error("RSVP request failed");
      toast.success("Your response has been received", { description: "We cannot wait to celebrate with you." });
      event.currentTarget.reset(); setRsvp({});
    } catch { toast.error("We could not send your response", { description: "Please try again shortly or contact the family directly." }); }
  };

  return <div className="site-shell"><Toaster theme="dark" position="bottom-center" />
    {!opened && <section className="envelope-stage" aria-label="Wedding invitation">
      <div className="ambient-orb orb-one" /><div className="ambient-orb orb-two" />
      <div className="ganesh-mark" aria-hidden="true">ॐ</div><p className="sacred-line">श्री गणेशाय नमः</p>
      <button className="envelope-button" onClick={() => setOpened(true)} aria-label="Open wedding invitation">
        <span className="envelope-paper"><span className="paper-kicker">A royal invitation</span><span className="paper-names">Madhushri<br /><i>&amp;</i><br />Bharath</span><span className="paper-date">{config.date} · {config.year}</span></span>
        <span className="envelope-flap" /><span className="wax-seal">✿</span>
      </button>
      <p className="open-hint"><Sparkles size={14} /> Touch the seal to open</p>
      <div className="stage-bottom">A celebration of love <span>·</span> Chandigarh, India</div>
    </section>}
    <AnimatePresence>{opened && <motion.div className="site-content" initial={reducedMotion ? false : { opacity: 0, rotateX: 5, y: 30 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} transition={{ duration: reducedMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}>
      <nav className="nav"><a className="monogram" href="#home" aria-label="Madhushri and Bharath home">M<span>✦</span>B</a><div className="nav-links">{[["home", "Our story"], ["celebrations", "Celebrations"], ["gallery", "Gallery"], ["rsvp", "RSVP"]].map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}</div><a className="nav-cta" href="#rsvp">Save your seat <ArrowUpRight size={14} /></a></nav>
      <main>
        <section className="hero-section" id="home">
          <div className="hero-backdrop" />
          <div className="hero-ornament ornament-left" aria-hidden="true">✺</div><div className="hero-ornament ornament-right" aria-hidden="true">✺</div>
          <Reveal reducedMotion={reducedMotion} className="hero-copy"><p className="eyebrow">With the blessings of our families</p><h1>Madhushri <i>&amp;</i><br />Bharath</h1><p className="hero-caption">Two hearts, one beautiful beginning.</p><div className="hero-date"><CalendarDays size={15} /> 05 — 06 December · 2026</div><a className="outline-link" href="#story">Discover our invitation <ArrowDown size={14} /></a></Reveal>
          <div className="hero-photo-wrap" aria-label="Wedding portrait artwork"><div className="hero-photo"><img src={config.gallery[0].src} alt={config.gallery[0].alt} /></div><div className="photo-caption">The beginning of forever <span>· 01</span></div></div>
          <span className="hero-side-note">A NEW CHAPTER · 2026</span>
        </section>
        <section className="intro-section section-pad" id="story"><div className="section-index">01 / OUR STORY</div><Reveal reducedMotion={reducedMotion}><p className="eyebrow">A note from our families</p><h2 className="display-title">A love story,<br /><i>written in the stars.</i></h2><p className="intro-copy">With the blessings of Waheguru and the love of our families, we invite you to join us as we celebrate the beautiful union of Madhushri and Bharath.</p><div className="intro-signature">With love <span>✦</span> Madhushri &amp; Bharath</div></Reveal><div className="intro-seal" aria-hidden="true">M<span>&amp;</span>B</div></section>
        <section className="scratch-section section-pad"><div className="section-index">02 / A LITTLE SURPRISE</div><Reveal reducedMotion={reducedMotion}><p className="eyebrow">A keepsake just for you</p><h2 className="script-title">A little surprise</h2><p className="section-subtitle">Tap the card to reveal our special day</p><button className={`scratch-card ${revealed ? "is-revealed" : ""}`} onClick={() => setRevealed(true)} aria-label={revealed ? "Wedding date revealed" : "Reveal the wedding date"}><span className="scratch-face">✧ Scratch to reveal ✧</span><span className="scratch-reveal"><small>THE DATE IS SET</small><strong>05 · 06<br />DECEMBER 2026</strong></span></button><button className="reveal-link" onClick={() => setRevealed(true)}>{revealed ? "A date to remember" : "Prefer not to scratch? Reveal here"}</button></Reveal></section>
        <section className="celebrations-section section-pad" id="celebrations"><div className="section-index">03 / THE CELEBRATIONS</div><div className="section-heading"><div><p className="eyebrow">Gather with us</p><h2 className="serif-title">Two days.<br /><i>One beginning.</i></h2></div><p className="heading-note">Every moment made more meaningful<br />with the people we love.</p></div><div className="event-timeline">{eventData.map((item, index) => <Reveal reducedMotion={reducedMotion} className={`event-card event-${index}`} key={item.date} delay={index * 0.12}><div className="timeline-node">✦</div><div className="event-date"><strong>{item.date}</strong><span>{item.month}</span><small>{item.weekday}</small></div><div className="event-details"><span className="event-number">0{index + 1} · CHAPTER</span><h3>{item.title}</h3><p>{item.time}</p><p><MapPin size={14} /> {item.venue}</p></div><div className="event-art" aria-hidden="true">{index === 0 ? "I" : "II"}</div></Reveal>)}</div></section>
        <section className="family-section section-pad"><div className="section-index">04 / OUR FAMILIES</div><Reveal reducedMotion={reducedMotion}><p className="eyebrow">Two families, one home</p><h2 className="serif-title">The soul synced <i>two.</i></h2></Reveal><div className="family-grid">{[{ label: "The bride's family", image: config.gallery[1] }, { label: "The groom's family", image: config.gallery[2] }].map((family, index) => <Reveal reducedMotion={reducedMotion} className="family-card" key={family.label} delay={index * .1}><div className="family-image"><img src={family.image.src} alt={family.image.alt} loading="lazy" /></div><p>{family.label}</p><span>With love and blessings</span></Reveal>)}</div><div className="family-ampersand" aria-hidden="true">&amp;</div></section>
        <section className="gallery-section section-pad" id="gallery"><div className="section-index">05 / MOMENTS TO KEEP</div><div className="section-heading"><div><p className="eyebrow">A glimpse of the feeling</p><h2 className="serif-title">Frames from<br /><i>our story.</i></h2></div><p className="heading-note">Little moments, lasting memories.</p></div><div className="gallery-grid">{config.gallery.map((image, index) => <motion.button className={`gallery-item gallery-${index}`} whileHover={reducedMotion ? undefined : { rotateY: index === 1 ? -4 : 4, rotateX: -3, scale: 1.025, z: 28 }} onClick={() => setLightbox(image)} key={image.src} aria-label={`View photo: ${image.alt}`}><img src={image.src} alt={image.alt} loading="lazy" /><span>0{index + 1} <ArrowUpRight size={13} /></span></motion.button>)}</div></section>
        <section className="countdown-section section-pad"><Reveal reducedMotion={reducedMotion}><div className="countdown-flower" aria-hidden="true">✺</div><p className="eyebrow">Until we meet beneath the lights</p><h2 className="script-title">Counting down to forever</h2><Countdown /><p className="countdown-date">05 December 2026 · India Standard Time</p></Reveal></section>
        <section className="rsvp-section section-pad" id="rsvp"><div className="rsvp-card"><Reveal reducedMotion={reducedMotion}><p className="eyebrow">Your presence is our present</p><h2 className="display-title">Will you<br /><i>join us?</i></h2><p className="rsvp-copy">We would be delighted to celebrate this new beginning with you.</p><form onSubmit={submit} data-testid="rsvp-form"><label>Your name<input required name="name" placeholder="How should we address you?" onChange={event => setRsvp({ ...rsvp, name: event.target.value })} data-testid="rsvp-name-input" /></label><label>Mobile number<input required name="mobile" type="tel" placeholder="Your contact number" onChange={event => setRsvp({ ...rsvp, mobile: event.target.value })} data-testid="rsvp-mobile-input" /></label><div className="form-row"><label>Will you join us?<select required name="attending" onChange={event => setRsvp({ ...rsvp, attending: event.target.value })} data-testid="rsvp-attendance-select"><option value="">Choose one</option><option>Joyfully accepts</option><option>Regretfully declines</option></select></label><label>Guests<select name="guests" onChange={event => setRsvp({ ...rsvp, guests: event.target.value })} data-testid="rsvp-guests-select"><option value="">Select</option><option>1 guest</option><option>2 guests</option><option>3+ guests</option></select></label></div><label>A note for the couple <textarea name="message" placeholder="Leave a little love (optional)" onChange={event => setRsvp({ ...rsvp, message: event.target.value })} data-testid="rsvp-message-input" /></label><button className="submit-button" type="submit" data-testid="rsvp-submit-button">Send my response <ArrowUpRight size={16} /></button></form></Reveal></div></section>
        <footer className="footer"><div className="footer-mark">M<span>✦</span>B</div><p className="eyebrow">With love and blessings</p><h2 className="script-title">Madhushri <i>&amp;</i> Bharath</h2><p>Two hearts. One forever.</p><span className="footer-date">05 — 06 December · 2026</span><Music2 size={15} className="footer-note" /></footer>
      </main>
    </motion.div>}</AnimatePresence>
    {lightbox && <div className="lightbox" role="dialog" aria-modal="true" aria-label={lightbox.alt} onClick={() => setLightbox(null)}><button onClick={() => setLightbox(null)} aria-label="Close image"><X /></button><img src={lightbox.src} alt={lightbox.alt} /></div>}
  </div>;
}

export default App;
