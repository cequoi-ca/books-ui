
import { Accessor, For, Resource, Setter, createResource } from "solid-js";

export type NamedFilters = Array<{ label: string, filter: {from?: number, to?: number}, active: boolean }>;

interface Props {
    filters: Accessor<NamedFilters>,
    setFilters: Setter<NamedFilters>
}

export default function InitialFilters({ filters, setFilters}: Props) {
    return (
        <div class="flex flex-row justify-center items-center col-start-2 p-10 gap-5">
          <span>Filters:</span>
          <For each={filters()}>{(item, index) => <span><input type="checkbox" x-filter-from={item.filter.from} x-filter-to={item.filter.to} checked={item.active} onchange={(event) => {
            let new_value = event.target.checked;
            let new_filters = [...filters()];
            let i = index();
            new_filters[i] = {...new_filters[i], active: new_value };
            setFilters(new_filters);
          }}/><span class="pl-2">{item.label}</span></span>}</For>
        </div>
    )
}