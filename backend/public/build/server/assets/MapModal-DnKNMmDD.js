import { jsxs, jsx } from "react/jsx-runtime";
import { M as ModalShell, a as ModalCloseButton } from "./ModalCloseButton-DyJv_YGM.js";
import { W as WorldMap } from "./server-build-FJRFwkCb.js";
import "react";
import "framer-motion";
import "react-dom";
import "node:stream";
import "@react-router/node";
import "react-router";
import "isbot";
import "react-dom/server";
import "@tanstack/react-query";
import "axios";
import "react-icons/gi";
import "graphql-request";
import "d3-geo";
import "d3-selection";
import "topojson-client";
import "d3-scale";
import "d3-transition";
import "react-icons/fa";
import "react-icons/lu";
import "react-icons/md";
import "masonic";
import "zod";
import "react-icons/io";
function MapModal({ open, onClose, civilisations }) {
  return /* @__PURE__ */ jsxs(
    ModalShell,
    {
      open,
      onClose,
      panelClassName: "max-w-5xl p-1 sm:p-3",
      children: [
        /* @__PURE__ */ jsx(ModalCloseButton, { onClose }),
        /* @__PURE__ */ jsx("div", { className: "aspect-[16/9] w-full mx-auto", children: /* @__PURE__ */ jsx(WorldMap, { civilisations, isInteractive: true }) })
      ]
    }
  );
}
export {
  MapModal as default
};
