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

export function controlField(
  labelText: string,
  children?: (Node | string)[]
): HTMLElementTagNameMap["div"] {
  const label = element(
    "label",
    {
      className:
        "block font-medium text-[0.6rem] text-slate-600 uppercase mb-1",
    },
    [labelText]
  );

  const field = element(
    "div",
    {
      className: "mb-2 bg-white p-2",
    },
    [label, ...(children ?? [])]
  );

  return field;
}
