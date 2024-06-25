<template>
  <q-layout
    style="padding-bottom: 15px"
    class="bg-grey-9 text-white"
    id="mainLayout"
  >
    <span v-if="isSpinner" class="loader"></span>
    <!-- Выбор системы мониторинга -->
    <div style="height: auto">
      <q-label
        style="
          padding: 10px;
          font-family: 'Roboto', sans-serif;
          font-size: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        "
      >
        <div>Выбор устройства:</div>
      </q-label>
      <q-scroll-area style="height: 85vh">
        <div>
        <q-card
          v-for="(system, index) in systems"
          :key="system"
          :class="computedClass"
          style="border-radius: 15px; padding: 0"
        >
          <q-card-section
            style="
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                width: 100%;
                align-items: center;
              "
            >
              <div
                @click="
                  () => {
                    checkConnections();
                    router.replace(
                      `RTK/${system.SN}/${system.port}/${system.host}/${system.name}/${system.mode}`
                    );
                  }
                "
                style="
                  display: flex;
                  flex-direction: row;
                  width: 90%;
                  justify-content: space-between;
                  align-items: end;
                "
              >
                <div>
                  <q-label
                    style="
                      word-wrap: break-word;
                      font-size: 16px;
                      font-weight: 700;
                    "
                    >{{ system.name }}</q-label
                  >

                  <div>{{ system.SN }}</div>
                  <div><b>Режим: </b>{{ system.mode }}</div>
                </div>
              </div>

              <div style="display: flex">
                <div>
                <q-btn @click="
                    () => {
                      changeSys = true;
                      editSystem(index);
                    }" style="height: 0; width: 0; background-color: transparent; border: none; padding: 0;">
                    <img
                    src="../components/images/edit-svgrepo-com.svg"
                    alt=""
                    style="height: 30px; margin-right: 20px"
                  />
                </q-btn>

                </div>
                <div @click="deleteSystem(index)">
                  <img
                    src="../components/images/garbage-svgrepo-com.svg"
                    alt=""
                    style="height: 30px; margin-left: 10px"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <q-btn
        v-if="!createNewSys"
        style="
          height: 40px;
          width: 230px;
          display: flex;
          margin: 0 auto;
          padding-top: -5px;
          padding-bottom: -5px;
        "
        rounded
        class="q-ma-md"
        color="teal-7"
        @click="
          () => {
            addSys = true;
            connectMqtt();
          }
        "
        >Добавить устройство</q-btn
      >

      <!-- <q-dialog persistent v-model="changeSys">
      <q-card :class="computedClass" :dark="isDark">
        <q-toolbar style="background-color: #ff6f24">
          <q-toolbar-title style="font-size: 18px"
            ><span>Добавление системы</span></q-toolbar-title
          >

          <q-btn
            @click="
              () => {
                connectionType = '';
                systName = '';
                serialNumber = '';
                host = '';
                errMessage = false;
              }
            "
            flat
            round
            dense
            icon="close"
            v-close-popup
          />
        </q-toolbar>
        <div
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
          "
        >
          <q-select
            v-model="connectionType"
            :options="connectTypes"
            label="Тип подкючения"
            :color="isDark"
            :dark="isDark"
            popup-content-style="font-size: 16px"
            options-style="font-size: 16px;"
            style="width: 83vw; margin-top: 10px"
          />
          <q-input
            :dark="isDark"
            outlined
            v-model="systName"
            label="Наименование"
            hint="Пример: РТК Кухня"
            style="width: 85vw; margin-top: 10px"
          />
          <q-input
            :dark="isDark"
            outlined
            v-model="serialNumber"
            label="Серийный номер"
            hint="Пример: 8882A10CVD78"
            style="width: 85vw; margin-top: 5px"
          />
          <q-input
            :dark="isDark"
            outlined
            v-model="host"
            label="Хост (брокер)"
            hint="Пример: test.mosquitto.org"
            style="width: 85vw; margin-top: 5px"
          />

          <div
            style="
              margin-top: 20px;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              width: 80vw;
            "
          >
            <q-btn
              rounded
              color="teal-7"
              label="Поиск (точка доступа)"
              @click="searchForNewSys()"
            />
            <q-btn
              rounded
              color="orange-9"
              :disable="
                serialNumber == undefined ||
                host == undefined ||
                systName == undefined ||
                errMessage
              "
              label="Сохранить"
              @click="addSystem()"
              v-close-popup
            />
          </div>
          <div
            v-if="errMessage"
            style="color: red; margin: 0 auto; margin-top: 10px"
          >
            Устройство недоступно!
          </div>
        </div>
      </q-card>
    </q-dialog> -->

      </q-scroll-area>

      <q-card
        :class="computedClass"
        style="border-radius: 15px"
        v-if="createNewSys"
      >
        <q-toolbar style="background-color: #ff6f24; color: white"
          ><img
            src="../components/images/switch.svg"
            alt=""
            style="height: 45px; margin: 10px"
          /><q-label
            style="word-wrap: break-word; font-size: 16px; font-weight: 700"
            >Новое подключение</q-label
          ></q-toolbar
        >
        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              outlined
              :dark="isDark"
              v-model="systemName"
              label="Название соединения"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Введите имя подключения',
              ]"
              style="margin-bottom: -10px"
            />
            <q-input
              :dark="isDark"
              outlined
              v-model="host"
              label="Хост"
              hint="Пример: test.mosquitto.org"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Поле не может быть пустым!',
              ]"
              style="margin-bottom: -10px"
            />
            <q-input
              :dark="isDark"
              outlined
              v-model="port"
              label="Порт"
              hint="Пример: 8081"
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Поле не может быть пустым!',
              ]"
              style="margin-bottom: -10px"
            />
            <q-input
              :dark="isDark"
              outlined
              v-model="prefix"
              label="Префикс"
              hint="Пример: /IoTmanager"
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Поле не может быть пустым!',
              ]"
            />

            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: center;
              "
            >
              <q-btn
                style="
                  height: 40px;
                  width: 130px;
                  display: flex;
                  margin: 0 auto;
                  padding-top: -5px;
                  padding-bottom: -5px;
                "
                rounded
                class="q-ma-md"
                color="orange-9"
                type="submit"
                @click="
                  () => {
                    createNewSys = false;
                    onSubmit();
                    myClient.disconnect();
                  }
                "
                ><b>Сохранить</b></q-btn>
              <q-btn
                style="
                  height: 40px;
                  width: 130px;
                  display: flex;
                  margin: 0 auto;
                  padding-top: -5px;
                  padding-bottom: -5px;
                "
                rounded
                class="q-ma-md"
                color="teal-7"
                @click="cancelCreation"
                ><b>Отмена</b></q-btn
              >
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
    <q-dialog persistent v-model="addSys">
      <q-card :class="computedClass" :dark="isDark">
        <q-toolbar style="background-color: #ff6f24">
          <q-toolbar-title style="font-size: 18px"
            ><span>Добавление системы</span></q-toolbar-title
          >

          <q-btn
            @click="
              () => {
                connectionType = '';
                systName = '';
                serialNumber = '';
                host = '';
                errMessage = false;
              }
            "
            flat
            round
            dense
            icon="close"
            v-close-popup
          />
        </q-toolbar>
        <div
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
          "
        >
          <q-select
            v-model="connectionType"
            :options="connectTypes"
            label="Тип подкючения"
            :color="isDark"
            :dark="isDark"
            popup-content-style="font-size: 16px"
            options-style="font-size: 16px;"
            style="width: 83vw; margin-top: 10px"
          />
          <q-input
            :dark="isDark"
            outlined
            v-model="systName"
            label="Наименование"
            hint="Пример: РТК Кухня"
            style="width: 85vw; margin-top: 10px"
          />
          <q-input
            :dark="isDark"
            outlined
            v-model="serialNumber"
            label="Серийный номер"
            hint="Пример: 8882A10CVD78"
            style="width: 85vw; margin-top: 5px"
          />
          <q-input
            :dark="isDark"
            outlined
            v-model="host"
            label="Хост (брокер)"
            hint="Пример: test.mosquitto.org"
            style="width: 85vw; margin-top: 5px"
          />

          <div
            style="
              margin-top: 20px;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              width: 80vw;
            "
          >
            <q-btn
              rounded
              color="teal-7"
              label="Поиск (точка доступа)"
              @click="searchForNewSys()"
            />
            <q-btn
              rounded
              color="orange-9"
              :disable="
                serialNumber == undefined ||
                host == undefined ||
                systName == undefined ||
                errMessage
              "
              label="Сохранить"
              @click="addSystem()"
              v-close-popup
            />
          </div>
          <div
            v-if="errMessage"
            style="color: red; margin: 0 auto; margin-top: 10px"
          >
            Устройство недоступно!
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog persistent v-model="changeSys">
      <q-card :class="computedClass" :dark="isDark">
        <q-toolbar style="background-color: #ff6f24">
          <q-toolbar-title style="font-size: 18px"
            ><span>Изменение системы</span></q-toolbar-title
          >
          <q-btn
            @click="
              () => {
                connectionType = '';
                systName = '';
                serialNumber = '';
                host = '';
                errMessage = false;
              }
            "
            flat
            round
            dense
            icon="close"
            v-close-popup
          />
        </q-toolbar>
        <div
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
          "
        >
          <q-select
            v-model="connectionType"
            :options="connectTypes"
            label="Тип подкючения"
            :color="isDark"
            :dark="isDark"
            popup-content-style="font-size: 16px"
            options-style="font-size: 16px;"
            style="width: 83vw; margin-top: 10px"
          />
          <q-input
            :dark="isDark"
            outlined
            v-model="systName"
            label="Наименование"
            hint="Пример: РТК Кухня"
            style="width: 85vw; margin-top: 10px"
          />
          <q-input
            :dark="isDark"
            outlined
            :disable="connectionType == 'Точка доступа'"
            v-model="serialNumber"
            label="Серийный номер"
            hint="Пример: 8882A10CVD78"
            style="width: 85vw; margin-top: 5px"
          />
          <q-input
            :dark="isDark"
            outlined
            :disable="connectionType == 'Точка доступа'"
            v-model="host"
            label="Хост (брокер)"
            hint="Пример: test.mosquitto.org"
            style="width: 85vw; margin-top: 5px"
          />

          <div
            style="
              margin-top: 20px;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              width: 80vw;
            "
          >
            <q-btn
              rounded
              color="orange-9"
              :disable="
                serialNumber == undefined ||
                host == undefined ||
                systName == undefined ||
                errMessage
              "
              label="Сохранить"
              @click="saveEditSystem()"
              v-close-popup
            />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </q-layout>
</template>
<script setup>
import { ref, onMounted, onBeforeMount, inject, provide } from "vue";
import { useRouter, useRoute } from "vue-router";
import Paho from "paho-mqtt";
// import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

const changeSys =  ref(false);
// import { MyNsdManager } from "../../src-capacitor/android/app/src/plugins/my-nsd-manager";
// const myNsdManager = ref(new MyNsdManager());

// async function startDiscovery() {
//   try {
//     const result = await myNsdManager.value.startDiscovery();
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function stopDiscovery() {
//   try {
//     const result = await myNsdManager.value.stopDiscovery();
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function getServiceInfo() {
//   try {
//     const result = await myNsdManager.value.getServiceInfo();
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// }

const connectTypes = ["Точка доступа", "Станция (онлайн)", "Станция (оффлайн)"];
const router = useRouter();
const rtkSerialNum = ref("");
const labelColor = ref("text-white");
const mainColor = ref("white");
const addSys = ref(false);
const serialNumber = ref();
const connectionType = ref("Станция (онлайн)");
const host = ref();
const systems = ref([]);
const systName = ref();
// systems.value = localStorage.getItem('systems')

const systemList = ref([
  {
    Name: "",
    Host: "",
    Port: 8080,
  },
]);
const isDark = ref();
const theme = ref();
const bus = inject("bus");
const errMessage = ref(false);
const computedClass = ref("my-card-dark");
const editSys = ref(false);
bus.on("themeChanged", (themeValue) => {
  console.log("changed");
  redoColor();
});
const myClient = ref();

function checkConnections() {
  console.log(myClient.value);
}
function connectMqtt() {
  if (myClient.value) {
    try {
      myClient.value.unsubscribe("#");
      myClient.value.disconnect();
      myClient.value = null;
    } catch {
      myClient.value = null;
    }
  }
  myClient.value = new Paho.Client(
    "192.168.4.1",
    Number(8883),
    "clientId_" + Math.random().toString(16).substr(2, 8)
  );
  myClient.value.connect({ onSuccess: onConnect, onFailure: onFailure });
}
function onConnect() {
  console.log("Mqtt connected");
  sendMessage("HELLO", "/IoTmanager");
  myClient.value.subscribe("/IoTmanager/#");
}
function onFailure() {
  console.log("Failed");
}
function deleteSystem(index) {
  event.stopPropagation();
  systems.value.splice(index, 1);
  localStorage.setItem("systems", JSON.stringify(systems.value));
}
const chosenSysIndex = ref(-1);
function editSystem(index) {
  console.log(myClient.value)
  // event.stopPropagation();
  // if (myClient.value !== '') {
  //   try {
  //     myClient.value.unsubscribe("#");
  //     myClient.value.disconnect();
  //     myClient.value = null;

  //     chosenSysIndex.value = index;
  //     connectionType.value = systems.value[index].mode;
  //     systName.value = systems.value[index].name;
  //     serialNumber.value = systems.value[index].SN;
  //     host.value = systems.value[index].host;

  //   } catch {
  //     myClient.value = null;
  //     console.log('zalupa')
  //   }
  // }
  // else{
    chosenSysIndex.value = index;
    connectionType.value = systems.value[index].mode;
    systName.value = systems.value[index].name;
    serialNumber.value = systems.value[index].SN;
    host.value = systems.value[index].host;
  // }

}
function sendMessage(payload, destination) {
  const message = new Paho.Message(payload);
  message.destinationName = destination;
  try {
    myClient.value.send(message);
  } catch {
    return false;
  }
}
function isInitial() {
  const serialNum = localStorage.getItem("SN");
  console.log(serialNum);
  return typeof serialNum == undefined;
}
function searchForNewSys() {
  sendMessage("HELLO", "/IoTmanager");
  if (sendMessage("HELLO", "/IoTmanager") == false) {
    errMessage.value = true;
  }
  try {
    myClient.value.subscribe("#");
    myClient.value.onMessageArrived = (message) => {
      // console.log(message);
      const recievedMessage = JSON.parse(message.payloadString);
      console.log(recievedMessage);
      if (recievedMessage.topic) {
        let newSN = recievedMessage.topic.split("/");
        rtkSerialNum.value = newSN[2].split("-")[1];
        console.log(rtkSerialNum.value);

        systName.value = rtkSerialNum.value;
        serialNumber.value = rtkSerialNum.value;
        host.value = "192.168.4.1";
        connectionType.value = "Точка доступа";
      }
    };
  } catch {
    console.log("error");
  }
}
function onClosed() {
  console.log("closed");
}
function addSystem() {
  console.log(systems.value, systName.value, serialNumber.value, host.value);
  let existingSystemIndex;
  if (systems.value) {
    existingSystemIndex = systems.value.findIndex(
      (system) =>
        system.name === systName.value &&
        system.SN === serialNumber.value &&
        system.host === host.value
    );
  }

  if (existingSystemIndex === -1 || !systems.value) {
    if (host.value == "192.168.4.1") {
      systems.value.push({
        name: `${systName.value}`,
        SN: serialNumber.value,
        host: host.value,
        port: 8883,
        mode: connectionType.value,
      });
    } else {
      if (connectionType.value == "Станция (онлайн)") {
        console.log("Станция онлайн");
        systems.value.push({
          name: `${systName.value}`,
          SN: serialNumber.value,
          host: host.value,
          port: 8080,
          mode: connectionType.value,
        });
      }
      if (connectionType.value == "Станция (оффлайн)") {
        console.log("Станция оффлайн");
        systems.value.push({
          name: `${systName.value}`,
          SN: serialNumber.value,
          host: host.value,
          port: 8883,
          mode: connectionType.value,
        });
      }
    }
  } else {
    console.log("System with the same properties already exists.");
  }
  localStorage.setItem("systems", JSON.stringify(systems.value));
  myClient.value.disconnect();
}
function saveEditSystem() {
  systems.value[chosenSysIndex.value].mode = connectionType.value;
  systems.value[chosenSysIndex.value].name = systName.value;
  systems.value[chosenSysIndex.value].SN = serialNumber.value;
  systems.value[chosenSysIndex.value].host = host.value;

  console.log(systems.value);
  localStorage.setItem("systems", JSON.stringify(systems.value));
  connectionType.value = "";
  systName.value = "";
  serialNumber.value = "";
  host.value = "";
}
function redoColor() {
  let a = localStorage.getItem("isDark");
  console.log(a);
  const changeable = ref(document.getElementById("mainLayout"));
  if (!a) {
    isDark.value = false;

    labelColor.value = "text-black";
    mainColor.value = "black";
    computedClass.value = "my-card-light";
    changeable.value.classList.remove("bg-grey-9", "text-white");
    changeable.value.classList.add("bg-grey-2", "text-black");
  }
  if (a == true || a === "true") {
    isDark.value = false;

    labelColor.value = "text-black";
    mainColor.value = "black";
    computedClass.value = "my-card-light";
    changeable.value.classList.remove("bg-grey-9", "text-white");
    changeable.value.classList.add("bg-grey-2", "text-black");
  }
  if (a == false || a === "false") {
    isDark.value = true;

    labelColor.value = "text-white";
    mainColor.value = "white";
    computedClass.value = "my-card-dark";
    changeable.value.classList.remove("bg-grey-2", "text-black");
    changeable.value.classList.add("bg-grey-9", "text-white");
  }
  // localStorage.setItem('isDark', isDark.value)
}

onMounted(() => {
  systems.value = localStorage.getItem("systems")
    ? JSON.parse(localStorage.getItem("systems"))
    : [];
  console.log(localStorage.getItem("systems"));
  redoColor();
});
</script>

<style>
.my-card-dark {
  width: 93vw;
  margin: 0 auto;
  background-color: #777777;
  flex-direction: column;
  margin-bottom: 10px;
  display: flex;
  justify-items: flex-start;
  font-size: 16px;
}
.my-card-light {
  width: 93vw;
  margin: 0 auto;
  background-color: #eeeeee;
  flex-direction: column;
  margin-bottom: 10px;
  display: flex;
  justify-items: flex-start;
  font-size: 16px;
  color: black;
}
.navbar {
  display: flex;
  align-items: center;
  flex-direction: column;
  /* margin-right: 15px; */
}
.cardInside {
  display: flex;
  flex-direction: row;
  font-size: 16px;
}
.cardInside-light {
  display: flex;
  flex-direction: row;
  font-size: 16px;
}
.settingsInside {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
}
.cardText {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  flex-wrap: nowrap;
  text-overflow: ellipsis;
}
.tagValue {
  overflow: hidden;
  white-space: nowrap;
  flex-wrap: nowrap;
  text-overflow: ellipsis;
  font-weight: 700;
}
.cardMan {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
}
.cardManCircle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
}
.schedule_item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
  font-size: 16px;
  margin-left: 15px;
  margin-right: 15px;
}
.item {
  font-size: 16px;
  margin-left: 15px;
  margin-right: 15px;
  width: 90%;
}
.dark {
  color: rgb(223, 223, 223);
}

.loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  position: relative;
  animation: rotate 1s linear infinite;
}
.loader::before,
.loader::after {
  content: "";
  box-sizing: border-box;
  position: absolute;
  inset: 0px;
  border-radius: 50%;
  border: 5px solid #00897b;
  animation: prixClipFix 2s linear infinite;
}
.loader::after {
  inset: 8px;
  transform: rotate3d(90, 90, 0, 180deg);
  border-color: #ff6f24;
}
.knobOutlined {
  border: solid 5px rgba(0, 0, 0, 0.062);
  border-radius: 100%;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes prixClipFix {
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
  }
  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
  }
  75%,
  100% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
  }
}

.button__progress {
  position: absolute;
  height: 100%;
  /* width: 0%; */

  border-radius: 25px;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  /* transition: width 0.3s; */
}
</style>
