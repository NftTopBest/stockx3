<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { MinusCircleIcon, PlusCircleIcon, XIcon } from '@heroicons/vue/outline'
const { storeJson } = $(useNFTStorage())

const { walletAddress, userData, initContract, parseEther, formatUnits } = $(web3AuthStore())
const { name, avatar } = $(userData)
const { cartOpen, cartItems, removeFromCart, addToCart, clearCart, updateProductList } = $(stockx3Store())

const total = $computed(() => {
  let theTotal = parseEther('0')
  forEach(cartItems, (item) => {
    theTotal = theTotal.add(parseEther(get(item, 'properties.basicPrice')).mul(item.quantity))
  })
  return formatUnits(theTotal)
})
const { addSuccess } = $(notificationStore())

let isLoading = $ref(false)
let error = $ref('')
const doCheckout = async() => {
  if (isLoading) return

  isLoading = true
  const contractWriter = await initContract('StockX3', true)
  const value = parseEther(total)
  const data = {
    author: walletAddress,
    avatar,
    name,
    cartItems,
    total,
  }
  const metadataCID = await storeJson(data)
  try {
    const tokenIds = []
    const amounts = []
    forEach(cartItems, (item) => {
      tokenIds.push(item.tokenId)
      amounts.push(item.quantity)
    })
    const tx = await contractWriter.mintNFTBatch(tokenIds, amounts, metadataCID, { value })
    // const txUrl = getTxUrl(tx.hash)
    const rc = await tx.wait()
    console.log('====> rc :', rc)
  }
  catch (err) {
    console.log('====> err :', err)
    isLoading = false
    error = err
    return
  }
  await updateProductList()
  isLoading = false
  clearCart()
  cartOpen = false
  addSuccess('Checkout success')
}
</script>
<template>
  <TransitionRoot as="template" :show="cartOpen">
    <Dialog as="div" class="z-10 relative" @close="cartOpen = false">
      <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
        <div class="bg-gray-500 bg-opacity-75 inset-0 transition-opacity fixed" />
      </TransitionChild>

      <div class="inset-0 fixed overflow-hidden">
        <div class="inset-0 absolute overflow-hidden">
          <div class="flex max-w-full pl-10 inset-y-0 right-0 pointer-events-none fixed">
            <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
              <DialogPanel class="max-w-md w-screen pointer-events-auto">
                <div class="bg-white flex flex-col h-full shadow-xl overflow-y-scroll">
                  <div class="flex-1 py-6 px-4 overflow-y-auto sm:px-6">
                    <div class="flex items-start justify-between">
                      <DialogTitle class="font-medium text-lg text-gray-900">
                        NFT Group Buying cart
                      </DialogTitle>
                      <div class="flex h-7 ml-3 items-center">
                        <button type="button" class="-m-2 p-2 text-gray-400 hover:text-gray-500" @click="cartOpen = false">
                          <span class="sr-only">Close panel</span>
                          <XIcon class="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div class="mt-8">
                      <div class="flow-root">
                        <ul role="list" class="divide-y divide-gray-200 -my-6">
                          <li v-for="product in cartItems" :key="product.id" class="flex py-6">
                            <div class="border rounded-md border-gray-200 flex-shrink-0 h-24 w-24 overflow-hidden">
                              <IpfsImg :src="product.image" class="h-full object-cover object-center w-full" />
                            </div>

                            <div class="flex flex-col flex-1 ml-4">
                              <div class="flex-1">
                                <div class="flex font-medium text-base text-gray-900 justify-between">
                                  <h3>
                                    #{{ product.tokenId }} {{ product.name }}
                                  </h3>
                                  <p class="flex ml-4 items-center">
                                    {{ get(product, 'properties.basicPrice') }}
                                    <logos-ethereum-color class="h-5 w-5" />
                                  </p>
                                </div>
                              </div>
                              <div class="flex text-sm items-center justify-between">
                                <div class="flex items-center">
                                  <MinusCircleIcon class="h-6 w-6 hover:cursor-pointer" @click="removeFromCart(product)" />
                                  <input v-model="product.quantity" type="number" name="qty" class="rounded-md border-gray-300 shadow-sm mx-2 text-center w-20 block sm:text-sm focus:border-indigo-500 focus:ring-indigo-500">
                                  <PlusCircleIcon class="h-6 w-6 hover:cursor-pointer" @click="addToCart(product)" />
                                </div>
                                <div class="flex items-center">
                                  {{ (get(product, 'properties.basicPrice') * product.quantity).toFixed(2) }}
                                  <logos-ethereum-color class="h-5 w-5" />
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div class="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <div class="flex font-medium text-base text-gray-900 justify-between">
                      <p>Total</p>
                      <p class="flex items-center">
                        {{ total }}
                        <logos-ethereum-color class="h-5 w-5" />
                      </p>
                    </div>
                    <div class="mt-6">
                      <btn-black class="w-full py-3" :is-loading="isLoading" @click="doCheckout">
                        Checkout
                      </btn-black>
                    </div>
                    <div class="flex mt-6 text-center text-sm text-gray-500 justify-center">
                      <p>
                        or <button type="button" class="font-medium text-indigo-600 hover:text-indigo-500" @click="cartOpen = false">
                          Continue Shopping<span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
