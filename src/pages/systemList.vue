<template>
  <q-layout
    style="padding-bottom: 15px"
    class="bgc-dark-class text-white"
    id="mainLayout"
  >
    <div style="height: auto; width: 70%; max-width: 900px; justify-self: center">
      <q-label
        style="
          padding: 10px;
          font-family: 'HelveticaRegular';
          font-size: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        "
      >
        <div>Выбор устройства:</div>
      </q-label>
      <div style="height: 85vh; width: 100% ">
        <div>
        <q-card
          v-for="(system, index) in systems"
          :key="system"
          :class="computedClass"
          style="border-radius: 15px; padding: 0; width: 90%"
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
                    tryToDisconnect();
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
          background-color: #00692f;
          color: white;
          font-size: 16px
        "
        rounded
        no-caps
        class="q-ma-md"
        @click="
          () => {
            addSys = true;
            connectMqtt();
          }
        "
        >Добавить устройство</q-btn
      >

            </div>

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
                    isSysFound = false;
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
                @click="() => {
                  cancelCreation();
                  isSysFound = false;
                }"
                ><b>Отмена</b></q-btn
              >
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog persistent v-model="addSys" >
      <q-card :class="computedClass" :dark="isDark" style="max-width: 500px">
        <q-toolbar style="background-color: #ff6f24">
          <q-toolbar-title style="font-size: 18px; color: white"
            ><span>Добавление системы</span></q-toolbar-title
          >

          <q-btn
            @click="
              () => {
                connectionType = '';
                systName = '';
                serialNumber = '';
                host = '';
                port = '';
                security = false;
                userName = '';
                pass = '';
                errMessage = false;
                isSysFound = false;
              }
            "
            flat
            round
            dense
            icon="close"
            color="white"
            v-close-popup
            no-caps
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
            label="Тип подключения"
            :color="isDark"
            :dark="isDark"
            popup-content-style="font-size: 16px"
            options-style="font-size: 16px;"
            style="width: 95%; margin-top: 10px"
            :disable="isSysFound"
            @update:model-value="() =>{
              errMessage = false;
            }"
          />
          <q-input
            :dark="isDark"
            outlined
            v-model="systName"
            label="Наименование"
            hint="Пример: РТК Кухня"
            style="width: 95%; margin-top: 10px"
          />
          <q-input
            :dark="isDark"
            outlined
            v-model="serialNumber"
            label="Серийный номер"
            hint="Пример: 8882A10CVD78"
            style="width: 95%; margin-top: 5px"
            :disable="isSysFound"
          />
          <q-input
            :dark="isDark"
            outlined
            v-model="host"
            label="Хост (брокер)"
            hint="Пример: test.mosquitto.org"
            style="width: 95%; margin-top: 5px"
            :disable="isSysFound"
          />
          <q-input v-if="connectionType == 'Станция (онлайн)'"
            :dark="isDark"
            outlined
            v-model="port"
            label="Порт"
            hint="Пример: 8080"
            style="width: 95%; margin-top: 5px"
          />
          <div v-if="connectionType == 'Станция (онлайн)'" style="width: 100%; display: flex; align-items: start">
            <q-checkbox v-model="security" label="Защищенный (TLS)" color="orange-9"  :dark="isDark"/>
          </div>
          <q-input
          v-if="security && connectionType == 'Станция (онлайн)'"
            :dark="isDark"
            outlined
            v-model="userName"
            label="Логин"
            hint="Пример: u_Uty67Hg"
            style="width: 95%; margin-top: 5px"
          />
          <q-input
           v-if="security && connectionType == 'Станция (онлайн)'"
            :dark="isDark"
            outlined
            v-model="pass"
            label="Пароль"
            hint="Пример: dfrt34f"
            style="width: 95%; margin-top: 5px"
          />


          <div
            style="
              margin-top: 20px;
              display: flex;
              flex-direction: row;
              justify-content: center;
              column-gap: 16px;
              width: 95%;
            "
          >
            <q-btn
              rounded no-caps
              label="Поиск (точка доступа)"
              @click="searchForNewSys()"
              style="background-color: #00692f; color: white"
            />
            <q-btn no-caps
              rounded
              color="orange-9"
              :disable="
                serialNumber == undefined ||
                host == undefined ||
                systName == undefined
              "
              label="Сохранить"
              @click="() => {
                addSystem();
                isSysFound = false;
              }"
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
      <q-card :class="computedClass" :dark="isDark" style="max-width: 500px;">
        <q-toolbar style="background-color: #ed6c05">
          <q-toolbar-title style="font-size: 18px; color: white"
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
                port = '';
                security = false;
                userName = '';
                pass = '';
              }
            "
            flat
            round
            dense
            color="white"
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
            label="Тип подключения"
            :disable="connectionType == 'Точка доступа'"
            :color="isDark"
            :dark="isDark"
            popup-content-style="font-size: 16px"
            options-style="font-size: 16px;"
            style="width: 95%; margin-top: 10px"
          />
          <q-input
            :dark="isDark"
            outlined
            v-model="systName"
            label="Наименование"
            hint="Пример: РТК Кухня"
            style="width: 95%; margin-top: 10px"
          />
          <q-input
            :dark="isDark"
            outlined
            :disable="connectionType == 'Точка доступа'"
            v-model="serialNumber"
            label="Серийный номер"
            hint="Пример: 8882A10CVD78"
            style="width: 95%; margin-top: 5px"
          />
          <q-input
            :dark="isDark"
            outlined
            :disable="connectionType == 'Точка доступа'"
            v-model="host"
            label="Хост (брокер)"
            hint="Пример: test.mosquitto.org"
            style="width: 95%; margin-top: 5px"
          />
          <q-input v-if="connectionType == 'Станция (онлайн)'"
            :dark="isDark"
            outlined
            v-model="port"
            label="Порт"
            hint="Пример: 8080"
            style="width: 95%; margin-top: 5px"
          />
          <div v-if="connectionType == 'Станция (онлайн)'" style="width: 100%; display: flex; align-items: start">
            <q-checkbox v-model="security" label="Защищенный (TLS)" color="teal-7"
            :dark="isDark"/>
          </div>
          <q-input
          v-if="security && connectionType == 'Станция (онлайн)'"
            :dark="isDark"
            outlined
            v-model="userName"
            label="Логин"
            hint="Пример: u_Uty67Hg"
            style="width: 95%; margin-top: 5px"
          />
          <q-input
           v-if="security && connectionType == 'Станция (онлайн)'"
            :dark="isDark"
            outlined
            v-model="pass"
            label="Пароль"
            hint="Пример: dfrt34f"
            style="width: 95%; margin-top: 5px"
          />
          <div
            style="
              margin-top: 20px;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              width: 95%;
            "
          >
            <q-btn
              rounded
              style="background-color: #ed6c05; color: white"
              :disable="
                serialNumber == undefined ||
                host == undefined ||
                systName == undefined ||
                errMessage
              "
              no-caps
              label="Сохранить"
              @click="saveEditSystem()"
              v-close-popup
            />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog persistent v-model="showUserAgreement">
      <q-card :class="computedClass" :dark="isDark" style="max-width: 500px;">
        <q-toolbar style="background-color: #ed6c05">
          <q-toolbar-title class="text-center" style="font-size: 18px; color: white"
            ><span>Пользовательское соглашение</span></q-toolbar-title
          >
        </q-toolbar>
      <div style="padding: 7px; display: flex; width: 100%; flex-direction: column; justify-items: center;">
        <span style="text-align: center;">
          <b style="font-size: 18px;">Пользовательское соглашение об использовании приложения ООО «НЕВАТОМ» «НЕВАТОМ РТК» для мобильных операционных систем Android. </b><br>
        </span>
        <span><b>1.	Общие положения</b></span>
        <span style="text-align: justify;">
          1.1.	Настоящее Пользовательское соглашение (далее - «Соглашение») регламентирует отношения между ООО «НЕВАТОМ» (далее – «Компания»), и дееспособным физическим лицом, надлежащим образом, присоединившимся к настоящему Соглашению для использования мобильного приложения «НЕВАТОМ РТК» (далее – «Пользователь»). <br>
          1.2.	Мобильное приложение ООО «НЕВАТОМ» «НЕВАТОМ РТК» (далее – «Приложение») является программой для ЭВМ, представляющей собой приложение интернета вещей (IoT), разработанное для мобильных устройств, работающих под управлением операционной системы Android. Права интеллектуальной собственности на Приложение и его элементы принадлежат Компании.<br>
          1.3.	Настоящее Соглашение является открытым и общедоступным документом.<br>
          1.4.	Установка Пользователем на своем Мобильном терминале Приложения означает полное и безоговорочное согласие Пользователя со всеми условиями настоящего Соглашения и влечет заключение Соглашения об использовании Приложения на условиях настоящего Пользовательского соглашения об использовании приложения ООО «НЕВАТОМ» «НЕВАТОМ РТК» для мобильных операционных систем Android.<br>
          1.5.	Условия настоящего Соглашения являются публичной офертой в соответствии со ст. 435 и п. 2 ст. 437 ГК РФ. Использование Пользователем Приложения означает полное и безоговорочное принятие Пользователем настоящего Соглашения в соответствии со ст. 438 ГК РФ.<br>
          1.6.		Настоящее Соглашение может быть изменено и/или дополнено Компанией в одностороннем порядке, которое вступают в силу в день, следующий за днем опубликования таких изменений/дополнений в Приложении. При этом продолжение использования Приложения после внесения изменений и/или дополнений в настоящее Соглашение, означает согласие Пользователя с такими изменениями и/или дополнениями, в связи с чем Пользователь обязуется регулярно отслеживать изменения в соответствующем разделе в Приложении и в Соглашении.<br>
          1.7.	Настоящее Соглашение составлено в соответствии с законодательством Российской Федерации. Вопросы, не урегулированные Соглашением, подлежат разрешению в соответствии с законодательством Российской Федерации.<br>
          1.8.		Соглашаясь с условиями настоящего Соглашения, Пользователь подтверждает свою правоспособность и дееспособность.<br>
        </span>
        <span style="text-align: justify;">
          <b>2.	Права и обязанности пользователя</b> <br>
          2.1.	Пользователь обязуется надлежащим образом соблюдать условия настоящего Соглашения.<br>
          2.2.	Пользователь обязуется не использовать Приложение для любых иных целей, кроме как для целей, связанных с личным некоммерческим использованием.<br>
          2.3.	Пользователь обязуется перед использованием Приложения изучить инструкцию пользователя и не совершать действий, противоречащих ей.<br>
          2.4.	Пользователь не вправе: продавать, переуступать, давать в пользование и аренду, распространять, передавать или иным образом предоставлять право на использование Мобильного приложения третьим лицам.<br>
          2.5.	Пользователь обязуется, пользуясь Приложением, не вводить в заблуждение других Пользователей и третьих лиц.<br>
          2.6.	Пользователь обязуется использовать Приложение только с оборудованием «Регулятор температуры канальный (РТК)» ООО «НЕВАТОМ».<br>
          2.7.	Пользователь обязуется не изменять, не декомпилировать, не дизассемблировать, не дешифровать (декодировать), не переводить на другие языки, не нарушать целостность, не восстанавливать исходный код мобильного приложения или каких-либо его частей, а также не производить иные действия с объектным кодом и исходным текстом мобильного приложения, в частности, для целей получения информации о реализации алгоритмов, используемых в мобильном приложении<br>
        </span>

        <span style="text-align: justify;">
          <b>3.	Права и обязанности Компании</b><br>
          3.1.	Компания вправе передавать права и обязанности по настоящему Соглашению, третьим лицам в целях исполнения настоящего Соглашения без дополнительного согласия Пользователя.<br>
          3.2.	Компания не несет ответственность за использование Приложения не по назначению и с нарушением инструкции пользователя.<br>
          3.3.	Компания не несет ответственности за любые ошибки, прерывания, давление, дефекты, задержку в обработке или передаче данных, сбое линий связи, кражу, уничтожение или неправомерный доступ к материалам пользователей, размещенным в Приложении или в любом другом месте.<br>
          3.4.	Компания вправе использовать Приложение в иных коммерческих, некоммерческих и/или рекламных целях.<br>
          3.5.	Компания на свое усмотрение вправе вносить изменения в структуру, дизайн, наполнение Приложения, а также совершать любые видоизменения Приложения.<br>
        </span>

        <span style="text-align: justify;">
          <b>4.	Гарантии и ответственность сторон</b><br>
          4.1.		Пользователь гарантирует, что не будет предпринимать каких-либо действий, направленных на причинение ущерба обладателю прав на Приложение - «Компании» и иным лицам.<br>
          4.2.	В случае нарушения правил использования Приложения, указанных в разделе 2 настоящего Соглашения, Пользователь обязуется возместить Компании вред, причиненный такими действиями.<br>
        </span>
        <span style="text-align: justify;">
          <b>5.	Персональные данные</b><br>
          5.1.	 Компания не собирает, не хранит и не обрабатывает персональные данные пользователя.<br>
        </span>
        <span style="text-align: justify;">
          <b>6.	Ограничение ответственности</b><br>
          6.1.	Компания не несет какой-либо ответственности за любые действия Пользователей. В том числе, Компания не несет ответственности за любые претензии третьих лиц в результате осуществления Пользователями действий, нарушающих права и законные интересы третьих лиц.<br>
          6.2.	Компания освобождается от ответственности за любые убытки, претензии и требования, связанные с использованием Приложения.<br>
          6.3.	Компания не несет ответственности за возможные ошибки, сбои, перерывы в работе Приложения и т.п., если подобные ошибки, сбои и перерывы и т.п. вызваны объективными обстоятельствами, находящимися вне зоны контроля Компании.<br>
          6.4.	Компания не несет какой-либо ответственности за любые потери Пользователей в результате ошибок и неточностей, совершенных Пользователями.<br>
        </span>
        <span style="text-align: justify;">
          <b>7.	Заключительные положения</b><br>
          7.1.	Вопросы, не урегулированные настоящим Соглашением, подлежат разрешению в соответствии с законодательством Российской Федерации.<br>
          7.2.	В случае возникновения любых споров или разногласий, связанных с исполнением настоящего Соглашения, Пользователь и Компания приложат все усилия для их разрешения путем проведения переговоров между ними. В случае, если споры не будут разрешены путем переговоров, споры подлежат разрешению в суде общей юрисдикции по месту нахождения Компании в порядке, установленном действующим законодательством Российской Федерации.<br>
          7.3.	Настоящее Соглашение вступает в силу для Пользователя с момента подключения Пользователя к устройству РТК с помощью Приложения. Настоящее Соглашение действует бессрочно.<br>
          7.4.	 Настоящее Соглашение составлено на русском языке.<br>
          7.5.	Если какое-либо из положений настоящего Соглашения будет признано недействительным, это не оказывает влияния на действительность или применимость остальных положений настоящего Соглашения.<br>
        </span>

        <q-checkbox color="orange-9" v-model="userAgrNotAccepted" label="Я прочитал и согласен с условиями Пользовательского соглашения" />
        <div style="width: 100%; display: flex; justify-content: center;">
          <q-btn style="width: 70%" no-caps v-if="userAgrNotAccepted" rounded label="Подтвердить" color="orange-9" v-close-popup @click="saveUserAgreement" />
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

const security = ref(false);
const changeSys =  ref(false);
const userName = ref();
const pass = ref();
const port = ref();
const showUserAgreement = ref();
const userAgrNotAccepted = ref(false);

const connectTypes = ["Точка доступа", "Станция (онлайн)", "Станция (оффлайн)"];
const router = useRouter();
const rtkSerialNum = ref("");
const labelColor = ref("text-white");
const mainColor = ref("white");
const addSys = ref(false);
const serialNumber = ref();
const connectionType = ref("Точка доступа");
const host = ref();
const systems = ref([]);
const systName = ref();


const isDark = ref();
const theme = ref();
const bus = inject("bus");
const errMessage = ref(false);
const computedClass = ref("my-card-dark");
const editSys = ref(false);
bus.on("themeChanged", (themeValue) => {
  redoColor();
});
const myClient = ref();
function tryToDisconnect(){
  if (myClient.value){
    try {
      myClient.value.unsubscribe("#");
      myClient.value.disconnect();
      myClient.value = null;
    } catch {
      myClient.value = null;
    }
  }
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
  sendMessage("HELLO", "/IoTmanager");
  myClient.value.subscribe("/IoTmanager/#");
}
function onFailure() {

}
function deleteSystem(index) {
  event.stopPropagation();
  systems.value.splice(index, 1);
  localStorage.setItem("systems", JSON.stringify(systems.value));
}
const chosenSysIndex = ref(-1);
function editSystem(index) {
    chosenSysIndex.value = index;
    connectionType.value = systems.value[index].mode;
    systName.value = systems.value[index].name;
    serialNumber.value = systems.value[index].SN;
    host.value = systems.value[index].host;
    port.value = systems.value[index].port;
    security.value = systems.value[index].auth;
    userName.value = systems.value[index].login;
    pass.value = systems.value[index].password;
 }
function saveUserAgreement(){
  localStorage.setItem('accepted', true);
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
  return typeof serialNum == undefined;
}
const isSysFound = ref(false);
function searchForNewSys() {
  sendMessage("HELLO", "/IoTmanager");
  if (sendMessage("HELLO", "/IoTmanager") == false) {
    errMessage.value = true;
  }
  try {
    myClient.value.subscribe("#");
    myClient.value.onMessageArrived = (message) => {
      const recievedMessage = JSON.parse(message.payloadString);
      if (recievedMessage.topic) {
        let newSN = recievedMessage.topic.split("/");
        rtkSerialNum.value = newSN[2].split("-")[1];

        systName.value = rtkSerialNum.value;
        serialNumber.value = rtkSerialNum.value;
        host.value = "192.168.4.1";
        connectionType.value = "Точка доступа";
        isSysFound.value = true;
      }
    };
  } catch {

  }
}
function addSystem() {
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
        systems.value.push({
          name: `${systName.value}`,
          SN: serialNumber.value,
          host: host.value,
          port: port.value,
          mode: connectionType.value,
          auth: security.value,
          login: userName.value,
          password: pass.value
        });
      }
      if (connectionType.value == "Станция (оффлайн)") {
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
  }
  localStorage.setItem("systems", JSON.stringify(systems.value));
  myClient.value.disconnect();
  connectionType.value = "";
  systName.value = "";
  serialNumber.value = "";
  host.value = "";
  port.value = "";
  security.value = false;
  userName.value = "";
  pass.value = "";
}
function saveEditSystem() {
  if (connectionType.value == 'Станция (онлайн)'){
    systems.value[chosenSysIndex.value].mode = connectionType.value;
    systems.value[chosenSysIndex.value].name = systName.value;
    systems.value[chosenSysIndex.value].SN = serialNumber.value;
    systems.value[chosenSysIndex.value].host = host.value;
    systems.value[chosenSysIndex.value].port = port.value;
    systems.value[chosenSysIndex.value].auth = security.value;
    systems.value[chosenSysIndex.value].login = userName.value;
    systems.value[chosenSysIndex.value].password = pass.value;
  }
  else{
    systems.value[chosenSysIndex.value].mode = connectionType.value;
    systems.value[chosenSysIndex.value].name = systName.value;
    systems.value[chosenSysIndex.value].SN = serialNumber.value;
    systems.value[chosenSysIndex.value].host = host.value;
    }
  localStorage.setItem("systems", JSON.stringify(systems.value));
  connectionType.value = "";
  systName.value = "";
  serialNumber.value = "";
  host.value = "";
  port.value = "";
  security.value = false;
  userName.value = "";
  pass.value = "";
}
function redoColor() {
  let a = localStorage.getItem("isDark");
  const changeable = ref(document.getElementById("mainLayout"));
  if (!a) {
    isDark.value = false;

    labelColor.value = "text-black";
    mainColor.value = "black";
    computedClass.value = "my-card-light";
    changeable.value.classList.remove("bgc-dark-class", "text-white");
    changeable.value.classList.add("bgc-light-class", "text-black");
  }
  if (a == true || a === "true") {
    isDark.value = false;

    labelColor.value = "text-black";
    mainColor.value = "black";
    computedClass.value = "my-card-light";
    changeable.value.classList.remove("bgc-dark-class", "text-white");
    changeable.value.classList.add("bgc-light-class", "text-black");
  }
  if (a == false || a === "false") {
    isDark.value = true;

    labelColor.value = "text-white";
    mainColor.value = "white";
    computedClass.value = "my-card-dark";
    changeable.value.classList.remove("bgc-light-class", "text-black");
    changeable.value.classList.add("bgc-dark-class", "text-white");
  }
}

onMounted(() => {
  console.log(localStorage.getItem('accepted'))
  if (localStorage.getItem('accepted') == null){
    showUserAgreement.value = true;
  }
  else{
    showUserAgreement.value = false;
  }
  systems.value = localStorage.getItem("systems")
    ? JSON.parse(localStorage.getItem("systems"))
    : [];
  redoColor();
});
</script>

<style>
.my-card-dark {
  width: 93vw;
  margin: 0 auto;
  background-color: #878787;
  flex-direction: column;
  margin-bottom: 10px;
  display: flex;
  justify-items: flex-start;
  font-size: 16px;
}
.my-card-light {
  width: 93vw;
  margin: 0 auto;
  background-color: #ffffff;
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
.bgc-light-class {
  background-color: #e3e3e3;
}
.bgc-dark-class {
  background-color: #3c3c3b;
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

@font-face {
  font-family: "HelveticaRegular";
  src: url('../fonts/00_Helvetica/HelveticaRegular/HelveticaRegular.eot') format('eot'),
        url('../fonts/00_Helvetica/HelveticaRegular/HelveticaRegular.ttf') format('ttf'),
        url('../fonts/00_Helvetica/HelveticaRegular/HelveticaRegular.woff') format('woff'),
  ;
  font-weight: normal;
}
</style>
