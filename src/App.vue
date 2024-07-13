<template>
  <div class="app">
    <div class="page">
      <h3>Horizontal</h3>
      <TimeTable variant="horizontal" :styles="styles" :onItemClick="onItemClick" :onLocationClick="onLocationClick" :startingHour="startingHour" :numberOfHours="numberOfHours" :items="items" :locations="locations" />
      <h3>Vertical</h3>
      <div class="vertical">
        <TimeTable variant="vertical" :styles="styles2" :dateFormat="dateFormat" :onItemClick="onItemClick" :onLocationClick="onLocationClick" :locations="locationsB" :startingHour="8" :numberOfHours="12" />
      </div>
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
        dateBackgroundColor: '#15192D',
        borderStyle: 'solid 2px rgba(255, 255, 255, 0.2)',
        // datePickerBackgroundColor: '#15192D',
        itemBackgroundColor: 'lightgray',
        itemTextColor: 'black',
        locationBackgroundColor: 'lightgray',
        locationTextColor: 'black',
        dateTextColor: '#bbb',
      };

      const styles2: TimeTableStyles = {
        dateBackgroundColor: 'linear-gradient(to right, #15192D, #292e44)',
        backgroundColor: '#292e44',
        datePickerBackgroundColor: 'linear-gradient(to right, #15192D, #292e44)',
        borderStyle: 'solid 2px rgba(255, 255, 255, 0.05)'
      };

      return {
        startingHour: 6,
        numberOfHours: 24,
        items: timetableMockItems,
        locations: timetableMockLocations,
        locationsB: timetableMockLocationsB,
        dateFormat: 'eeee do',
        styles,
        styles2
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
    background-color: #15192d;
    flex-direction: column;
    min-height: 100%;
    align-items: center;
    font-family: Tahoma, sans-serif;
  
    .page {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: 100%;
      width: 100%;
      max-width: 800px;
    }

    h3 { 
      margin: 0; 
      padding: 15px 0 10px 0;
      text-align: center;
      // background-color: #444;
      // border-bottom: solid 2px #888;
    }

    .vertical {
      // flex: 1;
      height: 780px;
    }
  }
</style>