import { Book, BookID, Filter } from "assignment_3";
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
        
        <ul class="grid col-start-2 p-10 grid-cols-[auto_1fr_auto] grid-rows-[repeat(auto-fit,_minmax(10px,_auto)_minmax(10px,_auto)_minmax(10px,_1fr))] gap-y-0 gap-x-3 justify-center align-center">
            <For each={books()}>
                { (item, index) => 
                <li x-book-name={item.name} x-book={item.id ?? index} class="book grid grid-cols-subgrid grid-rows-subgrid col-span-3 row-span-3">
                <div class="col-start-1 row-span-3 w-20 h-32">
                    <img x-name="image" src={item.image} class="aspect-auto"/>
                </div>
                <h2 x-name="name" class="col-start-2 col-span-1 row-start-1">{item.name}</h2>
                <h3 x-name="price" class="col-span-1 row-start-1 row-span-2 col-start-3 flex flex-row items-center gap-5">
                    {item.price}
                    {
                        addToOrder ? (<button class="bg-green-400 hover:bg-green-700 p-2 flex flex-col items-center justify-center" onClick={() => addToOrder((books() || [])[index()].id || "")}>Add to Cart</button>) : (<></>)
                    }
                </h3>
                <h4 x-name="author" class="col-span-1 col-start-2 row-start-2">by {item.author}</h4>
                <div x-name="description" class="col-span-2 col-start-2 row-start-3">{item.description}</div>
                </li>
                }
            </For>
        </ul>
    )
}