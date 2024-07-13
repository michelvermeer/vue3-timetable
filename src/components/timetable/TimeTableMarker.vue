<template>
  <div class="tt-marker" v-if="isShown" :style="style"></div>
</template>

<script lang="ts">
import { addHours, differenceInMinutes, format, startOfDay, subHours } from 'date-fns';
import { computed, defineComponent, inject, onUpdated, Ref, type PropType } from 'vue'
import type { TimeTableStyles } from './types';

export default defineComponent({
  name: 'TimeTableMarker',
  props: {
    date: {
      type: String as PropType<string>
    },
    ttRef: {
      type: Object as PropType<HTMLDivElement>,
    }
  },
  setup(props) {
    const startingHour = inject<Ref<number>>('startingHour')!;
    const numberOfHours = inject<Ref<number>>('numberOfHours')!;
    const variant = inject<string>('variant');
    const showMarker = inject<boolean>('showTimeMarker');
    const styles = inject<TimeTableStyles>('styles');
    
    const position = computed<number>(() => {
      if (!props.date) {
        return -1;
      }

      const end = addHours(startOfDay(new Date(props.date)), numberOfHours.value);
      const dateString = format(new Date(props.date), "yyyy-MM-dd");
      const nowString = format(subHours(new Date(), startingHour.value), "yyyy-MM-dd");
      if (dateString !== nowString || new Date().getTime() > end.getTime()) {
        return -1;
      }
      const start = addHours(startOfDay(new Date(props.date)), startingHour.value);
      const now = new Date();
      const diff = differenceInMinutes(now, start);

      return Math.max(diff, 0);
    });

    const isShown = computed(() => position.value >= 1 && !!showMarker);
    const style = computed(() => {
      return {
        width: variant === "horizontal" ? "1px" : "150%",
        height: variant === "horizontal" ? "150%" : "1px",
        left: variant === "horizontal" ? `${position.value}px` : 0,
        top: variant === "horizontal" ? 0 : `${position.value}px`,
        background: styles?.timeMarkerColor,
      };
    });
  
    onUpdated(() => {
      if (typeof document === "undefined" || !props.ttRef) {
        return;
      }

      const scrollTo = Math.max(position.value - 180, 0);

      props.ttRef.scrollTo?.({
        top: variant === "vertical" ? scrollTo : 0,
        left: variant === "horizontal" ? scrollTo : 0,
        behavior: "smooth",
      });
    });
  
    return {
      style,
      isShown,
      showMarker
    }
  }
})
</script>

<style lang="scss" scoped>
  .tt-marker {
    position: absolute;
    // box-shadow: -1px -1px 2px 0 rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 255, 0.3);
  }
</style>