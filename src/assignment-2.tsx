import { For, createEffect, createResource, createSignal } from 'solid-js'
import assignment_2, { Book } from 'assignment_2';
import { Route, Router } from '@solidjs/router';
import { stringify } from 'querystring';
import PageWrapper from "./components/page_wrapper";
import InitialBookList from './components/initial_book_list';
import InitialFilters, { NamedFilters } from './components/initial_filters';
import InitialMutableBookList from './components/initial_mutable_book_list';

const routes = {"Home": "/", "Edit Book List": "/edit_list"};

export default function assignment(adapter: typeof assignment_2) {
  return (
    <Router>
        <Route path="/" component={() => main(adapter)} />
        <Route path="/edit_list" component={() => edit_list(adapter)} />
    </Router>
  )
}

function main(adapter: typeof assignment_2) {
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
    <PageWrapper routes={routes}>
      <InitialFilters filters={filters} setFilters={setFilters} />
      <InitialBookList filters={active_filters} listBooks={adapter.listBooks}/>
    </PageWrapper>
  )
}


function edit_list(adapter: typeof assignment_2) {return (
  <PageWrapper title="Edit Book List" routes={routes}>
    <InitialMutableBookList listBooks={adapter.listBooks} createOrUpdateBook={adapter.createOrUpdateBook} removeBook={adapter.removeBook} />
  </PageWrapper>
)
}