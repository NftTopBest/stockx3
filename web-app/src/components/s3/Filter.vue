<script setup lang="ts">
// const emit = defineEmits(['update:modelValue'])
// interface Props {
//   modelValue?: string
// }
// const {
//   modelValue,
// } = defineProps<Props>()
import {
  MinusSmIcon,
  PlusSmIcon,
} from '@heroicons/vue/solid'
const { subCategories, filters } = $(stockx3Store())

</script>
<template>
  <!-- Filters -->
  <form class="hidden lg:block">
    <h3 class="sr-only">
      Categories
    </h3>
    <ul role="list" class="border-b font-medium space-y-4 border-gray-200 text-sm pb-6 text-gray-900">
      <li v-for="category in subCategories" :key="category.name">
        <a :href="category.href">
          {{ category.name }}
        </a>
      </li>
    </ul>

    <Disclosure v-for="section in filters" :key="section.id" v-slot="{ open }" as="div" class="border-b border-gray-200 py-6">
      <h3 class="-my-3 flow-root">
        <DisclosureButton class="bg-white flex text-sm w-full py-3 text-gray-400 items-center justify-between hover:text-gray-500">
          <span class="font-medium text-gray-900">
            {{ section.name }}
          </span>
          <span class="flex ml-6 items-center">
            <PlusSmIcon v-if="!open" class="h-5 w-5" aria-hidden="true" />
            <MinusSmIcon v-else class="h-5 w-5" aria-hidden="true" />
          </span>
        </DisclosureButton>
      </h3>
      <DisclosurePanel class="pt-6">
        <div class="space-y-4">
          <div v-for="(option, optionIdx) in section.options" :key="option.value" class="flex items-center">
            <input :id="`filter-${section.id}-${optionIdx}`" :name="`${section.id}[]`" :value="option.value" type="checkbox" :checked="option.checked" class="rounded border-gray-300 h-4 text-indigo-600 w-4 focus:ring-indigo-500">
            <label :for="`filter-${section.id}-${optionIdx}`" class="text-sm ml-3 text-gray-600">
              {{ option.label }}
            </label>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  </form>
</template>
