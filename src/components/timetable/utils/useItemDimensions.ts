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

  const itemStart = new Date(
    Math.max(new Date(item.startDate).getTime(), new Date(dayStart).getTime())
  );

  const itemStartOffset = differenceInMinutes(itemStart, dayStart);

  const durationMinutes = differenceInMinutes(
    new Date(item.endDate),
    itemStart
  );

  const itemSize = Math.min(
    durationMinutes,
    numberOfHours * 60 - itemStartOffset
  );

  return {
    itemStartOffset,
    itemSize,
    cutoffStart: new Date(item.startDate).getTime() < dayStart.getTime(),
    cutoffEnd:
      new Date(item.endDate).getTime() >
      addHours(dayStart, numberOfHours).getTime(),
  };
};
