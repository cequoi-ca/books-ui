import adapter from 'adapter';
import { JSXElement } from 'solid-js';

interface Props {
    children: JSXElement,
    title?: string
}

export default function PageWrapper(props: Props) {
    let assignment : string = adapter.assignment;
    let title : string = props.title ?? "";

    return (
        <div class="grid grid-cols-[1fr_minmax(900px,_3fr)_1fr] grid-rows-[auto_auto_auto_min-content_min-content_1fr_auto] min-h-[100dvh]">
          <header class="grid justify-items-center row-start-1 col-span-3 dark:bg-slate-900 bg-slate-300 p-10 grid-cols-subgrid items-center row-span-3 gap-y-2">
            <h2 class="text-md col-start-2">{assignment}</h2>
            <h1 class="text-xl col-start-2 row-start-2">McMasterful Books</h1>
            <h2 class="text-lg col-start-2 row-start-3">{title}</h2>
          </header>

          {props.children}
          
            <div class="col-span-3"></div>
            <footer class="grid justify-items-center col-span-3  dark:bg-slate-900 bg-slate-400 grid-cols-subgrid p-10 items-center">
                <div class="text-xs col-start-2">McMasterful Books is used for assignments in McMaster's BVD-103 course.</div>
            </footer>
        </div>
    )
}