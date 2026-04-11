'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';

// ─── Destinations ─────────────────────────────────────────────────────────────
const BRAZIL = { lat: -15.78, lng: -47.93 };

const DESTINATIONS = [
  { name: 'China', lat: 39.91, lng: 116.39, color: '#f4c542' },
  { name: 'Japan', lat: 35.68, lng: 139.69, color: '#e8a020' },
  { name: 'South Korea', lat: 37.57, lng: 126.98, color: '#d4943a' },
  { name: 'India', lat: 28.61, lng: 77.21, color: '#c9a84c' },
  { name: 'UAE', lat: 24.45, lng: 54.37, color: '#e2c66d' },
  { name: 'Saudi Arabia', lat: 24.69, lng: 46.72, color: '#f0d060' },
  { name: 'Turkey', lat: 39.93, lng: 32.86, color: '#c8803c' },
  { name: 'Russia', lat: 55.75, lng: 37.62, color: '#b87030' },
  { name: 'Indonesia', lat: -6.21, lng: 106.85, color: '#e0aa40' },
  { name: 'Vietnam', lat: 21.02, lng: 105.83, color: '#d4943a' },
  { name: 'Thailand', lat: 13.75, lng: 100.52, color: '#c9a84c' },
  { name: 'Egypt', lat: 30.06, lng: 31.25, color: '#f0c030' },
];

const ARCS_DATA = DESTINATIONS.map((dst) => ({
  startLat: BRAZIL.lat,
  startLng: BRAZIL.lng,
  endLat: dst.lat,
  endLng: dst.lng,
  color: [dst.color, '#ffffff'],
  label: dst.name,
}));

const POINTS_DATA = [
  // Brazil origin
  { lat: BRAZIL.lat, lng: BRAZIL.lng, size: 0.6, color: '#ffffff', label: 'Brasil', isOrigin: true },
  // Destinations
  ...DESTINATIONS.map((d) => ({ lat: d.lat, lng: d.lng, size: 0.3, color: d.color, label: d.name, isOrigin: false })),
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Globe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const { theme, resolvedTheme } = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeInstanceRef = useRef<any>(null);

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Build / rebuild globe imperatively once we have dimensions
  const buildGlobe = useCallback(async () => {
    if (!globeRef.current || dims.w === 0 || dims.h === 0) return;

    // Lazy-load globe.gl (vanilla JS, not React) to avoid SSR issues
    const GlobeModule = await import('globe.gl');
    const GlobeLib = GlobeModule.default ?? GlobeModule;

    // Destroy previous instance if any
    if (globeInstanceRef.current) {
      globeInstanceRef.current._destructor?.();
      globeRef.current.innerHTML = '';
    }

    const currentTheme = theme === 'system' ? resolvedTheme : theme;
    const isDark = currentTheme === 'dark';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globe = (GlobeLib as any)({ animateIn: false })(globeRef.current as HTMLElement);
    globeInstanceRef.current = globe;

    globe
      // ── Sizing ──────────────────────────────────────────────────────────
      .width(dims.w)
      .height(dims.h)

      // ── Globe appearance ─────────────────────────────────────────────────
      .backgroundColor('rgba(0,0,0,0)')
      .globeImageUrl(
        isDark 
          ? '//unpkg.com/three-globe/example/img/earth-night.jpg' 
          : '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
      )
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')

      // ── Trade route arcs ─────────────────────────────────────────────────
      .arcsData(ARCS_DATA)
      .arcColor('color')
      .arcAltitudeAutoScale(0.5)   // auto-scales arc height with arc length → no clipping
      .arcStroke(0.3)
      .arcDashLength(0.4)
      .arcDashGap(0.2)
      .arcDashAnimateTime(1800)

      // ── City points ───────────────────────────────────────────────────────
      .pointsData(POINTS_DATA)
      .pointColor('color')
      .pointRadius('size')
      .pointAltitude(0.01)
      .pointsMerge(false)

      // ── Elegant HTML Labels ──────────────────────────────────────────────
      .htmlElementsData(POINTS_DATA)
      .htmlLat('lat')
      .htmlLng('lng')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .htmlElement((d: any) => {
        const el = document.createElement('div');
        
        // Define theme-aware subtle colors
        const bgColor = isDark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.45)';
        const textColor = isDark ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.85)';
        
        // Increase opacity/border for the origin point (Brazil)
        const borderColor = d.isOrigin ? 'rgba(255,255,255,0.8)' : `${d.color}60`;
        const fontWeight = d.isOrigin ? '600' : '400';

        el.innerHTML = `
          <div style="
            color: ${textColor};
            font-size: 10px;
            font-family: inherit;
            font-weight: ${fontWeight};
            letter-spacing: 0.03em;
            background: ${bgColor};
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            padding: 3px 8px;
            border-radius: 9999px;
            border: 1px solid ${borderColor};
            white-space: nowrap;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transform: translate(-50%, -200%);
            pointer-events: none;
            transition: all 0.3s ease;
          ">
            ${d.label}
          </div>
        `;
        return el;
      });

    // ── Camera ──────────────────────────────────────────────────────────────
    // Look at the Atlantic mid-point so Brazil and eastern countries are visible
    globe.pointOfView({ lat: 10, lng: 30, altitude: 2.2 }, 0);

    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableZoom = false;
    controls.enablePan = false;
  }, [dims.w, dims.h, theme, resolvedTheme]);

  useEffect(() => {
    buildGlobe();
  }, [buildGlobe]);

  // Keep globe sized if container resizes
  useEffect(() => {
    if (!globeInstanceRef.current || dims.w === 0) return;
    globeInstanceRef.current.width(dims.w).height(dims.h);
  }, [dims]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 opacity-90">
      <div ref={globeRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
