<template>
  <div class="ftr-timetable ftr-timetable__vertical" ref="ttRef" :style="timeTableStyle.general">
    <div class="timetable-inner">
      <div class="ftr-timetable-datetime" :style="{ minWidth: `${locations.length * 200}px` }">
        <div class="ftr-timetable-datetime__container" :style="timeTableStyle.datetimeContainer">
          <div class="ftr-timetable-datetime__date" :style="timeTableStyle.date">
            <select :value="selectedDate" @change="onChange($event)">
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
        <div className="ftr-timetable-locations">
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
  name: 'TimeTableVertical',
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
          borderRight: styles.borderStyle,
          backgroundColor: styles.dateBackgroundColor || styles.backgroundColor
        },
        date: {
          borderBottom: styles.borderStyle,
          backgroundColor: styles.dateBackgroundColor || styles.backgroundColor
        },
        hour: {
          borderTop: styles.borderStyle
        },
        locationContainer: {
          borderRight: styles.borderStyle
        },
        location: {
          borderBottom: styles.borderStyle,
          backgroundColor: styles.locationBackgroundColor || styles.backgroundColor,
          color: styles.locationTextColor
        }
      };
    });

    return {
      onDateChange,
      onLocationClick,
      selectedDate,
      timeTableStyle
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
  height: 100%;
  min-height: 300px;
  max-width: 100vw;
  position: relative;
  overflow: auto;
  box-sizing: border-box !important;
  color:#fff;
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
    transform: translateY(-1px);

    .ftr-timetable-datetime {
      display: flex;
      flex-direction: row;
      width: 100%;

      &__container {
        width: 8rem;
        border-right: solid 2px #374151;
        background-color: #1f2937;
        position: sticky;
        left: 0;
        top: 0;
        z-index: 3;
      }

      &__date {
        display: flex;
        flex-direction: row;
        justify-content: stretch;
        align-items: stretch;
        width: 100%;
        height: 60px;
        padding: 0 0.25rem;
        background-color: #1f2937;
        border-bottom: solid 2px #374151;
        position: sticky;
        top: 0;
        z-index: 2;

        select {
          width: 100%;
          background-color: transparent;
          color: inherit;
          border: none;
          outline: none;
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
      }

      &__hours {
        position: relative;
        z-index: 1;
      }

      &__hour {
        display: flex;
        justify-content: flex-end;
        height: 60px;
        padding-top: 0.25rem;
        padding-right: 0.5rem;
        position: relative;
        z-index: 2;
        font-size: 0.75rem;
        line-height: 1rem;
        border-top: solid 2px #374151;

        &:first-child {
          border-top: none !important;
        }
      }
    }

    .ftr-timetable-locations {
      display: flex;
      flex-direction: row;
      flex: 1;
      position: relative;
    }
  }

  .ftr-timetable-location-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    border-right: solid 2px #374151;

    .ftr-timetable-location {
      height: 60px;
      position: sticky;
      top: 0;
      z-index: 2;
      color: inherit;
      border-bottom: solid 2px #374151;

      &__inner {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 0.5rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        height: 100%;
      }

      &__name {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
      }
    }

    .ftr-timetable-location-items {
      display: flex;
      flex: 1;
      flex-direction: column;
      position: relative;
    }
  }
}
</style>