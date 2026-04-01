import { geoNaturalEarth1, geoPath, geoCentroid } from "d3-geo";
import { select } from "d3-selection";
import { feature } from "topojson-client";
import { useEffect, useMemo, useRef, useState, Suspense, lazy } from "react";
import { scaleSqrt } from "d3-scale";
import "d3-transition";
import { useEra } from "../../context/EraContext";
import type { FeatureCollection, Geometry, Feature } from "geojson";
import { useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import type { Post } from "../../generated/graphql";
import { AnimatePresence } from "framer-motion";
import groupColor from "./MapColour";
import type { Continent } from "./MapColour";

const PostModal = lazy(() => import("../modal/PostModal"));

type Props = {
  civilisations: {
    id: string;
    name: string;
    country: { name: string; continent: string };
    startYear: number;
    endYear: number;
    startSignificance: number;
    group?: { id: number } | null;
  }[];
  onClick?: () => void;
  isInteractive?: boolean;
};

let cachedWorld: FeatureCollection<Geometry, { name: string }> | null = null;

export default function WorldMap({
  civilisations,
  onClick,
  isInteractive,
}: Props) {
  const { dataStartYear } = useEra();
  const queryClient = useQueryClient();

  const [openPost, setOpenPost] = useState<Post | null>(null);
  const [worldDataLoaded, setWorldDataLoaded] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const width = 320;
  const height = 180;

  const projection = useMemo(() => geoNaturalEarth1(), []);
  const path = useMemo(() => geoPath(projection), [projection]);

  const activeCivilisations = useMemo(
    () =>
      civilisations.filter(
        (c) => c.startYear <= dataStartYear && c.endYear >= dataStartYear,
      ),
    [civilisations, dataStartYear],
  );

  const countryMap = useMemo(() => {
    const map = new Map<string, any>();

    activeCivilisations.forEach((c) => {
      const key = c.country.name.trim().toLowerCase();

      if (!map.has(key)) {
        map.set(key, {
          civs: [],
          totalSignificance: 0,
          groupId: c.group?.id ?? null,
          country: {
            name: c.country.name,
            continent: c.country.continent as Continent,
          },
        });
      }

      const entry = map.get(key)!;
      entry.civs.push(c);
      entry.totalSignificance += c.startSignificance;
    });

    return map;
  }, [activeCivilisations]);

  const groupColors = useMemo(() => {
    const map = new Map<number, string>();
    for (const civ of activeCivilisations) {
      if (civ.group?.id != null && !map.has(civ.group.id)) {
        map.set(
          civ.group.id,
          groupColor(civ.group.id, civ.country.continent as Continent),
        );
      }
    }
    return map;
  }, [activeCivilisations]);

  /** Dot scaling tied to map size */
  const radiusScale = useMemo(
    () => scaleSqrt().domain([0, 3]).range([1.5, 6]).clamp(true),
    [],
  );

  /** Load world */
  useEffect(() => {
    let cancelled = false;

    const loadWorld = async () => {
      if (!cachedWorld) {
        const mod = await import("./world-110m.json");
        const topology = (mod as any).default ?? mod;
        const fcUnknown = feature(
          topology,
          topology.objects.countries,
        ) as unknown;

        if ((fcUnknown as any).type !== "FeatureCollection") return;

        cachedWorld = fcUnknown as FeatureCollection<
          Geometry,
          { name: string }
        >;
      }

      if (!cancelled) setWorldDataLoaded(true);
    };

    loadWorld();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Draw map */
  useEffect(() => {
    if (!svgRef.current || !cachedWorld || !worldDataLoaded) return;

    const svg = select(svgRef.current);

    projection.fitSize([width, height], cachedWorld);

    if (svg.select(".map-paths").empty()) {
      svg
        .append("g")
        .classed("map-paths", true)
        .selectAll("path")
        .data(cachedWorld.features)
        .join("path")
        .attr("d", path as any)
        .attr("fill", "oklch(55.3% 0.013 58.071)")
        .attr("stroke", "oklch(26.8% 0.007 34.298)")
        .attr("stroke-width", 0.3);
    }
  }, [worldDataLoaded]);

  /** Draw dots */
  useEffect(() => {
    if (!svgRef.current || !cachedWorld || !worldDataLoaded) return;

    const svg = select(svgRef.current);

    let dotsG = svg.select<SVGGElement>(".dots");
    if (dotsG.empty()) dotsG = svg.append("g").classed("dots", true);

    const filtered = cachedWorld.features.filter((d) =>
      countryMap.has(d.properties.name.trim().toLowerCase()),
    );

    // Bind data
    // Bind data
    const circles = dotsG
      .selectAll<
        SVGCircleElement,
        Feature<Geometry, { name: string }>
      >("circle")
      .data(filtered, (d: any) => d.properties.name);

    // EXIT: fade and shrink
    circles
      .exit()
      .transition()
      .duration(300)
      .attr("r", 0)
      .attr("opacity", 0)
      .remove();

    // ENTER: new circles
    const enterCircles = circles
      .enter()
      .append("circle")
      .attr("cx", (d) => projection(geoCentroid(d))?.[0] ?? 0)
      .attr("cy", (d) => projection(geoCentroid(d))?.[1] ?? 0)
      .attr("r", 0)
      .attr("opacity", 0)
      .attr("fill", (d) => {
        const entry = countryMap.get(d.properties.name.trim().toLowerCase());
        return entry?.groupId
          ? (groupColors.get(entry.groupId) ?? "#adb7adff")
          : "#adb7adff";
      });

    // MERGE enter + update and transition all
    enterCircles
      .merge(circles)
      .transition()
      .duration(300)
      .attr("cx", (d) => projection(geoCentroid(d))?.[0] ?? 0)
      .attr("cy", (d) => projection(geoCentroid(d))?.[1] ?? 0)
      .attr("r", (d) => {
        const entry = countryMap.get(d.properties.name.trim().toLowerCase());
        return entry
          ? radiusScale(entry.totalSignificance * entry.civs.length)
          : 1.5;
      })
      .attr("fill", (d) => {
        const entry = countryMap.get(d.properties.name.trim().toLowerCase());
        return entry?.groupId
          ? (groupColors.get(entry.groupId) ?? "#adb7adff")
          : "#adb7adff";
      })
      .attr("opacity", 0.7);

    // Tooltip & click logic (same as before)
    dotsG
      .selectAll("circle")
      .on("mouseenter", (_e, d: any) => {
        const entry = countryMap.get(d.properties.name.trim().toLowerCase());
        if (!entry) return;

        select(tooltipRef.current)
          .style("display", "block")
          .html(
            `<strong>${d.properties.name}</strong><br/>${entry.civs
              .map((c: any) => c.name)
              .join("<br/>")}`,
          )
          .style("opacity", 0)
          .transition()
          .duration(200)
          .style("opacity", 1);
      })
      .on("mousemove", (event) => {
        if (!tooltipRef.current || !svgRef.current) return;

        const rect = svgRef.current.getBoundingClientRect();
        tooltipRef.current.style.left = `${event.clientX - rect.left + 10}px`;
        tooltipRef.current.style.top = `${event.clientY - rect.top + 10}px`;
      })
      .on("mouseleave", () => {
        select(tooltipRef.current).style("display", "none");
      })
      .on("click", function (event, d: any) {
        const entry = countryMap.get(d.properties.name.trim().toLowerCase());

        if (!isInteractive) {
          onClick?.();
          return;
        }

        event.stopPropagation();

        if (!entry?.civs.length) return;

        const queries = queryClient.getQueriesData<
          InfiniteData<{ posts: Post[] }>
        >({
          queryKey: ["timeline"],
        });

        for (const [, data] of queries) {
          if (!data) continue;
          for (const page of data.pages) {
            const post = page.posts.find((p) => p.id === entry.civs[0].id);
            if (post) {
              setOpenPost(post);
              return;
            }
          }
        }
      })
      .style("cursor", isInteractive ? "pointer" : "default");
  }, [countryMap, groupColors, worldDataLoaded]);

  return (
    <>
      <div
        className="relative w-full"
        onClick={onClick}
        style={{
          cursor: isInteractive ? "default" : "pointer",
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
        />

        <div
          ref={tooltipRef}
          className={`${isInteractive ? "text-lg" : "text-sm" } absolute pointer-events-none bg-base-100 text-white rounded px-2 py-1 hidden z-10`}
        />
      </div>

      <AnimatePresence>
        {openPost && (
          <Suspense fallback={null}>
            <PostModal open post={openPost} onClose={() => setOpenPost(null)} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
}
