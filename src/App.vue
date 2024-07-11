<template>
  <div class="app">
    <h3>Horizontal</h3>
    <TimeTable variant="horizontal" :styles="styles" :onItemClick="onItemClick" :onLocationClick="onLocationClick" :startingHour="startingHour" :numberOfHours="numberOfHours" :items="items" :locations="locations" />
    <h3>Vertical</h3>
    <div class="vertical">
      <TimeTable variant="vertical" :onItemClick="onItemClick" :onLocationClick="onLocationClick" :locations="locationsB" :startingHour="7" :numberOfHours="17" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import TimeTable from './components/timetable/TimeTable.vue';
  import { timetableMockItems, timetableMockLocations, timetableMockLocationsB } from './components/timetable/mocks/mockData';
  import type { TimeTableItem, TimeTableLocation, TimeTableStyles } from './components/timetable/types';

  export default defineComponent({
    name: 'App',
    components: { TimeTable },
    data() {
      const styles: TimeTableStyles = {
        backgroundColor: 'silver',
        dateBackgroundColor: 'black',
        borderStyle: 'dashed 1px #1d5741',
        itemBackgroundColor: 'lightgray',
        itemTextColor: 'black',
        locationBackgroundColor: 'lightgray',
        locationTextColor: 'black',
      };

      return {
        startingHour: 6,
        numberOfHours: 24,
        items: timetableMockItems,
        locations: timetableMockLocations,
        locationsB: timetableMockLocationsB,
        styles
      }
    },
    methods: {
      onItemClick(item: TimeTableItem) {
        console.log('onItemClick', item);
      },
      onLocationClick(loc: TimeTableLocation) {
        console.log('onLocationClick', loc);
      }
    }
  });
</script>

<style lang="scss" scoped>
  .app {
    display: flex;
    flex: 1;
    background-color: #000;
    flex-direction: column;
    min-height: 100%;
  
    h3 { 
      margin: 0; 
      padding: 10px 0;
      text-align: center;
      background-color: #444;
      border-bottom: solid 2px #888;
    }

    .vertical {
      flex: 1;
    }
  }
</style>