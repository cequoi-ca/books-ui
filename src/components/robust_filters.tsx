
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
        <div class="flex flex-col m-2 justify-center items-center col-start-2 p-4 gap-2 bg-slate-200 dark:bg-slate-800">
          <span>Filters:</span>
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
        <button name="add_filter" class="bg-green-400 hover:bg-green-700 text-white p-2" onClick={() => setFilters([...filters(), {}])}>Add Filter</button>
        </div>
    )
}



function SingleFilter({index, filter, setFilter}: {index: number, filter: Filter, setFilter: (filter: Filter | false) => void}) {
  return (
    <div class="flex flex-row gap-2 items-center" x-filter-id={index}>
      <label for="name">Name</label>
      <input name="name" class="text-black p-2" value={filter.name || ""} onInput={(e) => setFilter({...filter, name: e.target.value})}/>
      <label for="author">Author</label>
      <input name="author" class="text-black p-2" value={filter.author || ""} onInput={(e) => setFilter({...filter, author: e.target.value})}/>
      <label for="from">From</label>
      <input name="from" class="text-black w-20 p-2" type="number" value={filter.from || 0} onInput={(e) => setFilter({...filter, from: Number.parseFloat(e.target.value)})}/>
      <label for="to">To</label>
      <input name="to" class="text-black w-20 p-2" type="number" value={filter.to || 1000} onInput={(e) => setFilter({...filter, to: Number.parseFloat(e.target.value)})}/>
      <button name="remove_filter" class="bg-red-400 hover:bg-red-700 text-white p-2" onClick={() => setFilter(false)}>Remove</button>
    </div>
  )
}