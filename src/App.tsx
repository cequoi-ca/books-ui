import { For, createEffect, createResource, createSignal } from 'solid-js'
import adapter from 'adapter';
import assignment from './assignment-1';
import assignment_2 from './assignment-2';

function App() {
  if (adapter.assignment == "assignment-1") {
    return assignment(adapter);
  } else if (adapter.assignment == "assignment-2") {
    return assignment_2(adapter);
  }
}

export default App

