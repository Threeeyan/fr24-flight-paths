<template>
  <q-menu v-model="internalMenuVisible" :target="anchor" anchor="bottom left" self="top left">
    <q-color v-model="hexColor" @change="emit('update:color', hexColor)"/>
  </q-menu>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps<{ show: boolean, anchor: Element | boolean, initialColor: string }>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'update:color', value: string): void;
}>()

const internalMenuVisible = ref(props.show)
const hexColor = ref(props.initialColor)

watch(() => props.show, (newVal) => {
  internalMenuVisible.value = newVal
})

watch(() => props.initialColor, (newVal) => {
  hexColor.value = newVal
})

watch(internalMenuVisible, (newVal) => {
  emit('update:show', newVal)
})
</script>
