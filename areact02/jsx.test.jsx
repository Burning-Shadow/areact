import { describe, it, expect } from "vitest";
import AReact from "./AReact";

describe("AReact JSX", () => {
  it("should render jsx", () => {
    const container = document.createElement("div");
    const element = (
      <div id="foo">
        <div id="bar"></div>
        <button></button>
      </div>
    );

    const root = AReact.createRoot(container);
    root.render(element);

    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar"></div><button></button></div>'
    );
  });

  it("should render jsx with text", () => {
    const container = document.createElement("div");
    const element = (
      <div id="foo">
        <div id="bar">Hello</div>
        <button>Add</button>
      </div>
    );

    const root = AReact.createRoot(container);
    root.render(element);

    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar">Hello</div><button>Add</button></div>'
    );
  });

  it("should render jsx with different props", () => {
    const container = document.createElement("div");
    const element = (
      <div id="foo" className="bar">
        <button></button>
      </div>
    );

    const root = AReact.createRoot(container);
    root.render(element);

    expect(container.innerHTML).toBe(
      '<div id="foo" class="bar"><button></button></div>'
    );
  });
});
