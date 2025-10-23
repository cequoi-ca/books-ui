
import { Key } from "@solid-primitives/keyed";
import { Filter } from "assignment_3";
import { Accessor, For, Resource, Setter, createResource } from "solid-js";

interface Props {
    filters: Accessor<Filter[]>,
    setFilters: (f: Filter[]) => void,
}

export default function RobustFilters({ filters, setFilters}: Props) {
  const [listedFilters] = createResource(filters, (filters) => filters.map((value, i) => {return { index: i, filter: value}}));
    return (
        <div class="flex flex-col m-2 justify-center items-start col-start-2 p-6 gap-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
          <h3 class="font-semibold text-lg">Filters:</h3>
          <div class="flex flex-col gap-3 w-full">
            <Key each={listedFilters()} by="index" >{item => (<SingleFilter index={item().index} filter={item().filter} setFilter={(filter) => {
              if (!filter) {
                let new_filters = [...filters()];
                new_filters.splice(item().index, 1);
                setFilters(new_filters);
                return;
              }
              let new_filters = [...filters()];
              new_filters[item().index] = filter;
              setFilters(new_filters);
            }
          }/>)}</Key>
          </div>
          <button name="add_filter" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors" onClick={() => setFilters([...filters(), {}])}>Add Filter</button>
        </div>
    )
}



function SingleFilter({index, filter, setFilter}: {index: number, filter: Filter, setFilter: (filter: Filter | false) => void}) {
  return (
    <div class="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700" x-filter-id={index}>
      <div class="grid grid-cols-2 gap-3">
        <div class="flex flex-col gap-1">
          <label for="name" class="text-sm font-medium">Name</label>
          <input name="name" class="text-black dark:text-white bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded px-3 py-2" value={filter.name || ""} onInput={(e) => setFilter({...filter, name: e.target.value})} placeholder="Book name..."/>
        </div>
        <div class="flex flex-col gap-1">
          <label for="author" class="text-sm font-medium">Author</label>
          <input name="author" class="text-black dark:text-white bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded px-3 py-2" value={filter.author || ""} onInput={(e) => setFilter({...filter, author: e.target.value})} placeholder="Author name..."/>
        </div>
        <div class="flex flex-col gap-1">
          <label for="from" class="text-sm font-medium">Price From</label>
          <input name="from" class="text-black dark:text-white bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded px-3 py-2" type="number" value={filter.from || 0} onInput={(e) => setFilter({...filter, from: Number.parseFloat(e.target.value)})}/>
        </div>
        <div class="flex flex-col gap-1">
          <label for="to" class="text-sm font-medium">Price To</label>
          <input name="to" class="text-black dark:text-white bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded px-3 py-2" type="number" value={filter.to || 1000} onInput={(e) => setFilter({...filter, to: Number.parseFloat(e.target.value)})}/>
        </div>
      </div>
      <button name="remove_filter" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors self-end" onClick={() => setFilter(false)}>Remove</button>
    </div>
  )
}