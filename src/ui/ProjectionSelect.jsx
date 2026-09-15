import { Select } from "radix-ui";
import { ChevronDownIcon } from "@radix-ui/react-icons";

export default function ProjectionSelect({
  selectedProjection,
  setProjection,
}) {
  return (
    <Select.Root value={selectedProjection} onValueChange={setProjection}>
      <Select.Trigger
        className="flex w-auto md:w-42 min-w-42 [&>span:first-child]:relative
    [&>span:first-child]:top-px items-center gap-1.5 rounded-sm border border-border bg-surface py-2 pl-3 pr-2 text-sm "
      >
        <Select.Value />
        <Select.Icon className="ml-auto">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="overflow-hidden w-[var(--radix-select-trigger-width)] border border-text bg-surface rounded-sm shadow-sm text-sm md:text-sm"
          position="popper"
          side="bottom"
          sideOffset={5}
        >
          <Select.Viewport>
            <Select.Item
              value="authagraph"
              className="flex items-center h-8 py-1 px-3 cursor-pointer rounded-sm outline-none  data-[highlighted]:bg-surface-active data-[highlighted]:text-text-dark"
            >
              <Select.ItemText>AuthaGraph</Select.ItemText>
            </Select.Item>

            <Select.Item
              value="dymaxion"
              className="flex items-center h-8 py-1 px-3 cursor-pointer rounded-sm outline-none data-[highlighted]:bg-surface-active data-[highlighted]:text-text-dark"
            >
              <Select.ItemText>Dymaxion / Fuller</Select.ItemText>
            </Select.Item>

            <Select.Item
              value="gall_peters"
              className="flex items-center h-8 py-1 px-3 cursor-pointer rounded-sm outline-none data-[highlighted]:bg-surface-active data-[highlighted]:text-text-dark"
            >
              <Select.ItemText>Gall-Peters</Select.ItemText>
            </Select.Item>

            <Select.Item
              value="goode_homolosine"
              className="flex items-center h-8 py-1 px-3 cursor-pointer rounded-sm outline-none data-[highlighted]:bg-surface-active data-[highlighted]:text-text-dark"
            >
              <Select.ItemText>Goode homolosine</Select.ItemText>
            </Select.Item>

            <Select.Item
              value="mercator"
              className="flex items-center h-8 py-1 px-3 cursor-pointer rounded-sm outline-none data-[highlighted]:bg-surface-active data-[highlighted]:text-text-dark"
            >
              <Select.ItemText>Mercator</Select.ItemText>
            </Select.Item>

            <Select.Item
              value="robinson"
              className="flex items-center h-8 py-1 px-3 cursor-pointer rounded-sm outline-none data-[highlighted]:bg-surface-active data-[highlighted]:text-text-dark"
            >
              <Select.ItemText>Robinson</Select.ItemText>
            </Select.Item>

            <Select.Item
              value="winkel_tripel"
              className="flex items-center h-8 py-1 px-3 cursor-pointer rounded-sm outline-none data-[highlighted]:bg-surface-active data-[highlighted]:text-text-dark"
            >
              <Select.ItemText>Winkel tripel</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
