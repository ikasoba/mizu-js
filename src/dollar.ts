import Mizu from "./mizu.js";
import { State, condition } from "./reactive.js";

export function $<R>(fn: () => R, states: State<any>[]): State<R>;
export function $(query: string): Mizu;
export function $<T extends Element>(node: T): Mizu<[T]>;

export function $<
  A extends
    | [fn: () => any, states: State<any>[]]
    | [query: string]
    | [node: Element]
>(...args: A): State<any> | Mizu | Mizu<[Element]> {
  if (args.length == 2) {
    return condition(args[0], args[1]);
  } else if (typeof args[0] == "string") {
    return Mizu.querySelectorAll(args[0]);
  } else {
    return new Mizu([args[0]]);
  }
}

$.createElement = Mizu.createElement;
$.querySelectorAll = Mizu.querySelectorAll;
$.querySelector = Mizu.querySelector;
