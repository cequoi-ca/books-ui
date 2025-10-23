import { createSignal } from 'solid-js'
import { Route, Router } from '@solidjs/router';
import PageWrapper from "./components/page_wrapper";
import InitialBookList from './components/initial_book_list';
import InitialMutableBookList from './components/initial_mutable_book_list';
import ecommerceAdapter from 'ecommerce_adapter';
import type { Filter, BookID } from 'ecommerce_adapter';
import RobustFilters from './components/robust_filters';
import InitialWarehouseShipmentArrived from './components/initial_warehouse_shipment_arrived';
import InitialOrderList from './components/initial_order_list';
import InitialShoppingCart from './components/initial_shopping_cart';

const routes = { "Home": "/", "Edit Book List": "/edit_list", "Warehouse": "/warehouse" };

export default function assignment(adapter: typeof ecommerceAdapter) {
  return (
    <Router>
      <Route path="/" component={() => main(adapter)} />
      <Route path="/edit_list" component={() => edit_list(adapter)} />
      <Route path="/warehouse" component={() => warehouse(adapter)} />
    </Router>
  )
}

function edit_list(adapter: typeof ecommerceAdapter) {
  return (
    <PageWrapper title="Manage Books" routes={routes}>
      <InitialMutableBookList
        listBooks={adapter.listBooks}
        createOrUpdateBook={adapter.createOrUpdateBook}
        removeBook={adapter.removeBook}
      />
    </PageWrapper>
  );
}

function main(adapter: typeof ecommerceAdapter) {
  let [filters, setFilters] = createSignal<Filter[]>([]);  
  
  let [currentOrder, setCurrentOrder] = createSignal<Record<BookID, number>>({});
  let [orderStatus, setOrderStatus] = createSignal<boolean | string>(false);

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
    setOrderStatus(false);
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
    try {
      await adapter.orderBooks(order);
      setCurrentOrder({});
      setOrderStatus(true);
    } catch (e) {
      console.error(e);
      setOrderStatus(`Error with order: ${e}`);
    }
  }

  return (
    <PageWrapper routes={routes}>
      <RobustFilters filters={filters} setFilters={(filters) => {
        console.log("Setting filters", filters);
        setFilters(filters)
      }} />
      <InitialBookList filters={filters} listBooks={adapter.listBooks} addToOrder={addToOrder}/>
      <InitialShoppingCart orderStatus={orderStatus} lookupBookById={adapter.lookupBookById} addToOrder={addToOrder} removeFromOrder={removeFromOrder} currentOrder={currentOrder} submitOrder={submitOrder}/>
    </PageWrapper>
  )
}

function warehouse(adapter: typeof ecommerceAdapter) {
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