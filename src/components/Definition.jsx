import {
  Button,
  DialogTrigger,
  OverlayArrow,
  Popover,
} from "react-aria-components";

import { Tooltip, TooltipTrigger } from "@/ui/tooltip";

// ------------------------------------------------------------
// Shared styles
// ------------------------------------------------------------

const triggerClassName = `
  inline
  cursor-help
  appearance-none
  border-0
  bg-transparent
  p-0
  font-inherit
  text-inherit
  hover:text-link-hover
  transition
  underline
  decoration-dotted
  underline-offset-4
`;

const panelClassName = `
  relative
  z-50
  inline-flex
  w-fit
  max-w-xs
  items-center
  gap-1.5
  rounded-sm
  border
  border-text
  bg-surface
  px-3
  py-2
  body-small
  shadow-none

  data-entering:animate-in
  data-entering:fade-in-0
  data-exiting:animate-out
  data-exiting:fade-out-0
`;

// ------------------------------------------------------------
// Arrow
//
// A rotated square sits behind the panel. The panel covers the
// top half, leaving the lower half visible as a triangle.
// ------------------------------------------------------------

function DefinitionArrow() {
  return (
    <OverlayArrow
      className="
        z-0
        size-2.5
        rotate-45
        rounded-[2px]
        border
        border-text
        bg-surface
      "
    />
  );
}

// ------------------------------------------------------------
// Definition
//
// Desktop:
//   TooltipTrigger → hover / keyboard focus
//
// Touch:
//   DialogTrigger + Popover → tap / keyboard press
// ------------------------------------------------------------

export default function Definition({ term, description }) {
  return (
    <>
      {/* ======================================================
          DESKTOP / HOVER
      ====================================================== */}

      <span className="definition-desktop">
        <TooltipTrigger delay={100}>
          <button type="button" className={triggerClassName}>
            {term}
          </button>

          <Tooltip placement="top" offset={4} className={panelClassName}>
            <p>{description}</p>
          </Tooltip>
        </TooltipTrigger>
      </span>

      {/* ======================================================
    TOUCH / TAP
====================================================== */}

      <span className="definition-touch">
        <DialogTrigger>
          <Button className={triggerClassName}>{term}</Button>

          <Popover
            placement="top"
            offset={4}
            aria-label={`${term} definition`}
            className={panelClassName}
          >
            <p>{description}</p>

            <OverlayArrow>
              <div className="relative">
                {/* Outer border */}
                <div
                  className="
        absolute
        left-1/2
        top-0
        -translate-x-1/2
        size-0
        border-l-[7px]
        border-r-[7px]
        border-l-transparent
        border-r-transparent
        border-t-[7px]
        border-t-text
      "
                />

                {/* Inner fill */}
                <div
                  className="
        absolute
        left-1/2
        top-0
        -translate-x-1/2
        translate-y-[-1px]
        size-0
        border-l-[7px]
        border-r-[7px]
        border-l-transparent
        border-r-transparent
        border-t-[7px]
        border-t-surface
      "
                />
              </div>
            </OverlayArrow>
          </Popover>
        </DialogTrigger>
      </span>
    </>
  );
}
