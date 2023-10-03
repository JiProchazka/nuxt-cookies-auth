<script setup lang="ts">
import { useLogin, useGetData } from "#imports"

async function login() {
  await useLogin()
}
async function requestData() {
  const { data, error } = await useGetData()
  console.log("data", data.value)
  console.log("error", error.value)
}

const { data, error } = await useGetData()
console.log("data", data.value?.message)
console.log("error", error.value)
</script>

<template>
  <div>
    <button type="button" @click="login">Login</button>
    <button type="button" @click="requestData">Request Data</button>
  </div>
</template>
