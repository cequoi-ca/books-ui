import { For, createEffect, createResource, createSignal } from 'solid-js'
import adapter, { Book } from 'adapter'

function App() {
  let [filters, setFilters] = createSignal([
    { label: "Under 10$", filter: { to: 10}, active: false},
    { label: "10$-20$", filter: {from: 10, to: 20}, active: false},
    { label: "Over 20$", filter: { from: 20}, active: false}
  ]);

  let [books] = createResource(filters, async (available_filters) => {
    let active_filters = available_filters.filter(f => f.active, ).map(f => f.filter);

    return adapter.assignment == "assignment-1" ? await adapter.listBooks(active_filters) : []; 
  })

  return (
    <div class="grid grid-cols-[1fr_minmax(900px,_3fr)_1fr] grid-rows-[auto_min-content_min-content_1fr_auto] min-h-[100dvh]">
      <header class="grid justify-items-center row-start-1 col-span-3 dark:bg-slate-900 bg-slate-300 p-10 grid-cols-subgrid items-center">
        <h1 class="text-xl col-start-2">McMasterful Books</h1>
      </header>
      <div class="flex flex-row justify-center items-center col-start-2 p-10 gap-5">
        <span>Filters:</span>
        <For each={filters()}>{(item, index) => <span><input type="checkbox" checked={item.active} onchange={(event) => {
          let new_value = event.target.checked;
          let new_filters = [...filters()];
          let i = index();
          new_filters[i] = {...new_filters[i], active: new_value };
          setFilters(new_filters);
        }}/><span class="pl-2">{item.label}</span></span>}</For>
      </div>
      <ul class="grid col-start-2 p-10 grid-cols-[auto_1fr_auto] grid-rows-[repeat(1fr,_1fr)] gap-3">
        <For each={books()}>
          { (item) => 
          <li x-book={item.name} class="book grid grid-cols-subgrid grid-rows-subgrid col-span-3 row-span-2">
            <div class="col-start-1 row-span-2 w-20 h-32">
              <img src={item.image} class="aspect-auto"/>
            </div>
            <h2 class=" col-start-2 col-span-1 row-start-1">{item.name}</h2>
            <h3 class="col-span-1 row-start-1 col-start-3">{item.price}</h3>
            <div class="col-span-2">{item.description}</div>
          </li>
          }
        </For>
      </ul>
      <div class="col-span-3"></div>
      <footer class="grid justify-items-center col-span-3  dark:bg-slate-900 bg-slate-400 grid-cols-subgrid p-10 items-center">
        <div class="text-xs col-start-2">McMasterful Books is used for assignments in McMaster's BVD-103 course.</div>
      </footer>
    </div>
  )
}

export default App

