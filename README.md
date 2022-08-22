# StockX3

## What it does

Sell anything in Web3 World with token gating: Gaming, Animation, Audio, Comics & Graphic Novels, Design, Drawing & Painting, Films, Music & Sound Design

## Links

* [Demo Video](https://www.loom.com/share/f6d4aef05efd4b7bb63e37632ee16a9d)
* [DApp Demo](https://stockx3.nfttop.best/)
* [DApp Source Code](https://github.com/NftTopBest/stockx3)
* [Smart Contract Source Code](https://github.com/NftTopBest/stockx3/blob/main/solidity-contract/StockX3.sol)
* [Smart Contract Deployment link](https://mumbai.polygonscan.com/address/0xEF103781e33B7468587a81E4970A2a4bb8B20387)
* [All Screenshot](https://github.com/NftTopBest/stockx3/blob/main/screenshot)

<img src="https://github.com/NftTopBest/stockx3/raw/main/screenshot-1.png" />

## Inspiration

At first, we just want to make a web3 version of stockx.com, but then the process of the verify sneakers make it complicated for the platform in Web3.
Then we turn it into "User can sell any things in Web3", but the platform does not need to do the verification process.
Such as user can sell their own produce products: shoes(not branding), clothes, e-books...

## How we built it

We use an ERC1155 NFT to build the platform, and add many helper functions and features to make the create sale function/batch checkout function.

* [x] IPFS
* [x] OpenZepplin
* [x] ERC1155
* [x] Hardhat
* [x] Vercel
* [x] TailwindCSS
* [x] Vue3
* [x] Pinia (state store)
* [x] PWA
* [x] Vite2

## Challenges we ran into

How to make the UX to simple but useful is hard for us, and we spend a lot of time removing unnecessary actions and buttons to keep the system simple and easy to use.

## Accomplishments that we're proud of

A simple and easy UX for users to buy/sell products in the Web3 world.

## Features

* contract Build base on the `ERC1155` and add many helpfull functions [source](https://github.com/NftTopBest/stockx3/blob/main/solidity-contract/StockX3.sol)
* platform get 1% fee for all of the token mint payments
* creators can add their product by create a new `ERC1155` token with `totalSupply` setup
  * create new token [source](https://github.com/NftTopBest/stockx3/blob/main/web-app/src/components/s3/ProductSubmitModal.vue)
    * nft image (upload to IPFS via `nft.storage` sdk)
    * basic price (for the token sell price)
    * invite commission (for club owner promote marketing)
    * dynamic properites
    * secret content
      * now just simply a textarea
      * in the future it will have multiple content type such as: image/music/movie/photo etc...
    * all data pack into json and submit to IPFS via `NFT.Stroage` SDK [source](https://github.com/NftTopBest/stockx3/blob/main/web-app/src/composables/useNFTStorage.ts)
  * buyer can buy any products by add to cart and batch mint token [source](https://github.com/NftTopBest/stockx3/blob/main/web-app/src/stores/stockx3Store.ts#L101)
    * user can batch mint token via the abi [contract code](https://github.com/NftTopBest/stockx3/blob/main/solidity-contract/StockX3.sol#L288)
    * invite friends to join club and get commission rewards
    * inviter get ${inviteCommission}% of the payment
    * user can decrypted content  [source](https://github.com/NftTopBest/stockx3/blob/main/web-app/src/components/s3/ProductModal.vue#L34)

## What's next

* make user can select category while creating new product
* After selecting different categories, we can show different UI/UX to help user to add more useful content for the product
* Implement the invite commission function
* Implement the category filter function
* Marketing && Promotion for the platform
* Improve the UX/UI design
* Make a great Landing page
* Find 100 NFT/creator KOLs to use our platform and sell products
* Help top 100 users to get earned with $1M worths of Crypto Assets
