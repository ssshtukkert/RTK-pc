<template style="height: 800px">
  <q-layout
    style="padding-bottom: 15px"
    class="bg-grey-9 text-white"
    id="mainLayout"
  >
    <span v-if="isSpinner" class="loader"></span>

    <!-- Уставки -->
    <q-scroll-area v-if="!schedulePage && !settingsPage" style="height: 85vh">
      <q-dialog v-model="confirm">
        <q-card :class="computedClass" style="border-radius: 15px">
          <q-toolbar style="justify-content: space-between">
            <div></div>
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                width: 100%;
              "
            >
              <div style="color: white"><b>Применить изменения?</b></div>
            </div>
          </q-toolbar>
          <q-card-section
            style="display: flex; justify-content: center; margin-top: -20px"
          >
            <q-btn
              color="orange-9"
              rounded
              label="OK"
              style="margin-right: 10px"
              v-close-popup
              @click="
                () => {
                  reloadBtnPressed(CONFIRM);
                  confirm = false;
                }
              "
            />
            <q-btn
              color="teal-7"
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

      <div v-if="!schedulePage && !settingsPage">
        <q-label
          style="
            padding: 10px;
            font-family: 'Roboto', sans-serif;
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
          class="my-card-dark cardMonocolor"
          style="border-radius: 15px"
        >
          <q-card-section style="background-color: #ff6f24; margin-top: -10px">
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

        <q-card :class="computedClass" style="border-radius: 15px"
          ><q-toolbar style="background-color: #ff6f24; color: white"
            ><q-label
              style="word-wrap: break-word; font-size: 16px; font-weight: 700"
              >Управление</q-label
            ></q-toolbar
          >
          <q-card-section>
            <div style="margin-bottom: -10px; margin-top: -10px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Режим АВТО</div>
                <q-toggle
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
                <div>Вентиляция</div>

                <q-toggle
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
                <div>Нагреватель</div>

                <q-toggle
                  @click="toggle(SW_HEATER)"
                  color="orange-9"
                  v-model="SW_HEATER.val"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card
          v-if="!SW_TABLE.val"
          :class="computedClass"
          style="border-radius: 15px"
        >
          <q-toolbar style="background-color: #ff6f24; color: white">
            <img
              src="../components/images/temperature.svg"
              alt=""
              style="height: 45px; margin: 10px"
              @click="
                () => {
                  isTemp = true;
                  isFan = false;
                  isHum = false;
                }
              "
            />
            <img
              src="../components/images/fan.svg"
              alt=""
              style="height: 45px; margin: 10px"
              @click="
                () => {
                  isTemp = false;
                  isFan = true;
                  isHum = false;
                }
              "
            />
            <img
              src="../components/images/humdity.svg"
              alt=""
              style="height: 45px; margin: 10px"
              v-if="gotHumdity"
              @click="
                () => {
                  isTemp = false;
                  isFan = false;
                  isHum = true;
                }
              "
            />
          </q-toolbar>
          <q-card-section v-if="isTemp">
            <div style="margin-bottom: 8px">
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
            <!-- <div class="settingsInside" style="margin-right: 10px; width: 100%"> -->
            <q-dialog persistent v-model="showWindowForTemp">
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
                      background-color: #00897b;
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
                      }
                    "
                    label="Подтвердить"
                    rounded
                  />
                  <q-btn
                    @click="
                      () => {
                        waitForSubmit(RANGE_TEMP);
                      }
                    "
                    style="
                      background-color: #626262;
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
              <q-knob
                @touchstart="
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
                v-model="RANGE_TEMP.val"
                show-value
                :min="5"
                :max="35"
                size="150px"
                font-size="30px"
                :thickness="0.35"
                color="orange-9"
                track-color="teal-7"
                :dark="isDark"
                class="q-ma-md"
                >{{ RANGE_TEMP.val }}°С</q-knob
              >
              <!-- <q-btn
              @click="
                () => {
                  submitted = true;
                  writeSet(RANGE_TEMP);
                  RANGE_TEMP.blocked = false;
                }
              "
              label="Подтвердить ввод"
              rounded
            /> -->
            </div>

            <!-- </div> -->
          </q-card-section>
          <q-card-section v-if="isFan">
            <q-dialog persistent v-model="showWindowForVent">
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
                      background-color: #00897b;
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
                      }
                    "
                    label="Подтвердить"
                    rounded
                  />
                  <q-btn
                    @click="
                      () => {
                        waitForSubmit(RANGE_FAN);
                      }
                    "
                    style="
                      background-color: #626262;
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
                <div>Уставка вентиляции</div>

                <div style="font-weight: 700; margin-right: 10px">
                  {{ RANGE_FAN.val }}%
                </div>
              </div>
            </div>
            <div class="cardManCircle">
              <q-knob
                @touchstart="
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
                v-model="RANGE_FAN.val"
                show-value
                :min="60"
                :max="100"
                size="150px"
                font-size="30px"
                :thickness="0.35"
                color="orange-9"
                track-color="teal-7"
                :dark="isDark"
                class="q-ma-md"
                >{{ RANGE_FAN.val }}%</q-knob
              >
              <!-- <q-btn
                @click="
                  () => {
                    submitted = true;
                    writeSet(RANGE_FAN);
                    RANGE_FAN.blocked = false;
                  }
                "
                label="Подтвердить ввод"
                rounded
              /> -->
            </div>

            <!-- </div> -->
          </q-card-section>
          <q-card-section v-if="isHum && gotHumdity">
            <q-dialog persistent v-model="showWindowForHum">
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
                      background-color: #00897b;
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
                      }
                    "
                    label="Подтвердить"
                    rounded
                  />
                  <q-btn
                    @click="
                      () => {
                        waitForSubmit(RANGE_H);
                      }
                    "
                    style="
                      background-color: #626262;
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
                <div>Уставка влажности</div>

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
                <div>Текущая влажность</div>

                <div style="font-weight: 700; margin-right: 10px">
                  {{ RANGE_H.val }}%
                </div>
              </div>
            </div>
            <div class="cardManCircle">
              <q-knob
                v-model="RANGE_H.val"
                show-value
                :min="5"
                :max="35"
                size="150px"
                font-size="30px"
                :thickness="0.35"
                color="orange-9"
                track-color="teal-7"
                :dark="isDark"
                class="q-ma-md"
                @touchstart="
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
                >{{ RANGE_H.val }}%</q-knob
              >
              <!-- <q-btn
                @click="testFoo(tag, tag.displayedValue)"
                label="Подтвердить ввод"
                rounded
              /> -->
            </div>

            <!-- </div> -->
          </q-card-section>
        </q-card>
      </div>
    </q-scroll-area>

    <q-dialog
      style="backdrop-filter: blur(2px)"
      v-model="spinnerActive"
      :persistent="isPromise"
    >
      <div
        style="
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        "
      >
        <q-spinner-ios color="orange-9" style="height: 50px; width: 50px" />
        <div v-if="isPromise" style="color: #b0b0b0; font-size: 16px">
          Отправка данных
        </div>
      </div>
    </q-dialog>
    <!-- Расписание -->

    <q-scroll-area
      style="height: 85vh"
      v-if="schedulePage && !set && systemIsChosen && !settingsPage"
    >
      <div
        v-if="schedulePage && !set && systemIsChosen && !settingsPage"
        style="margin-bottom: 65px; width: 100%"
      >
        <q-label
          style="
            padding: 10px;
            font-family: 'Roboto', sans-serif;
            font-size: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <!-- <div @click="home">
          <img
            src="../components/images/back-svgrepo-com.svg"
            style="
              height: 20px;
              display: flex;
              justify-items: center;
              margin-right: 5px;
            "
            v-if="isDark"
          />
          <img
            src="../components/images/back-svgrepo-com-black.svg"
            style="
              height: 20px;
              display: flex;
              justify-items: center;
              margin-right: 5px;
            "
            v-if="!isDark"
          />
        </div> -->
          <div style="text-align: center">
            <b>Расписание</b>
          </div></q-label
        >
        <!-- <div style="width: 100vw; display: flex; justify-content: center; margin-bottom: 10px;">
        <div class="loader"></div>
      </div> -->

        <q-card :class="computedClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ff6f24"
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
              <div><b>Настройки расписания</b></div>
            </div>
          </q-toolbar>
          <q-card-section>
            <q-select
              v-model="T_MODE.val"
              @click="
                () => {
                  T_MODE.blocked = true;
                  console.log('blocked');
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
              v-if="T_MODE.val == 'ИНДИВИДУАЛЬНАЯ'"
              v-model="T_WDAY.val"
              @click="
                () => {
                  T_WDAY.blocked = true;
                  console.log('blocked');
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
            <q-select
              v-if="T_MODE.val == 'ОФИС' || T_MODE.val == 'РАБОЧАЯ НЕДЕЛЯ'"
              v-model="weekDayWW"
              @update:model-value="
                () => {
                  console.log(weekDayWW);
                  if (weekDayWW == 'Будни') {
                    sendMessage(
                      JSON.stringify(2),
                      `/IoTmanager/RTK-${SN}/T_WDAY/control`
                    );
                  }
                  if (weekDayWW == 'Выходные') {
                    sendMessage(
                      JSON.stringify(6),
                      `/IoTmanager/RTK-${SN}/T_WDAY/control`
                    );
                  }
                }
              "
              :options="weekDaysWorkWeekend"
              label="День недели"
              style="margin-top: -10px"
              :color="isDark"
              :dark="isDark"
              popup-content-style="font-size: 16px"
              options-style="font-size: 16px;"
            />
          </q-card-section>
        </q-card>

        <q-card :class="computedClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ff6f24"
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
              <div><b>Время 1</b></div>
              <q-input
                v-model="T_TIME_1.val"
                @focus="
                  () => {
                    T_TIME_1.blocked = true;
                  }
                "
                @blur="
                  () => {
                    prepared = T_TIME_1.val;
                    isPromise = true;
                    spinnerActive = true;
                    writeScheduleSetMultiple(T_TIME_1, prepared);
                  }
                "
                icon="time"
                outlined
                mask="##:##"
                dense
                :dark="isDark"
                style="width: 30%; font-size: 16px; padding: 0"
                :color="isDark"
                placeholder="00:00"
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
                    writeScheduleSetMultiple(T_VENT_1, T_VENT_1.val);
                  }
                "
                v-model="T_VENT_1.val"
                dense
                style="width: 30%; font-size: 16px"
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
                style="width: 30%; font-size: 16px"
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
                    writeScheduleSetMultiple(T_TEMP_1);
                  }
                "
              />
              <!-- <q-input
              v-model="T_TEMP_1.val"
              dense
              :dark="isDark"
              style="width: 30%; margin-left: 6px; font-size: 16px; padding: 0"
              :color="isDark"
            /> -->
            </div>
            <div style="margin-bottom: -10px; margin-top: 10px">
              <div
                class="settingsInside"
                style="margin-right: 10px; width: 100%"
              >
                <div>Вентиляция</div>

                <q-toggle
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
                  @click="toggle(T_SW_HEATER_1)"
                  color="orange-9"
                  v-model="T_SW_HEATER_1.val"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card :class="computedClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ff6f24"
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
              <div><b>Время 2</b></div>
              <q-input
                v-model="T_TIME_2.val"
                @focus="
                  () => {
                    T_TIME_2.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSetMultiple(T_TIME_2);
                  }
                "
                icon="time"
                outlined
                mask="##:##"
                dense
                :dark="isDark"
                style="width: 30%; font-size: 16px; padding: 0"
                :color="isDark"
                placeholder="00:00"
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
                style="width: 30%; font-size: 16px"
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    T_VENT_2.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSetMultiple(T_VENT_2);
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
                style="width: 30%; font-size: 16px"
                :dark="isDark"
                :color="isDark"
                @focus="
                  () => {
                    T_TEMP_2.blocked = true;
                  }
                "
                @blur="
                  () => {
                    writeScheduleSetMultiple(T_TEMP_2);
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
                  @click="toggle(T_SW_HEATER_2)"
                  color="orange-9"
                  v-model="T_SW_HEATER_2.val"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card :class="computedClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ff6f24"
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
              <div><b>Время 3</b></div>
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
                mask="##:##"
                dense
                :dark="isDark"
                style="width: 30%; font-size: 16px; padding: 0"
                :color="isDark"
                placeholder="00:00"
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
                style="width: 30%; font-size: 16px"
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
                style="width: 30%; font-size: 16px"
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
                  @click="toggle(T_SW_HEATER_3)"
                  color="orange-9"
                  v-model="T_SW_HEATER_3.val"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card :class="computedClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ff6f24"
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
              <div><b>Время 4</b></div>
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
                mask="##:##"
                dense
                :dark="isDark"
                style="width: 30%; font-size: 16px; padding: 0"
                :color="isDark"
                placeholder="00:00"
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
                style="width: 30%; font-size: 16px"
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
                style="width: 30%; font-size: 16px"
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
                  @click="toggle(T_SW_HEATER_4)"
                  color="orange-9"
                  v-model="T_SW_HEATER_4.val"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card :class="computedClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ff6f24"
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
              <div><b>Время 5</b></div>
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
                mask="##:##"
                dense
                :dark="isDark"
                style="width: 30%; font-size: 16px; padding: 0"
                :color="isDark"
                placeholder="00:00"
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
                style="width: 30%; font-size: 16px"
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
                style="width: 30%; font-size: 16px"
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
                  @click="toggle(T_SW_HEATER_5)"
                  color="orange-9"
                  v-model="T_SW_HEATER_5.val"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card :class="computedClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ff6f24"
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
              <div><b>Время 6</b></div>
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
                mask="##:##"
                dense
                :dark="isDark"
                style="width: 30%; font-size: 16px; padding: 0"
                :color="isDark"
                placeholder="00:00"
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
                style="width: 30%; font-size: 16px"
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
                style="width: 30%; font-size: 16px"
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
                  @click="toggle(T_SW_HEATER_6)"
                  color="orange-9"
                  v-model="T_SW_HEATER_6.val"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card :class="computedClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ff6f24"
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
              <div><b>Время 7</b></div>
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
                mask="##:##"
                dense
                :dark="isDark"
                style="width: 30%; font-size: 16px; padding: 0"
                :color="isDark"
                placeholder="00:00"
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
                style="width: 30%; font-size: 16px"
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
                style="width: 30%; font-size: 16px"
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
                  @click="toggle(T_SW_HEATER_7)"
                  color="orange-9"
                  v-model="T_SW_HEATER_7.val"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-scroll-area>

    <!-- Параметры -->
    <q-scroll-area
      style="height: 85vh"
      v-if="!schedulePage && !set && systemIsChosen && settingsPage"
    >
      <div
        v-if="!schedulePage && !set && systemIsChosen && settingsPage"
        style="margin-bottom: 65px"
      >
        <q-label
          style="
            padding: 10px;
            font-family: 'Roboto', sans-serif;
            font-size: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <!-- <div @click="home">
          <img
            src="../components/images/back-svgrepo-com.svg"
            style="
              height: 20px;
              display: flex;
              justify-items: center;
              margin-right: 5px;
            "
            v-if="isDark"
          />
          <img
            src="../components/images/back-svgrepo-com-black.svg"
            style="
              height: 20px;
              display: flex;
              justify-items: center;
              margin-right: 5px;
            "
            v-if="!isDark"
          />
        </div> -->
          <div style="text-align: center">
            <b>Параметры</b>
          </div></q-label
        >
        <q-card :class="computedClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ff6f24"
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
              <div><b>Настройки времени</b></div>
            </div>
          </q-toolbar>
          <q-card-section>
            <q-select
              v-model="WDAY.val"
              @click="
                () => {
                  WDAY.blocked = true;
                  console.log('blocked');
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
                    console.log('blocked');
                  }
                "
                @blur="
                  () => {
                    writeScheduleSet(TIME);
                  }
                "
                icon="time"
                outlined
                mask="##:##"
                dense
                :dark="isDark"
                style="width: 30%; font-size: 16px; padding: 0"
                :color="isDark"
                placeholder="00:00"
                ><template v-slot:prepend> <q-icon name="schedule" /> </template
              ></q-input>
            </div>
          </q-card-section>
        </q-card>
        <q-card :class="computedClass" style="border-radius: 15px">
          <q-toolbar
            style="justify-content: space-between; background-color: #ff6f24"
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
                style="width: auto; font-size: 16px"
                :dark="isDark"
                :color="isDark"
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
              <div>Перезагрузка устройства</div>
              <q-btn
                icon="update"
                v-model="BTN_RESET2"
                @click="reloadBtnPressed(BTN_RESET2)"
              />
            </div>
          </q-card-section>
        </q-card>
        <q-card
          v-if="port == 8883 && mode != 'Станция (оффлайн)'"
          :class="computedClass"
          style="border-radius: 15px"
        >
          <q-toolbar
            style="justify-content: space-between; background-color: #ff6f24"
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
                style="width: auto; font-size: 16px"
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
                style="width: auto; font-size: 16px"
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
                style="width: auto; font-size: 16px"
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
                style="width: auto; font-size: 16px"
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
                style="width: auto; font-size: 16px"
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
                style="width: auto; font-size: 16px"
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
                style="width: auto; font-size: 16px"
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
              <div>Перезагрузка устройства</div>
              <q-btn
                icon="update"
                v-model="BTN_RESET"
                @click="reloadBtnPressed(BTN_RESET)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-scroll-area>
  </q-layout>

  <q-footer
    style="
      height: 65px;
      display: flex;
      align-content: center;
      position: fixed;
      bottom: 0px;
    "
    class="bg-teal-7 text-white"
  >
    <q-toolbar style="justify-content: space-around">
      <div
        class="navbar"
        @click="
          () => {
            disconnectMqtt();
            router.replace('/');
            redoColor();
          }
        "
      >
        <div>
          <img
            src="../components/images/3643769-building-home-house-main-menu-start_113416.svg"
            alt=""
            style="width: 40px; padding: 10"
          />
        </div>
        <div style="font-size: 8px; margin-top: -10px">Поиск</div>
      </div>
      <div
        class="navbar"
        @click="
          () => {
            redoColor();
            openSchedule();
            // synchTimers();
          }
        "
      >
        <div>
          <img
            src="../components/images/calendar-time-date-schedule-svgrepo-com (1).svg"
            alt=""
            style="width: 40px; padding: 10"
          />
        </div>
        <div style="font-size: 8px; margin-top: -10px">Расписание</div>
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
            // synchTimers();
          }
        "
      >
        <div>
          <img
            src="../components/images/monitoring-svgrepo-com.svg"
            alt=""
            style="width: 40px; padding: 10"
          />
        </div>
        <div style="font-size: 8px; margin-top: -10px">Управление</div>
      </div>
      <!--  -->
      <div
        class="navbar"
        @click="
          () => {
            redoColor();
            systemSettings();
          }
        "
      >
        <div>
          <img
            src="../components/images/settings-svgrepo-com (1).svg"
            alt=""
            style="width: 40px; padding: 10"
          />
        </div>
        <div style="font-size: 8px; margin-top: -10px">Параметры</div>
      </div>
    </q-toolbar>
  </q-footer>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, inject, provide } from "vue";
import { useRouter, useRoute } from "vue-router";

import mitt from "mitt";
// import bonjour from 'bonjour';
const isDark = ref();
const theme = ref();
const systems = ref([]);

const bus = inject("bus");
bus.on("themeChanged", (themeValue) => {
  console.log("changed");
  redoColor();
});

import Paho from "paho-mqtt";
// import { CapacitorWifiConnect } from "@falconeta/capacitor-wifi-connect";
// import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
// import ssdp from '@achingbrain/ssdp';
// const ssdpbus = ssdp();

const spinnerActive = ref(true);
// 88B0BF3BDAEC 5882A10CDADC 5882A10CDADC
// E4ACBF3BDAEC
const route = useRoute();
const { SN, host, port, name, mode } = route.params;

console.log(typeof SN, typeof host, port);
const rtkSerialNum = ref("");
console.log(Paho);
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
const temp_set = ref("15");
const chosenSys = ref();
const logs = ref([]);
const timers = ref([]);
const currentSeason = ref();
let configuration;
const onOff = ref([]);
const numSets = ref([]);
const authPage = ref(true);
const settingsPage = ref(false);
const computedClass = ref("my-card-dark");
const darkThemeMq = ref();
const isSpinner = ref(false);
const stopRefresh = ref(false);
const labelColor = ref("text-white");
const mainColor = ref("white");
const prepared = ref();

const onButton = ref([]);
const offButton = ref([]);
const resetAlarmButton = ref([]);
const confirm = ref(false);

const timersModelEnable = ref({}); // eslint-disable-line
const timersModelTime = ref({}); // eslint-disable-line
const timersModelTag = ref({}); // eslint-disable-line
const timersModelTagName = ref({}); // eslint-disable-line
const timersModelDays = ref({}); // eslint-disable-line
const timerModelInput = ref({}); // eslint-disable-line
const timerModelSelectInput = ref({}); // eslint-disable-line
const timerModelSelectInputOp = ref({}); // eslint-disable-line
const messenger = ref([]);
const system = ref({});
const serverNotAvailable = ref(false);
const notificationText = ref();
const allowUsers = ref([]);
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
const firstSetup = ref(true);
const isTemp = ref(true);
const isFan = ref(false);
const isHum = ref(false);
const router = useRouter();
const email = ref("");
const password = ref("");
const jsonMessage = ref();
const isPromise = ref(false);
const systemName = ref("");
// const host = ref("test.mosquitto.org");
// const port = ref("8081");
const prefix = ref("IoTmanager");
let wsClient;
const systemList = ref([
  {
    Name: "RTK-868488",
    Host: "test.mosquitto.org",
    Port: 8080,
    Prefix: "IoTmanager",
  },
]);
const scheduleOptions = ref([
  "ОФИС",
  "ВСЕ ВРЕМЯ ДОМА",
  "РАБОЧАЯ НЕДЕЛЯ",
  "ИНДИВИДУАЛЬНАЯ",
]);
const weekDays = ref(["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"]);
const weekDaysWorkWeekend = ref(["Будни", "Выходные"]);
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
  val: "",
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
  val: "ВС",
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

// RTK-5882A10CDADC
const message = ref("");
// let myClient = new Paho.Client('RTK-88B0BF3BDAEC', Number(8080), "/ws"); // в режиме точки доступа, работает с компа
// let myClient = new Paho.Client("test.mosquitto.org", Number(8080), "/ws"); // работает с телефона в режиме станции
// let myClient = new Paho.Client(`RTK-${SN}`, Number(8080), "/ws"); // в режиме точки доступа, работает с компа

console.log(host, port);
// let myClient = new Paho.Client(host, Number(port), "/ws"); // в режиме точки доступа, работает с компа и с телефона
let myClient = new Paho.Client(
  host,
  Number(port),
  "clientId_" + Math.random().toString(16).substr(2, 8)
); // в режиме точки доступа, работает с компа и с телефона
myClient.connect({ onSuccess: onConnect, onFailure: onFailure, timeout: 6000 });

function onFailure() {
  spinnerActive.value = false;
  router.replace("/");
}

function changeMode() {
  systems.value = localStorage.getItem("systems")
    ? JSON.parse(localStorage.getItem("systems"))
    : [];
  if (port == 8883) {
    console.log(MQTT_HOST.value.val);
    let existingSystemIndex;
    let newObj = {
      Name: name,
      Number: SN,
      Host: MQTT_HOST.value.val,
      Port: 8080,
      Connection: "Станция (онлайн)",
    };
    console.log(newObj);
    if (systems.value) {
      existingSystemIndex = systems.value.findIndex(
        (system) =>
          system.SN == newObj.Number && system.mode == newObj.Connection
      );
      console.log(existingSystemIndex);
      if (existingSystemIndex == -1) {
        systems.value.push({
          name: newObj.Name,
          SN: newObj.Number,
          host: MQTT_HOST.value.val,
          port: 8081,
          mode: newObj.Connection,
        });
        localStorage.setItem("systems", JSON.stringify(systems.value));

        console.log(systems.value);
      }
    }
  }

  toggle(AP.value);
  setTimeout(() => {
    disconnectMqtt();
    router.replace("/");
  }, 1000);
}
myClient.onMessageArrived = (message) => {
  recievedMessage.value = JSON.parse(message.payloadString);
  if (recievedMessage.value.topic == `/IoTmanager/RTK-${SN}/config`) {
    console.log(recievedMessage.value);
  }
  try {
    if (message.topic == `/IoTmanager/RTK-${SN}/config`) {
      if (
        !topicsArr.value.find((elem) => elem.id == recievedMessage.value.id)
      ) {
        topicsArr.value.push(recievedMessage.value);
        // console.log(topicsArr.value)
      }
      gotHumdity.value = topicsArr.value.find(
        (elem) => elem.topic == `/IoTmanager/RTK-${SN}/H10`
      );
    }
    if (message.topic != `/IoTmanager/RTK-${SN}/config`) {
      // console.log(message.topic, recievedMessage.value )
      rtkArray.value.forEach((obj) => {
        if (typeof obj == "object" && !obj.value.blocked) {
          if (typeof obj.value.topic != "undefined") {
            if (`${obj.value.topic}/status` == message.topic) {
              obj.value.val = recievedMessage.value.status;
              if (obj.value.topic == `/IoTmanager/RTK-${SN}/TCANCEL`) {
                console.log(recievedMessage.value);
                obj.value.val = recievedMessage.value.status;
                confirm.value = true;
              }
              if (isNumber(recievedMessage.value.status)) {
                if (obj.value.topic == `/IoTmanager/RTK-${SN}/SW_TABLE`) {
                  console.log("sw table");
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
                  // obj.value.val =
                  //   parseInt(recievedMessage.value.status) == true;
                } else if (
                  obj.value.topic == `/IoTmanager/RTK-${SN}/WIFI_AP_SSID` ||
                  obj.value.topic == `/IoTmanager/RTK-${SN}/PASS` ||
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
                  console.log(recievedMessage.value.status);
                  if (
                    weekDays.value[parseInt(recievedMessage.value.status)] == ""
                  ) {
                    console.log("empty");
                  }
                  obj.value.val =
                    weekDays.value[parseInt(recievedMessage.value.status)];
                  console.log(obj.value.val);
                  // if (T_MODE.value.val == 'ОФИС' || T_MODE.value.val == 'РАБОЧАЯ НЕДЕЛЯ'){
                  //   if (obj.value.val == 'СБ' || obj.value.val == 'ВС' ){
                  //   weekDayWW.value = 'Выходные'
                  // }
                  // if (recievedMessage.value.status == '' ){
                  //   weekDayWW.value = '';
                  // }
                  //   else{
                  //     weekDayWW.value = 'Будни'
                  //   }
                  // }
                } else if (obj.value.topic == `/IoTmanager/RTK-${SN}/WDAY`) {
                  obj.value.val =
                    weekDays.value[parseInt(recievedMessage.value.status)];
                } else if (obj.value.topic == `/IoTmanager/RTK-${SN}/ERR`) {
                  if (recievedMessage.value.status == "FAULT: OVERHEAT") {
                    obj.value.val = "Авария: термоконтакт!";
                  }
                  if (recievedMessage.value.status == "FAULT: HEATER") {
                    obj.value.val = "Авария: нагреватель!";
                  }
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
                // console.log(obj.value.val)
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
  try {
    myClient.send(message);
  } catch {
    return false;
  }
}
function disconnectMqtt() {
  console.log("disconnect mqtt");
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
  console.log("connect mqtt");
  disconnectMqtt();
  myClient = new Paho.Client(
    host,
    Number(port),
    "clientId_" + Math.random().toString(16).substr(2, 8)
  );

  myClient.onConnectionLost = onConnectionLost;
  myClient.connect({ onSuccess: onConnect });
}
function onConnectionLost(responseObject) {
  console.log("connection lost");
  if (responseObject.errorCode !== 0) {
    counter++;
    if (counter > 5) {
      console.log("Failed to connect to MQTT server after 10 attempts.");
      counter = 0;
      router.replace("/");
    } else {
      console.log("Connection lost. Attempting to reconnect...");
      setTimeout(connectMqtt, 2000);
    }
  }
}
myClient.onConnected = () => {
  rtkArray.value.forEach((topic) => {
    if (topic.value.topic == `/IoTmanager/RTK-${SN}/config`) {
      // sendMessage('HELLO', topic.value.topic);
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
      spinnerActive.value = false;
      clearInterval(test);
    }
  }, 2000);

  console.log("on connected");
};
function onConnect() {
  console.log("Mqtt connected");
  sendMessage("HELLO", "/IoTmanager");
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
  console.log(platform);
  const isNew = localStorage.getItem("added");
  console.log(isNew == null);
  isSpinner.value = false;
});

const response = ref(null);

// Запись в РТК

function writeSet(target) {
  console.log(target);
  sendMessage(JSON.stringify(target.val), `${target.topic}/control`);
  // client.publish(`${target.topic}/control`, JSON.stringify(target.val));
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
  sendMessage(target.val, `${target.topic}/control`);
  target.blocked = false;
  console.log(target);
}
function chooseFromList(target, dictionary) {
  console.log(target);
  console.log(dictionary.indexOf(target.val));
  sendMessage(
    JSON.stringify(dictionary.indexOf(target.val)),
    `${target.topic}/control`
  );
  target.blocked = false;
  console.log(target);
}

function writeScheduleSetMultiple(target, val) {
  console.log(val);
  if (T_MODE.value.val == "ИНДИВИДУАЛЬНАЯ") {
    sendMessage(target.val, `${target.topic}/control`);
    target.blocked = false;
    console.log(target);
  }

  if (T_MODE.value.val == "ВСЕ ВРЕМЯ ДОМА") {
    isPromise.value = true;
    spinnerActive.value = true;
    target.blocked = false;
    promiseMess(2000, 7, target, val, 0).then(() => {
      spinnerActive.value = false;
      isPromise.value = false;
      console.log("Все итерации завершены");
    });
  }
  if (T_MODE.value.val == "РАБОЧАЯ НЕДЕЛЯ" || T_MODE.value.val == "ОФИС") {
    isPromise.value = true;
    spinnerActive.value = true;
    if (weekDayWW.value == "Будни") {
      promiseMess(2000, 6, target, val, 1).then(() => {
        spinnerActive.value = false;
        isPromise.value = false;
        console.log("Все итерации завершены");
      });
    }

    if (weekDayWW.value == "Выходные") {
      setTimeout(() => {
        console.log(`Выходные`);
        console.log(val);
        sendMessage(JSON.stringify(0), `/IoTmanager/RTK-${SN}/T_WDAY/control`);
        setTimeout(() => {
          sendMessage(val, `${target.topic}/control`);
          spinnerActive.value = false;
          isPromise.value = false;
          // resolve();
        }, 1000);
      }, 2000);

      setTimeout(() => {
        console.log(`Выходные`);
        console.log(val);
        sendMessage(JSON.stringify(6), `/IoTmanager/RTK-${SN}/T_WDAY/control`);
        setTimeout(() => {
          sendMessage(val, `${target.topic}/control`);
          spinnerActive.value = false;
          isPromise.value = false;
        }, 4000);
      }, 6000);
    }
  }
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
    if (T_MODE.value.val == "ИНДИВИДУАЛЬНАЯ") {
      if (target.val == true) {
        preparedValue = 1;
      } else {
        preparedValue = 0;
      }
      sendMessage(JSON.stringify(preparedValue), `${target.topic}/control`);
    }

    if (T_MODE.value.val == "ВСЕ ВРЕМЯ ДОМА") {
      isPromise.value = true;
      spinnerActive.value = true;
      if (target.val == true) {
        preparedValue = 1;
      } else {
        preparedValue = 0;
      }
      promiseMess(2000, 7, target, JSON.stringify(preparedValue), 0).then(
        () => {
          spinnerActive.value = false;
          isPromise.value = false;
          console.log("Все итерации завершены");
        }
      );
      target.blocked = false;
    }

    if (T_MODE.value.val == "РАБОЧАЯ НЕДЕЛЯ" || T_MODE.value.val == "ОФИС") {
      isPromise.value = true;
      spinnerActive.value = true;
      console.log(weekDayWW.value);
      if (target.val == true) {
        preparedValue = 1;
      } else {
        preparedValue = 0;
      }
      if (weekDayWW.value == "Будни") {
        promiseMess(2000, 6, target, JSON.stringify(preparedValue), 1).then(
          () => {
            spinnerActive.value = false;
            isPromise.value = false;
            console.log("Все итерации завершены");
          }
        );
      }

      if (weekDayWW.value == "Выходные") {
        setTimeout(() => {
          console.log(`Выходные`);
          sendMessage(
            JSON.stringify(0),
            `/IoTmanager/RTK-${SN}/T_WDAY/control`
          );
          setTimeout(() => {
            sendMessage(
              JSON.stringify(preparedValue),
              `${target.topic}/control`
            );
            spinnerActive.value = false;
            isPromise.value = false;
          }, 1000);
        }, 2000);

        setTimeout(() => {
          console.log(`Выходные`);
          sendMessage(
            JSON.stringify(6),
            `/IoTmanager/RTK-${SN}/T_WDAY/control`
          );
          setTimeout(() => {
            sendMessage(
              JSON.stringify(preparedValue),
              `${target.topic}/control`
            );
            spinnerActive.value = false;
            isPromise.value = false;
          }, 4000);
        }, 6000);
      }
      target.blocked = false;
    }
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

function promiseMess(time, iterations, target, val, start) {
  let promise = Promise.resolve();
  for (let i = start; i < iterations; i++) {
    promise = promise.then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(`first ${i}`);
          console.log(val);
          sendMessage(
            JSON.stringify(i),
            `/IoTmanager/RTK-${SN}/T_WDAY/control`
          );
          setTimeout(() => {
            console.log(`second ${i}`);
            sendMessage(val, `${target.topic}/control`);
            resolve();
          }, 1000);
        }, time);
      });
    });
  }

  return promise;
}

onBeforeMount(() => {
  isSpinner.value = false;
});
onMounted(() => {
  let el = document.createElement('div');
  document.body.appendChild(el);

// eruda.init({
//     container: el,
//     tool: ['console', 'elements']
// });

// document.addEventListener('deviceready', function() {
//   var erudaElement = document.querySelector('.eruda');
//   if (erudaElement) {
//     erudaElement.style.display = 'none';
//   }
// });
  console.log(mode);
  darkThemeMq.value = window.matchMedia("(prefers-color-scheme: light)");
  redoColor();
});

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
}

// Задержка перед возвращением старой уставки
const submitted = ref(false); // нажата кнопка "подтвердить ввод"

function waitForSubmit(target) {
  setTimeout(() => {
    target.blocked = false;
    console.log("reset");
    sendMessage("HELLO", "/IoTmanager");
    submitted.value = false;
  }, 5000);
}
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
  color: white;
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
