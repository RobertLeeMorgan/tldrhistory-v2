import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Timeline from '../frontend/src/features/timeline/components/Timeline';
import TimelineToolbar from '../frontend/src/features/timeline/components/TimelineToolbar';
import WorldMap from '../frontend/src/components/map/WorldMap';
import { EraProvider, useEra } from '../frontend/src/context/EraContext';
import { TimelineFilterProvider, useTimelineFilter } from '../frontend/src/context/FilterContext';
import { ToastProvider } from '../frontend/src/context/ToastContext';
import Drawer from '../frontend/src/components/drawer/Drawer';
import Nav from '../frontend/src/components/ui/Nav';
import TimelineHeader from '../frontend/src/features/timeline/components/TimelineHeader';
import TimelineStats from '../frontend/src/features/timeline/components/TimelineStats';

function App() {
  const { filter, resetFilter } = useTimelineFilter();
  const era = useEra();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => { (window as any).navigateFixture = navigate; }, [navigate]);
  return <div data-app-root className="relative min-h-screen bg-canvas text-content">
    <Nav />
    <output id="era" className="sr-only" data-year={era.dataStartYear}>{era.label}</output>
    <button id="saved" className="sr-only" onClick={() => navigate('/timeline?q=saved')}>Saved search</button>
    <button id="reset" className="sr-only" onClick={() => resetFilter({ replace: false })}>Reset</button>
    <button id="reverse" className="sr-only" onClick={() => navigate('/timeline?o=desc')}>Reverse</button>
    <button id="region" className="sr-only" onClick={() => era.setView(era.view === 'global' ? 'europe' : 'global')}>Region</button>
    <div className="relative z-10 w-full pt-[var(--nav-height)]">
      <TimelineHeader filter={filter} />
      <main className="relative z-10 min-h-screen bg-canvas pt-[var(--timeline-header-height)]">
        <div className="relative mx-auto max-w-[1600px] lg:pl-[var(--timeline-sidebar-width)]">
          <TimelineStats filter={filter} />
          <section id="timeline-feed" className="min-w-0 px-4 pb-40 sm:px-6 lg:px-7 lg:pb-20">
            <TimelineToolbar onOpenDrawer={() => setDrawerOpen(true)} />
            <Timeline filter={filter} />
          </section>
        </div>
      </main>
    </div>
    <div style={{ position: 'fixed', right: 0, top: 140, zIndex: 10, pointerEvents: 'none' }} id="map">
      <WorldMap civilisations={[{ id: 'civ', name: '<img src=x onerror=alert(1)>', country: { name: 'France', continent: 'Europe' }, startYear: 1200, endYear: 1600, startSignificance: 1 }]} />
    </div>
    {drawerOpen && <Drawer isOpen onClose={() => setDrawerOpen(false)} />}
  </div>;
}
createRoot(document.getElementById('root')!).render(<BrowserRouter><QueryClientProvider client={new QueryClient()}><ToastProvider><TimelineFilterProvider><EraProvider><App /></EraProvider></TimelineFilterProvider></ToastProvider></QueryClientProvider></BrowserRouter>);
