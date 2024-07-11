import type { TimeTableItem, itemsWithIntersections } from "../types";

export const useItemIntersections = (items: TimeTableItem[]) => {
  const intersectingItems = items.reduce((acc, item, i) => {
    const start = new Date(item.startDate).getTime();
    const end = new Date(item.endDate).getTime();
    let offset = 0;
    const intersections = acc.filter(
      (existingItem) =>
        (start >= existingItem.start && start < existingItem.end) ||
        (end >= existingItem.start && end < existingItem.end)
    );
    for (const existingItem of intersections) {
      if (existingItem.offset > 0) {
        offset--;
        break;
      }

      if (existingItem.intersections === 0) {
        existingItem.intersections += 1;
        continue;
      }
      for (const existingItemintersection of acc.filter((item) =>
        existingItem.with.includes(item.index)
      )) {
        if (
          (start >= existingItemintersection.start &&
            start < existingItemintersection.end) ||
          (end >= existingItemintersection.start &&
            end < existingItemintersection.end)
        ) {
          existingItem.intersections += 1;
        }
      }
    }

    return [
      ...acc,
      {
        item,
        start,
        end,
        offset: intersections.length + offset,
        intersections: intersections.length,
        index: i,
        with: intersections.map((item) => item.index),
      },
    ];
  }, [] as itemsWithIntersections[]);

  return intersectingItems;
};
