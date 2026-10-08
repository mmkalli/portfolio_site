import DigitalTwin from "@/components/DigitalTwin";
import { formatProfileMonth, profile } from "@/data/profile";

const ArrowUpRight = ({ size = 18 }: { size?: number }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 17L17 7M8 7h9v9" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const ArrowDown = () => (
  <svg
    aria-hidden="true"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 4v15m0 0-6-6m6 6 6-6"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

const LinkedIn = () => (
  <svg
    aria-hidden="true"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6.5 8.3H3.1V19h3.4V8.3ZM4.8 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM19 12.9c0-3.2-1.7-4.9-4-4.9-1.9 0-2.7 1-3.2 1.8V8.3H8.4V19h3.4v-5.3c0-1.4.3-2.8 2-2.8 1.7 0 1.8 1.6 1.8 2.9V19H19v-6.1Z" />
  </svg>
);

const tickerItems = [
  "TECHNICAL LEADERSHIP",
  "PRODUCT OWNERSHIP",
  "SOFTWARE ARCHITECTURE",
  "ENGINEERING MANAGEMENT",
] as const;

function yearsSince(start: string, now = new Date()): number {
  const [year, month] = start.split("-").map(Number);
  let years = now.getFullYear() - year;

  if (now.getMonth() + 1 < month) {
    years -= 1;
  }

  return years;
}

function roleYears(start: string, end: string | null): string {
  const startYear = start.slice(0, 4);
  return `${startYear} — ${end ? end.slice(0, 4) : "NOW"}`;
}

function TickerSequence({ copy }: { copy: number }) {
  return tickerItems.map((item) => (
    <span className="ticker-item" key={`${copy}-${item}`}>
      <span>{item}</span>
      <i>✦</i>
    </span>
  ));
}

export default function Home() {
  const careerYears = yearsSince(profile.roles.at(-1)!.start);
  const akbankYears = yearsSince(
    profile.roles.findLast((role) => role.company === "Akbank")!.start,
  );

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Mehmet Kalli — home">
          <span className="brand-mark">MK</span>
          <span className="brand-text">
            MEHMET KALLI
            <small>TECH / PRODUCT / LEADERSHIP</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#about">ABOUT</a>
          <a href="#journey">JOURNEY</a>
          <a href="#portfolio">WORK</a>
        </nav>
        <a className="header-cta" href={`mailto:${profile.contact.email}`}>
          LET&apos;S TALK
          <ArrowUpRight size={16} />
        </a>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-orbit orbit-one" aria-hidden="true" />
          <div className="hero-orbit orbit-two" aria-hidden="true" />

          <div className="hero-eyebrow">
            <span className="status-dot" />
            ISTANBUL, TR <span className="eyebrow-line" /> TECHNICAL LEADER
          </div>

          <div className="hero-title-wrap">
            <p className="hero-kicker">I BUILD THE SYSTEMS</p>
            <h1>
              <span>BEHIND</span>
              <span className="outline-text">AMBITION.</span>
            </h1>
          </div>

          <div className="hero-bottom">
            <p className="hero-intro">
              Technical Lead & Product Owner with a career spanning team
              leadership, software architecture, engineering management, and
              product ownership.
            </p>
            <a className="scroll-link" href="#about">
              <span>EXPLORE THE STORY</span>
              <ArrowDown />
            </a>
          </div>

          <div className="hero-index" aria-hidden="true">
            <span>01</span>
            <span>/ 05</span>
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            <span className="ticker-sequence">
              <TickerSequence copy={1} />
            </span>
            <span className="ticker-sequence">
              <TickerSequence copy={2} />
            </span>
          </div>
        </div>

        <section className="section about" id="about">
          <div className="section-label">
            <span>01</span>
            <p>ABOUT</p>
          </div>

          <div className="about-content">
            <p className="overline">A CAREER IN TECHNICAL LEADERSHIP.</p>
            <h2>
              From team leadership to product ownership
              <span className="accent">.</span>
            </h2>
            <div className="about-copy-grid">
              <p className="lead-copy">
                My background spans{" "}
                <strong>technology, product, and people</strong> across
                leadership, architecture, and management roles.
              </p>
              <div className="body-copy">
                <p>
                  Since 2011, my career has progressed from Team Leader at
                  VeriPark to Software Development Manager at OBSS, followed by
                  architecture roles at Akbank.
                </p>
                <p>
                  Today, I serve as Technical Lead & Product Owner at Akbank.
                </p>
              </div>
            </div>

            <div className="metrics">
              <article>
                <strong>
                  {careerYears}
                  <span>+</span>
                </strong>
                <p>YEARS OF EXPERIENCE</p>
              </article>
              <article>
                <strong>
                  {akbankYears}
                  <span>+</span>
                </strong>
                <p>YEARS AT AKBANK</p>
              </article>
              <article>
                <strong>{String(profile.roles.length).padStart(2, "0")}</strong>
                <p>CAREER ROLES</p>
              </article>
            </div>
          </div>
        </section>

        <section className="principles">
          <div className="principles-intro">
            <p className="overline">VERIFIED PROFILE</p>
            <h2>Professional foundation.</h2>
          </div>
          <div className="principle-list">
            <article>
              <span>01</span>
              <h3>CORE SKILLS</h3>
              <p>{profile.skills.join(" / ")}</p>
            </article>
            <article>
              <span>02</span>
              <h3>EDUCATION</h3>
              <p>
                {profile.education.degree}, {profile.education.institution}
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>CERTIFICATION</h3>
              <p>{profile.certification}</p>
            </article>
          </div>
        </section>

        <section className="section journey" id="journey">
          <div className="section-label light">
            <span>02</span>
            <p>CAREER JOURNEY</p>
          </div>

          <div className="journey-content">
            <div className="journey-heading">
              <p className="overline">THE LONG GAME</p>
              <h2>
                {careerYears} years.
                <br />
                One trajectory: <em>forward.</em>
              </h2>
            </div>

            <div className="timeline">
              {profile.roles.map((item) => (
                <article
                  className="timeline-row"
                  key={`${item.company}-${item.role}`}
                >
                  <div className="timeline-date">
                    <span className={item.end === null ? "live-dot" : ""} />
                    {roleYears(item.start, item.end)}
                  </div>
                  <div className="timeline-role">
                    <h3>{item.role}</h3>
                    <p>{item.company.toUpperCase()}</p>
                  </div>
                  <p className="timeline-copy">
                    {formatProfileMonth(item.start)} —{" "}
                    {formatProfileMonth(item.end)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="expertise section">
          <div className="section-label">
            <span>03</span>
            <p>EXPERTISE</p>
          </div>

          <div className="expertise-content">
            <p className="overline">DEPTH MEETS DIRECTION</p>
            <h2>Technology is the medium. Impact is the work.</h2>

            <div className="expertise-grid">
              <article className="expertise-card featured">
                <span className="card-number">01</span>
                <div>
                  <p className="card-tag">LEADERSHIP</p>
                  <h3>Technical & Product Ownership</h3>
                  <p>Current role: Technical Lead & Product Owner at Akbank.</p>
                </div>
              </article>
              <article className="expertise-card">
                <span className="card-number">02</span>
                <div>
                  <p className="card-tag">ARCHITECTURE</p>
                  <h3>Enterprise Systems</h3>
                  <p>
                    Software Architect and Senior Software Architect experience
                    at Akbank.
                  </p>
                </div>
              </article>
              <article className="expertise-card dark-card">
                <span className="card-number">03</span>
                <div>
                  <p className="card-tag">ENGINEERING</p>
                  <h3>.NET Core / C# / SQL</h3>
                  <p>Core technical skills listed in the verified profile.</p>
                </div>
                <div className="code-decoration" aria-hidden="true">
                  <span>01</span>
                  <span>10</span>
                  <span>11</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="portfolio" id="portfolio">
          <div className="portfolio-noise" aria-hidden="true" />
          <div className="portfolio-topline">
            <p>SELECTED WORK</p>
            <span>04 / 05</span>
          </div>
          <div className="portfolio-body">
            <span className="coming-soon">PORTFOLIO / COMING SOON</span>
            <h2>
              The work is in motion<span>.</span>
            </h2>
            <p>
              A curated collection of product, architecture, and leadership case
              studies is being prepared.
            </p>
            <a
              href={`mailto:${profile.contact.email}?subject=Let%27s%20connect`}
            >
              ASK ME ABOUT MY WORK
              <ArrowUpRight />
            </a>
          </div>
          <div className="portfolio-shape" aria-hidden="true">
            <span>MK</span>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-meta">
            <p className="overline">START A CONVERSATION</p>
            <p>Have a complex problem worth solving?</p>
          </div>
          <h2>
            LET&apos;S BUILD
            <br />
            WHAT&apos;S <em>NEXT.</em>
          </h2>
          <a className="contact-link" href={`mailto:${profile.contact.email}`}>
            <span>{profile.contact.email}</span>
            <span className="contact-arrow">
              <ArrowUpRight size={28} />
            </span>
          </a>
        </section>
      </main>
      <footer>
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark">MK</span>
          <span className="brand-text">MEHMET KALLI</span>
        </a>
        <p>© {new Date().getFullYear()} — ISTANBUL, TURKIYE</p>
        <div className="socials">
          <a
            href={`https://www.${profile.contact.linkedin}`}
            target="_blank"
            rel="noreferrer"
          >
            <LinkedIn />
            LINKEDIN
          </a>
          <a href="#top">
            BACK TO TOP
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </footer>
      <DigitalTwin />
    </>
  );
}
