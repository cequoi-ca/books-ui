import { Book, BookID, Filter } from "ecommerce_adapter";
import { Accessor, For, Resource, createResource } from "solid-js";

interface Props {
    filters: Accessor<Filter[]> | Resource<Filter[]>,
    listBooks: (filters: Array<Filter>) => Promise<Book[]>,
    addToOrder?: (book: BookID) => void
}

export default function InitialBookList({ filters, listBooks, addToOrder}: Props) {
    let [books] = createResource(filters, async (available_filters) => {
        console.log("Filters Updated", available_filters);
        return await listBooks(available_filters)
    });

    return (
        <div class="col-start-2 p-10">
            <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                <For each={books()}>
                    { (item, index) =>
                    <li x-book-name={item.name} x-book={item.id ?? index} class="book bg-white dark:bg-slate-700 border-2 border-black dark:border-slate-500 rounded-3xl p-6 w-full max-w-sm h-full flex flex-row gap-4 items-stretch hover:shadow-lg transition-shadow">
                        <div class="flex-shrink-0 flex items-center">
                            <img x-name="image" src={item.image} class="w-24 h-32 object-cover rounded"/>
                        </div>
                        <div class="flex flex-col gap-2 flex-grow">
                            <h4 x-name="author" class="text-sm text-gray-600 dark:text-gray-300">{item.author}</h4>
                            <h2 x-name="name" class="font-semibold text-lg">{item.name}</h2>
                            <div>
                                <span class="text-sm text-gray-600 dark:text-gray-300">Price:</span>
                                <h3 x-name="price" class="text-md font-bold">${item.price}</h3>
                            </div>
                            {
                                addToOrder ? (
                                    <button
                                        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mt-auto transition-colors"
                                        onClick={() => addToOrder((books() || [])[index()].id || "")}>
                                        Add to Cart
                                    </button>
                                ) : null
                            }
                        </div>
                    </li>
                    }
                </For>
            </ul>
        </div>
    )
}