/**
 * Constructs a full URL by combining the backend URL with a path
 */
export const constructCallbackUrl = (path) => {
  const baseUrl = process.env.BACKEND_URL.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");
  return `${baseUrl}/${cleanPath}`;
};

/**
 * Validates if a URL is from an allowed origin
 */
export const isAllowedOrigin = (url) => {
  try {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
    return allowedOrigins.includes(url);
  } catch (error) {
    return false;
  }
};
