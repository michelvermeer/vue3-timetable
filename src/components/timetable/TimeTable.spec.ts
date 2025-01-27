import { mount } from "@vue/test-utils";
import TimeTable from "./TimeTable.vue";
import { describe, expect, it } from "vitest";
import { timetableMockLocations } from "./mocks/mockData";
import { format } from "date-fns";

function mountComponent() {
  const wrapper = mount(TimeTable, {
    props: { variant: "horizontal", locations: timetableMockLocations },
  });
  return wrapper;
}

describe("TimeTable", () => {
  const cmp = mountComponent();

  it("Mounts properly", async () => {
    expect(cmp).toBeTruthy();
  });

  it("Has the correct number of locations", () => {
    const locations = cmp.findAll(".ftr-timetable-location");
    expect(locations.length).toBe(timetableMockLocations.length);
  });

  it("Shows items", () => {
    const items = cmp.findAll(".ftr-timetable-item");
    expect(items.length).toBeGreaterThan(0);
  });

  it("Shows the main event", () => {
    const item = cmp.find(".ftr-timetable-item[data-item-id='e1']");
    expect(item).toBeTruthy();
    expect(item.text()).toContain("Main Event");
    expect(item.attributes().style).toContain("width: 240px;");
  });

  it("Has the correct initial selected date value", () => {
    const dt = format(new Date(), "yyyy-MM-dd");
    const el = cmp.find<HTMLSelectElement>(
      ".ftr-timetable-datetime__select select"
    );
    expect(el.element.value).toBe(dt);
  });
});
