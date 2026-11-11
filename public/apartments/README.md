# Apartment photos

Each apartment reserves **8 photo slots**. Drop the files here and they appear
on the site immediately — no code change needed.

```
public/apartments/<slug>/01.jpg … 08.jpg
```

| Slug        | Apartment | City                  |
| ----------- | --------- | --------------------- |
| `zagiel`    | Żagiel    | Koszalin              |
| `latarnia`  | Latarnia  | Koszalin              |
| `lodz`      | Łódź      | Koszalin              |
| `promenada` | Promenada | Koszalin              |
| `mewa`      | Mewa      | Koszalin              |
| `fala`      | Fala      | Koszalin              |
| `bryza`     | Bryza     | Koszalin              |
| `laguna`    | Laguna    | Las Lagunas de Mijas, Costa del Sol |

## Guidelines

- **Format**: `.jpg` (or `.webp`, renaming the extension in `photoPaths()`).
- **Size**: 2000 px on the long edge is plenty; keep files under ~500 KB.
- **Orientation**: landscape works best. `01.jpg` is the cover, used on the
  cards, the hero of the apartment page and the first, largest gallery tile.
- **Order**: 01 living room → 02 kitchen → 03 bedroom → 04 bathroom →
  05 balcony/garden → 06–08 details and the view.

## While photos are missing

Slot 1 falls back to a still from the apartment's YouTube film, and the
remaining slots show a branded "photo coming soon" placeholder. Once the real
files land, set `photosPending: false` on that apartment in
`src/data/apartments.ts` to hide the "photos are being retouched" notice.
