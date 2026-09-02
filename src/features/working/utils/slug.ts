/**
 * Utility to generate clean, SEO-friendly and human-readable slugs for projects.
 * Converts Vietnamese diacritics, strips non-alphanumeric characters, and formats with hyphens.
 */
export function slugify(text: string): string {
    if (!text) return ''
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

/**
 * Returns the best URL representation for a project: slug if available, otherwise slugified name, or ID.
 */
export function getProjectUrl(project: { id: string; name?: string; slug?: string }): string {
    if (project.slug && project.slug.trim()) {
        return project.slug.trim()
    }
    if (project.name && project.name.trim()) {
        const slug = slugify(project.name.trim())
        if (slug) return slug
    }
    return project.id
}
