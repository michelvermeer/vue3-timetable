# Vue 3 Timetable

A versatile, configurable and responsive timetable component for Vue 3.
Ideal for showing the agenda for locations on a specific date.

![Example](https://github.com/michelvermeer/vue3-timetable/blob/master/src/assets/vue3-timetable.png?raw=true)

## Installation

```
npm i vue3-timetable
```

## Usage example

```ts
<script lang="ts">
import { defineComponent } from 'vue';
import { TimeTable, type TimeTableItem, type TimeTableLocation } from 'vue3-timetable';

export default defineComponent({
    name: 'App',
    components: { TimeTable },
    setup() {
      const items: TimeTableItem[] = [
        {
          id: "e3",
          locationId: 2,
          startDate: `2024-07-09T14:00:00`,
          endDate: `2024-07-09T16:00:00`,
          name: "Surprise Event",
        }
      ];

      const locations: TimeTableLocation[] = [
        {
            id: 1,
            name: "Mainstage",
            items: [
              {
                id: "e1",
                startDate: `2024-07-09T08:00:00`,
                endDate: `2024-07-09T11:00:00`,
                name: "Main Event",
                info: "Don't miss it!",
                style: {
                  backgroundColor: "#999",
                  color: "#000",
                },
              },
            ],
          },
          {
            id: 2,
            name: "Playground",
            items: [
              {
                id: "e2",
                startDate: `2024-07-09T12:00:00`,
                endDate: `2024-07-09T17:00:00`,
                name: "Fun Time",
              },
            ],
          }
      ];

      return {
        items,
        locations,
      };
    },
  });
</script>

<template>
  <div class="timetable">
    <TimeTable variant="horizontal" :items="items" :locations="locations" />
  </div>
</template>
```

## API Reference

### TimeTable

Options

| Option          | Type                                                 | Required | Default    | Description                                                                                                                               |
| --------------- | ---------------------------------------------------- | -------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| locations       | [TimeTableLocation[]](#timetablelocation)            | yes      |            | The locations to show in the timetable                                                                                                    |
| items           | [TimeTableItem[]](#timetableitem)                    | no       | []         | The events to show in the timetable                                                                                                       |
| variant         | _string_                                             | no       | horizontal | The display style of the timetable. Can be `horizontal` or `vertical`. Defaults to vertical when unspecified and there is only 1 location |
| dates           | _string[]_                                           | no       |            | Predefined dates to choose from. The first date will be selected by default. The format needs to be `yyyy-MM-dd`                          |
| startingHour    | _number_                                             | no       | 6          | Starting hour of a day                                                                                                                    |
| numberOfHours   | _number_                                             | no       | 24         | Number of hours to display for a single day                                                                                               |
| styles          | [TimeTableStyles](#timetablestyles)                  | no       |            | Custom styling to apply to the timetable                                                                                                  |
| onItemClick     | _function(item: `TimeTableRenderedItem<T>`) => void_ | no       |            | Callback function when an item is clicked                                                                                                 |
| onLocationClick | _function(item: `TimeTableLocation`) => void_        | no       |            | Callback function when a location is clicked                                                                                              |

### TimeTableLocation

Options

| Option | Type                                        | Required | Default | Description                   |
| ------ | ------------------------------------------- | -------- | ------- | ----------------------------- |
| id     | _string_ / _number_                         | yes      |         | Location ID                   |
| name   | _string_                                    | yes      |         | Location name                 |
| items  | [TimeTableItem[]](#timetableitem)           | no       |         | Event items for the location  |
| style  | [CustomCSSProperties](#customcssproperties) | no       |         | Custom style for the location |

### TimeTableItem

Options

| Option    | Type                                        | Required | Default | Description                               |
| --------- | ------------------------------------------- | -------- | ------- | ----------------------------------------- |
| id        | _string_ / _number_                         | yes      |         | Item ID                                   |
| name      | _string_                                    | yes      |         | Item name                                 |
| info      | _string_                                    | no       |         | Item extra information                    |
| startDate | _Date_ / _string_                           | yes      |         | Item start date                           |
| endDate   | _Date_ / _string_                           | yes      |         | Item end date                             |
| data      | _{}_                                        | no       |         | Optional extra data. Useful for callbacks |
| style     | [CustomCSSProperties](#customcssproperties) | no       |         | Custom style for the item                 |

### TimeTableStyles

Options

| Option                  | Type     | Default           | Description                                                       |
| ----------------------- | -------- | ----------------- | ----------------------------------------------------------------- |
| backgroundColor         | _string_ | #1f2937           | Background color                                                  |
| borderStyle             | _string_ | solid 2px #374151 | CSS Border style, specify "none" to remove borderStyle            |
| dateBackgroundColor     | _string_ | #1f2937           | Background color of the date and hours. Avoid using "transparent" |
| itemBackgroundColor     | _string_ | #304151           | Background color of an item                                       |
| itemTextColor           | _string_ | inherit           | Text color of an item                                             |
| locationBackgroundColor | _string_ | #000              | Background color of a location                                    |
| locationTextColor       | _string_ | inherit           | Text color of a location                                          |
| textColor               | _string_ | #fff              | General text color used in the timetable                          |
| timeMarkerColor         | _string_ | #666              | Color of the current time indicator                               |

### CustomCSSProperties

Options

| Option          | Example                               | Description      |
| --------------- | ------------------------------------- | ---------------- |
| background      | #1f2937                               | Background       |
| backgroundColor | red                                   | Background color |
| border          | solid 2px #000                        | Border style     |
| boxShadow       | inset 0 0 5px 5px #000                | Box shadow       |
| color           | blue                                  | Text color       |
| font            | italic small-caps bold 16px/2 cursive | Font properties  |
| fontWeight      | bold                                  | Font weight      |
| fontSize        | 14px                                  | Font size        |
| fontFamily      | Arial, sans-serif                     | Font family      |
| fontStyle       | italic                                | Font style       |
| opacity         | 0.8                                   | Opacity          |
