export interface FlightPoint {
  lat: number;
  lng: number;
  position: string;
  direction: string;
  speed: string;
  timestamp: string;
}

export interface Flight {
  id: string;
  filename: string;
  callsign: string;
  startTimestamp: string;
  endTimestamp: string;
  startUTC: string;
  endUTC: string;
  data: FlightPoint[];
  hexColor: string;
}
