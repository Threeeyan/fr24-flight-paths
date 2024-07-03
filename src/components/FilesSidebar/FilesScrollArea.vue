<template>
  <q-scroll-area ref="scrollArea" :thumb-style="thumbStyle" :bar-style="barStyle" style="height: 100%; width: 100%;">
    <q-list v-if="props.flights.length > 0" bordered separator>
      <q-item v-for="(flight, index) in props.flights" :key="index" clickable v-ripple
        @click="store.updateHighlightFlightId(flight.id)" :class="{ 'bg-blue-grey-2 q-py-lg': isFlightHighlighted(flight.id) }"
        :ref="(el) => { isFlightHighlighted(flight.id) ? highlightedItem = el : null }">
        <q-item-section top avatar>
          <q-avatar @click.stop="toggleColorPicker($event, flight)" size="md" rounded :style="{ backgroundColor: flight.hexColor }" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <span class="text-bold">{{ flight.callsign }}</span>

            <span class="text-caption text-grey q-ml-sm">{{ flight.filename }}</span>
          </q-item-label>
          <q-item-label caption>
            {{ flight.startUTC }} - {{ flight.endUTC }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn @click.stop="store.removeFlightById(flight.id)" flat color="negative" icon="o_delete" size="md" padding="xs" class="btn--remove" />
        </q-item-section>
      </q-item>
      <FileColorPicker
      :show="showColorPicker"
      :anchor="colorPickerAnchor"
      :initialColor="colorPickerFlight?.hexColor ?? '#fff'"
      @update:show="handleColorPickerShowUpdate"
      @update:color="handleColorPickerColorUpdate" />
    </q-list>
    <div v-else class="row justify-center align-center q-mt-lg text-caption">Add some files to see them here..</div>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { QScrollArea, VueStyleProp } from 'quasar'
import FileColorPicker from 'src/components/FilesSidebar/FileColorPicker.vue'
import { Flight } from 'src/models'
import { useFlightsStore } from 'src/stores/flights-store'
import { nextTick, ref, watch } from 'vue'

defineOptions({
  name: 'FilesScrollArea'
})

const props = defineProps<{
  flights: Flight[]
}>()

const thumbStyle: Partial<CSSStyleDeclaration> = {
  right: '4px',
  borderRadius: '5px',
  backgroundColor: '#027be3',
  width: '5px'
}
const barStyle: VueStyleProp = {
  right: '2px',
  borderRadius: '9px',
  backgroundColor: '#027be3',
  width: '9px'
}

const store = useFlightsStore()

/**
 * Checks if the passed flight id is highlighted
 */
const isFlightHighlighted = (id: string) => {
  return id === store.highlightFlightId
}

watch(() => store.highlightFlightId, async () => {
  await nextTick()
  checkHighlightedVisible()
})

const scrollArea = ref<QScrollArea>()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const highlightedItem = ref<{ $el: HTMLElement } | any | null>(null)

/**
 * Checks if the highlighted list item is visible -> in the scroll area view
 */
const checkHighlightedVisible = () => {
  if (scrollArea.value && highlightedItem.value && highlightedItem.value.$el) {
    const highlightedRect = highlightedItem.value.$el.getBoundingClientRect()
    const scrollAreaRect = scrollArea.value.getScrollTarget().getBoundingClientRect()
    const isVisible =
      highlightedRect.top >= scrollAreaRect.top &&
      highlightedRect.bottom <= scrollAreaRect.bottom

    if (!isVisible) {
      scrollToHighlighted()
    }
  }
}

/**
 * Scroll the scroll area to the highlighted item
 */
const scrollToHighlighted = () => {
  if (scrollArea.value) {
    const offset = highlightedItem.value.$el.offsetTop
    const duration = 100
    scrollArea.value.setScrollPosition('vertical', offset, duration)
  }
}

const showColorPicker = ref(false)
const colorPickerAnchor = ref<Element | boolean>(false)
const colorPickerFlight = ref<Flight>()

/**
 * Toggles the color picker visibility
 * @param event The click event
 * @param flight The flight to edit
 */
const toggleColorPicker = (event: MouseEvent, flight: Flight) => {
  showColorPicker.value = !showColorPicker.value
  colorPickerAnchor.value = event.currentTarget as Element
  colorPickerFlight.value = flight
}

/**
 * Handles the update of the color picker's show value
 * @param value The new value (shown/hidden)
 */
const handleColorPickerShowUpdate = (value: boolean) => {
  if (!value) {
    colorPickerAnchor.value = false
  }
  showColorPicker.value = value
}

/**
 * Handles the update of the color picker's color
 * @param value The new color
 */
const handleColorPickerColorUpdate = (value: string) => {
  store.updateFlightColor(colorPickerFlight.value?.id ?? '', value)
}

</script>

<style lang="scss" scoped>
.q-item {
  .btn--remove {
    opacity: 0;
  }

  &:hover {
    .btn--remove {
      opacity: 1
    }
  }
}
</style>
