import { lazy, Suspense } from 'react';
import { cx } from '@/lib/format';

const KoszalinMap = lazy(() => import('./KoszalinMap').then((module) => ({ default: module.KoszalinMap })));

/** Keeps Leaflet out of the main bundle; the placeholder holds the map's space. */
export function LazyKoszalinMap({ className }: { className?: string }) {
  return (
    <Suspense fallback={<div className={cx('bg-sea-50', className)} />}>
      <KoszalinMap className={className} />
    </Suspense>
  );
}
