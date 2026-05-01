/**
 * Specialitetet në menunë “Specialistet” (shqip).
 * `slug` duhet të përputhet me `slug` të kategorisë në Strapi kur filtron lajmet.
 * Ndrysho tekstet/slug-et sipas nevojës.
 */
export const SPECIALTIES_NAV: { label: string; slug: string }[] = [
  { label: "Angjilogjia", slug: "angjilogjia" },
  { label: "Dermatologjia", slug: "dermatologji" },
  { label: "Gastroenterologjia", slug: "gastroenterologjia" },
  { label: "Mjekësia e përgjithshme", slug: "mjekesia-e-pergjithshme" },
  { label: "Gjinekologjia", slug: "gjinekologjia" },
  { label: "Kardiologjia", slug: "kardiologjia" },
  { label: "Gjiri", slug: "gjiri" },
  { label: "Neurologjia", slug: "neurologji" },
  { label: "Stomatologjia", slug: "stomatologjia" },
  { label: "Ortopedjia", slug: "ortopedjia" },
  { label: "Urologjia dhe andrologjia", slug: "urologjia-dhe-andrologjia" },
  { label: "Oftalmologjia", slug: "oftalmologjia" },
  { label: "Kirurgjia plastike", slug: "kirurgjia-plastike" },
  { label: "ORL (vesh, hundë, fyt)", slug: "orl" },
];

export const SPECIALTY_SLUG_SET = new Set(SPECIALTIES_NAV.map((s) => s.slug));
