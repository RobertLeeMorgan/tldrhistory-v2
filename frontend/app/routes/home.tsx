import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { LuArrowRight, LuBookOpen, LuGlobe, LuLandmark, LuUsers } from "react-icons/lu";
import { buildMeta } from "../../src/lib/seo";
import PageContainer from "../../src/components/ui/PageContainer";
import TimelineSearchField from "../../src/features/filter/components/TimelineSearchField";
import { DEFAULT_TIMELINE_FILTER } from "../../src/features/filter/components/TimelineFilter";
import { filterToSearchParams } from "../../src/features/filter/components/timelineFilterParams";
import heroImage from "../../src/assets/images/home/hero.png";
import exploreImage from "../../src/assets/images/home/explore.png";
import ancientChinaImage from "../../src/assets/images/home/ancientchina.jpg";
import preColombiaImage from "../../src/assets/images/home/precolombia.jpg";
import blackHistoryImage from "../../src/assets/images/home/blackhistory.jpg";
import feminismImage from "../../src/assets/images/home/feminism.jpg";
import wwiiImage from "../../src/assets/images/home/wwii.jpg";
import medievalImage from "../../src/assets/images/home/medieval.jpg";
import eurasianImage from "../../src/assets/images/home/aurasian.jpg";
import worldConnectsImage from "../../src/assets/images/home/worldconnects.jpg";
import intellectualImage from "../../src/assets/images/home/intellectualexplosion.jpg";
import parallelImage from "../../src/assets/images/home/parallelsuperpowers.jpg";

// React Router consumes this alongside the route component.
// eslint-disable-next-line react-refresh/only-export-components
export function meta() {
  return buildMeta({
    title: "TLDR History – Interactive Human History Timeline",
    description:
      "TLDR History is an interactive visual timeline of human history, exploring civilisations, population changes, and influential events across eras.",
    path: "/",
    type: "website",
  });
}

const topGroups = [
  { to: "/timeline/ancient-china", label: "Ancient China", years: "2100 BCE – 220 CE", blurb: "Dynasties, philosophy, warfare, and imperial foundations.", image: ancientChinaImage },
  { to: "/timeline/?c=NorthAmerica%2CSouthAmerica&ys=-3000&ye=1572", label: "Pre-Columbian Americas", years: "3000 BCE – 1572 CE", blurb: "From Olmec and Maya worlds to the Aztec and Inca, explore Andean civilizations and Mesoamerica.", image: preColombiaImage },
  { to: "/timeline/black-history", label: "Black History", years: "1500 CE – 2025 CE", blurb: "Resistance, culture, emancipation, civil rights, and global Black history.", image: blackHistoryImage },
  { to: "/timeline/feminism", label: "Feminism", years: "1792 CE – 2025 CE", blurb: "Ideas, movements, rights, and struggles for gender equality.", image: feminismImage },
  { to: "/timeline/wwii", label: "WWII", years: "1939 CE – 1945 CE", blurb: "Global war, occupation, genocide, resistance, and a remade world order.", image: wwiiImage },
  { to: "/timeline/medieval-europe", label: "Medieval Europe", years: "500 CE – 1500 CE", blurb: "Faith, warfare, kingship, and everyday life in the medieval West.", image: medievalImage },
];

const lenses = [
  { title: "Intellectual history", to: "/timeline?t=person,event&s=intellectual", blurb: "Thinkers, schools, philosophy, science, and ideas across time.", icon: LuBookOpen },
  { title: "Art and culture", to: "/timeline?t=person,event&s=art", blurb: "Music, visual art, literature, and cultural development through history.", icon: LuLandmark },
  { title: "Military history", to: "/timeline?t=landmark,event&s=military", blurb: "Wars, campaigns, leaders, and the evolution of conflict.", icon: LuGlobe },
  { title: "Religion and belief", to: "/timeline?t=event,person&s=religion", blurb: "Faith, institutions, movements, and spiritual transformation.", icon: LuUsers },
];

const timeSlices = [
  { title: "Explosive Eurasian Convergence", years: "1200–1300", blurb: "War, trade, science, and empire colliding across connected Eurasia.", detail: "Mongol conquests, Crusades, Islamic knowledge production, Song Dynasty technology and economy, and Angkor at its peak.", to: "/timeline?ys=1200&ye=1300", image: eurasianImage },
  { title: "The World Connects", years: "1490–1530", blurb: "Independent worlds suddenly collide as the Americas enter the global system.", detail: "Columbus, Spanish conquest of the Aztec Empire, Ottoman expansion, Ming inward turn, and Vijayanagara thriving.", to: "/timeline?ys=1490&ye=1530", image: worldConnectsImage },
  { title: "Simultaneous Intellectual Explosion", years: "around 500 BCE", blurb: "Different civilisations independently producing foundational philosophies and ideas.", detail: "Classical Greece, Warring States China, Buddha’s teachings, and Achaemenid imperial dominance.", to: "/timeline?ys=-550&ye=-400", image: intellectualImage },
  { title: "Parallel Superpowers", years: "70–220 CE", blurb: "Massive empires linked by trade routes and shared Eurasian systems.", detail: "Roman peak, Han peak, Kushan Empire, and the Silk Road in full use.", to: "/timeline?ys=70&ye=220", image: parallelImage },
];

const overlapFacts = [
  { eyebrow: "Same-time fact", title: "Medieval Europe and the Islamic Golden Age overlapped", body: "Europe fragmented and feudal while scholarship, medicine, and astronomy flourished elsewhere.", to: "/timeline?ys=750&ye=1250" },
  { eyebrow: "Same-time fact", title: "Samurai and cowboys shared the nineteenth century", body: "Japan’s samurai era and the American Wild West existed in the same broad historical moment.", to: "/timeline?ys=1800&ye=1900" },
  { eyebrow: "Same-time fact", title: "Oxford is older than the Aztec Empire", body: "A medieval university predates one of the most famous empires in the Americas.", to: "/timeline?ys=1096&ye=1521" },
];

const popularSearches = [
  { to: "/timeline/ancient-rome", label: "Ancient Rome" },
  { to: "/timeline/ancient-greece", label: "Ancient Greece" },
  { to: "/timeline/ancient-egypt", label: "Ancient Egypt" },
];

function ArrowLink({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-bold text-[#765017]">
      {children}
      <LuArrowRight aria-hidden="true" />
    </span>
  );
}

export default function HomeRoute() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const openSearch = () => {
    const query = search.trim();
    if (!query) {
      navigate("/timeline");
      return;
    }
    const params = filterToSearchParams(
      { ...DEFAULT_TIMELINE_FILTER, search: query },
      new URLSearchParams(),
    );
    navigate({ pathname: "/timeline", search: "?" + params.toString() });
  };

  return (
    <PageContainer variant="discovery">
      <section className="relative isolate min-h-[min(780px,calc(100dvh-var(--nav-height)))] overflow-hidden border-b border-divider">
        <img src={heroImage} alt="" aria-hidden="true" fetchPriority="high" className="absolute inset-0 -z-20 size-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,14,17,.96)_0%,rgba(7,14,17,.56)_5%)]" />
        <div className="mx-auto flex min-h-[min(780px,calc(100dvh-var(--nav-height)))] w-full flex-col items-center justify-center px-4 py-12 text-center sm:px-6 lg:px-8">
            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-semibold leading-[1.02] text-content sm:text-6xl lg:text-7xl">
              Explore history <span className="text-accent">as a connected timeline.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-content-muted sm:text-lg">
              Follow people, events, cultures, and empires across eras. Move through time visually, compare what was happening at once, and jump into the parts of history that interest you most.
            </p>
            <TimelineSearchField value={search} onChange={setSearch} onSubmit={openSearch} label="Search history from the homepage" placeholder="Search for an event, person, place, or topic…" className="mt-8 max-w-2xl" />
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/timeline" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-on-accent transition-colors hover:bg-accent-strong">Open the timeline <LuArrowRight aria-hidden="true" /></Link>
              <Link to="/timeline/modern-era" className="inline-flex min-h-11 items-center justify-center rounded-full border border-control bg-canvas/60 px-6 py-3 text-sm font-bold text-content transition-colors hover:border-accent hover:text-accent">Start with the modern era</Link>
            </div>
            <nav aria-label="Popular searches" className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="mr-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-content-muted">Popular</span>
              {popularSearches.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="inline-flex min-h-8 items-center rounded-full border border-divider bg-canvas/65 px-3 py-1 text-xs font-semibold text-content-muted backdrop-blur-sm transition-colors hover:border-accent hover:bg-surface hover:text-content"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
        </div>
      </section>

      <div className="reading-surface">
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="atlas-eyebrow !text-[#765017]">Featured paths</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">Good places to begin</h2>
            <p className="mt-4 text-base leading-7 text-ink/75">These curated themes work better than throwing new visitors directly into every possible filter at once.</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topGroups.map((theme) => (
              <Link key={theme.to} to={theme.to} className="group overflow-hidden rounded-xl border border-[#d4ccbe] bg-cream-raised shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="aspect-[16/9] overflow-hidden bg-[#eee6d8]"><img src={theme.image} alt="" loading="lazy" className="size-full object-cover transition duration-300 group-hover:scale-[1.025]" /></div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#765017]">{theme.years}</p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold text-ink">{theme.label}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-ink/70">{theme.blurb}</p>
                  <span className="mt-5 block"><ArrowLink>Explore theme</ArrowLink></span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-[#d4ccbe] bg-[#eee6d8]/45">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8 lg:py-24">
            <div className="self-start lg:sticky lg:top-24">
              <p className="atlas-eyebrow !text-[#765017]">Why this is different</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">See what was happening at the same time</h2>
              <p className="mt-5 text-base leading-7 text-ink/75">History makes more sense when events are placed beside one another rather than sealed inside separate chapters. Use the timeline to compare societies, ideas, conflicts, and cultural movements across the same centuries.</p>
              <Link to="/timeline" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#765017] px-5 py-2.5 text-sm font-bold text-[#765017]">Compare eras in the timeline <LuArrowRight aria-hidden="true" /></Link>
            </div>
            <div className="grid gap-5">
              {timeSlices.map((item) => (
                <Link key={item.title} to={item.to} className="group grid overflow-hidden rounded-xl border border-[#d4ccbe] bg-cream-raised shadow-sm sm:grid-cols-[180px_1fr]">
                  <div className="aspect-[16/9] overflow-hidden bg-[#eee6d8] sm:aspect-auto"><img src={item.image} alt="" loading="lazy" className="size-full object-cover transition duration-300 group-hover:scale-[1.025]" /></div>
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#765017]">{item.years}</p>
                    <h3 className="mt-1 font-serif text-2xl font-semibold text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink/80">{item.blurb}</p>
                    <p className="mt-2 text-sm leading-6 text-ink/60">{item.detail}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="atlas-eyebrow !text-[#765017]">Browse by lens</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-ink">Start with a filter, not a blank slate</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink/75">Keep this lighter than the main app filter UI. It should feel like a guided starting point, not the full controls panel.</p>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lenses.map((lens) => {
              const Icon = lens.icon;
              return (
                <Link key={lens.title} to={lens.to} className="group rounded-xl border border-[#d4ccbe] bg-cream-raised p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#eee6d8] text-[#765017]"><Icon aria-hidden="true" /></span>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-ink">{lens.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/70">{lens.blurb}</p>
                  <span className="mt-5 block"><ArrowLink>Explore lens</ArrowLink></span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="grid gap-5 lg:grid-cols-3">
            {overlapFacts.map((item) => (
              <Link key={item.title} to={item.to} className="group rounded-xl border-l-4 border-[#b98539] bg-[#eee6d8]/65 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#765017]">{item.eyebrow}</p>
                <h3 className="mt-3 font-serif text-2xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/70">{item.body}</p>
                <span className="mt-5 block"><ArrowLink>See the overlap</ArrowLink></span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="relative isolate overflow-hidden border-t border-divider">
        <img src={exploreImage} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover object-center opacity-65" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,16,19,.97),rgba(8,16,19,.72))]" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="atlas-eyebrow">Ready to explore</p>
          <h2 className="mt-3 max-w-2xl font-serif text-4xl font-semibold text-content sm:text-5xl">Open the full timeline of human history</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-content-muted">Jump between eras, compare cultures, and follow the people and events that shaped the world.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/timeline" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-on-accent">Open timeline <LuArrowRight aria-hidden="true" /></Link>
            <Link to="/timeline?t=person,event&s=culture" className="inline-flex min-h-11 items-center justify-center rounded-full border border-control bg-canvas/70 px-6 py-3 text-sm font-bold text-content hover:border-accent">Explore culture</Link>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
