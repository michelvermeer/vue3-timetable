<template>
  <div :class="className" :style="style" @click="onItemClick?.(item)" :data-item-id="item.id">
    <div class="ftr-timetable-item__inner">
      <div class="ftr-timetable-item__container" :style="{ ...itemStyle, ...item.style }" :title="`${item.name}\n${formatDate(item.startDate)}-${formatDate(item.endDate)}${item.info ? `\n${item.info}` : ''}`">
        <div class="ftr-timetable-item__content">
          <div>{{ item.name }}</div>
          <div class="ftr-timetable-item__info">
            <span v-if="showInfo">{{ formatDate(item.startDate) }}-{{ formatDate(item.endDate) }}</span>
            {{ item.info ? `${item.info}` : ''}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { format } from 'date-fns';
import { computed, defineComponent, inject, Ref, type PropType } from 'vue'
import type { TimeTableItem, TimeTableStyles } from './types';
import { useItemDimensions } from './utils/useItemDimensions';

export default defineComponent({
  name: 'TimeTableItem',
  props: {
    item: {
      type: Object as PropType<TimeTableItem>,
      required: true
    },
    intersections: {
      type: Number,
      required: true
    },
    offset: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const startingHour = inject<Ref<number>>('startingHour')!;
    const numberOfHours = inject<Ref<number>>('numberOfHours')!;
    const selectedDate = inject<Ref<string>>('selectedDate')!;
    const onItemClick = inject<(item: TimeTableItem) => void>('onItemClick');
    const variant = inject<string>('variant');
    const styles = inject<TimeTableStyles>('styles');
   
    const itemDimensions = computed(() => {
      return useItemDimensions(props.item, startingHour.value, numberOfHours.value, selectedDate.value)
    });
  
    const style = computed(() => {
      if (variant === 'vertical') {
        return {
          top: `${itemDimensions.value.itemStartOffset}px`,
          height: `${itemDimensions.value.itemSize}px`,
          left: `calc(100% / ${props.intersections + 1} * ${props.offset})`,
          maxWidth: `calc(100% / ${props.intersections + 1})`,
        }
      }
  
      return {
        left: `${itemDimensions.value.itemStartOffset}px`,
        width: `${itemDimensions.value.itemSize}px`,
        top: `calc(100% / ${props.intersections + 1} * ${props.offset})`,
        maxHeight: `calc(100% / ${props.intersections + 1})`,
      }
    });
  
    const showInfo = computed(() => {
      return variant === 'vertical' || itemDimensions.value.itemSize >= 90;
    });
  
    const itemStyle = computed(() => {
      if (!styles) {
        return {};
      }

      return {
        color: styles.itemTextColor,
        backgroundColor: styles.itemBackgroundColor
      }
    });
  
    const className = computed(() => {
      const classes = ['ftr-timetable-item', `ftr-timetable-item__${variant}`];
      if (itemDimensions.value.cutoffStart) {
        classes.push('cutoff-start');
      }
      if (itemDimensions.value.cutoffEnd) {
        classes.push('cutoff-end');
      }
      if (props.item.className) {
        classes.push(props.item.className);
      }
       if (props.item.cancelled) {
        classes.push('item-cancelled');
      }
      return classes.join(' ');
    });
  
    return {
      item: props.item,
      style,
      itemStyle,
      className,
      onItemClick,
      showInfo
    }
  },
  methods: {
    formatDate(date: string | Date, style?: string) {
      return format(new Date(date), style || 'HH:mm');
    },
  }
})
</script>

<style lang="scss" scoped>
  .ftr-timetable-item {
    position: absolute;
    font-size: 0.75rem;
    line-height: 1.25rem;

    &__horizontal {
      height: 100%;
      padding: 1px 0;

      &.cutoff-start {
        .ftr-timetable-item__container {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          
          &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 2px;
            background-color: rgba(0, 0, 0, 0.3);
          }
        }
      }

      &.cutoff-end {
        .ftr-timetable-item__container {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          
          &:before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            width: 2px;
            background-color: rgba(0, 0, 0, 0.3);
          }
        }
      }
  
      .ftr-timetable-item__container {
        padding: 0.125rem 0.25rem;
        flex-direction: row;

        .ftr-timetable-item__content {
            left: 164px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
          }
      }
    }

    &__vertical {
      width: 100%;
      padding: 0 0.5rem;

      &.cutoff-start {
        .ftr-timetable-item__container {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          
          &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: rgba(0, 0, 0, 0.3);
          }
        }
      }

      &.cutoff-end {
        .ftr-timetable-item__container {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          
          &:before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: rgba(0, 0, 0, 0.3);
          }
        }
      }
      
      .ftr-timetable-item__container {
        padding: 0.25rem;
        flex-direction: column;

        .ftr-timetable-item__content {
          top: 62px;
        }
      }
    }

    &__inner {
      position: relative;
      height: 100%;
      padding: 1px;
    }

    &__container {
      display: flex;
      position: relative;
      height: 100%;
      color: inherit;
      background-color: #304151;
      cursor: pointer;
      border-radius: 5px;
      box-shadow: 0 2px 5px -4px rgba(0, 0, 0, 0.4);
    
      &:hover {
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.1);
      }
    }

    &__content {
      position: sticky;
      overflow: hidden;
    }

    &__info {
      opacity: 0.8;
      font-size: 0.7rem;
      font-weight: normal;

      span {
        // font-weight: bold;
        margin-right: 5px;
      }
    }

    &.item-cancelled {
      opacity: 0.5;

      .ftr-timetable-item__content {
        text-decoration: line-through;
      }
    }
  }
</style>