import { PREVIEW_BASE_URL } from '../../Services/Api/Constants';

/**
 * Prepends the PREVIEW_BASE_URL to relative asset paths from the backend.
 * If the path is already absolute, it returns it as-is.
 *
 * @param path The relative or absolute path of the asset
 * @returns The fully qualified URL of the asset
 */
export const getAssetUrl = (path: string | null | undefined): string => {
  if (!path) return '';

  // If the path is already an absolute URL (starts with http or https), return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Ensure PREVIEW_BASE_URL doesn't end with a slash if path starts with one
  const baseUrl = PREVIEW_BASE_URL.endsWith('/')
    ? PREVIEW_BASE_URL.slice(0, -1)
    : PREVIEW_BASE_URL;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
};

export default getAssetUrl;
