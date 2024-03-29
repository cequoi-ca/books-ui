import { For, createEffect, createResource, createSignal } from 'solid-js'
import { Route, Router } from '@solidjs/router';
import { stringify } from 'querystring';
import PageWrapper from "./components/page_wrapper";
import InitialBookList from './components/initial_book_list';
import InitialFilters, { NamedFilters } from './components/initial_filters';
import InitialMutableBookList from './components/initial_mutable_book_list';
import assignment_4, { Book, Filter } from 'assignment_4';
import RobustFilters from './components/robust_filters';
import InitialWarehouseShipmentArrived from './components/initial_warehouse_shipment_arrived';
import InitialOrderList from './components/initial_order_list';
import { edit_list } from './assignment-3';
import InitialShoppingCart from './components/initial_shopping_cart';
import { BookID } from 'assignment_2';

const routes = { "Home": "/", "Edit Book List": "/edit_list", "Warehouse": "/warehouse" };

export default function assignment(adapter: typeof assignment_4) {
  return (
    <Router>
      <Route path="/" component={() => main(adapter)} />
      <Route path="/edit_list" component={() => edit_list(adapter)} />
      <Route path="/warehouse" component={() => warehouse(adapter)} />
    </Router>
  )
}

function main(adapter: typeof assignment_4) {
  let [filters, setFilters] = createSignal<Filter[]>([]);  
  
  let [currentOrder, setCurrentOrder] = createSignal<Record<BookID, number>>({});

  const addToOrder = (id: BookID) => {
    let current = currentOrder();
    console.log("Adding", id, current)
    if (id.length === 0) {
      return;
    }
    let nextOrder = {...current};
    nextOrder[id] = (nextOrder[id] || 0) + 1;
    console.log("New Order", nextOrder)
    setCurrentOrder(nextOrder);
  }
  const removeFromOrder = (id: BookID) => {
    let current = currentOrder();
    console.log("Removing", id, current)
    if (id.length === 0) {
      return;
    }
    let nextOrder = {...current};
    nextOrder[id] = (nextOrder[id] || 0) - 1;
    if (nextOrder[id] <= 0) {
      delete nextOrder[id];
    }
    console.log("New Order", nextOrder)
    setCurrentOrder(nextOrder);}
  const submitOrder = async () => {
    let current = currentOrder();
    let order = Object.keys(current).flatMap((key) => {
      let count = current[key];
      let result = []
      for (let i = 0; i < count; i++) {
        result.push(key)
      }
      return result
    });
    await adapter.orderBooks(order);
  }

  return (
    <PageWrapper routes={routes}>
      <RobustFilters filters={filters} setFilters={(filters) => {
        console.log("Setting filters", filters);
        setFilters(filters)
      }} />
      <InitialBookList filters={filters} listBooks={adapter.listBooks} addToOrder={addToOrder}/>
      <InitialShoppingCart lookupBookById={adapter.lookupBookById} addToOrder={addToOrder} removeFromOrder={removeFromOrder} currentOrder={currentOrder} submitOrder={submitOrder}/>
    </PageWrapper>
  )
}

function warehouse(adapter: typeof assignment_4) {
  return (
    <PageWrapper title="Warehouse" routes={routes}>
      <div class="grid grid-cols-[1fr_2px_1fr] justify-center items-start col-start-2 gap-2 p-4">
        <InitialWarehouseShipmentArrived listBooks={adapter.listBooks} placeBooksOnShelf={adapter.placeBooksOnShelf} />
        <div class="w-full h-full bg-slate-800"/>
        <InitialOrderList lookupBookById={adapter.lookupBookById} listOrders={adapter.listOrders} findBookOnShelf={adapter.findBookOnShelf} fulfilOrder={adapter.fulfilOrder} />
      </div>
    </PageWrapper>
  )
}