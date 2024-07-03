/**
 * Extracts latitude and longitude coordinates from a string formatted as "lat, lng".
 * @param {string} coordString - The input string containing coordinates separated by a comma.
 * @throws {Error} If the input string format is invalid (must contain exactly one comma).
 * @throws {Error} If latitude or longitude values are not valid numbers.
 * @throws {Error} If latitude is not within the range of -90 to 90 degrees.
 * @throws {Error} If longitude is not within the range of -180 to 180 degrees.
 */
export const extractCoordinates = (coordString: string): { lat: number, lng: number } => {
  const parts = coordString.split(',')

  if (parts.length !== 2) {
    throw new Error('Invalid input string. Must contain exactly one comma.')
  }

  const lat = parseFloat(parts[0].trim())
  const lng = parseFloat(parts[1].trim())

  if (isNaN(lat) || isNaN(lng)) {
    throw new Error('Invalid coordinates. Must be valid numbers.')
  }
  if (lat < -90 || lat > 90) {
    throw new Error('Invalid latitude. Must be between -90 and 90.')
  }
  if (lng < -180 || lng > 180) {
    throw new Error('Invalid longitude. Must be between -180 and 180.')
  }

  return { lat, lng }
}
