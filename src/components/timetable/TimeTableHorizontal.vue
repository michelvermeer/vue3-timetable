<template>
  <div class="ftr-timetable ftr-timetable__horizontal" ref="ttRef" :style="{ height: `${locations.length * 60 + 44}px`, ...timeTableStyle.general }">
    <div class="timetable-inner" :style="{ minWidth: `${hours.length * 60 + 160}px` }">
      <div class="ftr-timetable-datetime" :style="timeTableStyle.datetimeContainer">
        <div class="ftr-timetable-datetime__date" :style="timeTableStyle.date">
          <select class="ftr-timetable-datetime__select" :value="selectedDate" @change="onChange($event)">
            <option v-for="dt in dates" :value="dt" :key="dt">
              {{ formatDate(dt, 'eee dd MMMM') }}
            </option>
          </select>
        </div>
        <div class="ftr-timetable-datetime__hours">
          <div class="ftr-timetable-datetime__hour" v-for="hour in hours" :key="hour.display" :style="timeTableStyle.hour">
            {{ hour.display }}
          </div>
          <TimeTableMarker :date="selectedDate" :ttRef="ttRef" />
        </div>
      </div>
      <div class="ftr-timetable-location-container" v-for="location in locations" :key="location.id" :style="timeTableStyle.locationContainer">
        <div class="ftr-timetable-location" :title="location.name" :style="{ ...timeTableStyle.location, ...location.style }" @click="onLocationClick?.(location)">
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
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref, Ref, type PropType } from 'vue'
import type { TimeTableHour, TimeTableItem, TimeTableLocation, TimeTableStyles } from './types';
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
    const styles = inject<TimeTableStyles>('styles');
    const selectedDate = inject<Ref<string>>('selectedDate');
    
    const timeTableStyle = computed(() => {
      if (!styles) {
        return {};
      }
  
      return {
        general: {
          backgroundColor: styles.backgroundColor,
          color: styles.textColor
        },
        datetimeContainer: {
          borderBottom: styles.borderStyle,
          backgroundColor: styles.dateBackgroundColor || styles.backgroundColor
        },
        date: {
          borderRight: styles.borderStyle,
          backgroundColor: styles.dateBackgroundColor || styles.backgroundColor
        },
        hour: {
          borderLeft: styles.borderStyle
        },
        locationContainer: {
          borderBottom: styles.borderStyle
        },
        location: {
          borderRight: styles.borderStyle,
          backgroundColor: styles.locationBackgroundColor || styles.backgroundColor,
          color: styles.locationTextColor
        }
      };
    });

    return {
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
  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  position: relative;
  overflow: auto;
  width: 100%;
  max-height: 100%;
  max-width: 100vw;
  box-sizing: border-box !important;
  color: #fff;
  background-color: #1f2937;

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
      background-color: #1f2937;
      border-bottom: solid 2px #374151;
      width: 100%;
      height: 44px;

      &__date {
        position: sticky;
        top: 0;
        left: 0;
        z-index: 2;
        background-color: #1f2937;
        border-right: solid 2px #374151;
        display: flex;
        justify-content: space-between;
        width: 10rem;
        height: 100%;
        flex-shrink: 0;
        flex-direction: row;
        padding: 0 0.25rem;

        select {
          background-color: transparent;
          color: inherit;
          border: none;
          outline: none;
          font-size: 0.875rem;
          line-height: 1.25rem;
          width: 100%;
        }
      }

      &__hours {
        display: flex;
        flex-direction: row;
        position: relative;
        // background-color: #1f2937;
        width: 100%;
        height: 100%;
      }

      &__hour {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        width: 60px;
        padding-left: 0.25rem;
        padding-bottom: 0.25rem;
        font-size: 0.75rem;
        height: 100%;
        border-left: solid 2px #374151;

        &:first-child {
          border-left: none !important;
        }
      }
    }
  }

  .ftr-timetable-location-container {
    display: flex;
    flex-direction: row;
    border-bottom: solid 2px #374151;
    height: 60px;

    .ftr-timetable-location {
      height: 100%;
      width: 10rem;
      z-index: 2;
      position: sticky;
      top: 0;
      left: 0;
      color: inherit;
      background-color: #000;
      border-right: solid 2px #374151;

      &__inner {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 0.5rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
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
    }
  }
}
</style>