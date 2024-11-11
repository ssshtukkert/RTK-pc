<template style="height: 800px">
  <q-layout
    style="padding-bottom: 15px; font-family: 'HelveticaRegular'"
    class=" text-white"
    id="mainLayout"
  >
<div v-if="PullToRefresh" id="mainLayout" style="
    display:flex;
    align-items:center;
    justify-content:center;
    padding-top: 10px;
    left:0px;
    width:100vw;">

  <q-spinner

    color="orange-9"
    size="3em"
  />

  </div>

    <!-- Уставки -->
    <q-scroll-area v-if="!schedulePage && !settingsPage" style="height: 85vh; width: 80vw; justify-self: center;">
      <q-dialog v-model="confirm">
        <q-card :class="computedClass" style="border-radius: 15px" class="cardManCircle">
          <q-toolbar style="justify-content: space-between">

            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                width: 100%;
              "
            >
              <div :dark="isDark"><b>Применить изменения?</b></div>
            </div>
          </q-toolbar>
          <q-card-section
            style="display: flex; justify-content: center; margin-top: -20px"
          >
            <q-btn
              rounded
              label="OK"
              style="margin-right: 10px; background-color: #ed6c05; color: white"
              v-close-popup
              @click="
                () => {
                  reloadBtnPressed(CONFIRM);
                  confirm = false;
                }
              "
            />
            <q-btn
              style="background-color: #878787; color: white"
              rounded
              label="Отмена"
              @click="
                () => {
                  reloadBtnPressed(TCANCEL);
                  confirm = false;
                }
              "
              v-close-popup
            />
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-scroll-area v-if="!schedulePage && !settingsPage" style="height: 85vh; width: 100%; justify-self: center;">
        <q-label
          style="
            padding: 10px;
            font-family: 'HelveticaRegular';
            font-size: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div style="text-align: center">
            <b style="text-align: center">Управление</b>
          </div>
        </q-label>

        <q-card
          v-if="ERR.val != ''"
          class="my-card-dark cardMonocolor pcClass"
          style="border-radius: 15px; margin-top: 20px;"
        >
          <q-card-section style="background-color: #ed6c05; margin-top: -10px">
            <div class="cardInside">
              <div style="margin-right: 10px; width: 100%">
                <div class="cardText">
                  <div style="width: 100%; white-space: break-spaces">
                    {{ ERR.val }}
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card :class="computedClass " class="pcClass" style="border-radius: 15px"
          ><q-toolbar style="background-color: #ed6c05;"
            ><q-label
              style="word-wrap: break-word; font-size: 16px; font-weight: 700; color: white;"

              >Управление</q-label
            ></q-toolbar
          >
          <q-card-section>
            <div style="margin-bottom: -10px; margin-top: -10px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
              <div style="display: flex; flex-direction: row; align-items: center">
                <div>Работа по расписанию</div>
                <q-btn flat style="background: none; width: 18px" @click="() =>{
                  showAdviceForSchedule = true;
                }"><img v-if="isDark" src="../components/images/question-svgrepo-com.svg" style="height: 18px;"><img v-if="!isDark" src="../components/images/question-svgrepo-com (1).svg" style="height: 18px;"></q-btn>
              </div>

                <q-toggle
                  size="lg"
                  @click="toggle(SW_TABLE)"
                  color="orange-9"
                  v-model="SW_TABLE.val"
                />
              </div>
            </div>
            <div style="margin-bottom: -10px" v-if="!SW_TABLE.val">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
              <div style="display: flex; flex-direction: row; align-items: center">
                <div>Включение/отключение RТК</div>
                <q-btn flat style="background: none; width: 18px" @click="() =>{
                  showAdviceForRtk = true;
                }"><img v-if="isDark" src="../components/images/question-svgrepo-com.svg" style="height: 18px;"><img v-if="!isDark" src="../components/images/question-svgrepo-com (1).svg" style="height: 18px;"></q-btn>
              </div>


                <q-toggle
                size="lg"
                  @click="toggle(SW_FAN)"
                  color="orange-9"
                  v-model="SW_FAN.val"
                />
              </div>
            </div>
            <div style="margin-bottom: -10px" v-if="!SW_TABLE.val">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
              <div style="display: flex; flex-direction: row; align-items: center">
                <div>Разреш. работы нагревателя</div>
                <q-btn flat style="background: none; width: 18px" @click="() =>{
                  showAdviceForHeater = true;
                }"><img v-if="isDark" src="../components/images/question-svgrepo-com.svg" style="height: 18px;"><img v-if="!isDark" src="../components/images/question-svgrepo-com (1).svg" style="height: 18px;"></q-btn>
              </div>


                <q-toggle
                  size="lg"
                  @click="toggle(SW_HEATER)"
                  color="orange-9"
                  v-model="SW_HEATER.val"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card
          class="pcClass"
          :class="computedClass"
          style="border-radius: 15px; margin-bottom: 60px"
        >
          <q-toolbar style="background-color: #ed6c05; ">
            <div :class="selectClass" style="height: 60px; ">
              <img
              src="../components/images/temperature.svg"
              alt=""
              style="height: 45px; margin: 10px; "
              @click="
                () => {
                  selectClass = 'underline';
                  selectClass1 = 'no-underline';
                  selectClass2 = 'no-underline';
                  isTemp = true;
                  isFan = false;
                  isHum = false;
                }
              "
            />
            </div>
            <div :class="selectClass1" style="height: 60px; ">
              <img
              src="../components/images/fan.svg"
              alt=""
              style="height: 45px; margin: 10px"
              @click="
                () => {
                  selectClass = 'no-underline';
                  selectClass1 = 'underline';
                  selectClass2 = 'no-underline';
                  isTemp = false;
                  isFan = true;
                  isHum = false;
                }
              "
            />
            </div>
            <div :class="selectClass2" style="height: 60px; ">
              <img
              src="../components/images/humdity.svg"
              alt=""
              style="height: 45px; margin: 10px"
              v-if="gotHumdity"
              @click="
                () => {
                  selectClass = 'no-underline';
                  selectClass1 = 'no-underline';
                  selectClass2 = 'underline';
                  isTemp = false;
                  isFan = false;
                  isHum = true;
                }
              "
            />
            </div>

          </q-toolbar>


          <q-card-section v-if="isTemp">
            <div style="margin-bottom: 8px">
              <div style="margin-bottom: 8px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Текущая температура</div>

                <div style="font-weight: 700; margin-right: 10px">
                  {{ T10.val }}°С
                </div>
              </div>

            </div>
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Уставка температуры</div>

                 <div style="font-weight: 700; margin-right: 10px">
                  {{ RANGE_TEMP.val }}°С
                </div>
              </div>

            </div>

            <q-dialog persistent v-if="showWindowForTemp" v-model="showWindowForTemp">
              <q-card
                class="cardManCircle"
                :class="computedClass"
                style="
                  height: 100px;
                  width: 300px;
                  display: flex;
                  flex-direction: column;
                  border-radius: 20px;
                "
              >
                <q-label
                  :dark="isDark"
                  style="margin: 0 auto; padding-top: 10px; font-size: 18px"
                  >Подтвердить ввод?</q-label
                >

                <div
                  style="
                    display: flex;
                    width: 100%;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-evenly;
                  "
                >
                  <q-btn
                    style="
                      background-color: #ed6c05;
                      color: white;
                      height: 15px;
                      margin-top: 10px;
                    "
                    @click="
                      () => {
                        submitted = true;
                        writeSet(RANGE_TEMP);
                        RANGE_TEMP.blocked = false;
                        showWindowForTemp = false;
                        isTemp = true
                      }
                    "
                    label="Подтвердить"
                    rounded
                  />
                  <q-btn
                    @click="
                      () => {
                        waitForSubmit(RANGE_TEMP);
                        isTemp = true
                      }
                    "
                    style="
                      background-color: #878787;
                      color: white;
                      height: 15px;
                      margin-top: 10px;
                    "
                    v-close-popup
                    label="Отмена"
                    rounded
                  />
                </div>
              </q-card>
            </q-dialog>
            <div class="cardManCircle">

              <q-slider @touchstart="
                  () => {
                    RANGE_TEMP.blocked = true;
                    waitForSubmit(RANGE_TEMP);
                  }
                "
                @touchend="
                  () => {
                    showWindowForTemp = true;
                  }
                "
                v-if="!SW_TABLE.val"
                v-model="RANGE_TEMP.val" :min="0" :max="35" color="orange-9" track-color="grey-5" thumb-size="25px" track-size="10px" :marker-labels="fnMarkerLabel" label-always style="margin-top: 30px"
                />

            </div>
          </q-card-section>

          <q-card-section v-if="isFan">
            <div style="margin-bottom: 8px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Уставка вентиляции</div>

                <div style="font-weight: 700; margin-right: 10px">
                  {{ RANGE_FAN.val }}%
                </div>
              </div>
            </div>
            <div class="cardManCircle">

              <q-slider @touchstart="
                  () => {
                    RANGE_FAN.blocked = true;
                    waitForSubmit(RANGE_FAN);
                  }
                "
                @touchend="
                  () => {
                    showWindowForVent = true;
                  }
                "
                v-if="!SW_TABLE.val"
                v-model="RANGE_FAN.val" :min="60" :max="100" color="orange-9" track-color="grey-5" thumb-size="25px" track-size="10px" :marker-labels="fanMarkerLabel" label-always style="margin-top: 30px"
                />
            </div>
            <q-dialog v-if="showWindowForVent" persistent v-model="showWindowForVent">
              <q-card
                class="cardManCircle"
                :class="computedClass"
                style="
                  height: 100px;
                  width: 300px;
                  display: flex;
                  flex-direction: column;
                  border-radius: 20px;
                "
              >
                <q-label
                  :dark="isDark"
                  style="margin: 0 auto; padding-top: 10px; font-size: 18px"
                  >Подтвердить ввод?</q-label
                >

                <div
                  style="
                    display: flex;
                    width: 100%;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-evenly;
                  "
                >
                  <q-btn
                    style="
                      background-color: #ed6c05;
                      color: white;
                      height: 15px;
                      margin-top: 10px;
                    "
                    @click="
                      () => {
                        submitted = true;
                        writeSet(RANGE_FAN);
                        RANGE_FAN.blocked = false;
                        showWindowForVent = false;
                        isFan = true;
                      }
                    "
                    label="Подтвердить"
                    v-close-popup
                    rounded
                  />
                  <q-btn
                    @click="
                      () => {
                        waitForSubmit(RANGE_FAN);
                        isFan = true;
                      }
                    "
                    style="
                      background-color: #878787;
                      color: white;
                      height: 15px;
                      margin-top: 10px;
                    "
                    v-close-popup
                    label="Отмена"
                    rounded
                  />
                </div>
              </q-card>
            </q-dialog>


          </q-card-section>

          <q-card-section v-if="isHum && gotHumdity">
            <q-dialog persistent v-if="showWindowForHum" v-model="showWindowForHum">
              <q-card
                class="cardManCircle"
                :class="computedClass"
                style="
                  height: 100px;
                  width: 300px;
                  display: flex;
                  flex-direction: column;
                  border-radius: 20px;
                "
              >
                <q-label
                  :dark="isDark"
                  style="margin: 0 auto; padding-top: 10px; font-size: 18px"
                  >Подтвердить ввод?</q-label
                >

                <div
                  style="
                    display: flex;
                    width: 100%;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-evenly;
                  "
                >
                  <q-btn
                    style="
                      background-color: #ed6c05;
                      color: white;
                      height: 15px;
                      margin-top: 10px;
                    "
                    @click="
                      () => {
                        submitted = true;
                        writeSet(RANGE_H);
                        RANGE_H.blocked = false;
                        showWindowForHum = false;
                        isHum = true;
                      }
                    "
                    label="Подтвердить"
                    rounded
                  />
                  <q-btn
                    @click="
                      () => {
                        waitForSubmit(RANGE_H);
                        isHum = true;
                      }
                    "
                    style="
                      background-color: #878787;
                      color: white;
                      height: 15px;
                      margin-top: 10px;
                    "
                    v-close-popup
                    label="Отмена"
                    rounded
                  />
                </div>
              </q-card>
            </q-dialog>
            <div style="margin-bottom: 8px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Текущая влажность</div>

                <div style="font-weight: 700; margin-right: 10px">
                  {{ H10.val }}%
                </div>
              </div>
            </div>
            <div style="margin-bottom: 8px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Уставка влажности</div>

                <div style="font-weight: 700; margin-right: 10px">
                  {{ RANGE_H.val }}%
                </div>
              </div>
            </div>
            <div class="cardManCircle">

              <q-slider @touchstart="
                  () => {
                    RANGE_H.blocked = true;
                    waitForSubmit(RANGE_H);
                  }
                "
                @touchend="
                  () => {
                    showWindowForHum = true;
                  }
                "
                v-if="!SW_TABLE.val"
                v-model="RANGE_H.val" :min="0" :max="100" color="orange-9" track-color="grey-5" thumb-size="25px" track-size="10px" :marker-labels="HumMarkerLabel" label-always style="margin-top: 30px"
                />

            </div>
          </q-card-section>
        </q-card>
      </q-scroll-area>
      <q-dialog v-model="showAdviceForSchedule" >
      <q-card :class="computedClass" >

        <q-card-section>
          <div style="text-align: center">При активированном переключателе РТК работает по заданному расписанию, при отключенном — в автоматическом режиме по заданной уставке температуры и производительности вентиляции</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showAdviceForRtk" >
      <q-card :class="computedClass">

        <q-card-section>
          <div style="text-align: center">Переключатель предназначен для управления вентиляцией в автоматическом режиме работы. Он включает и отключает РТК</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showAdviceForHeater" >
      <q-card :class="computedClass">

        <q-card-section>
          <div style="text-align: center">Переключатель предназначен для управления нагревателем — он разрешает или запрещает включение нагревателя в том случае, если температура в помещении меньше уставки и требуется нагрев</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    </q-scroll-area>


    <!-- Расписание -->

    <q-scroll-area
      style="height: 85vh; width: 100%; justify-self: center;"
      v-if="schedulePage && !set && systemIsChosen && !settingsPage"
    >
      <!-- <div
        v-if="schedulePage && !set && systemIsChosen && !settingsPage"
        style="margin-bottom: 65px; width: 70%; justify-self: center"
      > -->
        <q-label
          style="
            padding: 10px;
            font-family: 'HelveticaRegular';
            font-size: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >

          <div style="text-align: center">
            <b>Расписание</b>
          </div></q-label
        >

        <q-card :class="computedClass" class="pcClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ed6c05"
          >
            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 100%;
              "
            >
              <div style="color: white"><b>Настройки расписания</b></div>
            </div>
          </q-toolbar>
          <q-card-section>
            <q-select
              v-model="T_MODE.val"
              @click="
                () => {
                  T_MODE.blocked = true;

                }
              "
              @update:model-value="
                () => {
                  fillSchedule();
                  chooseFromList(T_MODE, scheduleOptions);
                }
              "
              :options="scheduleOptions"
              label="Расписание"
              style="margin-top: -10px; margin-bottom: 10px"
              :color="isDark"
              :dark="isDark"
              popup-content-style="font-size: 16px"
              options-style="font-size: 16px;"
            />
            <q-select
              v-model="T_WDAY.val"
              @click="
                () => {
                  T_WDAY.blocked = true;

                }
              "
              @update:model-value="
                () => {
                  chooseFromList(T_WDAY, weekDays);
                }
              "
              :options="weekDays"
              label="День недели"
              style="margin-top: -10px"
              :color="isDark"
              :dark="isDark"
              popup-content-style="font-size: 16px"
              options-style="font-size: 16px;"
            />

          </q-card-section>
        </q-card>

        <q-card :class="computedClass" class="pcClass" style="border-radius: 15px" >
          <q-toolbar
            style="justify-content: space-between; background-color: #ed6c05"
          >
            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 100%;
              "
            >
              <div style="color: white"><b>Время 1</b></div>
              <q-input
                v-model="T_TIME_1.val"
                @focus="
                  () => {
                    T_TIME_1.blocked = true;
                  }
                "
                @blur="
                  () => {

                    isPromise = true;
                    writeScheduleSet(T_TIME_1);
                  }
                "
                icon="time"
                outlined
                dark
                dense

                style="width: 30%; font-size: 16px; padding: 0"
                :color="isDark"
                mask="##:##"
                maxlength="5"
                ><template v-slot:prepend> <q-icon name="schedule" /> </template
              ></q-input>
            </div>
          </q-toolbar>
          <q-card-section>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-bottom: 20px;
                height: 30px;
              "
            >
              <div>Уставка вентиляции, %</div>
              <q-input
                @focus="
                  () => {
                    T_VENT_1.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_VENT_1);
                  }
                "
                v-model="T_VENT_1.val"
                dense
                style="width: 30%; font-size: 16px; margin-top: 20px"
                :dark="isDark"
                :color="isDark"
                :rules="[(val) => val > 59 || 'Минимальное значение: 60']"
              />
            </div>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 30px;
              "
            >
              <div>Уставка температуры,°С</div>
              <q-input
                v-model="T_TEMP_1.val"
                dense
                style="width: 30%; font-size: 16px; "
                :dark="isDark"
                :color="isDark"
                :lazy-rules="true"
                @focus="
                  () => {
                    T_VENT_1.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_TEMP_1);
                  }
                "
              />

            </div>
            <div style="margin-bottom: -10px; margin-top: 10px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Вентиляция</div>

                <q-toggle
                size="lg"
                  @click="toggle(T_SW_FAN_1)"
                  color="orange-9"
                  v-model="T_SW_FAN_1.val"
                />
              </div>
            </div>
            <div style="margin-bottom: -10px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Нагреватель</div>

                <q-toggle
                size="lg"
                  @click="toggle(T_SW_HEATER_1)"
                  color="orange-9"
                  v-model="T_SW_HEATER_1.val"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card :class="computedClass" class="pcClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ed6c05"
          >
            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 100%;
              "
            >
              <div style="color: white"><b>Время 2</b></div>
              <q-input
                v-model="T_TIME_2.val"
                @focus="
                  () => {
                    T_TIME_2.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_TIME_2);
                  }
                "
                icon="time"
                outlined

                dense
                dark
                style="width: 30%; font-size: 16px; padding: 0"
                :color="isDark"
                maxlength="5"
                mask="##:##"
                ><template v-slot:prepend> <q-icon name="schedule" /> </template
              ></q-input>
            </div>
          </q-toolbar>
          <q-card-section>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-bottom: 20px;
                height: 30px;
              "
            >
              <div>Уставка вентиляции, %</div>
              <q-input
                v-model="T_VENT_2.val"
                dense
                style="width: 30%; font-size: 16px;  margin-top: 20px"
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    T_VENT_2.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_VENT_2);
                  }
                "
                :rules="[(val) => val > 59 || 'Минимальное значение: 60']"
              />
            </div>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 30px;
              "
            >
              <div>Уставка температуры,°С</div>
              <q-input
                v-model="T_TEMP_2.val"
                dense
                style="width: 30%; font-size: 16px;  "
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    T_TEMP_2.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_TEMP_2);
                  }
                "
              />
            </div>
            <div style="margin-bottom: -10px; margin-top: 10px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Вентиляция</div>

                <q-toggle
                size="lg"
                  @click="toggle(T_SW_FAN_2)"
                  color="orange-9"
                  v-model="T_SW_FAN_2.val"
                />
              </div>
            </div>
            <div style="margin-bottom: -10px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Нагреватель</div>

                <q-toggle
                size="lg"
                  @click="toggle(T_SW_HEATER_2)"
                  color="orange-9"
                  v-model="T_SW_HEATER_2.val"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card :class="computedClass" class="pcClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ed6c05"
          >
            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 100%;
              "
            >
              <div style="color: white"><b>Время 3</b></div>
              <q-input
                v-model="T_TIME_3.val"
                @focus="
                  () => {
                    T_TIME_3.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_TIME_3);
                  }
                "
                icon="time"
                outlined

                dense
                dark
                style="width: 30%; font-size: 16px; padding: 0"
                :color="isDark"
                maxlength="5"
                mask="##:##"
                ><template v-slot:prepend> <q-icon name="schedule" /> </template
              ></q-input>
            </div>
          </q-toolbar>
          <q-card-section>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-bottom: 20px;
                height: 30px;
              "
            >
              <div>Уставка вентиляции, %</div>
              <q-input
                v-model="T_VENT_3.val"
                dense
                style="width: 30%; font-size: 16px; margin-top: 20px"
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    T_VENT_3.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_VENT_3);
                  }
                "
                :rules="[(val) => val > 59 || 'Минимальное значение: 60']"
              />
            </div>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 30px;
              "
            >
              <div>Уставка температуры,°С</div>
              <q-input
                v-model="T_TEMP_3.val"
                dense
                style="width: 30%; font-size: 16px;  "
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    T_TEMP_3.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_TEMP_3);
                  }
                "
              />
            </div>
            <div style="margin-bottom: -10px; margin-top: 10px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Вентиляция</div>

                <q-toggle
                size="lg"
                  @click="toggle(T_SW_FAN_3)"
                  color="orange-9"
                  v-model="T_SW_FAN_3.val"
                />
              </div>
            </div>
            <div style="margin-bottom: -10px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Нагреватель</div>

                <q-toggle
                size="lg"
                  @click="toggle(T_SW_HEATER_3)"
                  color="orange-9"
                  v-model="T_SW_HEATER_3.val"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card :class="computedClass" class="pcClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ed6c05"
          >
            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 100%;
              "
            >
              <div style="color: white"><b>Время 4</b></div>
              <q-input
                v-model="T_TIME_4.val"
                @focus="
                  () => {
                    T_TIME_4.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_TIME_4);
                  }
                "
                icon="time"
                outlined

                dense
                dark
                style="width: 30%; font-size: 16px; padding: 0"
                :color="isDark"
                maxlength="5"
                mask="##:##"
                ><template v-slot:prepend> <q-icon name="schedule" /> </template
              ></q-input>
            </div>
          </q-toolbar>
          <q-card-section>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-bottom: 20px;
                height: 30px;
              "
            >
              <div>Уставка вентиляции, %</div>
              <q-input
                v-model="T_VENT_4.val"
                dense
                style="width: 30%; font-size: 16px;  margin-top: 20px"
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    T_VENT_4.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_VENT_4);
                  }
                "
                :rules="[(val) => val > 59 || 'Минимальное значение: 60']"
              />
            </div>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 30px;
              "
            >
              <div>Уставка температуры,°С</div>
              <q-input
                v-model="T_TEMP_4.val"
                dense
                style="width: 30%; font-size: 16px;  "
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    T_TEMP_4.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_TEMP_4);
                  }
                "
              />
            </div>
            <div style="margin-bottom: -10px; margin-top: 10px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Вентиляция</div>

                <q-toggle
                size="lg"
                  @click="toggle(T_SW_FAN_4)"
                  color="orange-9"
                  v-model="T_SW_FAN_4.val"
                />
              </div>
            </div>
            <div style="margin-bottom: -10px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Нагреватель</div>

                <q-toggle
                size="lg"
                  @click="toggle(T_SW_HEATER_4)"
                  color="orange-9"
                  v-model="T_SW_HEATER_4.val"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card :class="computedClass" class="pcClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ed6c05"
          >
            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 100%;
              "
            >
              <div style="color: white"><b>Время 5</b></div>
              <q-input
                v-model="T_TIME_5.val"
                @focus="
                  () => {
                    T_TIME_5.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_TIME_5);
                  }
                "
                icon="time"
                outlined

                dense
                dark
                style="width: 30%; font-size: 16px; padding: 0"
                :color="isDark"
                maxlength="5"
                mask="##:##"
                ><template v-slot:prepend> <q-icon name="schedule" /> </template
              ></q-input>
            </div>
          </q-toolbar>
          <q-card-section>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-bottom: 20px;
                height: 30px;
              "
            >
              <div>Уставка вентиляции, %</div>
              <q-input
                v-model="T_VENT_5.val"
                dense
                style="width: 30%; font-size: 16px; margin-top: 20px"
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    T_VENT_5.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_VENT_5);
                  }
                "
                :rules="[(val) => val > 59 || 'Минимальное значение: 60']"
              />
            </div>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 30px;
              "
            >
              <div>Уставка температуры,°С</div>
              <q-input
                v-model="T_TEMP_5.val"
                dense
                style="width: 30%; font-size: 16px;  "
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    T_TEMP_5.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_TEMP_5);
                  }
                "
              />
            </div>
            <div style="margin-bottom: -10px; margin-top: 10px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Вентиляция</div>

                <q-toggle
                size="lg"
                  @click="toggle(T_SW_FAN_5)"
                  color="orange-9"
                  v-model="T_SW_FAN_5.val"
                />
              </div>
            </div>
            <div style="margin-bottom: -10px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Нагреватель</div>

                <q-toggle
                size="lg"
                  @click="toggle(T_SW_HEATER_5)"
                  color="orange-9"
                  v-model="T_SW_HEATER_5.val"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card :class="computedClass" class="pcClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ed6c05"
          >
            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 100%;
              "
            >
              <div style="color: white"><b>Время 6</b></div>
              <q-input
                v-model="T_TIME_6.val"
                @focus="
                  () => {
                    T_TIME_6.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_TIME_6);
                  }
                "
                icon="time"
                outlined

                dense
                dark
                style="width: 30%; font-size: 16px; padding: 0"
                :color="isDark"
                maxlength="5"
                mask="##:##"
                ><template v-slot:prepend> <q-icon name="schedule" /> </template
              ></q-input>
            </div>
          </q-toolbar>
          <q-card-section>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-bottom: 20px;
                height: 30px;
              "
            >
              <div>Уставка вентиляции, %</div>
              <q-input
                v-model="T_VENT_6.val"
                dense
                style="width: 30%; font-size: 16px;  margin-top: 20px"
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    T_VENT_6.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_VENT_6);
                  }
                "
                :rules="[(val) => val > 59 || 'Минимальное значение: 60']"
              />
            </div>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 30px;
              "
            >
              <div>Уставка температуры,°С</div>
              <q-input
                v-model="T_TEMP_6.val"
                dense
                style="width: 30%; font-size: 16px;  "
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    T_TEMP_6.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_TEMP_6);
                  }
                "
              />
            </div>
            <div style="margin-bottom: -10px; margin-top: 10px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Вентиляция</div>

                <q-toggle
                size="lg"
                  @click="toggle(T_SW_FAN_6)"
                  color="orange-9"
                  v-model="T_SW_FAN_6.val"
                />
              </div>
            </div>
            <div style="margin-bottom: -10px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Нагреватель</div>

                <q-toggle
                size="lg"
                  @click="toggle(T_SW_HEATER_6)"
                  color="orange-9"
                  v-model="T_SW_HEATER_6.val"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card :class="computedClass" class="pcClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ed6c05"
          >
            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 100%;
              "
            >
              <div style="color: white"><b>Время 7</b></div>
              <q-input
                v-model="T_TIME_7.val"
                @focus="
                  () => {
                    T_TIME_7.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_TIME_7);
                  }
                "
                icon="time"
                outlined

                dense
                dark
                style="width: 30%; font-size: 16px; padding: 0"
                :color="isDark"
                maxlength="5"
                mask="##:##"
                ><template v-slot:prepend> <q-icon name="schedule" /> </template
              ></q-input>
            </div>
          </q-toolbar>
          <q-card-section>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-bottom: 20px;
                height: 30px;
              "
            >
              <div>Уставка вентиляции, %</div>
              <q-input
                v-model="T_VENT_7.val"
                dense
                style="width: 30%; font-size: 16px; margin-top: 20px"
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    T_VENT_7.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_VENT_7);
                  }
                "
                :rules="[(val) => val > 59 || 'Минимальное значение: 60']"
              />
            </div>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 30px;
              "
            >
              <div>Уставка температуры,°С</div>
              <q-input
                v-model="T_TEMP_7.val"
                dense
                style="width: 30%; font-size: 16px;  "
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    T_TEMP_7.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(T_TEMP_7);
                  }
                "
              />
            </div>
            <div style="margin-bottom: -10px; margin-top: 10px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Вентиляция</div>
                <q-toggle
                size="lg"
                  @click="toggle(T_SW_FAN_7)"
                  color="orange-9"
                  v-model="T_SW_FAN_7.val"
                />
              </div>
            </div>
            <div style="margin-bottom: -10px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Нагреватель</div>
                <q-toggle
                size="lg"
                  @click="toggle(T_SW_HEATER_7)"
                  color="orange-9"
                  v-model="T_SW_HEATER_7.val"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      <!-- </div> -->
    </q-scroll-area>

    <!-- Параметры -->
    <q-scroll-area
      style="height: 85vh; width: 100%; margin-bottom: 65px"
      v-if="!schedulePage && !set && systemIsChosen && settingsPage"
    >
      <q-label
        style="
          padding: 10px;
          font-family: 'HelveticaRegular';
          font-size: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
          <div style="text-align: center">
            <b>Параметры</b>
          </div></q-label
        >
        <q-card :class="computedClass" class="pcClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ed6c05"
          >
            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                color: white;
              "
            >
              <div><b>Настройки времени</b></div>
            </div>
          </q-toolbar>
          <q-card-section>
            <q-select
              v-model="WDAY.val"
              @click="
                () => {
                  WDAY.blocked = true;
                }
              "
              @update:model-value="
                () => {
                  chooseFromList(WDAY, weekDays);
                }
              "
              :options="weekDays"
              label="День недели"
              style="margin-top: -10px; margin-bottom: 15px"
              :color="isDark"
              :dark="isDark"
              popup-content-style="font-size: 16px"
              options-style="font-size: 16px;"
            />
            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;

              "
            >
              <div>Текущее время</div>

              <q-input
                v-model="TIME.val"
                @focus="
                  () => {
                    TIME.blocked = true;
                  }"
                @blur="
                  () => {
                    writeScheduleSet(TIME);
                  }"
                icon="time"
                outlined
                mask="##:##"
                dense
                :dark="isDark"
                style="width: 120px; font-size: 16px; padding: 0"
                :color="isDark"
                placeholder="00:00"
                ><template v-slot:prepend> <q-icon name="schedule" /> </template
              ></q-input>
            </div>
          </q-card-section>
        </q-card>
        <q-card :class="computedClass" class="pcClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ed6c05"
          >
            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                color: white;
              "
            >
              <div><b>Настройки точки доступа</b></div>
            </div>
          </q-toolbar>
          <q-card-section style="justify-content: space-between">
            <div
              :color="isDark"
              :dark="isDark"
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                margin-top: -10px;
                margin-bottom: -10px;
              "
            >
              <div>Точка доступа</div>
              <q-toggle
              size="lg"
                color="orange-9"
                v-model="AP.val"
                @click="
                  () => {
                    changeMode();
                  }
                "
              />
            </div>
          </q-card-section>
          <q-card-section
            v-if="port == 8883 && mode != 'Станция (оффлайн)'"
            style="justify-content: space-between"
          >
            <div
              :color="isDark"
              :dark="isDark"
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                margin-top: -10px;
                margin-bottom: -10px;
              "
            >
              <div>Имя сети WiFi</div>
              <q-input
                v-model="WIFI_AP_SSID.val"
                dense
                style="width: auto; font-size: 16px; margin-left: 8px"
                :dark="isDark"
                :color="isDark"
                maxlength="16"
                @focus="
                  () => {
                    WIFI_AP_SSID.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(WIFI_AP_SSID);
                  }
                "
              />
            </div>
          </q-card-section>
          <q-card-section
            v-if="port == 8883 && mode != 'Станция (оффлайн)'"
            style="justify-content: space-between"
          >
            <div
              :color="isDark"
              :dark="isDark"
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                margin-top: -10px;
                margin-bottom: -10px;
              "
            >
              <div>Пароль сети WiFi</div>
              <q-input
                v-model="WIFI_AP_PASS.val"
                dense
                style="width: auto; font-size: 16px"
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    WIFI_AP_PASS.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(WIFI_AP_PASS);
                  }
                "
              />
            </div>
          </q-card-section>
          <q-card-section style="justify-content: space-between">
            <div
              :color="isDark"
              :dark="isDark"
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                margin-top: -10px;
                margin-bottom: -10px;
              "
            >
            <div style="display: flex; flex-direction: row; justify-content: center; width: 100%">
                <q-btn
                icon="update"
                id="button"
                v-model="BTN_RESET2"
                no-caps rounded
                @click="reloadBtnPressed(BTN_RESET2)"
                label="Перезагрузка устройства"
                style="margin-bottom: 10px; width: 250px"
              />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card
          v-if="port == 8883 && mode != 'Станция (оффлайн)'"
          :class="computedClass" class="pcClass"
          style="border-radius: 15px"
        >
          <q-toolbar
            style="justify-content: space-between; background-color: #ed6c05"
          >
            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                color: white;
              "
            >
              <div><b>Настройки режима станции</b></div>

            </div>
          </q-toolbar>
            <q-card-section style="justify-content: space-between">
            <div
              :color="isDark"
              :dark="isDark"
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                margin-top: -10px;
                margin-bottom: -10px;
              "
            >
              <div>Имя сети WiFi</div>
              <q-input
                v-model="WIFI_SSID.val"
                dense
                style="width: auto; font-size: 16px; margin-left: 10px"
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    WIFI_SSID.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(WIFI_SSID);
                  }
                "
              />
            </div>
          </q-card-section>
          <q-card-section style="justify-content: space-between">
            <div
              :color="isDark"
              :dark="isDark"
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                margin-top: -10px;
                margin-bottom: -10px;
              "
            >
              <div>Пароль сети WiFi</div>
              <q-input
                v-model="WIFI_PASS.val"
                dense
                style="width: auto; font-size: 16px; margin-left: 10px"
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    WIFI_PASS.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(WIFI_PASS);
                  }
                "
              />
            </div>
          </q-card-section>
          <q-card-section style="justify-content: space-between">
            <div
              :color="isDark"
              :dark="isDark"
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                margin-top: -10px;
                margin-bottom: -10px;
              "
            >
              <div>Хост</div>
              <q-input
                v-model="MQTT_HOST.val"
                dense
                style="width: auto; font-size: 16px; margin-left: 10px"
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    MQTT_HOST.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(MQTT_HOST);
                  }
                "
              />
            </div>
          </q-card-section>
          <q-card-section style="justify-content: space-between">
            <div
              :color="isDark"
              :dark="isDark"
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                margin-top: -10px;
                margin-bottom: -10px;
              "
            >
              <div>Порт</div>
              <q-input
                v-model="MQTT_PORT.val"
                dense
                style="width: auto; font-size: 16px; margin-left: 10px"
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    MQTT_PORT.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(MQTT_PORT);
                  }
                "
              />
            </div>
          </q-card-section>
          <q-card-section style="justify-content: space-between">
            <div
              :color="isDark"
              :dark="isDark"
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                margin-top: -10px;
                margin-bottom: -10px;
              "
            >
              <div>Префикс</div>
              <q-input
                v-model="MQTT_PREFIX.val"
                dense
                style="width: auto; font-size: 16px; margin-left: 10px"
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    MQTT_PREFIX.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(MQTT_PREFIX);
                  }
                "
              />
            </div>
          </q-card-section>
          <q-card-section style="justify-content: space-between">
            <div
              :color="isDark"
              :dark="isDark"
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                margin-top: -10px;
                margin-bottom: -10px;
              "
            >
              <div>Пользователь</div>
              <q-input
                v-model="MQTT_USER.val"
                dense
                style="width: auto; font-size: 16px; margin-left: 10px"
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    MQTT_USER.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(MQTT_USER);
                  }
                "
              />
            </div>
          </q-card-section>
          <q-card-section style="justify-content: space-between">
            <div
              :color="isDark"
              :dark="isDark"
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                margin-top: -10px;
                margin-bottom: -10px;
              "
            >
              <div>Пароль</div>
              <q-input
                v-model="MQTT_PASS.val"
                dense
                style="width: auto; font-size: 16px; margin-left: 10px"
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    MQTT_PASS.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(MQTT_PASS);
                  }
                "
              />
            </div>
          </q-card-section>
          <q-card-section style="justify-content: space-between">
            <div
              :color="isDark"
              :dark="isDark"
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                margin-top: -10px;
                margin-bottom: -10px;
              "
            >
              <div style="display: flex; flex-direction: row; justify-content: center; width: 100%">
                <q-btn
                icon="update"
                v-model="BTN_RESET"
                no-caps rounded
                @click="reloadBtnPressed(BTN_RESET)"
                label="Перезагрузка устройства"
                style="margin-bottom: 10px; "
              />
              </div>

            </div>
          </q-card-section>


        </q-card>



      <q-dialog v-model="showAdvice" >
      <q-card :class="computedClass">

        <q-card-section>
          <div style="text-align: center">Перезагрузка необходима для применения настроек. Если Вы вносили изменения в один из параметров выше, перезагрузите устройство.</div>
        </q-card-section>
      </q-card>
    </q-dialog>

    </q-scroll-area>
  </q-layout>

  <q-footer
    style="
      height: 65px;
      display: flex;
      align-content: center;
      position: fixed;
      bottom: 0px;
      background-color: #00692f;
    "
    class="text-white"
  >
    <q-toolbar style="justify-content: center; column-gap: 60px">
      <div
        class="navbar"
        @click="
          () => {
            disconnectMqtt();
            $q.loading.hide();
            router.replace('/');
            redoColor();
          }
        "
      >
        <div style="row-gap: 2px">

          <img
            src="../components/images/Vector (3).svg"
            alt=""
            style="width: 42px; height: 40px; padding: 10"
          />
        </div>
        <div style="font-size: 10px; margin-top: -8px">Устройства</div>
      </div>
      <div
        class="navbar"
        @click="
          () => {
            redoColor();
            openSchedule();
          }
        "
      >
        <div style="row-gap: 2px">
          <img
          v-if="schedulePage && !set && systemIsChosen && !settingsPage"
            src="../components/images/Vector (2) copy.svg"
            alt=""
            style="width: 40px; padding: 10; height: 40px;"
          />
         <img
          v-if="!schedulePage && (!set || systemIsChosen || !settingsPage)"
            src="../components/images/Vector (2).svg"
            alt=""
            style="width: 40px; height: 40px; padding: 10"
          />
        </div>
        <div v-if="!schedulePage && (!set || systemIsChosen || !settingsPage)" style="font-size: 10px; margin-top: -8px; color: white">Расписание</div>
        <div v-if="schedulePage && !set && systemIsChosen && !settingsPage" style="font-size: 10px; margin-top: -8px; color: #ed6c05">Расписание</div>
      </div>

      <div
        class="navbar"
        @click="
          () => {
            redoColor();
            settings();
            isTemp = true;
            isFan = false;
            isHum = false;
          }
        "
      >
        <div style="row-gap: 2px">
          <img
          v-if="schedulePage || settingsPage"
            src="../components/images/Vector (4).svg"
            alt=""
            style="width: 40px; height: 40px; padding: 10"
          />
          <img
          v-if="!schedulePage && !settingsPage"
            src="../components/images/Vector (4) copy.svg"
            alt=""
            style="width: 40px; height: 40px; padding: 10"
          />
        </div>
        <div style="font-size: 10px; margin-top: -8px; color: white" v-if="schedulePage || settingsPage">Управление</div>
        <div style="font-size: 10px; margin-top: -8px; color:#ed6c05" v-if="!schedulePage && !settingsPage">Управление</div>
      </div>
      <div
        class="navbar"
        @click="
          () => {
            redoColor();
            systemSettings();
          }
        "
      >
        <div style="row-gap: 2px">

          <img
          v-if="settingsPage && !set && systemIsChosen && !schedulePage"
            src="../components/images/Vector (5) copy.svg"
            alt=""
            style="width: 40px; padding: 10; height: 40px;"
          />
          <img
          v-if="!settingsPage && (!set || systemIsChosen || !schedulePage)"
            src="../components/images/Vector (5).svg"
            alt=""
            style="width: 39px; padding: 10; height: 40px;"
          />
        </div>
        <div style="font-size: 10px; margin-top: -8px; padding-top: -5px; color: white" v-if="!settingsPage && (!set || systemIsChosen || !schedulePage)">Параметры</div>
        <div style="font-size: 10px; margin-top: -8px; padding-top: -5px; color: #ed6c05" v-if="settingsPage && !set && systemIsChosen && !schedulePage">Параметры</div>
      </div>
    </q-toolbar>
  </q-footer>
</template>

<script setup>


import { ref, onMounted, onBeforeMount, inject, provide} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuasar, setCssVar } from 'quasar';

setCssVar('knobColor', '#009453')

const $q = useQuasar()
$q.loading.show({
    delay: 200 // ms
})

const showAdvice = ref(false);
const showAdviceForSchedule = ref(false);
const showAdviceForRtk = ref(false);
const showAdviceForHeater = ref(false);

const isDark = ref();
const theme = ref();
const systems = ref([]);

const count = ref(0);
const loading = ref(false);
const onRefresh = () => {
  setTimeout(() => {
    loading.value = false;
    count.value++;
  }, 1000);
};

const bus = inject("bus");
bus.on("themeChanged", (themeValue) => {
  redoColor();
});

import Paho from "paho-mqtt";

const route = useRoute();
const { SN, host, port, name, mode } = route.params;
let systemsList;
systemsList = JSON.parse(localStorage.getItem("systems"));
let currentSystem = systemsList.find(
      (system) =>
        system.name === name &&
        system.SN === SN &&
        system.host === host
    );

const rtkSerialNum = ref("");
const hasLoaded = ref(false);
const myMsg = ref(0);
const rtkArray = ref([]);
const parsedMessage = ref();
const topicsArr = ref([]);
const testVAAAAL = ref(true);
const WiFiStatus = ref(["ВЫКЛ", "ВКЛ"]);
const gotHumdity = ref(undefined);
const systemIsChosen = ref(false);
const monitoring = ref(false);
const set = ref(false);
const logsPage = ref(false);
const schedulePage = ref(false);
const settingsPage = ref(false);
const computedClass = ref("my-card-dark");
const selectClass = ref("underline");
const selectClass1 = ref("no-underline");
const selectClass2 = ref("no-underline");
const darkThemeMq = ref();
const labelColor = ref("text-white");
const mainColor = ref("white");

const confirm = ref(false);


const colors = [
  "white",
  "green",
  "red",
  "blue",
  "yellow",
  "#00ffe1",
  "grey",
  "orange",
  "#ae00ff",
  "#6fff00",
  "black",
  "#ff5ec9",
];
const isTemp = ref(true);
const isFan = ref(false);
const isHum = ref(false);
const router = useRouter();
const isPromise = ref(false);

const scheduleOptions = ref([
  "ОФИС",
  "ВСЕ ВРЕМЯ ДОМА",
  "РАБОЧАЯ НЕДЕЛЯ",
  "ИНДИВИДУАЛЬНАЯ",
]);
const weekDays = ref(["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"]);
const weekDayWW = ref();
const alarmDictionary = ref({
  "FAULT: OVERHEAT": "Авария: термоконтакт!",
  "FAULT: HEATER": "Авария: нагреватель!",
});

const SW_TABLE = ref({
  topic: `/IoTmanager/RTK-${SN}/SW_TABLE`,
  val: "",
  blocked: false,
}); // режим Авто
const SW_FAN = ref({
  topic: `/IoTmanager/RTK-${SN}/SW_FAN`,
  val: "",
  blocked: false,
}); // RTK вкл/выкл
const SW_HEATER = ref({
  topic: `/IoTmanager/RTK-${SN}/SW_HEATER`,
  val: "",
  blocked: false,
}); // Нагреватель (приточка)
const RANGE_TEMP = ref({
  topic: `/IoTmanager/RTK-${SN}/range_TEMP`,
  val: "",
  blocked: false,
}); // Уставка температуры
const RANGE_FAN = ref({
  topic: `/IoTmanager/RTK-${SN}/range_FAN`,
  val: "",
  blocked: false,
}); // Уставка вентиляции
const RANGE_H = ref({
  topic: `/IoTmanager/RTK-${SN}/range_H`,
  val: "",
  blocked: false,
}); // уставка влажности
const T10 = ref({
  topic: `/IoTmanager/RTK-${SN}/T10`,
  val: "",
  blocked: false,
}); // температура
const H10 = ref({
  topic: `/IoTmanager/RTK-${SN}/H10`,
  val: "",
  blocked: false,
}); //влажность
const ERR = ref({
  topic: `/IoTmanager/RTK-${SN}/ERR`,
  val: "",
  blocked: false,
});

//  вкладка время
const WDAY = ref({
  topic: `/IoTmanager/RTK-${SN}/WDAY`,
  val: "0",
  blocked: false,
});
const TIME = ref({
  topic: `/IoTmanager/RTK-${SN}/TIME`,
  val: "",
  blocked: false,
});
const COMPANY = ref({ topic: `/IoTmanager/RTK-${SN}/T_COMPANY`, val: "" });
const SITE = ref({ topic: `/IoTmanager/RTK-${SN}/T_SITE`, val: "" });
const knobDisabled = ref(true);
// вкладка расписание
const T_MODE = ref({
  topic: `/IoTmanager/RTK-${SN}/T_MODE`,
  val: "",
  blocked: false,
});
const T_WDAY = ref({
  topic: `/IoTmanager/RTK-${SN}/T_WDAY`,
  val: "",
  blocked: false,
});

const T_TIME_1 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_TIME_1`,
  val: "",
  blocked: false,
});
const T_VENT_1 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_VENT_1`,
  val: "",
  blocked: false,
});
const T_TEMP_1 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_TEMP_1`,
  val: "",
  blocked: false,
});
const T_SW_FAN_1 = ref({ topic: `/IoTmanager/RTK-${SN}/T_SW_FAN_1`, val: "" });
const T_SW_HEATER_1 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_SW_HEATER_1`,
  val: "",
});

const T_TIME_2 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_TIME_2`,
  val: "",
  blocked: false,
});
const T_VENT_2 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_VENT_2`,
  val: "",
  blocked: false,
});
const T_TEMP_2 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_TEMP_2`,
  val: "",
  blocked: false,
});
const T_SW_FAN_2 = ref({ topic: `/IoTmanager/RTK-${SN}/T_SW_FAN_2`, val: "" });
const T_SW_HEATER_2 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_SW_HEATER_2`,
  val: "",
});

const T_TIME_3 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_TIME_3`,
  val: "",
  blocked: false,
});
const T_VENT_3 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_VENT_3`,
  val: "",
  blocked: false,
});
const T_TEMP_3 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_TEMP_3`,
  val: "",
  blocked: false,
});
const T_SW_FAN_3 = ref({ topic: `/IoTmanager/RTK-${SN}/T_SW_FAN_3`, val: "" });
const T_SW_HEATER_3 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_SW_HEATER_3`,
  val: "",
});

const T_TIME_4 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_TIME_4`,
  val: "",
  blocked: false,
});
const T_VENT_4 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_VENT_4`,
  val: "",
  blocked: false,
});
const T_TEMP_4 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_TEMP_4`,
  val: "",
  blocked: false,
});
const T_SW_FAN_4 = ref({ topic: `/IoTmanager/RTK-${SN}/T_SW_FAN_4`, val: "" });
const T_SW_HEATER_4 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_SW_HEATER_4`,
  val: "",
});

const T_TIME_5 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_TIME_5`,
  val: "",
  blocked: false,
});
const T_VENT_5 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_VENT_5`,
  val: "",
  blocked: false,
});
const T_TEMP_5 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_TEMP_5`,
  val: "",
  blocked: false,
});
const T_SW_FAN_5 = ref({ topic: `/IoTmanager/RTK-${SN}/T_SW_FAN_5`, val: "" });
const T_SW_HEATER_5 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_SW_HEATER_5`,
  val: "",
});

const T_TIME_6 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_TIME_6`,
  val: "",
  blocked: false,
});
const T_VENT_6 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_VENT_6`,
  val: "",
  blocked: false,
});
const T_TEMP_6 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_TEMP_6`,
  val: "",
  blocked: false,
});
const T_SW_FAN_6 = ref({ topic: `/IoTmanager/RTK-${SN}/T_SW_FAN_6`, val: "" });
const T_SW_HEATER_6 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_SW_HEATER_6`,
  val: "",
});

const T_TIME_7 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_TIME_7`,
  val: "",
  blocked: false,
});
const T_VENT_7 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_VENT_7`,
  val: "",
  blocked: false,
});
const T_TEMP_7 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_TEMP_7`,
  val: "",
  blocked: false,
});
const T_SW_FAN_7 = ref({ topic: `/IoTmanager/RTK-${SN}/T_SW_FAN_7`, val: "" });
const T_SW_HEATER_7 = ref({
  topic: `/IoTmanager/RTK-${SN}/T_SW_HEATER_7`,
  val: "",
});

const AP = ref({ topic: `/IoTmanager/RTK-${SN}/AP`, val: "" });

//только в режиме точки доступа
const WIFI_AP_SSID = ref({
  topic: `/IoTmanager/RTK-${SN}/WIFI_AP_SSID`,
  val: "",
});
const WIFI_AP_PASS = ref({
  topic: `/IoTmanager/RTK-${SN}/WIFI_AP_PASS`,
  val: "",
});
const BTN_RESET2 = ref({ topic: `/IoTmanager/RTK-${SN}/BTN_RESET2`, val: "" });
const WIFI_SSID = ref({ topic: `/IoTmanager/RTK-${SN}/WIFI_SSID`, val: "" });
const WIFI_PASS = ref({ topic: `/IoTmanager/RTK-${SN}/WIFI_PASS`, val: "" });
const MQTT_HOST = ref({ topic: `/IoTmanager/RTK-${SN}/MQTT_HOST`, val: "" });
const MQTT_PORT = ref({ topic: `/IoTmanager/RTK-${SN}/MQTT_PORT`, val: "" });
const MQTT_PREFIX = ref({
  topic: `/IoTmanager/RTK-${SN}/MQTT_PREFIX`,
  val: "",
});
const MQTT_USER = ref({ topic: `/IoTmanager/RTK-${SN}/MQTT_USER`, val: "" });
const MQTT_PASS = ref({ topic: `/IoTmanager/RTK-${SN}/MQTT_PASS`, val: "" });
const BTN_RESET = ref({ topic: `/IoTmanager/RTK-${SN}/BTN_RESET`, val: "" });
const CONFIG = ref({ topic: `/IoTmanager/RTK-${SN}/config`, val: "" });
const CONFIRM = ref({ topic: `/IoTmanager/RTK-${SN}/CONFIRM`, val: "" });
const TCANCEL = ref({ topic: `/IoTmanager/RTK-${SN}/TCANCEL`, val: "" });

rtkArray.value.push(
  SW_TABLE,
  SW_FAN,
  SW_HEATER,
  RANGE_TEMP,
  RANGE_FAN,
  RANGE_H,
  T10,
  H10,
  ERR,
  WDAY,
  TIME,
  COMPANY,
  SITE,
  T_MODE,
  T_WDAY,
  T_TIME_1,
  T_VENT_1,
  T_TEMP_1,
  T_SW_FAN_1,
  T_SW_HEATER_1,
  T_TIME_2,
  T_VENT_2,
  T_TEMP_2,
  T_SW_FAN_2,
  T_SW_HEATER_2,
  T_TIME_3,
  T_VENT_3,
  T_TEMP_3,
  T_SW_FAN_3,
  T_SW_HEATER_3,
  T_TIME_4,
  T_VENT_4,
  T_TEMP_4,
  T_SW_FAN_4,
  T_SW_HEATER_4,
  T_TIME_5,
  T_VENT_5,
  T_TEMP_5,
  T_SW_FAN_5,
  T_SW_HEATER_5,
  T_TIME_6,
  T_VENT_6,
  T_TEMP_6,
  T_SW_FAN_6,
  T_SW_HEATER_6,
  T_TIME_7,
  T_VENT_7,
  T_TEMP_7,
  T_SW_FAN_7,
  T_SW_HEATER_7,
  AP,
  WIFI_AP_SSID,
  WIFI_AP_PASS,
  BTN_RESET2,
  WIFI_SSID,
  WIFI_PASS,
  MQTT_HOST,
  MQTT_PORT,
  MQTT_PREFIX,
  MQTT_USER,
  MQTT_PASS,
  BTN_RESET,
  CONFIG,
  CONFIRM,
  TCANCEL
);

let myClient
const fnMarkerLabel = [0,  35];
const fanMarkerLabel = [60, 100];
const HumMarkerLabel = [0,  100]

if (currentSystem.mode == 'Станция (онлайн)'){
  if (currentSystem.auth == true){
    myClient = new Paho.Client(
      host,
      Number(port),
      "clientId_" + Math.random().toString(16).substr(2, 8)
    );
    myClient.connect({ userName: currentSystem.login, password: currentSystem.password, useSSL: true, onSuccess: onConnect, onFailure: onFailure, timeout: 3000 });
  }
  else{
    myClient = new Paho.Client(
      host,
      Number(port),
      "/ws",
      "clientId_" + Math.random().toString(16).substr(2, 8)
    );
    myClient.connect({ onSuccess: onConnect, onFailure: onFailure, timeout: 3000 });
  }

}
else{
  myClient = new Paho.Client(
  host,
  Number(port),
  "clientId_" + Math.random().toString(16).substr(2, 8)
); // в режиме точки доступа, работает с компа и с телефона
myClient.connect({ onSuccess: onConnect, onFailure: onFailure, timeout: 3000 });
}



function onFailure() {
  $q.loading.hide();
  router.replace("/");
}

function changeMode() {
  systems.value = localStorage.getItem("systems")
    ? JSON.parse(localStorage.getItem("systems"))
    : [];
  if (port == 8883) {
    let existingSystemIndex;
    let newObj = {
      Name: name,
      Number: SN,
      Host: MQTT_HOST.value.val,
      Port: 8080,
      Connection: "Станция (онлайн)",

    };
    if (systems.value) {
      existingSystemIndex = systems.value.findIndex(
        (system) =>
          system.SN == newObj.Number && system.mode == newObj.Connection
      );
      if (existingSystemIndex == -1) {
        systems.value.push({
          name: newObj.Name,
          SN: newObj.Number,
          host: MQTT_HOST.value.val,
          port: 8080,
          mode: newObj.Connection,
          auth: false,
        });
        localStorage.setItem("systems", JSON.stringify(systems.value));
      }
    }
  }

  toggle(AP.value);
  setTimeout(() => {
    disconnectMqtt();
    router.replace("/");
  }, 1000);
}
let gotMessages = 0;
myClient.onMessageArrived = (message) => {
  gotMessages++;
  recievedMessage.value = JSON.parse(message.payloadString);
  if (recievedMessage.value.topic == `/IoTmanager/RTK-${SN}/config`) {
  }
  try {
    if (message.topic == `/IoTmanager/RTK-${SN}/config`) {
      if (
        !topicsArr.value.find((elem) => elem.id == recievedMessage.value.id)
      ) {
        topicsArr.value.push(recievedMessage.value);
      }
      gotHumdity.value = topicsArr.value.find(
        (elem) => elem.topic == `/IoTmanager/RTK-${SN}/H10`
      );
    }
    if (message.topic != `/IoTmanager/RTK-${SN}/config`) {
      rtkArray.value.forEach((obj) => {
        if (typeof obj == "object" && !obj.value.blocked) {
          if (typeof obj.value.topic != "undefined") {
            if (`${obj.value.topic}/status` == message.topic) {
              obj.value.val = recievedMessage.value.status;
              if (obj.value.topic == `/IoTmanager/RTK-${SN}/TCANCEL`) {
                obj.value.val = recievedMessage.value.status;
                confirm.value = true;
                $q.loading.hide();
              }
              if (isNumber(recievedMessage.value.status)) {
                if (obj.value.topic == `/IoTmanager/RTK-${SN}/SW_TABLE`) {
                }
                if (
                  obj.value.topic == `/IoTmanager/RTK-${SN}/SW_TABLE` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/SW_FAN` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/SW_HEATER` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_SW_FAN_1` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_SW_HEATER_1` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_SW_FAN_2` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_SW_HEATER_2` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_SW_FAN_3` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_SW_HEATER_3` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_SW_FAN_4` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_SW_HEATER_4` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_SW_FAN_5` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_SW_HEATER_5` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_SW_FAN_6` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_SW_HEATER_6` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_SW_FAN_7` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_SW_HEATER_7`
                ) {
                  if (parseInt(recievedMessage.value.status) == 1) {
                    obj.value.val = true;
                  } else {
                    obj.value.val = false;
                  }
                } else if (
                  obj.value.topic == `/IoTmanager/RTK-${SN}/WIFI_AP_SSID` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/WIFI_AP_PASS` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/WIFI_SSID` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/WIFI_PASS` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/MQTT_HOST` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/MQTT_PORT` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/MQTT_PREFIX` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/MQTT_USER` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/MQTT PASS`
                ) {
                  obj.value.val = recievedMessage.value.status;
                } else if (
                  obj.value.topic == `/IoTmanager/RTK-${SN}/TIME` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_TIME_1` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_TIME_2` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_TIME_3` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_TIME_4` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_TIME_5` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_TIME_6` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/T_TIME_7`
                ) {
                  obj.value.val = recievedMessage.value.status;
                } else if (obj.value.topic == `/IoTmanager/RTK-${SN}/T_MODE`) {
                  obj.value.val =
                    scheduleOptions.value[
                      parseInt(recievedMessage.value.status)
                    ];
                } else if (obj.value.topic == `/IoTmanager/RTK-${SN}/T_WDAY`) {
                  if (
                    weekDays.value[parseInt(recievedMessage.value.status)] == ""
                  ) {
                  }
                  obj.value.val =
                    weekDays.value[parseInt(recievedMessage.value.status)];
                  if (T_MODE.value.val == 'ОФИС' || T_MODE.value.val == 'РАБОЧАЯ НЕДЕЛЯ'){
                    if (obj.value.val == 'СБ' || obj.value.val == 'ВС' ){
                      weekDayWW.value = 'Выходные'
                    }
                    else{
                      weekDayWW.value = 'Будни'
                    }
                                    }
                  if (T_MODE.value.val == 'ИНДИВИДУАЛЬНАЯ'){
                    weekDays.value[parseInt(recievedMessage.value.status)];
                  }
                } else if (obj.value.topic == `/IoTmanager/RTK-${SN}/WDAY`) {
                  obj.value.val =
                    weekDays.value[parseInt(recievedMessage.value.status)];
                } else if (obj.value.topic == `/IoTmanager/RTK-${SN}/ERR`) {
                  obj.value.val = recievedMessage.value.status;

                } else {
                  obj.value.val = parseInt(recievedMessage.value.status);
                }
              } else if (obj.value.topic == `/IoTmanager/RTK-${SN}/AP`) {
                if (recievedMessage.value.status == "ВЫКЛ") {
                  obj.value.val = false;
                }
                if (recievedMessage.value.status == "ВКЛ") {
                  obj.value.val = true;
                }
              } else {
                obj.value.val = recievedMessage.value.status;
              }
            }
          }
        }
      });
    }
  } catch (e) {
    console.error("Error parsing message:", e);
  }
};
const showWindowForTemp = ref(false);
const showWindowForVent = ref(false);
const showWindowForHum = ref(false);

myClient.onConnectionLost = onConnectionLost;

function sendMessage(payload, destination) {
  const message = new Paho.Message(payload);
  message.destinationName = destination;
  message.qos = 1;
  try {
    myClient.send(message);
  } catch {
    return false;
  }
}
function disconnectMqtt() {
  if (myClient) {
    try {
      myClient.unsubscribe("#");
      myClient.disconnect();
      myClient = null;
    } catch {
      myClient = null;
    }
  }
}
let counter = 0;
function connectMqtt() {
  disconnectMqtt();
  myClient = new Paho.Client(
    host,
    Number(port),
    "clientId_" + Math.random().toString(16).substr(2, 8)
  );

  myClient.onConnectionLost = onConnectionLost;
  myClient.connect({ onSuccess: onConnect, onFailure: onFailure });
}
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    counter++;
    if (counter > 3) {
      counter = 0;
       router.replace("/");
    } else {
      setTimeout(connectMqtt, 2000);
    }
  }
}
myClient.onConnected = () => {
  rtkArray.value.forEach((topic) => {
    if (topic.value.topic == `/IoTmanager/RTK-${SN}/config`) {
      myClient.subscribe(`${topic.value.topic}`);
    } else {
      myClient.subscribe(`${topic.value.topic}/status`);
      myClient.subscribe(`/IoTmanager/RTK-${SN}/SW_TABLE/status`);
    }
  });
  let counter = 0;
  const test = setInterval(() => {
    counter++;
    if (counter < 3) {
      sendMessage("HELLO", "/IoTmanager");
    } else {
      $q.loading.hide()
      clearInterval(test);
      let found = 0;
      if (gotMessages == 0){
        myClient.disconnect();
        router.replace("/")
      }
    }
  }, 2000);
};
function onConnect() {
  sendMessage("HELLO", "/IoTmanager");
  hasLoaded.value = true;
}

const recievedMessage = ref();
const indiv = ref(false);
const office = ref(false);
const week = ref(false);
const house = ref(false);

function fillSchedule() {
  if (T_MODE.value.val == "ИНДИВИДУАЛЬНАЯ") {
    indiv.value = true;
    office.value = false;
    week.value = false;
    house.value = false;
  }
  if (T_MODE.value.val == "ОФИС") {
    office.value = true;
    week.value = false;
    house.value = false;
    indiv.value = false;
  }
  if (T_MODE.value.val == "РАБОЧАЯ НЕДЕЛЯ") {
    week.value = true;
    house.value = false;
    indiv.value = false;
    office.value = false;
  }
  if (T_MODE.value.val == "ВСЕ ВРЕМЯ ДОМА") {
    house.value = true;
    indiv.value = false;
    office.value = false;
    week.value = false;
  }
}
function isNumber(num) {
  try {
    let a = parseInt(num);
    if (typeof a === "number" && !isNaN(a)) {
      return true;
    }
  } catch {
    return false;
  }
}

function isString(str) {
  if (typeof str === "string") {
    return num;
  }
  return "...";
}

function home() {
  systemIsChosen.value = false;
  set.value = false;
  schedulePage.value = false;
  settingsPage.value = false;
}
function settings() {
  systemIsChosen.value = true;
  set.value = true;
  schedulePage.value = false;
  settingsPage.value = false;
}
function systemSettings() {
  systemIsChosen.value = true;
  set.value = false;
  schedulePage.value = false;
  settingsPage.value = true;
}
function getObject(array, prop, value) {
  for (let index = 0; index < array.length; index += 1) {
    const element = array[index];
    if (element[prop] === value) {
      return element;
    }
  }
  return null;
}
function openSchedule() {
  schedulePage.value = true;
  systemIsChosen.value = true;
  set.value = false;
  settingsPage.value = false;
}

onBeforeMount(() => {
  var platform = navigator.userAgent;
  const isNew = localStorage.getItem("added");
});

const response = ref(null);

// Запись в РТК

function writeSet(target) {
  sendMessage(JSON.stringify(target.val), `${target.topic}/control`);
  submitted.value = false;
  target.blocked = false;
}
function reloadBtnPressed(target) {
  sendMessage(JSON.stringify(1), `${target.topic}/control`);
  myClient.unsubscribe("#");
  myClient.disconnect();
  router.push("/");
}
function writeScheduleSet(target) {
  if (target.val == '--:--'){
    sendMessage(JSON.stringify(''), `${target.topic}/control`);
  }
  else{
    sendMessage(target.val, `${target.topic}/control`);
  }
    target.blocked = false;
}
function chooseFromList(target, dictionary) {
  sendMessage(
    JSON.stringify(dictionary.indexOf(target.val)),
    `${target.topic}/control`
  );
  target.blocked = false;
}

function toggle(target, dict) {
  let preparedValue;
  if (
    target.topic == `/IoTmanager/RTK-${SN}/SW_TABLE` ||
    target.topic == `/IoTmanager/RTK-${SN}/SW_FAN` ||
    target.topic == `/IoTmanager/RTK-${SN}/SW_HEATER`
  ) {
    if (target.val == true) {
      preparedValue = 1;
    } else {
      preparedValue = 0;
    }
    sendMessage(JSON.stringify(preparedValue), `${target.topic}/control`);
  }
  if (
    target.topic == `/IoTmanager/RTK-${SN}/T_SW_FAN_1` ||
    target.topic == `/IoTmanager/RTK-${SN}/T_SW_HEATER_1` ||
    target.topic == `/IoTmanager/RTK-${SN}/T_SW_FAN_2` ||
    target.topic == `/IoTmanager/RTK-${SN}/T_SW_HEATER_2` ||
    target.topic == `/IoTmanager/RTK-${SN}/T_SW_FAN_3` ||
    target.topic == `/IoTmanager/RTK-${SN}/T_SW_HEATER_3` ||
    target.topic == `/IoTmanager/RTK-${SN}/T_SW_FAN_4` ||
    target.topic == `/IoTmanager/RTK-${SN}/T_SW_HEATER_4` ||
    target.topic == `/IoTmanager/RTK-${SN}/T_SW_FAN_5` ||
    target.topic == `/IoTmanager/RTK-${SN}/T_SW_HEATER_5` ||
    target.topic == `/IoTmanager/RTK-${SN}/T_SW_FAN_6` ||
    target.topic == `/IoTmanager/RTK-${SN}/T_SW_HEATER_6` ||
    target.topic == `/IoTmanager/RTK-${SN}/T_SW_FAN_7` ||
    target.topic == `/IoTmanager/RTK-${SN}/T_SW_HEATER_7`
  ) {

      if (target.val == true) {
        preparedValue = 1;
      } else {
        preparedValue = 0;
      }
      sendMessage(JSON.stringify(preparedValue), `${target.topic}/control`);
  }
  if (target.topic == `/IoTmanager/RTK-${SN}/AP`) {
    if (target.val == false) {
      preparedValue = "ВЫКЛ";
    }
    if (target.val == true) {
      preparedValue = "ВКЛ";
    }
    sendMessage(preparedValue, `${target.topic}/control`);
  }
}
const PullToRefresh = ref(false)
let startY;
function handleTouchStart(event) {
  startY = event.touches[0].clientY;
}
let threshold = 100;

function handleTouchMove(event) {
  let currentY = event.touches[0].clientY;
  let distance = currentY - startY;

  if (distance > threshold && startY < 150) {
    PullToRefresh.value = true;

    const test = setInterval(() => {
    counter++;
    if (counter < 3) {
      sendMessage("HELLO", "/IoTmanager");
    } else {
      PullToRefresh.value = false;
      clearInterval(test);
    }
  }, 2000);

  }
}

onMounted(() => {
  let el = document.createElement('div');
  document.body.appendChild(el);
  let loadingCounter = 0;

  const counter = setInterval(() => {
    if (loadingCounter < 10 && !hasLoaded.value){
      loadingCounter++;
    }
    if ((loadingCounter >= 10 && !hasLoaded.value)){
      try{
        disconnectMqtt();
      }
      catch(e){

      }
      $q.loading.hide();
      clearInterval(counter);
      router.replace('/');
    }
    if (loadingCounter < 8 && hasLoaded.value){
      clearInterval(counter)
    }
  }, 1000)

  darkThemeMq.value = window.matchMedia("(prefers-color-scheme: light)");
  redoColor();

  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);

});

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
const submitted = ref(false);

function waitForSubmit(target) {
  setTimeout(() => {
    target.blocked = false;
    sendMessage("HELLO", "/IoTmanager");
    submitted.value = false;
  }, 5000);
}
</script>

<style>
@font-face {
  font-family: "HelveticaRegular";
  src: url('../fonts/00_Helvetica/HelveticaRegular/HelveticaRegular.eot') format('eot'),
        url('../fonts/00_Helvetica/HelveticaRegular/HelveticaRegular.ttf') format('ttf'),
        url('../fonts/00_Helvetica/HelveticaRegular/HelveticaRegular.woff') format('woff'),
  ;
  font-weight: normal;
}
.my-card-dark {
  width: 93vw;
  margin: 0 auto;
  background-color: #878787;
  flex-direction: column;
  margin-bottom: 10px;
  display: flex;
  justify-items: flex-start;
  font-size: 16px;
  color: white;
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
  text-color: black;
}
.btn-light-class{
  background-color: #e3e3e3;
  color: white;
}
.btn-dark-class{
  background-color: #009453;
  color: white;
}
.bgc-light-class {
  background-color: #e3e3e3;
}
.bgc-dark-class {
  background-color: #3c3c3b;
}
.no-underline{
  border-bottom: 2px solid #ed6c05;
}
.underline{
  border-bottom: 2px solid white;
}
.no-underline1{
  border-bottom: 2px solid #ed6c05;
}
.underline1{
  border-bottom: 2px solid white;
}
.no-underline2{
  border-bottom: 2px solid #ed6c05;
}
.underline2{
  border-bottom: 2px solid white;
}
.navbar {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
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
.pcClass{
  width: 70%;
  max-width: 800px
}
</style>
