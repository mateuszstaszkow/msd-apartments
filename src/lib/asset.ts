/**
 * Resolves a file in `public/` against the deployment base path.
 *
 * On GitHub Pages the site is served from `/<repo>/`, so a hard-coded
 * `/logo-mark.png` would 404. Always route public files through here.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
