<template>
  <div>
    <q-btn @click="handleUploadClick" icon="note_add" label="Add Files" color="primary" />
    <q-file
      ref="filePickerRef"
      v-model="pickerFiles"
      @update:model-value="handlePickerUpdated"
      label="Pick one file"
      accept=".csv"
      class="hidden"
      filled
      multiple
      clearable
    />
  </div>
</template>

<script setup lang="ts">
import { QFile, useQuasar } from 'quasar'
import { useFlightsStore } from 'src/stores/flights-store'
import { Ref, ref } from 'vue'

defineOptions({
  name: 'FilesUpload'
})

const $q = useQuasar()
const store = useFlightsStore()
const pickerFiles = ref<File[]>([])
const filePickerRef = ref() as Ref<QFile>

/**
 * Handles the click of the upload button
 */
const handleUploadClick = () => {
  filePickerRef.value.pickFiles()
}

/**
 * Handles the event of when the file-picker was updated
 */
const handlePickerUpdated = async () => {
  $q.loading.show()
  const fileProcessingPromises = []

  for (const file of pickerFiles.value) {
    // Import the worker that processes files into flights
    const worker = new Worker('src/workers/flight-worker', { type: 'module' })

    // Take the processing into a promise
    const fileProcessingPromise = new Promise<void>((resolve, reject) => {
      worker.onmessage = (event) => {
        // If the worker sent an error, show toast and reject
        if (event.data.error) {
          $q.notify({ type: 'negative', message: `There was an error processing the file "${file.name}"` })
          reject()
        } else {
          // Add flight to the state and resolve
          store.addFlight(event.data)
          resolve()
        }
      }
    })
    worker.postMessage(file)
    fileProcessingPromises.push(fileProcessingPromise)
  }

  await Promise.allSettled(fileProcessingPromises)

  // Hide loading and reset file-picker
  $q.loading.hide()
  pickerFiles.value = []
}
</script>

<style scoped>

</style>
