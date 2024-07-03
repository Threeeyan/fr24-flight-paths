<template>
  <div class="relative-position column-layout">
    <div class="row no-wrap items-center q-pa-md">
      <FilesUpload />
      <q-space></q-space>
      <div v-if="store.flights.length > 0">
        <q-btn flat unelevated icon="o_delete_forever" color="negative" @click="store.removeAllFlights()">
          <q-tooltip :delay="300">Clear all</q-tooltip>
        </q-btn>
        <q-btn-dropdown
          flat
          unelevated
          no-icon-animation
          dropdown-icon="sort"
          label="Sort"
        >
          <q-list>
            <q-item
              v-for="(item, index) in sortMenuItems"
              :key="index"
              :active="activeSorting === item.value"
              @click="updateSorting(item.value)"
              clickable
              v-close-popup
            >
              <q-item-section>
                <q-item-label>{{ item.text }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <FilesScrollArea :flights="flightsSorted" class="flex-grow-1"/>
  </div>
</template>

<script setup lang="ts">
import FilesScrollArea from 'src/components/FilesSidebar/FilesScrollArea.vue'
import FilesUpload from 'src/components/FilesSidebar/FilesUpload.vue'
import { Flight } from 'src/models'
import { useFlightsStore } from 'src/stores/flights-store'
import { computed, ref } from 'vue'

defineOptions({
  name: 'FilesList'
})

const store = useFlightsStore()

enum SortValues {
  START_DESC = 'START_DESC',
  START_ASC = 'START_ASC',
  END_DESC = 'END_DESC',
  END_ASC = 'END_ASC',
}

const sortMenuItems = [
  { text: 'Start (newest to oldest)', value: SortValues.START_ASC },
  { text: 'Start (oldest to newest)', value: SortValues.START_DESC },
  { text: 'End (newest to oldest)', value: SortValues.END_ASC },
  { text: 'End (oldest to newest)', value: SortValues.END_DESC }
]

const activeSorting = ref(SortValues.START_ASC)

const updateSorting = (newSort: SortValues) => {
  activeSorting.value = newSort
}

/**
 * The flights sorted by the selected sorting method
 */
const flightsSorted = computed(() => {
  const sortedFlights: Flight[] = [...store.flights]

  const sortByDate = (key: 'startUTC' | 'endUTC', isAsc: boolean) => {
    return (a: Flight, b: Flight) => {
      const dateA = new Date(a[key]).getTime()
      const dateB = new Date(b[key]).getTime()
      return isAsc ? dateA - dateB : dateB - dateA
    }
  }

  switch (activeSorting.value) {
    case SortValues.START_ASC:
      sortedFlights.sort(sortByDate('startUTC', true))
      break
    case SortValues.START_DESC:
      sortedFlights.sort(sortByDate('startUTC', false))
      break
    case SortValues.END_ASC:
      sortedFlights.sort(sortByDate('endUTC', true))
      break
    case SortValues.END_DESC:
      sortedFlights.sort(sortByDate('endUTC', false))
      break
    default:
      sortedFlights.sort(sortByDate('startUTC', true))
  }

  return sortedFlights
})
</script>

<style scoped>
.column-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.flex-grow-1 {
  flex-grow: 1;
}
</style>
