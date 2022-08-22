import * as ls from '~/helpers/ls'

const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
]
const subCategories = [
  { name: 'Totes', href: '#' },
  { name: 'Backpacks', href: '#' },
  { name: 'Travel Bags', href: '#' },
  { name: 'Hip Bags', href: '#' },
  { name: 'Laptop Sleeves', href: '#' },
]
const filters = [
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White', checked: false },
      { value: 'beige', label: 'Beige', checked: false },
      { value: 'blue', label: 'Blue', checked: true },
      { value: 'brown', label: 'Brown', checked: false },
      { value: 'green', label: 'Green', checked: false },
      { value: 'purple', label: 'Purple', checked: false },
    ],
  },
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'new-arrivals', label: 'New Arrivals', checked: false },
      { value: 'sale', label: 'Sale', checked: false },
      { value: 'travel', label: 'Travel', checked: true },
      { value: 'organization', label: 'Organization', checked: false },
      { value: 'accessories', label: 'Accessories', checked: false },
    ],
  },
  {
    id: 'size',
    name: 'Size',
    options: [
      { value: '2l', label: '2L', checked: false },
      { value: '6l', label: '6L', checked: false },
      { value: '12l', label: '12L', checked: false },
      { value: '18l', label: '18L', checked: false },
      { value: '20l', label: '20L', checked: false },
      { value: '40l', label: '40L', checked: true },
    ],
  },
]

export const stockx3Store = defineStore('stockx3Store', () => {
  const { initContract, walletAddress } = $(web3AuthStore())
  const { getJson } = $(useNFTStorage())

  let products = $ref([])
  let cartItems = $ref(ls.getItem('cartItems', {}))
  let product = $ref({})
  const mobileFiltersOpen = $ref(false)
  let cartOpen = $ref(false)
  let productModal = $ref(false)
  const productSubmitModal = $ref(false)

  const updateProductList = async() => {
    const contractReader = await initContract('StockX3')
    const allToken = await contractReader.getTokenList(0, 100)
    products = allToken.tokenURIs.map((cid, index) => {
      return {
        tokenId: index,
        cid,
        totalMintCount: allToken.totalMintCounts[index],
        mintMetadataCIDList: allToken.mintMetadataCIDList[index],
      }
    })
  }

  const updateProductItem = async(item) => {
    const data = await getJson(item.cid)
    const tokenId = item.tokenId
    const index = products.findIndex(item => item.tokenId === tokenId)
    if (index === -1) return

    const newProductData = {
      ...item,
      ...data,
    }

    products[index] = newProductData

    return newProductData
  }

  const showProductModal = async(item) => {
    productModal = true
    product = item
  }

  const addToCart = (item) => {
    if (!cartItems[item.tokenId]) {
      cartItems[item.tokenId] = {
        ...item,
        quantity: 0,
      }
    }
    cartItems[item.tokenId].quantity += 1
    cartOpen = true
    ls.setItem('cartItems', cartItems)
  }
  const removeFromCart = (item) => {
    if (cartItems[item.tokenId].quantity === 0) return
    cartItems[item.tokenId].quantity -= 1
    ls.setItem('cartItems', cartItems)
  }

  const clearCart = () => {
    cartItems = {}
    ls.setItem('cartItems', cartItems)
  }

  watchEffect(async() => {
    if (!walletAddress) return
    // do some init stuff
    await updateProductList()
  })

  return $$({
    sortOptions,
    subCategories,
    filters,
    products,
    mobileFiltersOpen,
    cartOpen,
    cartItems,
    product,
    productModal,
    productSubmitModal,
    updateProductItem,
    updateProductList,
    showProductModal,
    addToCart,
    removeFromCart,
    clearCart,
  })
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(stockx3Store, import.meta.hot))
