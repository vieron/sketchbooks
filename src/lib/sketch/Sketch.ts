import p5 from "p5";
import queryString from "query-string";
import type { ControlsDef } from "../controls/types";
import type { ControlsOptions } from "../controls/Controls";
import Controls from "../controls/Controls";

type URLParams = Partial<{
  preview: string;
  preset: string;
}>;

export type UserSketch = (
  p: p5,
  el: HTMLDivElement,
  urlParams: URLParams,
  api: {
    createControls: <Defs extends ControlsDef>(
      init: ControlsOptions<Defs>
    ) => Controls<Defs>;
  }
) => void;

export default class Sketch {
  private id: string;
  private el: HTMLDivElement | null;
  private sketch: UserSketch;
  private p5Project: p5 | null;

  private p5El: HTMLDivElement;
  private controlsEl: HTMLDivElement;

  constructor(sketch: UserSketch, id: string = "p5-sketch") {
    this.sketch = sketch;
    this.id = id;
    this.el = null;
    this.p5Project = null;

    this.p5El = document.createElement("div");
    this.controlsEl = document.createElement("div");
  }

  public init() {
    this.el = document.getElementById(this.id) as HTMLDivElement | null;

    if (!this.el) {
      throw new Error(`Element with id "${this.id}" not found`);
    }

    this.p5El.classList.add("grow", "shrink");
    this.el.appendChild(this.p5El);

    try {
      new p5((p5Project) => {
        this.p5Project = p5Project;
        this.initP5Sketch();
      }, this.p5El);
    } catch (error) {
      throw new Error(`Error initializing p5 sketch: ${error}`);
    }
  }

  private initP5Sketch() {
    if (!this.p5Project) return;

    const queryParams = queryString.parse(location.search) as URLParams;

    this.sketch(this.p5Project, this.p5El, queryParams, {
      createControls: <Defs extends ControlsDef>(
        defs: ControlsOptions<Defs>
      ) => {
        this.controlsEl.classList.add(
          ..."grow-0 shrink-0 basis-[300px] w-[300px] h-full px-3 py-3 overflow-y-auto bg-slate-800".split(
            " "
          ),
          queryParams.preview ? "hidden" : "visible"
        );
        this.el!.appendChild(this.controlsEl);

        const controls = new Controls(defs, this.controlsEl);

        controls.subscribe(() => this.p5Project?.draw());

        return controls;
      },
    });
  }
}
