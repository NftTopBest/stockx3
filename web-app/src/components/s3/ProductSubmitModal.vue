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
import { MinusCircleIcon, XIcon } from '@heroicons/vue/outline'
import { PlusCircleIcon } from '@heroicons/vue/solid'
import { litHelper } from '~/helpers/litHelper'
const { addSuccess } = $(notificationStore())

const litNodeClient = inject('litNodeClient')
const { storeJson } = $(useNFTStorage())
const { productSubmitModal, updateProductList } = $(stockx3Store())
const { initContract, parseEther, getContractAddress } = $(web3AuthStore())

const image = $ref('')
const name = $ref('Hulk Buster')
const basicPrice = $ref('0.01')
const inviteCommission = $ref('1')
const totalSupply = $ref('10000')
const description = $ref('I am Hulk Buster! Where is the Hulk? ')
const contentToBeLocked = $ref('This is a secret, only you mint at least one of the current ERC1155 token can decrypt the message ;)')

const properties = $ref([
  { label: 'Category', value: 'Travel' },
  { label: 'Color', value: 'Blue' },
  { label: 'Size', value: '40L' },
  { label: 'property 4', value: 'property 4 value' },
  { label: 'property 5', value: 'property 5 value' },
])

const addItem = () => {
  properties.push({ label: '', value: '' })
}

const removeItem = (index) => {
  if (properties.length <= 1) return
  properties.splice(index, 1)
}

let step = $ref(1)

let isLoading = $ref(false)
// let error = $ref({ message: 'some error' })
let error = $ref('')
const doSubmit = async() => {
  if (isLoading) return
  isLoading = true
  step = 3

  const _basicPrice = parseEther(basicPrice)
  const _inviteCommission = inviteCommission * 100
  let _properties = {}
  properties.forEach(({ label, value }) => {
    if (!label || !value) return
    _properties[label] = value
  })

  _properties = {
    ..._properties,
    from: 'StockX3',
    basicPrice,
    totalSupply,
    inviteCommission: _inviteCommission,
  }

  const metadata = {
    name,
    description,
    image,
    properties: _properties,
  }
  const metadataCID = await storeJson(metadata)
  let tokenId = ''
  const contractWriter = await initContract('StockX3', true)
  const value = parseEther('0.01')

  try {
    const tx = await contractWriter.createToken(_basicPrice, _inviteCommission, totalSupply, metadataCID, { value })
    // const txUrl = getTxUrl(tx.hash)
    const rc = await tx.wait()
    const event = rc.events.find(event => event.event === 'CreateToken')
    const rz = event.args
    tokenId = rz[0].toString()
  }
  catch (err) {
    isLoading = false
    error = err
    return
  }

  step = 4
  // add locked content cid
  const chain = 'mumbai'
  const { doEncryptedString } = await litHelper({ chain, litNodeClient })
  const contractAddress = getContractAddress('StockX3')
  const accessControlConditions = [{
    contractAddress,
    standardContractType: 'ERC1155',
    chain,
    method: 'balanceOf',
    parameters: [
      ':userAddress',
      tokenId,
    ],
    returnValueTest: {
      comparator: '>=',
      value: '1',
    },
  }]
  const {
    encryptedString,
    encryptedSymmetricKey,
  } = await doEncryptedString(contentToBeLocked, accessControlConditions)
  metadata.properties.content = {
    encryptedString,
    encryptedSymmetricKey,
    accessControlConditions,
  }
  const newMetadataCID = await storeJson(metadata)
  const tx = await contractWriter.updateToken(tokenId, _basicPrice, _inviteCommission, totalSupply, newMetadataCID)
  await tx.wait()

  addSuccess('Submit success')
  productSubmitModal = false
  await updateProductList()
  setTimeout(() => {
    isLoading = false
    step = 1
  }, 1000)
}
</script>
<template>
  <TransitionRoot as="template" :show="productSubmitModal">
    <Dialog as="div" class="z-10 relative" @close="productSubmitModal = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="bg-gray-500 bg-opacity-75 inset-0 transition-opacity hidden fixed md:block" />
      </TransitionChild>

      <div class="inset-0 z-10 fixed overflow-y-auto">
        <div class="flex min-h-full text-center items-stretch justify-center md:px-2 md:items-center lg:px-4">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enter-to="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 md:scale-100" leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
            <DialogPanel class="flex text-base text-left w-full transform transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
              <div class="bg-white flex w-full px-4 pt-14 pb-8 shadow-2xl relative items-center overflow-hidden sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                <button type="button" class="top-2 right-2 text-gray-400 absolute hover:text-gray-500" @click="productSubmitModal = false">
                  <span class="sr-only">Close</span>
                  <XIcon class="h-6 w-6" aria-hidden="true" />
                </button>

                <div v-if="step === 1" class="mt-2 w-full grid gap-y-8 gap-x-6 grid-cols-1 items-start sm:grid-cols-12 lg:gap-x-8">
                  <div class="rounded-lg overflow-hidden aspect-w-2 aspect-h-3 sm:col-span-4 lg:col-span-5">
                    <FileUploaderBanner v-model="image" class="h-full" />
                  </div>
                  <div class="flex flex-col h-full sm:col-span-8 lg:col-span-7">
                    <h2 class="font-bold text-2xl text-gray-900">
                      <input id="name" v-model="name" type="text" name="name" autocomplete="name" placeholder="product name" class="rounded-md border-gray-300 flex-1 w-full min-w-0 block sm:text-sm focus:border-indigo-500 focus:ring-indigo-500">
                    </h2>
                    <p class="flex mt-2 text-2xl text-gray-900">
                      <input id="basicPrice" v-model="basicPrice" type="text" name="basicPrice" autocomplete="basicPrice" placeholder="product basicPrice" class="rounded-md border-gray-300 flex-1 mr-2 min-w-0 w-80 block sm:text-sm focus:border-indigo-500 focus:ring-indigo-500">
                      <input id="totalSupply" v-model="totalSupply" type="text" name="totalSupply" autocomplete="totalSupply" placeholder="product totalSupply" class="rounded-md border-gray-300 flex-1 min-w-0 w-80 block sm:text-sm focus:border-indigo-500 focus:ring-indigo-500">
                    </p>
                    <p class="flex mt-2 text-2xl text-gray-900">
                      <input id="inviteCommission" v-model="inviteCommission" type="text" name="inviteCommission" autocomplete="inviteCommission" placeholder="product inviteCommission" class="rounded-md border-gray-300 flex-1 mr-2 min-w-0 w-80 block sm:text-sm focus:border-indigo-500 focus:ring-indigo-500">
                    </p>

                    <section aria-labelledby="information-heading" class="mt-2">
                      <h3 id="information-heading" class="sr-only">
                        Product information
                      </h3>
                      <p class="mt-2 text-2xl text-gray-900">
                        <EditorDefault v-model="description" height="324px" />
                      </p>
                    </section>
                  </div>
                  <div class="flex col-span-12 justify-end">
                    <btn-black class="py-3" @click="step = 2">
                      Next
                    </btn-black>
                  </div>
                </div>
                <div v-if="step === 2" class="mt-2 w-full grid gap-y-8 gap-x-6 grid-cols-1 items-start sm:grid-cols-12 lg:gap-x-8">
                  <section aria-labelledby="information-heading" class="sm:col-span-4 lg:col-span-5">
                    <h3 id="information-heading" class="sr-only">
                      Product information
                    </h3>
                    <p class="mt-2 text-2xl text-gray-900">
                      <EditorDefault v-model="contentToBeLocked" height="360px" />
                    </p>
                  </section>
                  <section aria-labelledby="properties-heading" class=" sm:col-span-8 lg:col-span-7">
                    <h3 id="properties-heading" class="sr-only">
                      Product properties
                    </h3>
                    <div v-for="(item, index) in properties" class="sm:grid sm:pb-2 sm:gap-4 sm:grid-cols-3 sm:items-start">
                      <input v-model="item.label" type="text" class="rounded-md max-w-lg border-gray-300 shadow-sm w-full block sm:max-w-xs sm:text-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="property name">
                      <div class="flex mt-1 items-center sm:mt-0 sm:col-span-2">
                        <input v-model="item.value" type="text" class="rounded-md max-w-lg border-gray-300 shadow-sm w-full block sm:max-w-xs sm:text-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="property value">
                        <div class="p-2" :class="properties.length > 1 ? 'cursor-pointer' : 'cursor-not-allowed text-gray-400'" @click="removeItem(index)">
                          <MinusCircleIcon class="h-6  w-6" />
                        </div>
                      </div>
                    </div>
                    <div class="flex justify-end items-center ">
                      <div class="cursor-pointer p-2" @click="addItem">
                        <PlusCircleIcon class="h-6 w-6" />
                      </div>
                    </div>
                  </section>
                  <div class="flex col-span-12 justify-end">
                    <btn-plain v-if="!isLoading" class="mr-2 py-3" @click="step = 1">
                      Prev
                    </btn-plain>
                    <btn-black class="py-3 px-15" :is-loading="isLoading" @click="doSubmit">
                      Submit
                    </btn-black>
                  </div>
                </div>
                <div v-if="step === 3" class="mt-2 w-full grid gap-y-8 gap-x-6 grid-cols-1 items-start sm:grid-cols-12 lg:gap-x-8">
                  <div class="flex col-span-12 justify-center">
                    <Loading v-if="isLoading" class="h-20" text="Creating your token on Chain" />
                    <Error v-model="error" />
                  </div>
                </div>
                <div v-if="step === 4" class="mt-2 w-full grid gap-y-8 gap-x-6 grid-cols-1 items-start sm:grid-cols-12 lg:gap-x-8">
                  <div class="flex col-span-12 justify-center">
                    <Loading v-if="isLoading" class="h-20" text="Add your locked content on chain" />
                    <Error v-model="error" />
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
