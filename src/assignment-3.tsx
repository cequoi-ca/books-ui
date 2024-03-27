import { For, createEffect, createResource, createSignal } from 'solid-js'
import { Route, Router } from '@solidjs/router';
import { stringify } from 'querystring';
import PageWrapper from "./components/page_wrapper";
import InitialBookList from './components/initial_book_list';
import InitialFilters, { NamedFilters } from './components/initial_filters';
import InitialMutableBookList from './components/initial_mutable_book_list';
import assignment_3, { Book, Filter } from 'assignment_3';
import RobustFilters from './components/robust_filters';

const routes = {"Home": "/", "Edit Book List": "/edit_list"};

export default function assignment(adapter: typeof assignment_3) {
  return (
    <Router>
        <Route path="/" component={() => main(adapter)} />
        <Route path="/edit_list" component={() => edit_list(adapter)} />
    </Router>
  )
}

function main(adapter: typeof assignment_3) {
  let [filters, setFilters] = createSignal<Filter[]>([]);

  return (
    <PageWrapper routes={routes}>
      <RobustFilters filters={filters} setFilters={(filters) => {
        console.log("Setting filters", filters);
        setFilters(filters)
      }} />
      <InitialBookList filters={filters} listBooks={adapter.listBooks}/>
    </PageWrapper>
  )
}


function edit_list(adapter: typeof assignment_3) {return (
  <PageWrapper title="Edit Book List" routes={routes}>
    <InitialMutableBookList listBooks={adapter.listBooks} createOrUpdateBook={adapter.createOrUpdateBook} removeBook={adapter.removeBook} />
  </PageWrapper>
)
}