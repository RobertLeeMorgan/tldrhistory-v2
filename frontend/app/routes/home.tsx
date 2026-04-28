import type { Route } from "./+types/home";
import { Link } from "react-router";
import { buildMeta } from "../../src/lib/seo";
import PageContainer from "../../src/components/ui/PageContainer";

export function meta({}: Route.MetaArgs) {
  return buildMeta({
    title: "TLDR History – Interactive Human History Timeline",
    description:
      "TLDR History is an interactive visual timeline of human history, exploring civilisations, population changes, and influential events across eras.",
    path: "/",
    type: "website",
  });
}

const topGroups = [
  {
    slug: "ancient-china",
    label: "Ancient China",
    years: "2100 BCE – 220 CE",
    blurb: "Dynasties, philosophy, warfare, and imperial foundations.",
  },

  {
    slug: "?c=NorthAmerica%2CSouthAmerica&ys=-3000&ye=1572",
    label: "Pre-Columbian Americas",
    years: "3000 BCE – 1572 CE",
    blurb:
      "From Olmec and Maya worlds to the Aztec and Inca, explore Andean civilizations and Mesoamerica.",
  },
  {
    slug: "black-history",
    label: "Black History",
    years: "1500 CE – 2025 CE",
    blurb:
      "Resistance, culture, emancipation, civil rights, and global Black history.",
  },
  {
    slug: "feminism",
    label: "Feminism",
    years: "1792 CE – 2025 CE",
    blurb: "Ideas, movements, rights, and struggles for gender equality.",
  },
  {
    slug: "wwii",
    label: "WWII",
    years: "1939 CE – 1945 CE",
    blurb:
      "Global war, occupation, genocide, resistance, and a remade world order.",
  },
  {
    slug: "medieval-europe",
    label: "Medieval Europe",
    years: "500 CE – 1500 CE",
    blurb: "Faith, warfare, kingship, and everyday life in the medieval West.",
  },
];

const lenses = [
  {
    title: "Intellectual history",
    to: "/timeline?t=person,event&s=intellectual",
    blurb: "Thinkers, schools, philosophy, science, and ideas across time.",
  },
  {
    title: "Art and culture",
    to: "/timeline?t=person,event&s=art",
    blurb:
      "Music, visual art, literature, and cultural development through history.",
  },
  {
    title: "Military history",
    to: "/timeline?t=landmark,event&s=military",
    blurb: "Wars, campaigns, leaders, and the evolution of conflict.",
  },
  {
    title: "Religion and belief",
    to: "/timeline?t=event,person&s=religion",
    blurb: "Faith, institutions, movements, and spiritual transformation.",
  },
];

const timeSlices = [
  {
    title: "Explosive Eurasian Convergence",
    years: "1200–1300",
    blurb:
      "War, trade, science, and empire colliding across connected Eurasia.",
    detail:
      "Mongol conquests, Crusades, Islamic knowledge production, Song Dynasty technology and economy, and Angkor at its peak.",
    to: "/timeline?ys=1200&ye=1300",
  },
  {
    title: "The World Connects",
    years: "1490–1530",
    blurb:
      "Independent worlds suddenly collide as the Americas enter the global system.",
    detail:
      "Columbus, Spanish conquest of the Aztec Empire, Ottoman expansion, Ming inward turn, and Vijayanagara thriving.",
    to: "/timeline?ys=1490&ye=1530",
  },
  {
    title: "Simultaneous Intellectual Explosion",
    years: "around 500 BCE",
    blurb:
      "Different civilisations independently producing foundational philosophies and ideas.",
    detail:
      "Classical Greece, Warring States China, Buddha’s teachings, and Achaemenid imperial dominance.",
    to: "/timeline?ys=-550&ye=-400",
  },
  {
    title: "Collapse Everywhere",
    years: "around 1350",
    blurb: "A global systemic shock, not just one region collapsing.",
    detail:
      "Black Death devastation, Mongol fragmentation, Yuan instability, and trade-network shock.",
    to: "/timeline?ys=1340&ye=1399",
  },
  {
    title: "Birth of the Modern World",
    years: "1800–1820",
    blurb:
      "Modern politics, industry, and nationalism ignite while some regions remain more static.",
    detail:
      "French Revolution aftermath, Napoleonic Wars, Industrial Revolution acceleration, Latin American independence movements, and Tokugawa Japan still isolated.",
    to: "/timeline?ys=1800&ye=1820",
  },
  {
    title: "Total Global Crisis",
    years: "1917–1920",
    blurb:
      "War, revolution, pandemic, and geopolitical reset in one tight window.",
    detail:
      "World War I ending, Russian Revolution, Spanish flu, and collapsing empires.",
    to: "/timeline?ys=1917&ye=1920",
  },
  {
    title: "Parallel Superpowers",
    years: "70–220 CE",
    blurb:
      "Massive empires linked by trade routes and shared Eurasian systems.",
    detail:
      "Roman peak, Han peak, Kushan Empire, and the Silk Road in full use.",
    to: "/timeline?ys=70&ye=220",
  },
];

const overlapFacts = [
  {
    eyebrow: "Same-time fact",
    title: "Medieval Europe and the Islamic Golden Age overlapped",
    body: "Europe fragmented and feudal while scholarship, medicine, and astronomy flourished elsewhere.",
    to: "/timeline?ys=750&ye=1250",
  },
  {
    eyebrow: "Same-time fact",
    title: "Samurai and cowboys shared the nineteenth century",
    body: "Japan’s samurai era and the American Wild West existed in the same broad historical moment.",
    to: "/timeline?ys=1800&ye=1900",
  },
  {
    eyebrow: "Same-time fact",
    title: "Oxford is older than the Aztec Empire",
    body: "A medieval university predates one of the most famous empires in the Americas.",
    to: "/timeline?ys=1096&ye=1521",
  }
];

const startHere = [
  {
    slug: "ancient-egypt",
    eyebrow: "Early civilization",
    label: "Ancient Egypt",
    blurb: "Dynasties, religion, pharaohs, and life shaped by the Nile.",
  },
  {
    slug: "ancient-greece",
    eyebrow: "Classical world",
    label: "Ancient Greece",
    blurb: "City-states, philosophy, warfare, and the classical world.",
  },
  {
    slug: "ancient-rome",
    eyebrow: "Empire and power",
    label: "Ancient Rome",
    blurb: "Republic, empire, conquest, and the remaking of the Mediterranean.",
  },
];

export default function HomeRoute() {
  return (
    <PageContainer>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.2fr)_380px] lg:items-start">
          <div className="max-w-3xl rounded-3xl border border-stone-100/10 bg-stone-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-8 lg:p-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
              TLDR History
            </p>

            <h1 className="max-w-2xl font-serif text-4xl font-semibold leading-tight text-stone-100 sm:text-5xl lg:text-6xl">
              Explore history as a connected timeline
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
              Follow people, events, cultures, and empires across eras. Move
              through time visually, compare what was happening at once, and
              jump into the parts of history that interest you most.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/timeline"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-gold"
              >
                Open the timeline
              </Link>

              <Link
                to="/timeline/modern-era"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-100/15 bg-stone-100/5 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-stone-100/10"
              >
                Start with the modern era
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl border border-stone-100/10 bg-stone-950/80 p-6 backdrop-blur-md sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              Start here
            </p>

            <div className="mt-5 space-y-4">
              {startHere.map((item) => (
                <Link
                  key={item.slug}
                  to={`/timeline/${item.slug}`}
                  className="block rounded-2xl border border-stone-100/10 bg-stone-100/5 p-4 transition hover:bg-stone-100/10"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
                    {item.eyebrow}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-stone-100">
                    {item.label}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-stone-300">
                    {item.blurb}
                  </p>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Featured paths
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-stone-100 sm:text-4xl">
            Good places to begin
          </h2>
          <p className="mt-4 text-base leading-7 text-stone-300">
            These curated themes work better than throwing new visitors directly
            into every possible filter at once.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topGroups.map((theme) => (
            <Link
              key={theme.slug}
              to={`/timeline/${theme.slug}`}
              className="group rounded-3xl border border-stone-100/10 bg-stone-950/80 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:bg-stone-900/70"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
                {theme.years}
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-stone-100">
                {theme.label}
              </h3>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                {theme.blurb}
              </p>
              <span className="mt-6 inline-flex items-center text-sm font-medium text-gold transition group-hover:text-gold">
                Explore theme →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="rounded-3xl border border-stone-100/10 bg-stone-950/80 p-6 backdrop-blur-md sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              Why this is different
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-stone-100">
              See what was happening at the same time
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-300">
              History makes more sense when events are placed beside one another
              rather than sealed inside separate chapters. Use the timeline to
              compare societies, ideas, conflicts, and cultural movements across
              the same centuries.
            </p>

            <div className="mt-8">
              <Link
                to="/timeline"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-100/15 bg-stone-100/5 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-stone-100/10"
              >
                Compare eras in the timeline
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {timeSlices.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="rounded-3xl border border-stone-100/10 bg-stone-950/80 p-6 backdrop-blur-md transition hover:bg-stone-900/70"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
                  {item.years}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-stone-100">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-300">
                  {item.blurb}
                </p>
                <p className="mt-3 text-sm leading-6 text-stone-400">
                  {item.detail}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Browse by lens
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-stone-100 sm:text-4xl">
            Start with a filter, not a blank slate
          </h2>
          <p className="mt-4 text-base leading-7 text-stone-300">
            Keep this lighter than the main app filter UI. It should feel like a
            guided starting point, not the full controls panel.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {lenses.map((group) => (
            <Link
              key={group.title}
              to={group.to}
              className="rounded-3xl border border-stone-100/10 bg-stone-950/80 p-6 backdrop-blur-md transition hover:bg-stone-900/70"
            >
              <h3 className="text-lg font-semibold text-stone-100">
                {group.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-stone-300">
                {group.blurb}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-4 lg:grid-cols-3">
          {overlapFacts.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="rounded-3xl border border-stone-100/10 bg-stone-950/80 p-6 backdrop-blur-md transition hover:bg-stone-900/70"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
                {item.eyebrow}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-stone-100">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                {item.body}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-[2rem] border border-stone-100/10 bg-stone-950/80 p-8 text-center backdrop-blur-md sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Ready to explore
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-stone-100 sm:text-4xl">
            Open the full timeline of human history
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-300">
            Jump between eras, compare cultures, and follow the people and
            events that shaped the world.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/timeline"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-gold"
            >
              Open timeline
            </Link>

            <Link
              to="/timeline?t=person,event&s=culture"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-100/15 bg-stone-100/5 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-stone-100/10"
            >
              Explore culture
            </Link>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
