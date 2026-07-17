/**
 * Lowercase, hyphen-separated, matches PostSlugSchema's pattern exactly.
 */
export const buildSlug = (title: string): string => {
  const slug = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug;
};
