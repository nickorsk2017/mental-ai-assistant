/**
 * Minimal d3 fluent API for Jest (avoids loading ESM d3 in node_modules).
 */

type Selection = {
  selectAll: (selector?: string) => Selection;
  remove: () => undefined;
  append: (tag: string) => Selection;
  attr: (name: string, value?: unknown) => Selection;
  datum: (data: unknown) => Selection;
  data: (data: unknown) => { join: (tag: string) => Selection };
  call: (callback: (selection: Selection) => void) => Selection;
  text: (value: string) => Selection;
  select: (selector: string) => Selection;
};

function createSelection(): Selection {
  const self: Selection = {
    selectAll: () => self,
    remove: () => undefined,
    append: () => createSelection(),
    attr: () => self,
    datum: () => self,
    data: () => ({
      join: () => createSelection(),
    }),
    call: (callback) => {
      if (typeof callback === 'function') {
        callback(createSelection());
      }
      return self;
    },
    text: () => self,
    select: () => createSelection(),
  };
  return self;
}

export function select() {
  return createSelection();
}

export function scaleLinear() {
  const scale = (value: number) => value;
  const chainable = Object.assign(scale, {
    domain: () => chainable,
    range: () => chainable,
  });
  return chainable;
}

function createLineOrAreaBuilder() {
  const builder = () => '';
  return Object.assign(builder, {
    curve: () => builder,
    x: () => builder,
    y: () => builder,
    y0: () => builder,
    y1: () => builder,
  });
}

export function line() {
  return createLineOrAreaBuilder();
}

export function area() {
  return createLineOrAreaBuilder();
}

export function axisBottom() {
  const axis = () => undefined;
  return Object.assign(axis, {
    tickValues: () => axis,
    tickFormat: () => axis,
  });
}

export const curveMonotoneX = {};
export const curveLinear = {};
