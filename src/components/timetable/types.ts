import { type CSSProperties } from "vue";

type CustomCSSProperties = Pick<
  CSSProperties,
  | "background"
  | "backgroundColor"
  | "border"
  | "boxShadow"
  | "color"
  | "font"
  | "fontWeight"
  | "fontSize"
  | "fontFamily"
  | "fontStyle"
  | "opacity"
>;

export interface TimeTableStyles {
  backgroundColor?: string;
  borderStyle?: string;
  dateBackgroundColor?: string;
  dateTextColor?: string;
  datePickerBackgroundColor?: string;
  itemBackgroundColor?: string;
  itemTextColor?: string;
  locationBackgroundColor?: string;
  locationTextColor?: string;
  textColor?: string;
  timeMarkerColor?: string;
}

export interface TimeTable {
  locations: TimeTableLocation[];
  items?: TimeTableItem[];
  variant?: "horizontal" | "vertical";
  startingHour?: number;
  dates?: string[];
  numberOfHours?: number;
  styles?: TimeTableStyles;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onItemClick?: (item: TimeTableRenderedItem<any>) => void;
  onLocationClick?: (location: TimeTableLocation) => void;
  onDateChange?: (date: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderItem?: (item: TimeTableRenderedItem<any>) => HTMLElement;
}

export interface TimeTableItem {
  id: string | number;
  name: string;
  info?: string;
  startDate: Date | string;
  endDate: Date | string;
  locationId?: string | number;
  data?: Record<string, unknown>;
  style?: CustomCSSProperties;
  className?: string;
  cancelled?: boolean;
}

export interface itemsWithIntersections {
  item: TimeTableItem;
  start: number;
  end: number;
  intersections: number;
  offset: number;
  index: number;
  with: number[];
}

export interface TimeTableRenderedItem<T> extends Omit<TimeTableItem, "data"> {
  data?: T;
}

export interface TimeTableLocation {
  id: string | number;
  name: string;
  items?: TimeTableItem[];
  style?: CustomCSSProperties;
  className?: string;
}

export interface TimeTableView {
  dateChange: (date: string) => void;
  locations: TimeTableLocation[];
  dates: string[];
  hours: TimeTableHour[];
  selectedDate: string;
}

export interface TimeTableHour {
  hour: number;
  display: string;
}
