<template>
  <div class="ftr-timetable ftr-timetable__horizontal" ref="ttRef" :style="{ ...timeTableStyle, height: `${locations.length * 60 + 52}px` }">
    <div class="timetable-inner" :style="{ minWidth: `${hours.length * 60 + 160}px` }">
      <div class="ftr-timetable-datetime">
        <div class="ftr-timetable-datetime__date">
          <div class="ftr-timetable-datetime__select">
            <select :value="selectedDate" @change="onChange($event)">
              <option v-for="dt in dates" :value="dt" :key="dt">
                {{ formatDate(dt, dateFormat) }}
              </option>
            </select>
          </div>
        </div>
        <div class="ftr-timetable-datetime__hours">
          <div class="ftr-timetable-datetime__hour" v-for="hour in hours" :key="hour.display">
            <span>{{ hour.display }}</span>
          </div>
          <TimeTableMarker :date="selectedDate" :ttRef="ttRef" />
        </div>
      </div>
      <div class="ftr-timetable-locations">
        <div class="ftr-timetable-location-container" v-for="location in locations" :key="location.id" :data-location-id="location.id">
          <div class="ftr-timetable-location" :title="location.name" :style="location.style" @click="onLocationClick?.(location)">
            <div className="ftr-timetable-location__inner">
              <div className="ftr-timetable-location__name">{{ location.name }}</div>
            </div>
          </div>
          <div className="ftr-timetable-location-items">
            <Item v-for="item in itemsForLocation(location.id)" :key="item.item.id" :item="item.item" :offset="item.offset" :intersections="item.intersections" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { type ComputedRef, defineComponent, inject, ref, Ref, type PropType } from 'vue'
import type { TimeTableHour, TimeTableItem, TimeTableLocation } from './types';
import TimeTableMarker from './TimeTableMarker.vue';
import { format } from 'date-fns';
import Item from './TimeTableItem.vue';
import { useItemIntersections } from './utils/useItemIntersections';

export default defineComponent({
  name: 'TimeTableHorizontal',
  components: { Item, TimeTableMarker },
  props: {
    hours: {
      type: Array as PropType<TimeTableHour[]>,
      required: true
    },
    locations: {
      type: Array as PropType<TimeTableLocation[]>,
      required: true
    },
    items: {
      type: Array as PropType<TimeTableItem[]>,
      default: []
    },
    dates: {
      type: Array as PropType<string[]>,
    }
  },
  setup() {
    const ttRef = ref<HTMLDivElement>();
    return {
      ttRef
    };
  },
  data() {
    const onDateChange = inject<(date: string) => void>('onDateChange');
    const onLocationClick = inject<(item: TimeTableLocation) => void>('onLocationClick');
    const timeTableStyle = inject<ComputedRef>('timetableStyle')!;
    const dateFormat = inject<string>('dateFormat');
    const selectedDate = inject<Ref<string>>('selectedDate');

    return {
      dateFormat,
      onDateChange,
      onLocationClick,
      timeTableStyle,
      selectedDate
    };
  },
  methods: {
    formatDate(date: string | Date, style?: string) {
      return format(new Date(date), style || 'yyyy-MM-dd');
    },
    itemsForLocation(locationId: string | number) {
      return useItemIntersections(this.items.filter((item: TimeTableItem) => item.locationId === locationId));
    },
    onChange(event: Event) {
      const target = event.target as HTMLSelectElement;
      this.onDateChange?.(target.value);
    }
  }
})
</script>

<style lang="scss" scoped>
.ftr-timetable {
  --scroll-color: var(--custom-date-background-color, #1f2937);
  --border-style: var(--custom-border-style, solid 2px rgba(255, 255, 255, 0.1));
  --text-color: var(--custom-text-color, #fff);
  --background-color: var(--custom-background-color, #1f2937);
  --date-background-color: var(--custom-date-background-color, #1f2937);
  --date-text-color: var(--custom-date-text-color, inherit);
  --datepicker-background-color: var(--custom-datepicker-background-color, #1f2937);
  --location-background-color: var(--custom-location-background-color, #1f2937);
  --location-text-color: var(--custom-location-text-color, inherit);

  &::-webkit-scrollbar {
    width: 0px;
    height: 8px;
    background: var(--background-color);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--scroll-color); 
    border-radius: 50%;
    border: solid 2px var(--background-color);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: hsl(from var(--scroll-color) h s calc(l - 5));
  }

  position: relative;
  overflow: auto;
  width: 100%;
  max-height: 100%;
  max-width: 100vw;
  box-sizing: border-box !important;
  color: var(--text-color);
  background: var(--background-color);
  padding-bottom: 6px;

  * {
    box-sizing: border-box !important;
  }

  .timetable-inner {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
      
    .ftr-timetable-datetime {
      display: flex;
      flex-direction: row;
      position: sticky;
      top: 0;
      z-index: 3;
      background: var(--date-background-color);
      width: 100%;
      height: 44px;
      color: var(--date-text-color);
  
      &__date {
        position: sticky;
        top: 0;
        left: 0;
        z-index: 2;
        background: var(--datepicker-background-color);
        display: flex;
        justify-content: space-between;
        width: 10rem;
        height: 100%;
        flex-shrink: 0;
        flex-direction: row;
        padding-left: 0.5rem;
        border-bottom: var(--border-style);
      }

      &__select {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        height: 100%;
        padding-left: 0.5rem;
        // border-bottom: var(--border-style);
        border-right: var(--border-style);
        // box-shadow: 0 5px 5px -4px rgba(0, 0, 0, 1);

        select {
          background: transparent url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23fff'><polygon points='0,0 100,0 50,50'/></svg>") no-repeat calc(100% - 10px) calc(50% + 3px);
          background-size: 10px;
          color: inherit;
          font-family: inherit;
          border: none;
          outline: none;
          font-size: 0.875rem;
          line-height: 1.25rem;
          width: 100%;
          -webkit-appearance: none;
          appearance: none;
        }
      }

      &__hours {
        display: flex;
        flex-direction: row;
        position: relative;
        border-bottom: var(--border-style);
        width: 100%;
        height: 100%;
      }

      &__hour {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        width: 60px;
        // padding-left: 0.25rem;
        // padding-bottom: 0.25rem;
        font-size: 0.65rem;
        height: 100%;
        position: relative;
        // border-left: solid 2px #374151;
        border-left: none !important;

        &:not(:first-child) {
          &:before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            height: 10px;
            border-left: var(--border-style);
          }
        }

        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          height: 5px;
          border-left: var(--border-style);
        }

        &:first-child {
          border-left: none !important;

          span {
            display: none;
          }
        }

        span {
          transform: translate(-25%, -12px);
        }
      }
    }
  }

  .ftr-timetable-locations {
    display: flex;
    flex-direction: column;
    // gap: 6px;
    // padding-top: 6px;
  }
  
  .ftr-timetable-location-container {
    display: flex;
    flex-direction: row;
    height: 60px;

    .ftr-timetable-location {
      height: 100%;
      width: 10rem;
      z-index: 4;
      position: sticky;
      top: 0;
      left: 0;
      color: var(--location-text-color);
      background-color: var(--location-background-color);

      &__inner {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 0.5rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        border-right: var(--border-style);
        border-bottom: var(--border-style);
      }

      &__name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
      }
    }

    .ftr-timetable-location-items {
      flex: 1;
      position: relative;
      height: 100%;
      border-bottom: var(--border-style);
    }
  }
}
</style>