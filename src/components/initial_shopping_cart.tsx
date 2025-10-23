import { Key } from "@solid-primitives/keyed";
import { Book, BookID, lookupBookById } from "ecommerce_adapter";
import { Accessor, ResourceFetcherInfo, createResource } from "solid-js";

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
        <div class="flex flex-col justify-start items-start col-start-3 gap-5 row-start-4 row-span-2 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
            <h3 class="font-bold text-xl">Shopping Cart</h3>
            {
                orderStatus() ? (
                    typeof orderStatus() === 'string' ?
                    (<span class="text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded">{orderStatus()}</span>) :
                    (<span class="text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded">Order Placed Successfully!</span>)
                ) : ""
            }
        <ul class="flex flex-col justify-start items-start gap-4 w-full">
            <Key each={bookArray()} by="id">
                { (item, index) =>
                <li x-book-name={item().name} x-book={item().id ?? index()} class="book flex flex-col gap-2 w-full p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                <h2 x-name="name" class="font-semibold">{item().name}</h2>
                <h4 x-name="author" class="text-sm text-gray-600 dark:text-gray-400">by {item().author}</h4>
                <h3 x-name="order" class="flex flex-row items-center gap-3 mt-2">
                    <button class="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-white transition-colors" onClick={() => addToOrder(item().id  || "")}>+</button>
                    <span class="font-bold text-lg min-w-[2rem] text-center">{item().order_count}</span>
                    <button class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white transition-colors" onClick={() => removeFromOrder(item().id || "")}>-</button>
                </h3>
                <div class="flex flex-row justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-slate-700">
                    <h3 x-name="price-calc" class="text-sm text-gray-600 dark:text-gray-400">
                        ${item().price} × {item().order_count}
                    </h3>
                    <h3 x-name="price" class="font-bold text-lg">
                        ${(item().price * item().order_count).toFixed(2)}
                    </h3>
                </div>
                </li>
                }
            </Key>
        </ul>
        <button onclick={submitOrder} class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg w-full font-semibold transition-colors">Place Order</button>
        </div>
    )
}