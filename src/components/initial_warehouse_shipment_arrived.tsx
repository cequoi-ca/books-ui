import { Filter, listBooks, placeBooksOnShelf } from "ecommerce_adapter";
import { For, createResource, createSignal } from "solid-js";

interface Props {
    listBooks: typeof listBooks,
    placeBooksOnShelf: typeof placeBooksOnShelf,
}

export default function InitialWarehouseShipmentArrived({ listBooks, placeBooksOnShelf }: Props) {

    let [book_filter, setBookFilter] = createSignal("");

    let [books] = createResource(book_filter, async (filter) => {
        let filters : Filter[] = [
            {
                name: filter.replace(/\s/g, "\s")
            },
            {
                author: filter.replace(/\s/g, "\s")
            }
        ];
        return await listBooks(filters)
    });
    let [selectedBook, selectBook] = createSignal<string | false>(false);

    let [numberOfBooks, setNumberOfBooks] = createSignal(1);

    let [shelf, setShelf] = createSignal<string | false>(false);

    let place_books = () => {
        return selectedBook() !== false && shelf() !== false && numberOfBooks() > 0;
    }

    return (
        <div class="p-2 flex-col flex gap-2" id="shipment_arrived">
            <h4 class="text-lg font-bold">Shipment Arrived</h4>
            <div class="flex flex-row gap-2">
                <label>Book</label>
                <div id="books" class="flex flex-col gap-1">
                    <input class="text-black p-1" name="book_filter" value={book_filter() || ""} onInput={(e) => {
                        setBookFilter(e.target.value)
                    }} />
                    <div class="grid grid-cols-3 gap-1">
                    <For each={books()}>
                        {(item) => 
                        <button class="p-2 hover:brightness-50 grid grid-col-span-1 grid-row-span-2" classList={{ "bg-blue-400 text-white": selectedBook() == item.id, "bg-blue-100 text-black": selectedBook() !== item.id}} onClick={() => {
                            selectBook(item.id || false);
                        }}><div>{item.name}</div><div class="text-sm">{item.author}</div></button>
                        }
                    </For></div>
                </div>
            </div>
            <div class="flex flex-row gap-2">
                <label>Number of Copies</label>
                <div id="copies" class="flex flex-col">
                    <input class="text-black p-1" type="number" name="number" value={numberOfBooks()} onInput={(e) => {
                        setNumberOfBooks(Number.parseInt(e.target.value))
                    }} />
                </div>
            </div>
            <div class="flex flex-row gap-2">
                <label>Shelf</label>
                <div id="shelf" class="flex flex-col">
                    <input class="text-black p-1" name="shelf" value={shelf() || ""} onInput={(e) => {
                        setShelf(e.target.value.length > 0 ? e.target.value : false)
                    }} />
                </div>
            </div>
            <button disabled={!place_books()} classList={{"bg-green-400 hover:bg-green-700": place_books(), "bg-gray-400": !place_books()}} onClick={() => {
                placeBooksOnShelf(selectedBook() || "", numberOfBooks(), shelf() || "");
            }}>Set On Shelves</button>
        </div>
    )
}