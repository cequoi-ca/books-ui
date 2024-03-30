import { Key } from "@solid-primitives/keyed";
import { Book, BookID, Filter } from "assignment_3";
import { lookupBookById } from "assignment_4";
import { Accessor, For, Resource, ResourceFetcherInfo, createResource } from "solid-js";

interface Props {
    lookupBookById: typeof lookupBookById, 
    addToOrder: (book: BookID) => void,
    removeFromOrder: (book: BookID) => void,
    currentOrder: Accessor<Record<BookID, number>>,
    submitOrder: () => void,
    orderStatus: Accessor<boolean | string>
}

export default function InitialShoppingCart({ lookupBookById, removeFromOrder, currentOrder, addToOrder, submitOrder, orderStatus}: Props) {
    let [books] = createResource(currentOrder, async (currentOrder, resource_info: ResourceFetcherInfo<Record<BookID, Book & { order_count: number }>, unknown>) => {
        let previous_value = resource_info.value || {};
        let new_value : Record<BookID, Book & { order_count: number }> = {};
        let books_to_lookup : Array<{id: BookID, order_count: number}> = [];
        for (let book of Object.keys(currentOrder)) {
            if (book in previous_value) {
                new_value[book] = { ...previous_value[book], order_count: currentOrder[book]};
            } else {
                books_to_lookup.push({ id: book, order_count: currentOrder[book]});
            }
        }

        let results = await Promise.all(books_to_lookup.map(async ({id, order_count}) => {
            let lookup_result = await lookupBookById(id);
            return {...lookup_result, id, order_count};
        }));

        for (let value of results) {
            new_value[value.id] = value;
        }

        return new_value;
    });

    const [bookArray] = createResource(books, (books) => {
        return Object.keys(books).map((key) => books[key]);
    });

    return (
        <div class="flex flex-col justify-start items-start col-start-3 gap-5 row-start-4 row-span-2">
            <h3 class="font-bold">Order</h3>
            {
                orderStatus() ? (
                    typeof orderStatus() === 'string' ?
                    (<span class="text-red-300">{orderStatus()}</span>) :
                    (<span class="text-green-300">Order Placed</span>)
                ) : ""
            }
        <ul class="flex flex-col justify-start items-start gap-5">
            <Key each={bookArray()} by="id">
                { (item, index) => 
                <li x-book-name={item().name} x-book={item().id ?? index()} class="book flex flex-col gap-2">
                <h2 x-name="name" class="col-start-2 col-span-1 row-start-1">{item().name}</h2>
                <h4 x-name="author" class="text-sm col-span-1 col-start-2 row-start-2">by {item().author}</h4>
                <h3 x-name="order" class="col-span-1 row-start-1 row-span-2 col-start-3 flex flex-row items-center gap-2">
                    <button class="bg-green-400 hover:bg-green-700 pl-1 pr-1 flex flex-col items-center justify-center" onClick={() => addToOrder(item().id  || "")}>+</button>
                    {item().order_count}
                    <button class="bg-red-400 hover:bg-red-700 pl-1 pr-1 flex flex-col items-center justify-center" onClick={() => removeFromOrder(item().id || "")}>-</button>
                </h3>
                <h3 x-name="price-calc" class="text-xs">
                    {item().price} * {item().order_count} =
                </h3>
                <h3 x-name="price" class="font-bold">
                    {item().price * item().order_count}
                </h3>
                </li>
                }
            </Key>
        </ul>
        <button onclick={submitOrder} class="bg-green-400 hover:bg-green-700 p-2">Place Order</button>
        </div> 
    )
}