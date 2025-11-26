import { useEra } from "../context/EraContext";
import { formatYear, formatYearNumberOnly } from "../utils/formatYear";
import bg from "../assets/bg-home.webp";
import { splitHeadline } from "../utils/splitHeadline";
import { useHeadlineQuery } from "../hooks/useQueries";

export default function EraHeader() {
  const { startYear, endYear, Icon, label } = useEra();

 const { data: headlineData } = useHeadlineQuery({ startYear, endYear });
const headline = headlineData?.getHeadline ?? label;

const { title, subtitle } = splitHeadline(headline);

  return (
    <div className="hero" style={{ backgroundImage: `url(${bg})` }}>
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-left">
        <header className="sticky top-0 z-40 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-[150px_minmax(0,1fr)_96px] gap-8 items-center">
              {/* LEFT */}
              <div className="flex flex-col items-start md:items-end whitespace-nowrap">
                {[startYear, endYear + 1].map((y, i) => (
                  <div
                    key={i}
                    className="flex items-baseline gap-1 mt-2 md:mt-0"
                  >
                    <span className="text-4xl md:text-5xl font-semibold leading-none tracking-tight">
                      {formatYearNumberOnly(y)}
                    </span>
                    <span className="text-sm md:text-md opacity-70 tracking-tight">
                      {formatYear(y)}
                    </span>
                  </div>
                ))}
              </div>

              {/* CENTER */}
              <div className="flex flex-col justify-center text-left max-w-[600px] min-w-[600px]">
                <div className="flex items-center gap-4">
                  <div className="md:block w-[2px] bg-base-300 h-30" />

                  <div className="flex items-start gap-3">
                    <div className="px-3">
                      <h1 className="text-xl md:text-2xl lg:text-3xl font-serif font-extrabold leading-tight uppercase tracking-tight">
                        {title}
                      </h1>
                      {subtitle && (
                        <div className="mt-1 text-lg md:text-base font-serif tracking-tight uppercase opacity-80">
                          — {subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center justify-end">
                {Icon && (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-base-200 border border-base-300 flex items-center justify-center shadow-sm">
                      <Icon className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};
