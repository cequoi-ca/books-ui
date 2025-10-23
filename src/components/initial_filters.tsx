
import { Accessor, For, Setter } from "solid-js";

export type NamedFilters = Array<{ label: string, filter: {from?: number, to?: number}, active: boolean }>;

interface Props {
    filters: Accessor<NamedFilters>,
    setFilters: Setter<NamedFilters>
}

export default function InitialFilters({ filters, setFilters}: Props) {
    return (
        <div class="flex flex-col col-start-2 p-10 gap-4 bg-white dark:bg-slate-900 rounded-lg">
          <h3 class="font-semibold text-lg">Filter Price:</h3>
          <div class="flex flex-col gap-3">
            <For each={filters()}>{(item, index) =>
              <label class="flex flex-row items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 p-2 rounded transition-colors">
                <input
                  type="checkbox"
                  x-filter-from={item.filter.from}
                  x-filter-to={item.filter.to}
                  checked={item.active}
                  class="w-5 h-5 cursor-pointer"
                  onchange={(event) => {
                    let new_value = event.target.checked;
                    let new_filters = [...filters()];
                    let i = index();
                    new_filters[i] = {...new_filters[i], active: new_value };
                    setFilters(new_filters);
                  }}
                />
                <span class="text-md">{item.label}</span>
              </label>
            }</For>
          </div>
        </div>
    )
}