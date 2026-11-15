import { useEffect, useMemo, useState } from "react";
import "@/app.css";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUpRight, CalendarDays, MapPin, Music2, Sparkles, X } from "lucide-react";
import "@/entrance.css";

const config = {
  couple: "Bharath & Madhushri",
  year: 2026,
  date: "5th & 6th December",
  venue: {
    name: "Sri Tirumala Kalyana Mantapa",
    address: "NH 369, Chitradurga, Kavadigarahatti, Karnataka 577502",
    directionsUrl: "https://maps.app.goo.gl/M2WxBGpP32XiYhDR6",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m16!1m11!1m3!1d3!2d76.3742495199002!3d14.218736934903795!2m2!1f0!2f90!3m2!1i1024!2i768!4f75!3m3!1m2!1s0x3bba752716b20417%3A0x1b3e5da89175012e!2sSri%20Tirumala%20Kalyana%20Mantapa!4v1794767340680",
  },
  gallery: [
    { src: "https://images.unsplash.com/photo-1600118569960-ea0f09f92d5b?auto=format&fit=crop&w=1400&q=85", alt: "A sunlit palace archway" },
    { src: "https://images.unsplash.com/photo-1561042771-abb14f50b8f4?auto=format&fit=crop&w=1400&q=85", alt: "Ornate palace architecture" },
    { src: "https://images.unsplash.com/photo-1699764681875-dd04ce36b1c3?auto=format&fit=crop&w=1400&q=85", alt: "Warm marigold wedding details" },
  ],
  events: [
    { date: "5th", month: "December", weekday: "Saturday", title: "Reception", time: "Evening - 7:00 PM onwards" },
    { date: "6th", month: "December", weekday: "Sunday", title: "Muhurtham", time: "8:40 AM – 9:30 AM" },
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

function downloadCalendarInvite() {
  const escapeIcsText = (value) => value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
  const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const description = "Reception evening: 5 December at 7:00 PM onwards.\nMuhurtha: 6 December, 8:40 AM - 9:30 AM.\nVenue: Sri Tirumala Kalyana Mantapa, NH 369, Chitradurga, Kavadigarahatti, Karnataka 577502.";
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
  const [lightbox, setLightbox] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const eventData = useMemo(() => config.events, []);

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
        <span className="envelope-paper"><span className="paper-kicker">A royal invitation</span><span className="paper-names">Bharath<br /><span className="paper-heart" aria-label="and">♥</span><br />Madhushri</span><span className="paper-date">{config.date} · {config.year}</span></span>
        <span className="envelope-flap" /><span className="wax-seal">❤️</span>
      </button>
      <p className="open-hint"><Sparkles size={14} /> Touch the seal to open</p>
      <div className="stage-bottom">A celebration of love <span>·</span> Karnataka, India</div>
    </section>}
    <AnimatePresence>{opened && <motion.div className="site-content" initial={reducedMotion ? false : { opacity: 0, rotateX: 5, y: 30 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} transition={{ duration: reducedMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}>
      <nav className="nav"><a className="monogram" href="#home" aria-label="Bharath and Madhushri home">B<span>✦</span>M</a><div className="nav-links">{[["home", "Our story"], ["celebrations", "Celebrations"], ["gallery", "Gallery"]].map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}</div></nav>
      <main>
        <section className="hero-section" id="home">
          <div className="hero-backdrop" />
          <div className="hero-ornament ornament-left" aria-hidden="true">✺</div>          <span className="mandala-symbol" aria-hidden="true"></span><div className="hero-blessing"><img className="ganesha-image" src="/ganesha.png" alt="" /><p className="eyebrow">With the blessings of our families</p></div><div className="hero-ornament ornament-right" aria-hidden="true"></div>
          <Reveal reducedMotion={reducedMotion} className="hero-intro"><h1 aria-label="Bharath and Madhushri"><span className="bouquet-type" style={{ backgroundImage: "url('/red-white-rose-bouquet.png')" }}>Bharath <span className="hero-heart" aria-hidden="true">♥</span> Madhushri</span></h1><p className="hero-caption">Two hearts, one beautiful beginning.</p><div className="hero-date"><CalendarDays size={15} /> 5th & 6th December · 2026</div><a className="outline-link" href="#story">Discover our invitation <ArrowDown size={14} /></a></Reveal>
          <div className="hero-photo-wrap" aria-label="Wedding portrait artwork"><div className="hero-photo"><img src="/bouquet.jpg" alt="Bharath and Madhushri together" /></div><div className="photo-caption">The beginning of forever </div></div>
          <span className="hero-side-note">A NEW CHAPTER · 2026</span>
        </section>
        <section className="intro-section section-pad" id="story"><div className="section-index">01 / OUR STORY</div><Reveal reducedMotion={reducedMotion}><p className="eyebrow">A note from our families</p><h2 className="display-title">A love story,<br /><i>written in the stars.</i></h2><p className="intro-copy">With the divine blessings of Lord Shiva and the love and blessings of our families, we joyfully invite you to celebrate the beautiful union of Bharath and Madhushri.</p><div className="intro-signature">With love <span>✦</span> Bharath &amp; Madhushri</div></Reveal><div className="intro-seal" aria-hidden="true"><strong>B<span>&amp;</span>M</strong></div></section>
        <section className="celebrations-section section-pad" id="celebrations">
          <div className="section-index">02 / THE CELEBRATIONS</div>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Gather with us</p>
              <h2 className="serif-title">Two days.<br /><i>One beginning.</i></h2>
            </div>
            <p className="heading-note">Every moment made more meaningful<br />with the people we love.</p>
          </div>
          <div className="event-timeline">
            {eventData.map((item, index) => <Reveal reducedMotion={reducedMotion} className={`event-card event-${index}`} key={item.date} delay={index * 0.12}>
              <div className="timeline-node">✦</div>
              <div className="event-date"><strong>{item.date}</strong><span>{item.month}</span><small>{item.weekday}</small></div>
              <div className="event-details">
                <span className="event-number">0{index + 1} · CHAPTER</span>
                <h3>{item.title}</h3>
                <p>{item.time}</p>
              </div>
              <div className="event-art" aria-hidden="true">{index === 0 ? "I" : "II"}</div>
            </Reveal>)}
          </div>
          <div className="venue-card">
            <div className="venue-copy">
              <p className="eyebrow">Our venue</p>
              <h3>{config.venue.name}</h3>
              <p className="venue-address">{config.venue.address}</p>
              <a className="venue-directions" href={config.venue.directionsUrl} target="_blank" rel="noreferrer">
                <MapPin size={15} /> Get directions <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="venue-map">
              <iframe
                src={config.venue.mapEmbedUrl}
                title={`Map to ${config.venue.name}`}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </section>
        <section className="family-section section-pad"><div className="section-index">03 / OUR FAMILIES</div><Reveal reducedMotion={reducedMotion}><p className="eyebrow">Two families, one home</p><h2 className="serif-title">The soul synced <i>two.</i></h2></Reveal><div className="family-grid">{[{ label: "The bride's family", image: config.gallery[1] }, { label: "The groom's family", image: config.gallery[2] }].map((family, index) => <Reveal reducedMotion={reducedMotion} className="family-card" key={family.label} delay={index * .1}><div className="family-image"><img src={family.image.src} alt={family.image.alt} loading="lazy" /></div><p>{family.label}</p><span>With love and blessings</span></Reveal>)}</div><div className="family-ampersand" aria-hidden="true">&amp;</div></section>
        <section className="gallery-section section-pad" id="gallery"><div className="section-index">04 / MOMENTS TO KEEP</div><div className="section-heading"><div><p className="eyebrow">A glimpse of the feeling</p><h2 className="serif-title">Frames from<br /><i>our story.</i></h2></div><p className="heading-note">Little moments, lasting memories.</p></div><div className="gallery-grid">{config.gallery.map((image, index) => <motion.button className={`gallery-item gallery-${index}`} whileHover={reducedMotion ? undefined : { rotateY: index === 1 ? -4 : 4, rotateX: -3, scale: 1.025, z: 28 }} onClick={() => setLightbox(image)} key={image.src} aria-label={`View photo: ${image.alt}`}><img src={image.src} alt={image.alt} loading="lazy" /><span>0{index + 1} <ArrowUpRight size={13} /></span></motion.button>)}</div></section>
        <section className="countdown-section section-pad"><Reveal reducedMotion={reducedMotion}><div className="countdown-flower" aria-hidden="true">✺</div><p className="eyebrow">Until we meet beneath the lights</p><h2 className="script-title">Counting down to forever</h2><Countdown /><p className="countdown-date">5th December 2026 · India Standard Time</p><button className="calendar-button" type="button" onClick={downloadCalendarInvite}><CalendarDays size={16} /> Add to calendar</button></Reveal></section>
        <footer className="footer"><div className="footer-mark">B<span>✦</span>M</div><p className="eyebrow">With love and blessings</p><h2 className="script-title">Bharath <i>&amp;</i> Madhushri</h2><p>Two hearts. One forever.</p><span className="footer-date">5th & 6th December · 2026</span><Music2 size={15} className="footer-note" /></footer>
      </main>
    </motion.div>}</AnimatePresence>
    {lightbox && <div className="lightbox" role="dialog" aria-modal="true" aria-label={lightbox.alt} onClick={() => setLightbox(null)}><button onClick={() => setLightbox(null)} aria-label="Close image"><X /></button><img src={lightbox.src} alt={lightbox.alt} /></div>}
  </div>;
}

export default App;
