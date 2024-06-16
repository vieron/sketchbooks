type ChildrenNode = (Node | string)[];

export function element<T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  attrs?: Partial<HTMLElementTagNameMap[T]>,
  children?: ChildrenNode
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

export function field(children?: ChildrenNode): HTMLDivElement {
  return element(
    "div",
    {
      className: "mb-[1px] p-1 flex items-center gap-1",
    },
    children ?? []
  );
}

export function controlField(
  labelText: string,
  children?: ChildrenNode
): HTMLElementTagNameMap["div"] {
  const field = element(
    "div",
    {
      className: "mb-[1px] p-1 flex items-center gap-2",
      lang: "en",
    },
    [
      element(
        "label",
        {
          className: "shrink-0 grow-0 font-light text-xs text-slate-300 w-1/4",
        },
        [labelText]
      ),
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

export function button(
  text: string,
  props: Partial<HTMLElementTagNameMap["button"]>
) {
  return element(
    "button",
    {
      ...props,
      className: [
        "inline-block rounded bg-slate-700 text-slate-200 py-1 px-2 align-middle text-xs leading-none font-medium hover:bg-blue-600 hover:text-slate-200 focus:outline-none focus:ring active:text-white",
        props.className,
      ]
        .filter(Boolean)
        .join(" "),
    },
    [text]
  );
}
