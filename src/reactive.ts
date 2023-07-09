import Mizu from "./mizu.js";
import { JSX } from "./jsx-runtime.js";
import { ArgType } from "./type/util.js";

interface ReactiveEnviron {
  disposeHandler: (() => void)[];
}

let reactiveEnviron: ReactiveEnviron;

export const getReactiveEnviron = () => reactiveEnviron;
export const resetReactiveEnviron = (): ReactiveEnviron =>
  (reactiveEnviron = {
    disposeHandler: [],
  });

reactiveEnviron = resetReactiveEnviron();

const materialSymbol = Symbol();
export type Material<T> = T & { dispose(): void; [materialSymbol]: true };

export const isMaterial = <T>(value: T): value is Material<T> =>
  (value as any)?.[materialSymbol] === true;

export function createMaterial<T extends object>(
  value: T,
  onDispose: () => void
): Material<T> {
  let isDisposed = false;
  const disposeFn = () => {
    if (!isDisposed) {
      isDisposed = true;
      onDispose();
    }
  };

  const res = value as Material<T>;

  res["dispose"] = disposeFn;
  res[materialSymbol] = true;

  return res;
}

export class State<T> {
  private listener = new Set<() => void>();

  constructor(private currentValue: T, private is = Object.is) {}

  get value() {
    return this.currentValue;
  }

  set value(newValue: T) {
    if (this.is(newValue, this.currentValue)) return;

    this.currentValue = newValue;

    queueMicrotask(() => {
      for (const fn of this.listener) {
        fn();
      }
    });
  }

  onChange(fn: () => void) {
    this.listener.add(fn);
  }

  removeListener(fn: () => void) {
    this.listener.delete(fn);
  }
}

export function useState<T>(value: T, is = Object.is) {
  return new State(value, is);
}

export function useEffect(fn: () => void, states?: State<any>[]) {
  if (states && states.length > 0) {
    for (const state of states) {
      state.onChange(fn);
    }
  } else {
    queueMicrotask(fn);
  }
}

export function onCleanup(fn: () => void) {
  reactiveEnviron.disposeHandler.push(fn);
}

export function condition<R>(fn: () => R, states: State<any>[]): State<R> {
  let state: State<R> | null;
  let prev: R | undefined;

  const wrapper = () => {
    const value = fn();

    if (isMaterial(prev)) {
      prev.dispose();
    }

    if (state == null) {
      state = new State(value);
    }

    prev = state.value = value;

    return state;
  };

  for (const state of states) {
    state.onChange(wrapper);
  }

  state = wrapper();

  return state;
}

export type Component<P = {}> = (prop: P) => JSX.Element;
export function Component<P = {}>(fn: Component<P>): Component<P> {
  return (...args: ArgType<typeof fn>) => {
    resetReactiveEnviron();

    const res: JSX.Element = fn(...args);

    const env = getReactiveEnviron();

    return createMaterial(res, () => env.disposeHandler.forEach((f) => f()));
  };
}
