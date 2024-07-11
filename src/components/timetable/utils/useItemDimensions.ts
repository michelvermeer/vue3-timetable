import {
  addHours,
  differenceInDays,
  differenceInMinutes,
  startOfDay,
  subDays,
} from "date-fns";
import type { TimeTableItem } from "../types";

export const useItemDimensions = (
  item: TimeTableItem,
  startingHour: number,
  numberOfHours: number,
  selectedDate: string
) => {
  const diffDays = differenceInDays(
    new Date(item.startDate),
    new Date(selectedDate)
  );

  const dayStart = subDays(
    addHours(startOfDay(new Date(item.startDate)), startingHour),
    diffDays
  );

  const itemStartOffset = differenceInMinutes(
    new Date(item.startDate),
    dayStart
  );

  const durationMinutes = differenceInMinutes(
    new Date(item.endDate),
    new Date(item.startDate)
  );

  const itemSize = Math.min(
    durationMinutes,
    numberOfHours * 60 - itemStartOffset
  );

  return {
    itemStartOffset,
    itemSize,
  };
};
