import type { TimeTableItem } from "../types";
import { addDays, differenceInDays, format } from "date-fns";

export const useTimetableDates = (
  items: TimeTableItem[],
  customDates?: string[]
) => {
  if (customDates) {
    return customDates;
  }

  const itemDates = items
    .flatMap((item) => {
      const itemDates: number[] = [];
      if (item.startDate) {
        itemDates.push(new Date(item.startDate).getTime());
      }
      if (item.endDate) {
        itemDates.push(new Date(item.endDate).getTime());
      }
      return itemDates;
    })
    .sort();

  if (!itemDates.length) {
    return [];
  }

  const firstDate = itemDates[0];
  const lastDate = itemDates[itemDates.length - 1];
  const days = differenceInDays(lastDate, firstDate);
  const dates: string[] = [];

  for (let i = 0; i <= days; i++) {
    const dateString = format(addDays(new Date(firstDate), i), "yyyy-MM-dd");
    dates.push(dateString);
  }

  return dates;
};
