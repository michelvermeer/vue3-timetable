<template>
  <div :class="className" :style="style" @click="onItemClick?.(item)">
    <div class="ftr-timetable-item__inner">
      <div class="ftr-timetable-item__container" :style="{ ...itemStyle, ...item.style }" :title="`${item.name}\n${item.info || ''}`">
        <div class="ftr-timetable-item__content">
          <div>{{ item.name }}</div>
          <div class="ftr-timetable-item__info" v-if="item.info">{{ item.info }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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
  
    const itemStyle = computed(() => {
      if (!styles) {
        return {};
      }

      return {
        color: styles.itemTextColor,
        backgroundColor: styles.itemBackgroundColor
      }
    });
  
    return {
      item: props.item,
      style,
      itemStyle,
      className: `ftr-timetable-item ftr-timetable-item__${variant}`,
      onItemClick
    }
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

      &:hover {
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.1);
      }
    }

    &__content {
      position: sticky;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__info {
      opacity: 0.8;
      font-size: 0.7rem;
      font-weight: normal;
    }
  }
</style>