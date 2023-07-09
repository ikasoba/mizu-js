import Mizu, { EventMap } from "./mizu.js";
import * as Reactivity from "./reactive.js";

type First<L extends string> = L extends `${infer S}${string}` ? S : never;
type Tail<L extends string> = L extends `${string}${infer S}` ? S : never;
type StartsWith<
  L extends string,
  L2 extends string
> = L extends `${L2}${infer S}` ? S : never;

type ToPascal<L extends string> = `${Uppercase<First<L>>}${Tail<L>}`;
type ToLowerCamel<L extends string> = `${Lowercase<First<L>>}${Tail<L>}`;

type RemoveNever<P> = {
  [K in { [K in keyof P]: P[K] extends never ? never : K }[keyof P]]?: P[K];
};

type ExtractKey<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

type ExtractLowerKey<T> = {
  [K in Extract<keyof T, string>]: K extends Lowercase<K>
    ? Extract<K, string | number | boolean>
    : never;
}[Extract<keyof T, string>];

type AttrType<E extends Element> = RemoveNever<
  {
    [K in ExtractLowerKey<E>]: Extract<E[K], string>;
  } & {
    [K in `on${ToPascal<Extract<keyof EventMap<E>, string>>}`]: (
      this: E,
      ev: EventMap<E>[Extract<
        keyof EventMap<E>,
        ToLowerCamel<StartsWith<K, "on">>
      >]
    ) => void;
  }
>;

type a = AttrType<HTMLButtonElement>;

export declare namespace JSX {
  export interface IntrinsicElements {
    a: AttrType<HTMLAnchorElement>;
    abbr: AttrType<HTMLElement>;
    address: AttrType<HTMLElement>;
    applet: AttrType<HTMLElement>;
    area: AttrType<HTMLAreaElement>;
    article: AttrType<HTMLElement>;
    aside: AttrType<HTMLElement>;
    audio: AttrType<HTMLAudioElement>;
    b: AttrType<HTMLElement>;
    base: AttrType<HTMLBaseElement>;
    basefont: AttrType<HTMLElement>;
    bdi: AttrType<HTMLElement>;
    bdo: AttrType<HTMLElement>;
    blockquote: AttrType<HTMLQuoteElement>;
    body: AttrType<HTMLBodyElement>;
    br: AttrType<HTMLBRElement>;
    button: AttrType<HTMLButtonElement>;
    canvas: AttrType<HTMLCanvasElement>;
    caption: AttrType<HTMLTableCaptionElement>;
    cite: AttrType<HTMLElement>;
    code: AttrType<HTMLElement>;
    col: AttrType<HTMLTableColElement>;
    colgroup: AttrType<HTMLTableColElement>;
    data: AttrType<HTMLDataElement>;
    datalist: AttrType<HTMLDataListElement>;
    dd: AttrType<HTMLElement>;
    del: AttrType<HTMLModElement>;
    details: AttrType<HTMLDetailsElement>;
    dfn: AttrType<HTMLElement>;
    dialog: AttrType<HTMLDialogElement>;
    dir: AttrType<HTMLDirectoryElement>;
    div: AttrType<HTMLDivElement>;
    dl: AttrType<HTMLDListElement>;
    dt: AttrType<HTMLElement>;
    em: AttrType<HTMLElement>;
    embed: AttrType<HTMLEmbedElement>;
    fieldset: AttrType<HTMLFieldSetElement>;
    figcaption: AttrType<HTMLElement>;
    figure: AttrType<HTMLElement>;
    font: AttrType<HTMLFontElement>;
    footer: AttrType<HTMLElement>;
    form: AttrType<HTMLFormElement>;
    frame: AttrType<HTMLFrameElement>;
    frameset: AttrType<HTMLFrameSetElement>;
    h1: AttrType<HTMLHeadingElement>;
    h2: AttrType<HTMLHeadingElement>;
    h3: AttrType<HTMLHeadingElement>;
    h4: AttrType<HTMLHeadingElement>;
    h5: AttrType<HTMLHeadingElement>;
    h6: AttrType<HTMLHeadingElement>;
    head: AttrType<HTMLHeadElement>;
    header: AttrType<HTMLElement>;
    hr: AttrType<HTMLHRElement>;
    html: AttrType<HTMLHtmlElement>;
    i: AttrType<HTMLElement>;
    iframe: AttrType<HTMLIFrameElement>;
    img: AttrType<HTMLImageElement>;
    input: AttrType<HTMLInputElement>;
    ins: AttrType<HTMLModElement>;
    kbd: AttrType<HTMLElement>;
    label: AttrType<HTMLLabelElement>;
    legend: AttrType<HTMLLegendElement>;
    li: AttrType<HTMLLIElement>;
    link: AttrType<HTMLLinkElement>;
    main: AttrType<HTMLElement>;
    map: AttrType<HTMLMapElement>;
    mark: AttrType<HTMLElement>;
    marquee: AttrType<HTMLMarqueeElement>;
    menu: AttrType<HTMLMenuElement>;
    meta: AttrType<HTMLMetaElement>;
    meter: AttrType<HTMLMeterElement>;
    nav: AttrType<HTMLElement>;
    noscript: AttrType<HTMLElement>;
    object: AttrType<HTMLObjectElement>;
    ol: AttrType<HTMLOListElement>;
    optgroup: AttrType<HTMLOptGroupElement>;
    option: AttrType<HTMLOptionElement>;
    output: AttrType<HTMLOutputElement>;
    p: AttrType<HTMLParagraphElement>;
    param: AttrType<HTMLParamElement>;
    picture: AttrType<HTMLPictureElement>;
    pre: AttrType<HTMLPreElement>;
    progress: AttrType<HTMLProgressElement>;
    q: AttrType<HTMLQuoteElement>;
    rp: AttrType<HTMLElement>;
    rt: AttrType<HTMLElement>;
    ruby: AttrType<HTMLElement>;
    s: AttrType<HTMLElement>;
    samp: AttrType<HTMLElement>;
    script: AttrType<HTMLScriptElement>;
    section: AttrType<HTMLElement>;
    select: AttrType<HTMLSelectElement>;
    slot: AttrType<HTMLSlotElement>;
    small: AttrType<HTMLElement>;
    source: AttrType<HTMLSourceElement>;
    span: AttrType<HTMLSpanElement>;
    strong: AttrType<HTMLElement>;
    style: AttrType<HTMLStyleElement>;
    sub: AttrType<HTMLElement>;
    summary: AttrType<HTMLElement>;
    sup: AttrType<HTMLElement>;
    table: AttrType<HTMLTableElement>;
    tbody: AttrType<HTMLTableSectionElement>;
    td: AttrType<HTMLTableDataCellElement>;
    template: AttrType<HTMLTemplateElement>;
    textarea: AttrType<HTMLTextAreaElement>;
    tfoot: AttrType<HTMLTableSectionElement>;
    th: AttrType<HTMLTableHeaderCellElement>;
    thead: AttrType<HTMLTableSectionElement>;
    time: AttrType<HTMLTimeElement>;
    title: AttrType<HTMLTitleElement>;
  }

  export type Element = ElementType;

  export type Component = Reactivity.Component;
}

export type ElementType = Mizu<HTMLElement[]>;

type ExtractProp<N extends keyof JSX.IntrinsicElements | JSX.Component> =
  N extends JSX.Component
    ? N extends (prop: infer P) => any
      ? P
      : never
    : N extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[N]
    : never;

export function h<
  N extends Extract<keyof JSX.IntrinsicElements, string> | JSX.Component,
  A extends ExtractProp<N>
>(name: N, attrs?: A, ...children: JSX.Element[]) {
  if (typeof name == "string") {
    const e = Mizu.createElement(name);

    for (const k in attrs) {
      if (k.startsWith("on")) {
        const value = attrs[k];
        if (typeof value != "function") continue;
        const handler = value as A[Extract<keyof A, string>] &
          ((...a: any) => any);
        e.on(
          k
            .slice(2)
            .replace(/^./, (x) => x.toLowerCase()) as keyof HTMLElementEventMap,
          handler
        );
      } else if (attrs[k] != null) e.attr(k, "" + attrs[k]);
    }

    e.append(...children);

    return e;
  } else {
    const props: ExtractProp<JSX.Component> | null | undefined = attrs;

    if (children) {
      if (props) (props as any)["children"] = children;
    }

    return name(props ?? ({} as A));
  }
}
