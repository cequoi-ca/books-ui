import { BookID } from "assignment_2";
import { Book, Filter, OrderId, ShelfId, findBookOnShelf, fulfilOrder, listOrders, lookupBookById } from "assignment_4";
import { listBooks, placeBooksOnShelf } from "assignment_4";
import { Accessor, For, Resource, createResource, createSignal } from "solid-js";

interface Props {
    lookupBookById: typeof lookupBookById,
    listOrders: typeof listOrders,
    findBookOnShelf: typeof findBookOnShelf,
    fulfilOrder: typeof fulfilOrder,
}

interface OrderDetails {
    orderId: OrderId,
    books_in_order: Array<Book & { copies: number, shelves: Array<{ shelf: string, count: number }> }>
}

export default function InitialOrderList({ lookupBookById, listOrders, findBookOnShelf, fulfilOrder }: Props) {
    const [fulfilStatus, setFulfilStatus] = createSignal<boolean | String>(false)

    let [orders, { refetch }] = createResource(async () => {
        let orders = await listOrders();
        let orders_with_book_info = await Promise.all(orders.map(async ({ orderId, books }) => {
            let book_ids = Object.keys(books)
            let book_info_promise = Promise.all(book_ids.map((bookId) => lookupBookById(bookId)));
            let book_position_promise = Promise.all(book_ids.map((bookId) => findBookOnShelf(bookId)));
            let [book_info, book_position] = await Promise.all([book_info_promise, book_position_promise]);
            let books_in_order = [];
            for (let i = 0; i < book_info.length && i < book_position.length; i++) {
                books_in_order[i] = {
                    ...book_info[i],
                    copies: books[book_info[i].id || ""] || 0,
                    shelves: book_position[i]
                }
            }

            let order_details: OrderDetails = { orderId, books_in_order };
            return order_details;
        }));
        return orders_with_book_info;
    });

    let [fulfilment_info, setFulfilmentInfo] = createSignal<Record<OrderId, Record<BookID, Record<ShelfId, number>>>>({})

    let shelf_fulfilment_info = (order: OrderId, book: BookID, shelf: ShelfId) => {
        let info = fulfilment_info();
        let order_info = info[order] || {};
        let book_info = order_info[book] || {};
        let shelf_info = book_info[shelf] || 0;
        return shelf_info;
    }

    let set_shelf_fulfimnet_info = (order: OrderId, book: BookID, shelf: ShelfId, value: string) => {
        let shelf_fulfiment_count = Number.parseInt(value);
        let info = { ...fulfilment_info() };
        let order_info = { ...(info[order] || {}) };
        let book_info = { ...(order_info[book] || {}), [shelf]: shelf_fulfiment_count };
        order_info[book] = book_info;
        info[order] = order_info;
        setFulfilmentInfo(info);
        setFulfilStatus(false);
    }

    let fulfil_order = async (order: OrderId) => {
        let order_fulfilment_info = fulfilment_info()[order] || {};
        let books_used = Object.keys(order_fulfilment_info).flatMap((book_id) => {
            let book_info = order_fulfilment_info[book_id];
            return Object.keys(book_info).map((shelf) => {
                let count = book_info[shelf];

                return {
                    book: book_id,
                    shelf,
                    numberOfBooks: count
                }
            })
        });
        try {
            await fulfilOrder(order, books_used);
            setFulfilStatus(true)
        } catch(e) {
            setFulfilStatus(`Fulfilment Failed: ${e}`)
        }
        refetch();
    }

    return (
        <div class="p-2 flex-col flex gap-2" id="orders">
            <h4 class="text-lg font-bold">Orders</h4>
            {
                fulfilStatus() ? (
                    typeof fulfilStatus() === 'string' ?
                        (<span class="text-red-300">{`${fulfilStatus()}`}</span>) :
                        (<span class="text-green-300">Order Fulfilled</span>)
                ) : ""
            }
            <For each={orders()}>
                {(item) =>
                    <div class="grid grid-cols-3 gap-1">
                        <div class="row-span-1 col-span-4 font-bold">Order {item.orderId}</div>
                        <For each={item.books_in_order}>
                            {(book) =>
                                <div class="grid grid-cols-subgrid col-span-3 gap-1 col-start-2">
                                    <div class="col-span-2 col-start-1">Name: {book.name}</div>
                                    <div class="col-span-1 col-start-3">Author: {book.author}</div>
                                    <div class="col-span-3 col-start-1">Copies Ordered: {book.copies}</div>
                                    <For each={book.shelves}>
                                        {(shelf) =>
                                            <div class="grid grid-cols-subgrid col-span-2 col-start-2">
                                                <div class="col-start-1">{shelf.shelf} has {shelf.count} copies - take </div>
                                                <input type="number" class="col-start-2 text-black" value={shelf_fulfilment_info(item.orderId, book.id || "", shelf.shelf)} onInput={(e) => set_shelf_fulfimnet_info(item.orderId, book.id || "", shelf.shelf, e.target.value)} />
                                            </div>
                                        }
                                    </For>
                                </div>
                            }
                        </For><button class="col-span-4 bg-green-400 hover:bg-green-700 p-2" onClick={() => fulfil_order(item.orderId)}>Fulfil Order</button>
                    </div>
                }
            </For>
        </div>
    )
}