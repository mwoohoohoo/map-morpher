import * as React from "react";
import { cn } from "cn";
import {
  Focusable,
  OverlayArrow,
  Tooltip as TooltipPrimitive,
  TooltipTrigger as TooltipTriggerPrimitive,
} from "react-aria-components";

function TooltipTrigger({ delay = 0, children, ...props }) {
  const [trigger, tooltip] = React.Children.toArray(children);

  return (
    <TooltipTriggerPrimitive
      data-slot="tooltip-trigger"
      delay={delay}
      {...props}
    >
      <Focusable>{trigger}</Focusable>
      {tooltip}
    </TooltipTriggerPrimitive>
  );
}

function Tooltip({
  className,
  placement = "top",
  offset = 4,
  crossOffset = 0,
  children,
  ...props
}) {
  return (
    <TooltipPrimitive
      data-slot="tooltip-content"
      placement={placement}
      offset={offset}
      crossOffset={crossOffset}
      className={cn(
        "z-50 inline-flex w-fit max-w-xs origin-(--trigger-anchor-point) items-center gap-1.5 border border-text bg-surface rounded-sm body-small px-3 py-2  has-data-[slot=kbd]:pr-1.5 data-entering:animate-in data-entering:fade-in-0  data-exiting:animate-out data-exiting:fade-out-0  data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm",
        className,
      )}
      {...props}
    >
      {children}
      <OverlayArrow>
        <div className="relative">
          <div
            className="
        absolute
        left-1/2
        -translate-x-1/2
        top-0
        size-0
        border-l-[7px] border-r-[7px]
        border-l-transparent border-r-transparent
        border-t-[7px]
        border-t-text
      "
          />

          <div
            className="
        absolute
        left-1/2
        -translate-x-1/2
        top-0
        translate-y-[-1px]
        size-0
        border-l-[7px] border-r-[7px]
        border-l-transparent border-r-transparent
        border-t-[7px]
        border-t-surface
      "
          />
        </div>
      </OverlayArrow>
    </TooltipPrimitive>
  );
}

export { Tooltip, TooltipTrigger };
