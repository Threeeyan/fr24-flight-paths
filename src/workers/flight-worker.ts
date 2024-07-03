import Papa from 'papaparse'
import { extractCoordinates } from 'src/helpers/coords'
import { Flight } from 'src/models'

self.addEventListener('message', async (event) => {
  const data = event.data as File

  try {
    const transformed = await transformCsvFileToFlight(data)
    postMessage(transformed)
  } catch (error) {
    postMessage({ error })
  }
})

interface CsvFileRow {
  Altitude: string;
  Callsign: string;
  Direction: string;
  Position: string;
  Speed: string;
  Timestamp: string;
  UTC: string;
}

/**
 * Transforms a csv file to a Flight object
 * @param file The csv file
 */
const transformCsvFileToFlight = async (file: File): Promise<Flight> => {
  const csvData = await readAndParseCsvFile(file)

  return {
    id: crypto.randomUUID(),
    filename: file.name,
    callsign: csvData[0].Callsign,
    startTimestamp: csvData[0].Timestamp,
    startUTC: csvData[0].UTC,
    endTimestamp: csvData[csvData.length - 1].Timestamp,
    endUTC: csvData[csvData.length - 1].UTC,
    data: csvData.map((row: CsvFileRow) => {
      const { lat, lng } = extractCoordinates(row.Position)
      return {
        lat,
        lng,
        position: row.Position,
        direction: row.Direction,
        speed: row.Speed,
        timestamp: row.Timestamp
      }
    }),
    hexColor: getRandomColor()
  }
}

/**
 * Reads and parses a csv file
 * @param file The csv file
 */
const readAndParseCsvFile = (file: File): Promise<CsvFileRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const fileContent = event.target?.result as string
      const parsedData = parseCsvString(fileContent)
      resolve(parsedData)
    }
    reader.onerror = (error) => reject(error)
    reader.readAsText(file)
  })
}

/**
 * Parses a csv String
 * @param str The csv string
 */
const parseCsvString = (str: string): CsvFileRow[] => {
  const parsed = Papa.parse(str, {
    header: true,
    skipEmptyLines: true
  })
  return parsed.data as CsvFileRow[]
}

/**
 * Generates a random hex color
 */
const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF'
  return '#' + Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('')
}
