<template>
  <TimeTableHorizontal v-if="variant === 'horizontal'" :items="items" :hours="hours" :locations="locations" :dates="dates" />
  <TimeTableVertical v-else :items="items" :hours="hours" :locations="locations" :dates="dates" />
</template>

<script lang="ts">
import { computed, defineComponent, onUpdated, provide, ref, type PropType } from 'vue'
import TimeTableHorizontal from './TimeTableHorizontal.vue'
import TimeTableVertical from './TimeTableVertical.vue'
import { useItems } from './utils/useItems'
import { useItemsInRange } from './utils/useItemsInRange'
import { useTimetableDates } from './utils/useTimetableDates'
import type { TimeTableHour, TimeTableItem, TimeTableLocation, TimeTableStyles } from './types';

export default defineComponent({
  name: 'TimeTable',
  components: {
    TimeTableHorizontal,
    TimeTableVertical
  },
  props: {
    variant: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal'
    },
    locations: {
      type: Array as PropType<TimeTableLocation[]>,
      required: true
    },
    items: {
      type: Array as PropType<TimeTableItem[]>,
      default: []
    },
    // dates: {
    //   type: Array as PropType<string[]>,
    // },
    onItemClick: Function as PropType<(item: TimeTableItem) => void>,
    onLocationClick: Function as PropType<(item: TimeTableItem) => void>,
    renderItem: Function as PropType<(item: TimeTableItem) => HTMLElement>,
    startingHour: {
      type: Number,
      default: 6
    },
    numberOfHours: {
      type: Number,
      default: 24
    },
    styles: {
      type: Object as PropType<TimeTableStyles>,
      default: {}
    },
    dateFormat: {
      type: String as PropType<string>,
      default: 'eee dd MMMM'
    },
    showTimeMarker: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const items = computed(() => {
      return useItems(props.locations, props.items);
    });

    const timetableDates = computed(() => {
      return useTimetableDates(items.value);
    });

    const selectedDate = ref<string>(timetableDates.value[0]);
    const startingHour = ref<number>(props.startingHour);
    const numberOfHours = ref<number>(props.numberOfHours);
  
    const itemsInRange = computed(() => {
      return useItemsInRange(
        items.value,
        startingHour.value,
        numberOfHours.value,
        selectedDate.value
      );
    });

    onUpdated(() => {
      startingHour.value = props.startingHour;
      numberOfHours.value = props.numberOfHours;
    });
  
    const hours = computed(() => {
      const hrs: TimeTableHour[] = [];
      for (let i = startingHour.value; i < startingHour.value + numberOfHours.value; i++) {
        const h = i < 24 ? i : i - 24;
        hrs.push({
          hour: i,
          display: `${h < 10 ? "0" : ""}${h}:00`,
        });
      }
      return hrs;
    });

    const timeTableStyle = computed(() => {
      const styles: TimeTableStyles = props.styles;
      if (!styles) {
        return {};
      }

      return {
        '--custom-border-style': styles.borderStyle,
        '--custom-background-color': styles.backgroundColor,
        '--custom-text-color': styles.textColor,
        '--custom-date-background-color': styles.dateBackgroundColor,
        '--custom-date-text-color': styles.dateTextColor,
        '--custom-datepicker-background-color': styles.datePickerBackgroundColor || styles.dateBackgroundColor,
        '--custom-location-background-color': styles.locationBackgroundColor,
        '--custom-location-text-color': styles.locationTextColor,
      };
    });

    function onDateChange (date: string) {
      selectedDate.value = date;
    }

    provide('selectedDate', selectedDate);
    provide('startingHour', startingHour);
    provide('numberOfHours', numberOfHours);
    provide('timetableStyle', timeTableStyle);
  
    return {
      ...props,
      items: itemsInRange,
      dates: timetableDates,
      hours,
      onDateChange
    };
  },
  provide() {
    return {
      variant: this.variant,
      onItemClick: this.onItemClick,
      onLocationClick: this.onLocationClick,
      onDateChange: this.onDateChange,
      dateFormat: this.dateFormat,
      showTimeMarker: this.showTimeMarker,
      styles: this.styles
    }
  }
});

</script>
