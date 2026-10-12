import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Timeline from '../frontend/src/features/timeline/components/Timeline';
import UtilityMenu from '../frontend/src/components/ui/UtilityMenu';
import WorldMap from '../frontend/src/components/map/WorldMap';
import { EraProvider, useEra } from '../frontend/src/context/EraContext';
import { TimelineFilterProvider, useTimelineFilter } from '../frontend/src/context/FilterContext';
import { ToastProvider } from '../frontend/src/context/ToastContext';
import Drawer from '../frontend/src/components/drawer/Drawer';

function App() {
  const { filter, resetFilter } = useTimelineFilter();
  const era = useEra();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => { (window as any).navigateFixture = navigate; }, [navigate]);
  return <>
    <div id="timeline-context-header" style={{ position: 'fixed', top: 0, left: 0, zIndex: 99999, background: '#111', color: 'white', width: '100%', minHeight: 120 }}>
      <output id="era" data-year={era.dataStartYear}>{era.label}</output>
      <button id="saved" onClick={() => navigate('/timeline?q=saved')}>Saved search</button>
      <button id="reset" onClick={() => resetFilter({ replace: false })}>Reset</button>
      <button id="reverse" onClick={() => navigate('/timeline?o=desc')}>Reverse</button>
      <button id="region" onClick={() => era.setView(era.view === 'global' ? 'europe' : 'global')}>Region</button>
      <UtilityMenu onOpenDrawer={() => setDrawerOpen(true)} />
    </div>
    <div style={{ position: 'fixed', right: 0, top: 140, zIndex: 10, pointerEvents: 'none' }} id="map">
      <WorldMap civilisations={[{ id: 'civ', name: '<img src=x onerror=alert(1)>', country: { name: 'France', continent: 'Europe' }, startYear: 1200, endYear: 1600, startSignificance: 1 }]} />
    </div>
    <main style={{ maxWidth: 760, paddingTop: 130 }}><Timeline filter={filter} /></main>
    {drawerOpen && <Drawer isOpen onClose={() => setDrawerOpen(false)} />}
  </>;
}
createRoot(document.getElementById('root')!).render(<BrowserRouter><QueryClientProvider client={new QueryClient()}><ToastProvider><TimelineFilterProvider><EraProvider><App /></EraProvider></TimelineFilterProvider></ToastProvider></QueryClientProvider></BrowserRouter>);
