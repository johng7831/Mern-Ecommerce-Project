/**
 * API may return populated { _id, name }, null, or (rarely) a raw id if ref is broken.
 */
export function displayBrandName(brand) {
  if (brand && typeof brand === "object" && brand.name != null) {
    const n = String(brand.name).trim();
    return n || null;
  }
  return null;
}

export function displayCategoryName(category) {
  if (category && typeof category === "object" && category.name != null) {
    const n = String(category.name).trim();
    return n || null;
  }
  return null;
}
