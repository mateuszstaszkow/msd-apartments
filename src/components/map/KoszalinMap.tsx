import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Building2, MapPin } from 'lucide-react';
import type { Apartment } from '@/types';
import { site } from '@/data/site';
import { useApartments } from '@/data/live';
import { useI18n } from '@/i18n';
import { cx } from '@/lib/format';

/** Below this zoom the flats sit too close together for their names to fit. */
const LABEL_ZOOM = 16;
const OFFICE = 'office';

/** Every Koszalin apartment and the office on one map, with a clickable list underneath. */
export function KoszalinMap({ className }: { className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markers = useRef(new Map<string, L.Marker>());
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const { t } = useI18n();
  const apartments = useApartments();
  const flats = apartments.filter((apartment) => apartment.country === 'PL');

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const map = L.map(element, { scrollWheelZoom: false });
    mapRef.current = map;
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Flats in the same building share one pin.
    const buildings = new Map<string, Apartment[]>();
    for (const flat of apartments) {
      if (flat.country !== 'PL') continue;
      const key = `${flat.coords.lat},${flat.coords.lng}`;
      buildings.set(key, [...(buildings.get(key) ?? []), flat]);
    }

    const points: L.LatLngTuple[] = [];
    for (const group of buildings.values()) {
      const { lat, lng } = group[0].coords;
      const names = group.map((flat) => flat.name).join(' · ');
      points.push([lat, lng]);
      const marker = L.marker([lat, lng], { icon: pin(names, 'apartment'), title: names, riseOnHover: true })
        .bindPopup(() => apartmentPopup(group, t('map.details'), (to) => navigateRef.current(to)))
        .addTo(map);
      for (const flat of group) markers.current.set(flat.slug, marker);
    }

    const office = site.office.coords;
    points.push([office.lat, office.lng]);
    markers.current.set(
      OFFICE,
      L.marker([office.lat, office.lng], { icon: pin(t('map.office'), 'office'), title: t('map.office'), zIndexOffset: 1000 })
        .bindPopup(() =>
          officePopup(t('map.office'), `${site.office.street}, ${site.office.city}`, site.office.mapsUrl, t('detail.map')),
        )
        .addTo(map),
    );

    const syncLabels = () => element.classList.toggle('msd-labels', map.getZoom() >= LABEL_ZOOM);
    map.on('zoomend', syncLabels);
    map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
    syncLabels();

    return () => {
      markers.current.clear();
      mapRef.current = null;
      map.remove();
    };
  }, [apartments, t]);

  function focus(key: string) {
    const marker = markers.current.get(key);
    const map = mapRef.current;
    if (!marker || !map) return;
    const target = marker.getLatLng();
    if (map.getZoom() === LABEL_ZOOM && map.getCenter().distanceTo(target) < 1) {
      marker.openPopup();
      return;
    }
    map.flyTo(target, LABEL_ZOOM, { duration: 0.8 });
    map.once('moveend', () => marker.openPopup());
  }

  return (
    <div>
      <div ref={container} className={cx('group z-0 bg-sea-50', className)} />
      <ul className="flex flex-wrap gap-2 border-t border-sea-100 bg-white p-4">
        {flats.map((flat) => (
          <li key={flat.slug}>
            <LegendButton onClick={() => focus(flat.slug)} icon={<MapPin className="h-3.5 w-3.5 text-sea-500" />}>
              <span className="font-semibold text-ink">{flat.name}</span> · {flat.street}
            </LegendButton>
          </li>
        ))}
        <li>
          <LegendButton onClick={() => focus(OFFICE)} icon={<Building2 className="h-3.5 w-3.5 text-ink" />}>
            <span className="font-semibold text-ink">{t('map.office')}</span> · {site.office.street}
          </LegendButton>
        </li>
      </ul>
    </div>
  );
}

function LegendButton({ onClick, icon, children }: { onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border border-sea-100 px-3 py-1.5 text-xs text-ink-soft transition hover:border-sea-300 hover:bg-sea-50"
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

function pin(label: string, tone: 'apartment' | 'office') {
  const office = tone === 'office';
  return L.divIcon({
    className: '',
    iconSize: undefined,
    popupAnchor: [0, -12],
    html: `<span class="relative block cursor-pointer">
      <span class="absolute left-0 top-0 block -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow-card ${
        office ? 'h-5 w-5 bg-ink' : 'h-4 w-4 bg-sea-500'
      }"></span>
      <span class="absolute bottom-3 left-0 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 font-display text-xs font-semibold shadow-card ${
        office ? 'block bg-ink text-white' : 'hidden border border-sea-200 bg-white text-ink group-[.msd-labels]:block'
      }">${label}</span>
    </span>`,
  });
}

function apartmentPopup(flats: Apartment[], detailsLabel: string, go: (to: string) => void) {
  const root = document.createElement('div');
  root.className = 'space-y-3';
  for (const flat of flats) {
    const item = document.createElement('div');
    const link = document.createElement('a');
    link.href = `${import.meta.env.BASE_URL}apartments/${flat.slug}`;
    link.textContent = `${detailsLabel} →`;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      go(`/apartments/${flat.slug}`);
    });
    item.append(...popupLines(flat.name, `${flat.street}, ${flat.city}`), link);
    root.append(item);
  }
  return root;
}

function officePopup(title: string, address: string, mapsUrl: string, mapsLabel: string) {
  const root = document.createElement('div');
  const link = document.createElement('a');
  link.href = mapsUrl;
  link.target = '_blank';
  link.rel = 'noreferrer noopener';
  link.textContent = `${mapsLabel} →`;
  root.append(...popupLines(title, address), link);
  return root;
}

function popupLines(title: string, address: string) {
  const name = document.createElement('p');
  name.className = 'font-display text-sm font-semibold text-ink';
  name.textContent = title;
  const street = document.createElement('p');
  street.className = 'text-xs text-ink-soft';
  street.textContent = address;
  return [name, street];
}
