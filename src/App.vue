<template>
  <div class="app">
    <div class="page">
      <h3>Horizontal</h3>
      <TimeTable variant="horizontal" :styles="styles" :onDateChange="onDateChange" :dates="dates" :onItemClick="onItemClick" :onLocationClick="onLocationClick" :startingHour="startingHour" :numberOfHours="numberOfHours" :items="items" :locations="locations" />
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
  import type { TimeTableItem, TimeTableLocation, TimeTableRenderedItem, TimeTableStyles } from './components/timetable/types';
  import { addDays, format } from 'date-fns';

  interface EventData {
    type?: string;
    category?: string;
    isFree?: boolean;
  }

  export default defineComponent({
    name: 'App',
    components: { TimeTable },
    data() {
      const dates = [format(new Date(), 'yyyy-MM-dd'), format(addDays(new Date(), 1), 'yyyy-MM-dd'), format(addDays(new Date(), 2), 'yyyy-MM-dd')];
      const styles: TimeTableStyles = {
        backgroundColor: 'silver',
        dateBackgroundColor: '#15192D',
        borderStyle: 'solid 2px rgba(255, 255, 255, 0.2)',
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
        dates,
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
      onItemClick(item: TimeTableRenderedItem<EventData>) {
        console.log('onItemClick', `Category: ${item.data?.category || '-'}`, item);
      },
      onLocationClick(loc: TimeTableLocation) {
        console.log('onLocationClick', loc);
      },
      onDateChange(date: string) {
        const dt = format(addDays(new Date(), 2), 'yyyy-MM-dd');
        console.log('onDateChange', date);
        if (dt === date) {
          setTimeout(() => {
            if (!this.items.find((item: TimeTableItem) => item.id === 'new-item')) {
              const item: TimeTableItem = {
                id: 'new-item',
                locationId: 1,
                name: 'Async loaded item',
                info: 'This item was loaded asynchronously',
                startDate: `${dt}T09:00:00`,
                endDate: `${dt}T16:00:00`,
                style: {
                  backgroundColor: 'lightgreen',
                  color: 'black',
                }
              };
              this.items.push(item);
            }

            if (!this.locations.find((loc: TimeTableLocation) => loc.id === 'new-location')) {
              const location: TimeTableLocation = {
                id: 'new-location',
                name: 'Async loaded location',
                style: {
                  backgroundColor: 'lightgreen',
                  color: 'black',
                },
                items: [
                  {
                    id: 'new-item2',
                    name: 'Hello world',
                    startDate: `${dt}T10:00:00`,
                    endDate: `${dt}T14:00:00`,
                    style: {
                      backgroundColor: 'lightgreen',
                      color: 'black',
                    }
                  }
                ]
              };
              this.locations.push(location);
            }
          }, 1000);
        }
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
    }

    .vertical {
      // flex: 1;
      height: 780px;
    }
  }
</style>