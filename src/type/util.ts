export type ArgType<F extends (...a: any) => any> = F extends (
  ...a: infer A
) => any
  ? A
  : never;

export const wrapArray = <T>(value: T): T extends null | undefined ? [] : [T] =>
  (value == null ? [] : [value]) as any;
