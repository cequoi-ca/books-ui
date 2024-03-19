import { Book, BookID } from "assignment_2";
import { For, createResource, createSignal } from "solid-js";

interface Props {
    listBooks: (filters: Array<{from?: number, to?: number}>) => Promise<Book[]>,
    createOrUpdateBook: (book: Book) => Promise<BookID>,
    removeBook: (book: BookID) => Promise<void>

}

export default function InitialMutableBookList({ createOrUpdateBook, removeBook, listBooks}: Props) {
    const [new_book, set_new_book] = createSignal<Book>({name: "", author: "", description: "", price: 0, image: ""})
  
    let [books, {mutate: mutate_books, refetch: refetch_books }] = createResource(async () => {
      return await listBooks([]); 
    })
  
    const update_new_book = (ev: Event & ({
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
  } | {
    currentTarget: HTMLTextAreaElement;
    target: HTMLTextAreaElement;
  }), value: keyof Book) => {
        let updated : Book = { ...new_book()};
        if (value === "price") {
          updated.price = Number.parseFloat(ev.target?.value ?? "0");
        } else {
          updated[value] = ev.target.value;
        }
        set_new_book(updated);
    }
  
    const submit_new_book = async ()  => {
      let book = new_book();
      set_new_book({name: "", author: "", description: "", price: 0, image: ""});
      await createOrUpdateBook(book);
      refetch_books();
    }
  
    const update_existing_book = (ev: Event & ({
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
  } | {
    currentTarget: HTMLTextAreaElement;
    target: HTMLTextAreaElement;
  }), value: keyof Book, index: number) => {
        mutate_books((original) => {
          if (!original) return original;
          let current_book = original[index];
          if (!current_book) return original;
          let updated_list = [...(original)];
          let updated : Book = { ...current_book};
          if (value === "price") {
            updated.price = Number.parseFloat(ev.target?.value ?? "0");
          } else {
            updated[value] = ev.target.value;
          }
  
          updated_list[index] = updated;
  
          return updated_list;
      });
    }
  
    const update_book = async (updated_book: Book)  => {
      let id = updated_book.id;
      if (!id) {
        throw new Error("Failed to update book");
      }
      let book = books()?.find((book) => book.id === id);
      if (!book) {
        throw new Error("No up to date book");
      }
      
      await createOrUpdateBook(book);
      refetch_books();
    }
  
    const delete_book = async (book: Book) => {
      if (book.id) {
        await removeBook(book.id);
      }
      refetch_books();
    }
  
    return (<>
        <form id="add_book_form" class="flex flex-col justify-items-center dark:bg-slate-800 bg-slate-200 p-10 col-start-1 col-span-1 gap-1">
          <h2>Add Book</h2>
          <label for='name'>Name</label>
          <input class='text-black' name='name' placeholder='Name' value={new_book().name} onchange={(e) => update_new_book(e, "name")}/>
          
          <label for='author'>Author</label>
          <input class='text-black' name='author' placeholder='Author' value={new_book().author} onchange={(e) => update_new_book(e, "author")}/>
          
          <label for='image'>Image URL</label>
          <input class='text-black' name='image' placeholder='Image URL' value={new_book().image} onchange={(e) => update_new_book(e, "image")}/>
          
          <label for='price'>Price</label>
          <input class='text-black' name='price' type="number" placeholder='0.0' value={new_book().price} onchange={(e) => update_new_book(e, "price")}/>
          
          <label for='description'>Description</label>
          <textarea class='text-black' name="description" placeholder='Description' value={new_book().description} onchange={(e) => update_new_book(e, "description")}/>
          
          <button name="add_book" class="bg-green-400 hover:bg-green-700 text-white" onclick={() => submit_new_book()}>Add Book</button>
        </form>
        <ul class="grid col-start-2 p-10 grid-cols-[auto_1fr_auto_min-content] grid-rows-[repeat(auto-fit,_minmax(10px,_auto)_minmax(10px,_auto)_minmax(10px,_1fr))] gap-y-1 gap-x-3">
          <For each={books()}>
            { (item, index) => 
            <li x-book={item.id} x-book-name={item.name} class="book grid grid-cols-subgrid grid-rows-subgrid col-span-4 row-span-3">
              <div class="col-start-1 row-span-3 w-20 h-32">
                <img src={item.image} class="aspect-auto"/>
              </div>
              <h2 class=" col-start-2 col-span-1 row-start-1">Name: <input x-name="name" class="text-black" value={item.name} onchange={(e) => update_existing_book(e, "name", index())}/></h2>
              <h3 class="col-span-1 row-start-1 col-start-3">Price: <input x-name="price" class="text-black" value={item.price} type="number" onchange={(e) => update_existing_book(e, "price", index())}/></h3>
              <h4 class="col-span-1 col-start-2 row-start-2">Author: <input x-name="author" class="text-black" value={item.author} onchange={(e) => update_existing_book(e, "author", index())}/></h4>
              <h4 class="col-span-1 col-start-3 row-start-2">Image URL: <input x-name="image" class="text-black" value={item.image} onchange={(e) => update_existing_book(e, "image", index())}/></h4>
              <div class="col-span-3 col-start-2 flex flex-row row-start-3">Description: <textarea x-name="description" class="text-black flex-grow" value={item.description} onchange={(e) => update_existing_book(e, "description", index())}/></div>
              <button x-name="update" class="bg-green-400 hover:bg-green-700 text-white col-start-4 row-start-1" onclick={() => update_book(item)}>Update Book</button>
              <button x-name="remove" class="bg-red-400 hover:bg-red-700 text-white col-start-4 row-start-2" onclick={() => delete_book(item)}>Delete Book</button>
            </li>
            }
          </For>
        </ul>
        </>
    )
}