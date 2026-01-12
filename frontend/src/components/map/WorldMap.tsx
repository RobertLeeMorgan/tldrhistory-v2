import { geoNaturalEarth1, geoPath, geoCentroid } from "d3-geo";
import { select } from "d3-selection";
import { feature } from "topojson-client";
import { useEffect, useMemo, useRef, useState, Suspense, lazy } from "react";
import { scaleSqrt } from "d3-scale";
import "d3-transition";
import { useEra } from "../../context/EraContext";
import type { FeatureCollection, Geometry } from "geojson";
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
};

let cachedWorld: FeatureCollection<Geometry, { name: string }> | null = null;

export default function WorldMap({ civilisations }: Props) {
  const { dataStartYear } = useEra();
  const queryClient = useQueryClient();
  const [openPost, setOpenPost] = useState<Post | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const width = 320;
  const height = 180;

  const projection = useMemo(() => geoNaturalEarth1(), []);
  const path = useMemo(() => geoPath(projection), [projection]);

  const activeCivilisations = useMemo(
    () =>
      civilisations.filter(
        (c) => c.startYear <= dataStartYear && c.endYear >= dataStartYear
      ),
    [civilisations, dataStartYear]
  );

  const countryMap = useMemo(() => {
    const map = new Map<
      string,
      {
        civs: typeof activeCivilisations;
        totalSignificance: number;
        groupId: number | null;
        country?: { name: string; continent: Continent };
      }
    >();

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
          groupColor(civ.group.id, civ.country.continent as Continent)
        );
      }
    }
    return map;
  }, [activeCivilisations]);

  const radiusScale = useMemo(
    () => scaleSqrt().domain([0, 3]).range([1.5, 6]).clamp(true),
    []
  );

  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;

    let cancelled = false;

    const loadMap = async () => {
      if (!cachedWorld) {
        const mod = await import("./world-110m.json");
        const topology = (mod as any).default ?? mod;

        const fcUnknown = feature(
          topology,
          topology.objects.countries
        ) as unknown;

        if ((fcUnknown as any).type !== "FeatureCollection") return;

        cachedWorld = fcUnknown as FeatureCollection<
          Geometry,
          { name: string }
        >;
      }

      if (cancelled || !cachedWorld) return;

      const countries = cachedWorld.features;
      projection.fitSize([width, height], cachedWorld);

      const svg = select(svgRef.current);

      if (svg.select(".map-paths").empty()) {
        svg
          .append("g")
          .classed("map-paths", true)
          .selectAll("path")
          .data(countries)
          .join("path")
          .attr("d", path as any)
          .attr("fill", "#42454a")
          .attr("stroke", "#24242d")
          .attr("stroke-width", 0.3);
      }

      let dotsG = svg.select<SVGGElement>(".dots");
      if (dotsG.empty()) dotsG = svg.append("g").classed("dots", true);

      const filteredCountries = countries.filter((d) =>
        countryMap.has(d.properties.name.trim().toLowerCase())
      );

      const circles = dotsG
        .selectAll("circle")
        .data(filteredCountries, (d: any) => d.properties.name);

      circles
        .join("circle")
        .attr("cx", (d) => projection(geoCentroid(d))?.[0] ?? 0)
        .attr("cy", (d) => projection(geoCentroid(d))?.[1] ?? 0)
        .attr("opacity", 0.7)
        .transition()
        .duration(300)
        .attr("fill", (d) => {
          const entry = countryMap.get(d.properties.name.trim().toLowerCase());
          if (!entry?.groupId) return "#adb7adff";
          return groupColors.get(entry.groupId) ?? "#adb7adff";
        })
        .attr("r", (d) => {
          const entry = countryMap.get(d.properties.name.trim().toLowerCase());
          return entry
            ? radiusScale(entry.totalSignificance * entry.civs.length)
            : 1.5;
        });

      dotsG
        .selectAll("circle")
        .on("mouseenter", (event, d: any) => {
          event;
          const entry = countryMap.get(d.properties.name.trim().toLowerCase());
          if (!entry) return;
          select(tooltipRef.current)
            .style("display", "block")
            .html(
              `<strong>${d.properties.name}</strong><br/>${entry.civs
                .map((c) => c.name)
                .join("<br/>")}`
            );
        })
        .on("mousemove", (event) => {
          if (!tooltipRef.current || !svgRef.current) return;
          const svgRect = svgRef.current.getBoundingClientRect();
          const tooltipEl = tooltipRef.current;
          const x = event.clientX - svgRect.left + 10;
          const y = event.clientY - svgRect.top + 10;
          const maxX = svgRect.width - tooltipEl.offsetWidth - 6;
          const maxY = svgRect.height - tooltipEl.offsetHeight - 6;
          tooltipEl.style.left = `${Math.max(4, Math.min(x, maxX))}px`;
          tooltipEl.style.top = `${Math.max(4, Math.min(y, maxY))}px`;
        })
        .on("mouseleave", () => {
          select(tooltipRef.current).style("display", "none");
        })
        .on("click", (_, d: any) => {
          const entry = countryMap.get(d.properties.name.trim().toLowerCase());
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
        });
    };

    loadMap();
    return () => {
      cancelled = true;
    };
  }, [countryMap, projection, path, radiusScale, queryClient, groupColors]);

  return (
    <>
      <div className="relative w-full max-w-md mx-auto">
        <svg
          ref={svgRef}
          width="100%"
          viewBox={`0 0 ${width} ${height}`}
          className="rounded-lg max-h-48"
        />
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none bg-base-100 text-white text-xs rounded px-2 py-1 hidden z-10"
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
