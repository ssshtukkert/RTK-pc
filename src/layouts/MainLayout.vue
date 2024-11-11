<template>
  <q-layout>
    <q-header
    reveal
    class="text-white"
    style="transition: none; margin-bottom: 100px; background-color: #00692f;"
  >
    <q-toolbar style="width: 100%;">
      <q-toolbar-title style="display: flex;
          width: 100vw;
          height: 70px;
          align-items: center;
          justify-content: space-between;
          padding: 0; ">
        <div>
          <img class="q-mt-xs"
            src="../components/images/NEVATOM_logo_NEVATOM-05.svg"
            style=" height: 70px; " />
        </div>
          <div  style="display: flex; flex-direction: row; align-items: center;">
            <div style="margin-right: 10px;">Тема: </div>
            <img
            src="../components/images/g1.svg"
            style="max-height: 35px; margin-right: 10px"
            @click="changeColor"
            v-if="isDark == 'false' || isDark == false"
          />

          <img
            src="../components/images/g31.svg"
            style="max-height: 35px; margin-right: 10px"
            @click="changeColor"
            v-if="isDark == 'true' || isDark == true"
          />

        </div>
      </q-toolbar-title>
    </q-toolbar>
  </q-header>

    <q-page-container style="margin-top: 0px; height: 100%;">
      <router-view style="margin-top: 0px; overflow: hidden; overflow-y: hidden; font-family: 'HelveticaRegular'"/>
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
  // console.log(localStorage.getItem("isDark"));
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
  // console.log(isDark.value)
  bus.emit('themeChanged', isDark);
})


provide('bus', bus)

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
@font-face {
  font-family: "HelveticaRegular";
  src: url('../fonts/00_Helvetica/HelveticaRegular/HelveticaRegular.eot') format('eot'),
        url('../fonts/00_Helvetica/HelveticaRegular/HelveticaRegular.ttf') format('ttf'),
        url('../fonts/00_Helvetica/HelveticaRegular/HelveticaRegular.woff') format('woff'),
  ;
  font-weight: normal;
}
</style>
