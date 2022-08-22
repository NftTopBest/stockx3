<script setup lang="ts">
import { PlusCircleIcon } from '@heroicons/vue/outline'

interface Props {
  item?: Object | null
}
const {
  item,
} = defineProps<Props>()

const { updateProductItem, showProductModal, addToCart } = $(stockx3Store())

watchEffect(async() => {
  if (!item.cid || item.name) return
  await updateProductItem(item)
})

</script>
<template>
  <div class=" group">
    <div class="rounded-lg cursor-pointer bg-gray-200 w-full overflow-hidden aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8" @click="showProductModal(item)">
      <IpfsImg :src="item.image" :alt="item.name" class="h-full object-center object-cover w-full group-hover:opacity-75" />
    </div>
    <div class="flex my-4 text-sm text-gray-700 justify-between">
      <div class="font-bold">
        {{ item.name }}
      </div>
      <div>{{ get(item, 'totalMintCount') }} / {{ get(item, 'properties.totalSupply') }}</div>
    </div>
    <div class="flex font-medium  mt-1 text-lg text-gray-900 items-center justify-between">
      <div class="flex items-center">
        <logos-ethereum-color class="h-5 w-5" /> {{ get(item, 'properties.basicPrice') }}
      </div>
      <PlusCircleIcon class="h-6 w-6 hover:cursor-pointer" @click="addToCart(item)" />
    </div>
  </div>
</template>
