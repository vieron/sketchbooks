export function element<T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  attrs?: Partial<HTMLElementTagNameMap[T]>,
  children?: (Node | string)[]
): HTMLElementTagNameMap[T] {
  const el = document.createElement(tagName);

  Object.entries(attrs ?? {}).forEach(([key, value]) => {
    const isEventListener =
      key.match(/^on[a-z]*/i) && typeof value === "function";

    if (isEventListener) {
      const eventName = key.match(/^on([a-z]*)$/i)?.[1].toLowerCase();

      if (eventName) {
        el.addEventListener(eventName, value);
      }
    } else if (key === "className") {
      el.classList.add(...value.split(" "));
    } else {
      el.setAttribute(key, value);
    }
  });

  if (children?.length) {
    children.forEach((node) => {
      const child =
        typeof node === "string" ? document.createTextNode(node) : node;

      el.appendChild(child);
    });
  }

  return el;
}

export function field(children?: (Node | string)[]): HTMLDivElement {
  return element(
    "div",
    {
      className: "mb-[1px] bg-white p-1 flex items-center gap-1",
    },
    children ?? []
  );
}

export function controlField(
  labelText: string,
  children?: (Node | string)[]
): HTMLElementTagNameMap["div"] {
  const label = element(
    "label",
    {
      className: "shrink-0 grow-0 font-light text-xs text-black w-1/4",
    },
    [labelText]
  );

  const field = element(
    "div",
    {
      className: "mb-[1px] bg-white p-1 flex items-center gap-1",
    },
    [
      label,
      element(
        "div",
        {
          className: "shrink-1 grow-1 w-3/4",
        },
        children
      ),
    ]
  );

  return field;
}
