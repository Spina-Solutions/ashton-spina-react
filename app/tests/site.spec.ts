import { describe, it, expect } from "vitest";
import { computeTimelineLayout, timelineTicks } from "../utils/timeline.js";
import { countryToGroupId } from "../content/travel.js";
import { readModeFromSearch } from "../hooks/useSiteMode.js";
import { stepAlbum } from "../hooks/usePhotoAlbums.js";
import { formatHelsinkiTime } from "../hooks/useHelsinkiTime.js";
import { hasCountryPhotos, type PhotoGroup } from "../utils/photography.js";
import { cefrStepsReached } from "../utils/cefr.js";
import { primaryLanguageFor } from "../content/spokenLanguages.js";
import { unvisitedRecommendations } from "../content/recommendations.js";

describe("computeTimelineLayout", () => {
  it("returns an empty layout for no spans", () => {
    expect(computeTimelineLayout([], 2026)).toEqual({ startYear: 2026, endYear: 2026, laneCount: 0, bars: [] });
  });

  it("places back-to-back spans in one lane with proportional widths", () => {
    const layout = computeTimelineLayout(
      [
        { startYear: 2000, endYear: 2010 },
        { startYear: 2010, endYear: 2020 },
      ],
      2026,
    );
    expect(layout.laneCount).toBe(1);
    expect(layout.bars).toEqual([
      { leftPct: 0, widthPct: 50, lane: 0 },
      { leftPct: 50, widthPct: 50, lane: 0 },
    ]);
  });

  it("moves an overlapping span to a second lane and back to the first when free", () => {
    const layout = computeTimelineLayout(
      [
        { startYear: 2015, endYear: 2019 },
        { startYear: 2017, endYear: 2018 },
        { startYear: 2019, endYear: 2021 },
      ],
      2026,
    );
    expect(layout.bars.map((b) => b.lane)).toEqual([0, 1, 0]);
    expect(layout.laneCount).toBe(2);
  });

  it("runs open-ended spans to nowYear", () => {
    const layout = computeTimelineLayout([{ startYear: 2021, endYear: null }], 2026);
    expect(layout.endYear).toBe(2026);
    expect(layout.bars[0].widthPct).toBe(100);
  });

  it("does not break on a span that has not started yet or ends before it starts", () => {
    const layout = computeTimelineLayout([{ startYear: 2030, endYear: null }], 2026);
    expect(layout.bars[0].widthPct).toBe(0);
    expect(layout.endYear).toBe(2031);
  });

  it("assigns lanes by start year even when input is unsorted", () => {
    const layout = computeTimelineLayout(
      [
        { startYear: 2017, endYear: 2018 },
        { startYear: 2015, endYear: 2019 },
      ],
      2026,
    );
    expect(layout.bars.map((b) => b.lane)).toEqual([1, 0]);
  });
});

describe("timelineTicks", () => {
  it("includes both ends and aligned interior years", () => {
    expect(timelineTicks(1995, 2026, 5)).toEqual([1995, 2000, 2005, 2010, 2015, 2020, 2026]);
  });

  it("drops a tick that would crowd the start label", () => {
    expect(timelineTicks(1999, 2010, 5)).toEqual([1999, 2005, 2010]);
  });

  it("handles a range shorter than a step", () => {
    expect(timelineTicks(2020, 2022, 5)).toEqual([2020, 2022]);
  });
});

describe("countryToGroupId", () => {
  it("maps Natural Earth names to album ids", () => {
    expect(countryToGroupId("Italy")).toBe("italy");
    expect(countryToGroupId("United States of America")).toBe("united_states");
    expect(countryToGroupId("Czechia")).toBe("czechia");
    expect(countryToGroupId("Vatican City")).toBe("vatican");
  });

  it("matches every album that exists", () => {
    for (const country of ["Italy", "Vietnam", "Malta", "Cambodia", "Croatia", "Finland", "Greece", "Ireland", "China", "Belgium", "Netherlands"]) {
      expect(hasCountryPhotos(countryToGroupId(country))).toBe(true);
    }
  });
});

describe("readModeFromSearch", () => {
  it("defaults to personal", () => {
    expect(readModeFromSearch("")).toBe("personal");
    expect(readModeFromSearch("?mode=nonsense")).toBe("personal");
  });

  it("reads work mode", () => {
    expect(readModeFromSearch("?foo=1&mode=work")).toBe("work");
  });
});

describe("stepAlbum", () => {
  const groups = ["a", "b", "c"].map((id) => ({ id, title: id, thumbnail: "", photos: [] })) as PhotoGroup[];

  it("wraps forwards and backwards", () => {
    expect(stepAlbum(groups, "c", 1)).toBe("a");
    expect(stepAlbum(groups, "a", -1)).toBe("c");
  });

  it("starts from the first album when the current id is unknown", () => {
    expect(stepAlbum(groups, "zzz", 1)).toBe("b");
  });

  it("returns empty for no albums", () => {
    expect(stepAlbum([], "a", 1)).toBe("");
  });
});

describe("formatHelsinkiTime", () => {
  it("formats in Helsinki time regardless of host timezone", () => {
    // 10:00 UTC in October is 13:00 in Helsinki (EEST, UTC+3)
    expect(formatHelsinkiTime(new Date("2026-10-22T10:00:00Z"))).toBe("13:00");
    // 10:00 UTC in January is 12:00 in Helsinki (EET, UTC+2)
    expect(formatHelsinkiTime(new Date("2026-01-15T10:00:00Z"))).toBe("12:00");
  });
});

describe("cefrStepsReached", () => {
  it("counts CEFR steps and fills all for native", () => {
    expect(cefrStepsReached("A1")).toBe(1);
    expect(cefrStepsReached("B2")).toBe(4);
    expect(cefrStepsReached("C2")).toBe(6);
    expect(cefrStepsReached("Native")).toBe(6);
  });
});

describe("primaryLanguageFor", () => {
  it("prefers the first listed language where several are spoken", () => {
    expect(primaryLanguageFor("Canada")?.name).toBe("English");
    expect(primaryLanguageFor("Switzerland")?.name).toBe("Italian");
  });

  it("returns null for countries with none of my languages", () => {
    expect(primaryLanguageFor("Japan")).toBeNull();
  });
});

describe("placeRecommendations", () => {
  it("only recommends places in countries I've visited", () => {
    expect(unvisitedRecommendations()).toEqual([]);
  });

  it("flags a place in an unvisited country", () => {
    expect(unvisitedRecommendations([{ title: "Kyoto", country: "Japan", description: "" }])).toEqual(["Kyoto"]);
  });
});
