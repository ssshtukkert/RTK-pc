<template>
  <q-layout>
    <q-header
    reveal
    class="bg-teal-7 text-white"
    style="transition: none; margin-bottom: 100px"
  >
    <q-toolbar>
      <q-toolbar-title style="display: flex;
          height: 70px;
          align-items: center;
          justify-content: space-between;
          padding: 0; ">
        <div>
          <img class="q-mt-xs"
            src="../components/images/logo.svg"
            style="width: 60vw; max-height: 60px; padding-top: 5px" />
        </div>
        <div style="display: flex; align-items: center">
          <img
            src="../components/images/sun-svgrepo-com (1).svg"
            style="width: 12vw; max-height: 60px; margin-right: 10px"
            @click="changeColor"
            v-if="isDark == 'false' || isDark == false"
          />
          <img
            src="../components/images/night-moon-svgrepo-com.svg"
            style="width: 12vw; max-height: 60px; margin-right: 10px"
            @click="changeColor"
            v-if="isDark == 'true' || isDark == true"
          />

        </div>
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
    <q-page-container style="margin-top: 0px; height: 100%;">
      <router-view style="margin-top: 0px; overflow: hidden; overflow-y: hidden;"/>
    </q-page-container>
  </q-layout>
</template>
<!-- class="bg-grey-9 text-white" -->
<script setup>
import { ref, onMounted, inject} from "vue";
import { provide } from 'vue';
import { useRouter } from 'vue-router';
import mitt from 'mitt';
const router = useRouter();
const bus = mitt();

// const theme = ref();
const isDark = ref(true);
const darkThemeMq = ref();

function goCalculation() {
  router.push(`/monitoring/configuration/${table.value.getSelect()[0].id}`);
}

if (localStorage.getItem("isDark") !== null) {
    isDark.value = localStorage.getItem("isDark");
}

onMounted(() => {
  // localStorage.clear();
  darkThemeMq.value = window.matchMedia("(prefers-color-scheme: light)");
  console.log(localStorage.getItem("isDark"));
  if (localStorage.getItem("isDark") !== null) {
    isDark.value = localStorage.getItem("isDark");
  } else {
    if (darkThemeMq.value.matches) {
      isDark.value = false;
      localStorage.setItem("isDark", false)
    }
    if (!darkThemeMq.value.matches) {
      isDark.value = true;
      localStorage.setItem("isDark", true)
    }
  }
  console.log(isDark.value)
  bus.emit('themeChanged', isDark);
})


provide('bus', bus)

// function changeColor() {
//   console.log(isDark.value);

//   let a = localStorage.getItem("isDark");
//   if (a && (a == false || a == "false")) {
//     isDark.value = true;
//     // theme.value = true;
//     localStorage.setItem("isDark", false);
//   }
//   else {
//     isDark.value = false;
//     // theme.value = false;
//     localStorage.setItem("isDark", true);
//   }
//   console.log (isDark.value)
//   bus.emit('themeChanged', isDark);
// }
function changeColor() {
  console.log(isDark.value);
  if (isDark.value == false || isDark.value == "false") {
    isDark.value = true;
    // theme.value = true;
    localStorage.setItem("isDark", true);
  }
  else {
    isDark.value = false;
    // theme.value = false;
    localStorage.setItem("isDark", false);
  }
  console.log (isDark.value)
  bus.emit('themeChanged', isDark);
}
</script>
<style>
body{
  overflow: hidden;
}
</style>
