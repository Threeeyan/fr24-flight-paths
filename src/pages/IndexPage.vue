<template>
  <q-page class="row">
    <div class="col-md-4 col-xs-12">
      <FilesList />
    </div>
    <div class="col-md-8 col-xs-12">
      <FlightsMap />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import FilesList from 'src/components/FilesSidebar/FilesList.vue'
import FlightsMap from 'src/components/FlightsMap.vue'

defineOptions({
  name: 'IndexPage'
})
</script>
