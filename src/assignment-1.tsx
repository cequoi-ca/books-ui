import { For, createEffect, createResource, createSignal } from 'solid-js'
import assignment_1 from 'assignment_1';
import PageWrapper from './components/page_wrapper';
import InitialFilters, { NamedFilters } from './components/initial_filters';
import InitialBookList from './components/initial_book_list';

export default function assignment(adapter: typeof assignment_1) {
  let [filters, setFilters] = createSignal<NamedFilters>([
    { label: "Under 10$", filter: { to: 10}, active: false},
    { label: "10$-20$", filter: {from: 10, to: 20}, active: false},
    { label: "Over 20$", filter: { from: 20}, active: false}
  ]);

  let [active_filters] = createResource(filters, async (available_filters) => {
    let active_filters = available_filters.filter(f => f.active, ).map(f => f.filter);
    return active_filters;
  })

  return (
    <PageWrapper>
      <InitialFilters filters={filters} setFilters={setFilters} />
      <InitialBookList filters={active_filters} listBooks={adapter.listBooks}/>
    </PageWrapper>
  )
}