<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
// const emit = defineEmits(['update:modelValue'])
// interface Props {
//   modelValue?: string
// }
// const {
//   modelValue,
// } = defineProps<Props>()
import { XIcon } from '@heroicons/vue/outline'
import * as ls from '~/helpers/ls'
import { litHelper } from '~/helpers/litHelper'

const litNodeClient = inject('litNodeClient')
const { productModal, product, addToCart } = $(stockx3Store())

const filterOutPropertKeys = ['from', 'basicPrice', 'content', 'totalSupply']
const propertiesArr = $computed(() => {
  const properties = []
  forEach(get(product, 'properties'), (value, key) => {
    if (filterOutPropertKeys.includes(key)) return
    properties.push({ key, value })
  })
  return properties
})

let isUnlocking = $ref(false)
let errMsg = $ref('')
const unlockNow = async() => {
  if (isUnlocking) return

  const cachedKey = `decryptedString-${product.cid}`
  const data = ls.getItem(cachedKey, false)
  if (data) {
    product.unlockedContent = data
    return
  }

  errMsg = ''
  isUnlocking = true
  const { encryptedSymmetricKey, encryptedString, accessControlConditions } = get(product, 'properties.content')
  accessControlConditions[0].returnValueTest.value = '1'
  const chain = 'mumbai'
  const { doDecryptString } = await litHelper({ chain, litNodeClient })
  const { decryptedString, err } = await doDecryptString(encryptedSymmetricKey, encryptedString, accessControlConditions)
  isUnlocking = false
  if (err) {
    errMsg = err
    return
  }
  product.unlockedContent = decryptedString
  ls.setItem(cachedKey, decryptedString)
}
</script>
<template>
  <TransitionRoot as="template" :show="productModal">
    <Dialog as="div" class="z-10 relative" @close="productModal = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="bg-gray-500 bg-opacity-75 inset-0 transition-opacity hidden fixed md:block" />
      </TransitionChild>

      <div class="inset-0 z-10 fixed overflow-y-auto">
        <div class="flex min-h-full text-center items-stretch justify-center md:px-2 md:items-center lg:px-4">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enter-to="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 md:scale-100" leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
            <DialogPanel class="flex text-base text-left w-full transform transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
              <div class="bg-white flex w-full px-4 pt-14 pb-8 shadow-2xl relative items-center overflow-hidden sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                <button type="button" class="top-4 right-4 text-gray-400 absolute sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8 hover:text-gray-500" @click="productModal = false">
                  <span class="sr-only">Close</span>
                  <XIcon class="h-6 w-6" aria-hidden="true" />
                </button>

                <div class="w-full grid gap-y-8 gap-x-6 grid-cols-1 items-start sm:grid-cols-12 lg:gap-x-8">
                  <div class="rounded-lg bg-gray-100 overflow-hidden aspect-w-2 aspect-h-3 sm:col-span-4 lg:col-span-5">
                    <IpfsImg :src="product.image" class="h-full object-center object-cover w-full" />
                  </div>
                  <div class="flex flex-col h-full justify-between sm:col-span-8 lg:col-span-7">
                    <div>
                      <h2 class="font-bold text-2xl text-gray-900 sm:pr-12">
                        {{ product.name }}
                      </h2>
                      <section aria-labelledby="information-heading" class="mt-2">
                        <h3 id="information-heading" class="sr-only">
                          Product information
                        </h3>
                        <div class="mt-2 text-sm">
                          {{ product.description }}
                        </div>

                        <div class="mt-2 text-sm">
                          <div v-if="product.unlockedContent">
                            {{ product.unlockedContent }}
                          </div>
                          <div v-else class="flex justify-between items-center">
                            <Error v-if="errMsg" v-model="errMsg" />
                            <div v-else>
                              The content is locked! Only you own the NFT can Unlock it!
                            </div>
                            <btn-green :is-loading="isUnlocking" @click="unlockNow">
                              Unlock
                            </btn-green>
                          </div>
                        </div>
                      </section>
                      <section class="mt-4 max-h-60 overflow-y-scroll">
                        <div class="border-gray-200 border-1">
                          <dl v-for="(item, index) in propertiesArr" :key="item.key">
                            <div class="py-3 px-4 sm:grid sm:px-6 sm:gap-4 sm:grid-cols-3" :class="index % 2 ? 'bg-gray-50' : 'bg-white'">
                              <dt class="font-medium text-sm text-gray-500">
                                {{ item.key }}
                              </dt>
                              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {{ item.key === 'inviteCommission' ? `${item.value/100}%`: item.value }}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </section>
                    </div>
                    <div class="flex mt-2 text-2xl text-gray-900 items-center justify-between">
                      <div class="flex items-center">
                        <logos-ethereum-color class="h-6 w-6" />
                        {{ get(product, 'properties.basicPrice') }}
                      </div>
                      <div class="flex text-xl items-center">
                        {{ get(product, 'totalMintCount') }} / {{ get(product, 'properties.totalSupply') }}
                      </div>
                    </div>
                    <section class="flex space-x-2 mt-2">
                      <btn-plain class="w-full py-3" @click="addToCart(product)">
                        Invite to Earn
                        {{ get(product, 'properties.basicPrice') * get(product, 'properties.inviteCommission') / 10000 }}
                        <logos-ethereum-color class="h-5 w-5" />
                      </btn-plain>
                      <btn-black class="w-full py-3" @click="addToCart(product)">
                        Add to Cart
                      </btn-black>
                    </section>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
