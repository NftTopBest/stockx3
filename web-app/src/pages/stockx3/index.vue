<script setup lang="ts">

</script>

<template>
  <div class="bg-white">
    <div>
      <S3MobileFilter />

      <main class="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <S3Head />

        <section aria-labelledby="products-heading" class="pt-6 pb-24">
          <div class="grid gap-x-8 gap-y-10 grid-cols-1 lg:grid-cols-5">
            <S3Filter />
            <div class="lg:col-span-4">
              <S3Products />
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: stockx3
</route>
