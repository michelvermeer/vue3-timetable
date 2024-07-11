import type { TimeTableItem } from "../types";
import { addHours, startOfDay } from "date-fns";

export const useItemsInRange = (
  items: TimeTableItem[],
  startingHour: number,
  numberOfHours: number,
  date?: string
) => {
  const itemsInRange: TimeTableItem[] = [];

  if (!items?.length || !date) {
    return itemsInRange;
  }

  const start = addHours(startOfDay(new Date(date)), startingHour);
  const end = addHours(start, numberOfHours);

  for (const i of items) {
    if (new Date(i.startDate) >= start && new Date(i.startDate) <= end) {
      itemsInRange.push(i);
    }
  }

  return itemsInRange.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
};
