import { JSXElement } from 'solid-js';

interface Props {
    children: JSXElement,
    title?: string,
    routes?: Record<string, string>
}

export default function PageWrapper(props: Props) {
    let title : string = props.title ?? "";
    let routes : Record<string, string>= props.routes ?? {};

    let route_elements = Object.keys(routes).map((key) => {
        let route = routes[key];
        return (<a href={route} class="text-md text-blue-200 hover:text-blue-400">{key}</a>);
    });

    return (
        <div class="grid grid-cols-[1fr_minmax(900px,_3fr)_1fr] grid-rows-[auto_auto_auto_min-content_min-content_1fr_auto] min-h-[100dvh] bg-gray-50 dark:bg-slate-800">
          <header class="grid justify-items-center row-start-1 col-span-3 dark:bg-slate-900 bg-white p-10 grid-cols-subgrid items-center row-span-2 gap-y-2 border-b-2 border-gray-200 dark:border-slate-700">
            <h1 class="text-4xl font-bold col-start-2 row-start-1 tracking-wider">BOOKS</h1>
            <h2 class="text-lg col-start-2 row-start-2 text-gray-600 dark:text-gray-300">{title}</h2>
            <div class="flex flex-col col-start-1 row-start-1 row-span-2 gap-2">
                {route_elements}
            </div>
          </header>

          {props.children}

            <div class="col-span-3"></div>
            <footer class="grid justify-items-center col-span-3 dark:bg-slate-900 bg-white grid-cols-subgrid p-10 items-center border-t-2 border-gray-200 dark:border-slate-700">
                <div class="text-xs col-start-2 text-gray-500 dark:text-gray-400">McMasterful Books is used for assignments in McMaster's BVD-103 course.</div>
            </footer>
        </div>
    )
}