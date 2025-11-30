/**
 * HTML Sanitization Utility
 * Uses DOMPurify to prevent XSS attacks
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS
 * Use this for any user-generated HTML content before rendering
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') {
    // Server-side rendering - return as-is, will be sanitized on client
    return dirty;
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize HTML and return safe React element
 * Use this for rendering rich text content
 */
export function createSafeHtml(dirty: string) {
  return {
    __html: sanitizeHtml(dirty)
  };
}

/**
 * Strip all HTML tags from content
 * Use this for plain text extraction
 */
export function stripHtml(html: string): string {
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>/g, '');
  }

  const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
  return clean;
}

/**
 * Validate and sanitize URL
 * Prevents javascript: and data: URLs
 */
export function sanitizeUrl(url: string): string {
  const cleaned = DOMPurify.sanitize(url);
  
  // Block dangerous protocols
  if (cleaned.match(/^(javascript|data|vbscript):/i)) {
    return '';
  }
  
  return cleaned;
}
