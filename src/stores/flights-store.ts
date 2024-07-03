import { defineStore } from 'pinia'
import { Flight } from 'src/models'

export const useFlightsStore = defineStore('flights', {
  state: () => ({
    flights: [] as Flight[],
    highlightFlightId: null as string | null
  }),
  getters: {
    isFlightHighlighted (): boolean {
      return this.highlightFlightId !== null
    }
  },
  actions: {
    addFlight (flight: Flight) {
      this.flights.push(flight)
    },
    removeFlightById (id: string) {
      this.flights = this.flights.filter(f => f.id !== id)

      if (this.highlightFlightId === id) {
        this.highlightFlightId = null
      }
    },
    removeAllFlights () {
      this.flights = []
      this.highlightFlightId = null
    },
    updateHighlightFlightId (newId: string | null) {
      this.highlightFlightId = this.highlightFlightId === newId ? null : newId
    },
    updateFlightColor (id: string, color: string) {
      const index = this.flights.findIndex(f => f.id === id)
      this.flights[index].hexColor = color
    }
  }
})
