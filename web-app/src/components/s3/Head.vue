<script setup lang="ts">
// const emit = defineEmits(['update:modelValue'])
// interface Props {
//   modelValue?: string
// }
// const {
//   modelValue,
// } = defineProps<Props>()

import { ChevronDownIcon, FilterIcon } from '@heroicons/vue/solid'
const { mobileFiltersOpen, sortOptions } = $(stockx3Store())

</script>
<template>
  <div class="border-b flex border-gray-200 pt-8 pb-6 z-10 relative items-baseline justify-between">
    <h1 class="font-bold tracking-tight text-4xl text-gray-900">
      All Products
    </h1>

    <div class="flex items-center">
      <Menu as="div" class="text-left relative inline-block">
        <div>
          <MenuButton class="font-medium text-sm text-gray-700 group inline-flex justify-center hover:text-gray-900">
            Sort
            <ChevronDownIcon class="flex-shrink-0 h-5 -mr-1 ml-1 text-gray-400 w-5 group-hover:text-gray-500" aria-hidden="true" />
          </MenuButton>
        </div>

        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
          <MenuItems class="bg-white rounded-md ring-black mt-2 origin-top-right right-0 shadow-2xl ring-1 ring-opacity-5 w-40 absolute focus:outline-none">
            <div class="py-1">
              <MenuItem v-for="option in sortOptions" :key="option.name" v-slot="{ active }">
                <a :href="option.href" :class="[option.current ? 'font-medium text-gray-900' : 'text-gray-500', active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm']">
                  {{ option.name }}
                </a>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
      <!-- <button type="button" class="-m-2 ml-5 p-2 text-gray-400 sm:ml-7 hover:text-gray-500">
              <span class="sr-only">View grid</span>
              <ViewGridIcon class="h-5 w-5" aria-hidden="true" />
            </button> -->
      <button type="button" class="-m-2 ml-4 p-2 text-gray-400 sm:ml-6 lg:hidden hover:text-gray-500" @click="mobileFiltersOpen = true">
        <span class="sr-only">Filters</span>
        <FilterIcon class="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
