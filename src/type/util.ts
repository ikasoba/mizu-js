export type ArgType<F extends (...a: any) => any> = F extends (
  ...a: infer A
) => any
  ? A
  : never;
