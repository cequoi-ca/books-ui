import { For, createEffect, createResource, createSignal } from 'solid-js'
import assignment_2, { Book } from 'assignment_2';
import { Route, Router } from '@solidjs/router';
import { stringify } from 'querystring';

export default function assignment(adapter: typeof assignment_2) {
  return (
    <Router>
        <Route path="/" component={() => main(adapter)} />
        <Route path="/edit_list" component={() => edit_list(adapter)} />
    </Router>
  )
}

function main(adapter: typeof assignment_2) {
  let [filters, setFilters] = createSignal([
    { label: "Under 10$", filter: { to: 10}, active: false},
    { label: "10$-20$", filter: {from: 10, to: 20}, active: false},
    { label: "Over 20$", filter: { from: 20}, active: false}
  ]);

  let [books] = createResource(filters, async (available_filters) => {
    let active_filters = available_filters.filter(f => f.active, ).map(f => f.filter);

    return await adapter.listBooks(active_filters); 
  })

  return (
    <div class="grid grid-cols-[1fr_minmax(900px,_3fr)_1fr] grid-rows-[auto_min-content_min-content_1fr_auto] min-h-[100dvh]">
      <header class="grid justify-items-center row-start-1 col-span-3 dark:bg-slate-900 bg-slate-300 p-10 grid-cols-subgrid items-center">
        <h1 class="text-xl col-start-2">McMasterful Books</h1>
      </header>
      <div class="flex flex-row justify-center items-center col-start-2 p-10 gap-5">
        <span>Filters:</span>
        <For each={filters()}>{(item, index) => <span><input type="checkbox" checked={item.active} onchange={(event) => {
          let new_value = event.target.checked;
          let new_filters = [...filters()];
          let i = index();
          new_filters[i] = {...new_filters[i], active: new_value };
          setFilters(new_filters);
        }}/><span class="pl-2">{item.label}</span></span>}</For>
      </div>
      <ul class="grid col-start-2 p-10 grid-cols-[auto_1fr_auto] grid-rows-[repeat(auto-fit,_minmax(10px,_auto)_minmax(10px,_auto)_minmax(10px,_1fr))] gap-y-0 gap-x-3">
        <For each={books()}>
          { (item) => 
          <li x-book={item.name} class="book grid grid-cols-subgrid grid-rows-subgrid col-span-3 row-span-3">
            <div class="col-start-1 row-span-3 w-20 h-32">
              <img src={item.image} class="aspect-auto"/>
            </div>
            <h2 class=" col-start-2 col-span-1 row-start-1">{item.name}</h2>
            <h3 class="col-span-1 row-start-1 col-start-3">{item.price}</h3>
            <h4 class="col-span-1 col-start-2 row-start-2">by {item.author}</h4>
            <div class="col-span-2">{item.description}</div>
          </li>
          }
        </For>
      </ul>
      <div class="col-span-3"></div>
      <footer class="grid justify-items-center col-span-3  dark:bg-slate-900 bg-slate-400 grid-cols-subgrid p-10 items-center">
        <div class="text-xs col-start-2">McMasterful Books is used for assignments in McMaster's BVD-103 course.</div>
      </footer>
    </div>
  )
}


function edit_list(adapter: typeof assignment_2) {
  const [new_book, set_new_book] = createSignal<Book>({name: "", author: "", description: "", price: 0, image: ""})

  let [books, {mutate: mutate_books, refetch: refetch_books }] = createResource(async () => {
    return await adapter.listBooks([]); 
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
    await adapter.createOrUpdateBook(book);
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
    await adapter.createOrUpdateBook(updated_book);
    refetch_books();
  }

  const delete_book = async (book: Book) => {
    if (book.id) {
      await adapter.removeBook(book.id);
    }
    refetch_books();
  }

  return (
    <div class="grid grid-cols-[1fr_minmax(900px,_3fr)_1fr] grid-rows-[auto_min-content_min-content_1fr_auto] min-h-[100dvh]">
      <header class="grid justify-items-center row-start-1 col-span-3 dark:bg-slate-900 bg-slate-300 p-10 grid-cols-subgrid items-center">
        <h1 class="text-xl col-start-2">McMasterful Books</h1>
      </header>
      <form class="flex flex-col justify-items-center dark:bg-slate-800 bg-slate-200 p-10 col-start-1 col-span-1 gap-1">
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
        
        <button class="bg-green-400 hover:bg-green-700 text-white" onclick={() => submit_new_book()}>Add Book</button>
      </form>
      <ul class="grid col-start-2 p-10 grid-cols-[auto_1fr_auto_min-content] grid-rows-[repeat(auto-fit,_minmax(10px,_auto)_minmax(10px,_auto)_minmax(10px,_1fr))] gap-y-1 gap-x-3">
        <For each={books()}>
          { (item, index) => 
          <li x-book={item.id || index()} class="book grid grid-cols-subgrid grid-rows-subgrid col-span-4 row-span-3">
            <div class="col-start-1 row-span-3 w-20 h-32">
              <img src={item.image} class="aspect-auto"/>
            </div>
            <h2 class=" col-start-2 col-span-1 row-start-1">Name: <input class="text-black" value={item.name} onchange={(e) => update_existing_book(e, "name", index())}/></h2>
            <h3 class="col-span-1 row-start-1 col-start-3">Price: <input class="text-black" value={item.price} type="number" onchange={(e) => update_existing_book(e, "price", index())}/></h3>
            <h4 class="col-span-1 col-start-2 row-start-2">Author: <input class="text-black" value={item.author} onchange={(e) => update_existing_book(e, "author", index())}/></h4>
            <h4 class="col-span-1 col-start-3 row-start-2">Image URL: <input class="text-black" value={item.image} onchange={(e) => update_existing_book(e, "image", index())}/></h4>
            <div class="col-span-3 col-start-2 flex flex-row row-start-3">Description: <textarea class="text-black flex-grow" value={item.description} onchange={(e) => update_existing_book(e, "description", index())}/></div>
            <button class="bg-green-400 hover:bg-green-700 text-white col-start-4 row-start-1" onclick={() => update_book(item)}>Update Book</button>
            <button class="bg-red-400 hover:bg-red-700 text-white col-start-4 row-start-2" onclick={() => delete_book(item)}>Delete Book</button>
          </li>
          }
        </For>
      </ul>
      <div class="col-span-3"></div>
      <footer class="grid justify-items-center col-span-3  dark:bg-slate-900 bg-slate-400 grid-cols-subgrid p-10 items-center">
        <div class="text-xs col-start-2">McMasterful Books is used for assignments in McMaster's BVD-103 course.</div>
      </footer>
    </div>
  )
}