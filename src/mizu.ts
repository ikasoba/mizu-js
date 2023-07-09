import { State } from "./reactive.js";

export type EventMap<E extends Element | HTMLElement> = E extends HTMLElement
  ? HTMLElementEventMap
  : ElementEventMap;

/**
 * Class for manipulating any number of HTML elements
 */
export class Mizu<
  Contents extends (Element | HTMLElement)[] = (Element | HTMLElement)[]
> {
  constructor(private contents: Contents) {}

  get length() {
    return this.contents.length;
  }

  /**
   * Returns all children of HTML elements that you have.
   */
  children(): Mizu {
    return new Mizu(this.contents.flatMap((e) => [...e.children]));
  }

  /**
   * Returns the first html element
   */
  first() {
    if (this.contents.length == 0) {
      return new Mizu([]);
    }
    return new Mizu([this.contents[0]]);
  }

  /**
   * Returns the last html element
   */
  last() {
    if (this.contents.length == 0) {
      return new Mizu([]);
    }
    return new Mizu([this.contents[this.contents.length - 1]]);
  }

  /**
   * Return the raw HTML elements you have from the index
   */
  at(index: number) {
    if (index >= 0) {
      return this.contents[index];
    } else {
      return this.contents[this.contents.length - 1];
    }
  }

  /**
   * Apply event handlers to HTML elements that have
   */
  on<K extends keyof EventMap<Contents[number]>>(
    type: Extract<K, string>,
    listener: (
      this: Contents[number],
      ev: EventMap<Contents[number]>[K]
    ) => void
  ): this {
    for (const content of this.contents) {
      content.addEventListener(type, (e) =>
        listener.call(content, e as EventMap<Contents[number]>[K])
      );
    }

    return this;
  }

  /**
   * Remove event handlers from HTML elements that have
   */
  removeListener<K extends keyof EventMap<Contents[number]>>(
    type: Extract<K, string>,
    listener: (
      this: Contents[number],
      ev: EventMap<Contents[number]>[K]
    ) => void
  ): this {
    for (const content of this.contents) {
      content.removeEventListener(type, (e) =>
        listener.call(content, e as EventMap<Contents[number]>[K])
      );
    }

    return this;
  }

  /**
   * Returns the value of the attribute of the first HTML element.
   */
  attr(name: string): string | null;

  /**
   * Sets the attributes of all HTML elements that the instance has.
   */
  attr(name: string, value: string | null): this;

  attr(name: string, value?: string | null) {
    if (value === undefined) {
      for (const content of this.contents) {
        if (value == null) {
          content.removeAttribute(name);
        } else {
          content.setAttribute(name, value);
        }
      }
      return this;
    } else {
      return this.contents[0].getAttribute(name);
    }
  }

  /**
   * Add classes to all HTML elements
   */
  addClass(classNames: string | string[]) {
    if (typeof classNames == "string") {
      classNames = classNames.split(/\s+/);
    }

    for (const e of this.contents) {
      e.classList.add(...classNames);
    }

    return this;
  }

  /**
   * Remove classes from all HTML elements
   */
  removeClass(classNames: string | string[]) {
    if (typeof classNames == "string") {
      classNames = classNames.split(/\s+/);
    }

    for (const e of this.contents) {
      e.classList.remove(...classNames);
    }

    return this;
  }

  /**
   * Set attributes on all HTML elements at once
   */
  setAttrs(obj: { [k: string]: string | null }): this {
    for (const content of this.contents) {
      for (const k in obj) {
        const value = obj[k];
        if (value == null) {
          content.removeAttribute(k);
        } else {
          content.setAttribute(k, value);
        }
      }
    }

    return this;
  }

  /**
   * Iterate all HTML elements
   */
  each(fn: (x: Mizu<[Contents[number]]>, i: number) => void) {
    this.contents.forEach((x, i) => fn(new Mizu([x]), i));
    return this;
  }

  /**
   * Returns HTML elements matching CSS selectors
   */
  filter(query: string): Mizu<Contents[number][]> {
    return new Mizu(this.contents.filter((e) => e.matches(query)));
  }

  /**
   * Returns all child elements of the HTML element held by the instance with the matching CSS selector.
   */
  find(query: string): Mizu {
    return new Mizu(
      this.contents.flatMap((e) => [...e.querySelectorAll(query)])
    );
  }

  /**
   * Add a child to the first HTML element
   */
  append(
    ..._children: (
      | Mizu
      | Node
      | { toString(): string }
      | State<Element | { toString(): string }>
    )[]
  ): this {
    const children = _children
      .map((x) => Mizu.createNode(x))
      .flatMap((x) => (x instanceof Mizu ? [...x] : [x]));

    this.contents[0].append(...children);

    return this;
  }

  /**
   * Returns the iterator of the HTML element that the instance has
   */
  [Symbol.iterator]() {
    return this.contents[Symbol.iterator]();
  }

  /**
   * Adds HTML elements owned by an instance to other elements
   */
  appendTo(node: Element) {
    node.append(Mizu.createNode(this));
    return this;
  }

  static querySelectorAll(query: string): Mizu {
    return new Mizu([...document.querySelectorAll(query)]);
  }

  static querySelector(query: string): Mizu {
    const e = document.querySelector(query);
    const content = e ? [e] : [];
    return new Mizu(content);
  }

  static createElement(name: string) {
    return new Mizu<[HTMLElement]>([document.createElement(name)]);
  }

  static createNode<T>(value: T): Node {
    if (value instanceof Node) {
      return value;
    } else if (value instanceof State) {
      let node = this.createNode(value.value);
      let prevValue = value.value;

      value.onChange(() => {
        const newNode = this.createNode(value.value);

        if (prevValue instanceof Mizu) {
          const first = prevValue.at(0);
          const other = [...prevValue].slice(1);

          first.parentNode?.replaceChild(newNode, first);

          for (const node of other) {
            node.parentNode?.removeChild(node);
          }
        } else {
          node.parentNode?.replaceChild(newNode, node);
        }

        node = newNode;
        prevValue = value.value;
      });

      return node;
    } else if (value instanceof Mizu) {
      const fragment = document.createDocumentFragment();

      for (const node of value) {
        fragment.append(node);
      }

      return fragment;
    } else if (value?.toString) {
      return document.createTextNode(value.toString());
    } else if (value?.valueOf) {
      return document.createTextNode("" + value.valueOf());
    } else if (value == null) {
      return document.createTextNode("" + value);
    } else {
      return document.createTextNode(Object.prototype.toString.call(value));
    }
  }
}

export default Mizu;
