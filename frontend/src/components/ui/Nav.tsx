import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { LuChevronDown, LuMenu, LuUserRound, LuX } from "react-icons/lu";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

type MenuLink = { to: string; label: string };

const publicLinks: MenuLink[] = [
  { to: "/", label: "Home" },
  { to: "/timeline", label: "Timeline" },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `inline-flex min-h-11 items-center border-b-2 px-1 text-sm font-semibold transition-colors ${
    isActive ? "border-accent text-content" : "border-transparent text-content-muted hover:text-content"
  }`;
}

export default function Nav() {
  const { isAuth, logout, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const locationKey = `${location.pathname}${location.search}`;
  const navRef = useRef<HTMLElement>(null);
  const [mobileMenuLocation, setMobileMenuLocation] = useState<string | null>(null);
  const [accountMenuLocation, setAccountMenuLocation] = useState<string | null>(null);
  const mobileOpen = mobileMenuLocation === locationKey;
  const accountOpen = accountMenuLocation === locationKey;

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileMenuLocation(null);
        setAccountMenuLocation(null);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuLocation(null);
        setAccountMenuLocation(null);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  async function handleLogout() {
    await logout();
    addToast({ message: "You are logged out, bye for now!", type: "info" });
    navigate("/timeline");
  }

  const accountLinks: MenuLink[] = isAuth.token
    ? [
        { to: `/user/${isAuth.id}`, label: "Profile" },
        ...(isAuth.role === "ADMIN" || isAuth.role === "MODERATOR"
          ? [{ to: "/review-suggestions", label: "Review suggestions" }]
          : []),
        { to: "/articles/create", label: "Create article" },
        { to: "/terms", label: "Terms" },
        { to: "/privacy", label: "Privacy" },
        { to: "/cookies", label: "Cookies" },
      ]
    : [
        { to: "/login", label: "Log in" },
        { to: "/register", label: "Register" },
        { to: "/terms", label: "Terms" },
        { to: "/privacy", label: "Privacy" },
        { to: "/cookies", label: "Cookies" },
      ];

  return (
    <nav ref={navRef} aria-label="Primary navigation" className="fixed inset-x-0 top-0 z-50 h-[var(--nav-height)] border-b border-divider/70 bg-canvas/95 shadow-lg shadow-black/15 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/timeline" aria-label="TL;DR History timeline" className="flex min-w-0 shrink-0 items-center rounded-sm">
          <img src="/tldr-history-logo.svg" alt="TL;DR History" className="h-8 w-auto max-w-[170px] sm:h-9 sm:max-w-[220px]" />
        </Link>

        <div className="hidden h-full items-center gap-7 md:flex">
          {publicLinks.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="inline-flex size-11 items-center justify-center rounded-full border border-divider text-content md:hidden"
            onClick={() => {
              setMobileMenuLocation(mobileOpen ? null : locationKey);
              setAccountMenuLocation(null);
            }}
          >
            {mobileOpen ? <LuX aria-hidden="true" /> : <LuMenu aria-hidden="true" />}
          </button>

          <div className="relative">
            <button
              type="button"
              aria-label="Account menu"
              aria-expanded={accountOpen}
              aria-controls="account-navigation"
              disabled={loading}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-divider px-3 text-content transition-colors hover:border-control hover:bg-surface disabled:cursor-wait disabled:opacity-60"
              onClick={() => {
                setAccountMenuLocation(accountOpen ? null : locationKey);
                setMobileMenuLocation(null);
              }}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm text-accent" aria-label="Loading account" />
              ) : (
                <LuUserRound aria-hidden="true" className="size-5" />
              )}
              <span className="hidden max-w-28 truncate text-sm font-semibold sm:inline">
                {isAuth.token ? isAuth.username || "Account" : "Account"}
              </span>
              <LuChevronDown aria-hidden="true" className="hidden size-4 sm:block" />
            </button>

            {!loading && accountOpen && (
              <div id="account-navigation" className="atlas-surface absolute right-0 top-[calc(100%+0.6rem)] w-56 rounded-xl p-2">
                {accountLinks.map((item) => (
                  <Link key={`${item.to}-${item.label}`} to={item.to} className="flex min-h-11 items-center rounded-lg px-3 text-sm text-content-muted transition-colors hover:bg-surface-raised hover:text-content">
                    {item.label}
                  </Link>
                ))}
                {isAuth.token && (
                  <button type="button" onClick={() => void handleLogout()} className="flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm text-danger transition-colors hover:bg-surface-raised">
                    Log out
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-navigation" className="atlas-surface absolute inset-x-3 top-[calc(100%+0.5rem)] rounded-xl p-2 md:hidden">
          {publicLinks.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold ${isActive ? "bg-surface-raised text-accent" : "text-content-muted hover:bg-surface hover:text-content"}`}>
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
