// This is a placeholder for utility functions

/**
 * Example utility function.
 * Generates a random string of a given length.
 * @param length The length of the string to generate.
 * @returns A random string.
 */
export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Example utility to format a date.
 * @param date The date to format.
 * @returns A formatted date string (YYYY-MM-DD).
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
