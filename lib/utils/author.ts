/**
 * Utility functions for handling post authors
 */

interface Author {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

/**
 * Get display name for an author (handles deleted users)
 */
export function getAuthorName(author: Author | null | undefined): string {
  if (!author) {
    return 'Unknown Author';
  }
  return author.name || author.email || 'Unknown Author';
}

/**
 * Get author initials for avatar (handles deleted users)
 */
export function getAuthorInitial(author: Author | null | undefined): string {
  if (!author) {
    return '?';
  }
  const name = author.name || author.email;
  return name ? name.charAt(0).toUpperCase() : '?';
}

/**
 * Get author image URL (handles deleted users)
 */
export function getAuthorImage(author: Author | null | undefined): string | undefined {
  return author?.image || undefined;
}

/**
 * Check if author exists
 */
export function hasAuthor(author: Author | null | undefined): author is Author {
  return author !== null && author !== undefined;
}
