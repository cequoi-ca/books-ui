import assignment_1 from "assignment_1";
import assignment_2, { Book } from "assignment_2";
import { For, Resource, createResource } from "solid-js";

interface Props {
    filters: Resource<Array<{from?: number, to?: number}>>,
    listBooks: (filters: Array<{from?: number, to?: number}>) => Promise<Book[]>
}

export default function InitialBookList({ filters, listBooks}: Props) {
    let [books] = createResource(filters, async (available_filters) => {
        return await listBooks(available_filters)
    });

    return (
        
        <ul class="grid col-start-2 p-10 grid-cols-[auto_1fr_auto] grid-rows-[repeat(auto-fit,_minmax(10px,_auto)_minmax(10px,_auto)_minmax(10px,_1fr))] gap-y-0 gap-x-3">
            <For each={books()}>
                { (item, index) => 
                <li x-book-name={item.name} x-book={item.id ?? index} class="book grid grid-cols-subgrid grid-rows-subgrid col-span-3 row-span-3">
                <div class="col-start-1 row-span-3 w-20 h-32">
                    <img x-name="image" src={item.image} class="aspect-auto"/>
                </div>
                <h2 x-name="name" class="col-start-2 col-span-1 row-start-1">{item.name}</h2>
                <h3 x-name="price" class="col-span-1 row-start-1 col-start-3">{item.price}</h3>
                <h4 x-name="author" class="col-span-1 col-start-2 row-start-2">by {item.author}</h4>
                <div x-name="description" class="col-span-2 col-start-2 row-start-3">{item.description}</div>
                </li>
                }
            </For>
        </ul>
    )
}