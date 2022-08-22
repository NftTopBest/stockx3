<script setup lang="ts">
// const emit = defineEmits(['update:modelValue'])
// interface Props {
//   modelValue?: string
// }
// const {
//   modelValue,
// } = defineProps<Props>()
const { products } = $(stockx3Store())

</script>
<template>
  <div class="py-0 px-0 sm:py-6 sm:px-2">
    <div class="grid gap-y-6 gap-x-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 xl:grid-cols-4">
      <S3ProductItem v-for="product in products" :key="product.tokenId" :item="product" />
    </div>
  </div>
</template>
