<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { XIcon } from '@heroicons/vue/outline'
import {
  MinusSmIcon,
  PlusSmIcon, 
} from '@heroicons/vue/solid'
// const emit = defineEmits(['update:modelValue'])
// interface Props {
//   modelValue?: string
// }
// const {
//   modelValue,
// } = defineProps<Props>()

const { mobileFiltersOpen, subCategories, filters } = $(stockx3Store())
</script>
<template>
  <!-- Mobile filter dialog -->
  <TransitionRoot as="template" :show="mobileFiltersOpen">
    <Dialog as="div" class="z-40 relative lg:hidden" @close="mobileFiltersOpen = false">
      <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
        <div class="bg-black bg-opacity-25 inset-0 fixed" />
      </TransitionChild>

      <div class="flex inset-0 z-40 fixed">
        <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="translate-x-full">
          <DialogPanel class="bg-white flex flex-col h-full ml-auto max-w-xs shadow-xl w-full py-4 pb-12 relative overflow-y-auto">
            <div class="flex px-4 items-center justify-between">
              <h2 class="font-medium text-lg text-gray-900">
                Filters
              </h2>
              <button type="button" class="bg-white rounded-md flex h-10 -mr-2 p-2 text-gray-400 w-10 items-center justify-center" @click="mobileFiltersOpen = false">
                <span class="sr-only">Close menu</span>
                <XIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <!-- Filters -->
            <form class="border-t border-gray-200 mt-4">
              <h3 class="sr-only">
                Categories
              </h3>
              <ul role="list" class="font-medium py-3 px-2 text-gray-900">
                <li v-for="category in subCategories" :key="category.name">
                  <a :href="category.href" class="py-3 px-2 block">
                    {{ category.name }}
                  </a>
                </li>
              </ul>

              <Disclosure v-for="section in filters" :key="section.id" v-slot="{ open }" as="div" class="border-t border-gray-200 py-6 px-4">
                <h3 class="-my-3 -mx-2 flow-root">
                  <DisclosureButton class="bg-white flex w-full py-3 px-2 text-gray-400 items-center justify-between hover:text-gray-500">
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
                  <div class="space-y-6">
                    <div v-for="(option, optionIdx) in section.options" :key="option.value" class="flex items-center">
                      <input :id="`filter-mobile-${section.id}-${optionIdx}`" :name="`${section.id}[]`" :value="option.value" type="checkbox" :checked="option.checked" class="rounded border-gray-300 h-4 text-indigo-600 w-4 focus:ring-indigo-500">
                      <label :for="`filter-mobile-${section.id}-${optionIdx}`" class="flex-1 ml-3 min-w-0 text-gray-500">
                        {{ option.label }}
                      </label>
                    </div>
                  </div>
                </DisclosurePanel>
              </Disclosure>
            </form>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
