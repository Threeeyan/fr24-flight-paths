<template>
  <GoogleMap
    id="flight-map"
    :api-key="mapsApiKey"
    :center="{ lat: 45.68, lng: 15.19 }"
    :zoom="5"
    map-type-id="roadmap"
    :controlSize="20"
    :street-view-control="false"
    :fullscreenControl="false"
    gesture-handling="greedy"
    :styles="mapStyle"
    ref="mapInstance"
  >
    <Polyline v-for="(polyline, index) in polylines" :key="index" :options="polyline" @click="store.updateHighlightFlightId(polyline.id)"/>
  </GoogleMap>
</template>

<script setup lang="ts">
import mapStyle from 'src/assets/map-style'
import { useFlightsStore } from 'src/stores/flights-store'
import { computed, nextTick, ref, watch } from 'vue'
import { GoogleMap, Polyline } from 'vue3-google-map'

defineOptions({
  name: 'FlightsMap'
})

const store = useFlightsStore()
const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY
const mapInstance = ref<typeof GoogleMap>()

const polylines = computed(() => store.flights.map(f => {
  let opacity = 1.0

  if (store.isFlightHighlighted) {
    opacity = store.highlightFlightId === f.id ? 1.0 : 0.1
  }

  return {
    id: f.id,
    path: f.data,
    strokeColor: f.hexColor,
    strokeOpacity: opacity,
    geodesic: true,
    strokeWeight: 3
  }
}))

/**
 * The bounds of all map polylines
 */
const polylinesBounds = computed(() => {
  if (!mapInstance.value) return

  const mapInstanceValue = mapInstance.value // Add a new variable after the check

  const bounds = new mapInstanceValue.api.LatLngBounds()
  polylines.value.forEach(polyline => {
    polyline.path.forEach(point => {
      bounds.extend(new mapInstanceValue.api.LatLng(point.lat, point.lng))
    })
  })

  return bounds
})

// Center map and adjust zoom, everytime a polyline gets added/removed
watch(() => polylines.value.length, async (newVal) => {
  if (newVal === 0) return

  const bounds = polylinesBounds.value
  await nextTick()
  if (mapInstance.value && bounds && bounds.getNorthEast() && bounds.getSouthWest()) {
    mapInstance.value.map.fitBounds(bounds)
  }
})

</script>

<style scoped>
#flight-map {
  height: 100vh;
  width: 100%;
}
</style>
