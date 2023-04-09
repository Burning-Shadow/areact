import { describe, it, expect } from "vitest";
import AReact from "./AReact";

const act = AReact.act;

function sleep(ms) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, ms)
  );
}

describe("AReact JSX", () => {
  it("should render jsx", async () => {
    const container = document.createElement("div");
    const element = (
      <div id="foo">
        <div id="bar"></div>
        <button></button>
      </div>
    );

    const root = AReact.createRoot(container);
    await act(() => {
      root.render(element);
    });

    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar"></div><button></button></div>'
    );
  });

  it("should render jsx with text", async () => {
    const container = document.createElement("div");
    const element = (
      <div id="foo">
        <div id="bar">Hello</div>
        <button>Add</button>
      </div>
    );

    const root = AReact.createRoot(container);
    await act(() => {
      root.render(element);
    });

    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar">Hello</div><button>Add</button></div>'
    );
  });

  it("should render jsx with different props", async () => {
    const container = document.createElement("div");
    const element = (
      <div id="foo" className="bar">
        <button></button>
      </div>
    );

    const root = AReact.createRoot(container);
    await act(() => {
      root.render(element);
    });

    expect(container.innerHTML).toBe(
      '<div id="foo" class="bar"><button></button></div>'
    );
  });
});

describe("AReact Concurrent", () => {
  it("should render in async", async () => {
    const container = document.createElement("div");
    const element = (
      <div id="foo">
        <div id="bar"></div>
        <button></button>
      </div>
    );

    const root = AReact.createRoot(container);
    root.render(element);

    expect(container.innerHTML).toBe("");
    await sleep(1000);

    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar"></div><button></button></div>'
    );
  });

  it("should render in async", async () => {
    const container = document.createElement("div");
    const element = (
      <div id="foo">
        <div id="bar"></div>
        <button></button>
      </div>
    );

    const root = AReact.createRoot(container);
    // 等待 render 异步执行完成后再执行最后的 expect 对比
    await act(() => {
      root.render(element);
      expect(container.innerHTML).toBe("");
    });

    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar"></div><button></button></div>'
    );
  });
});

describe("Function Component", () => {
  it("should render Function Component", async () => {
    const container = document.createElement("div");
    function App() {
      return (
        <div id="foo">
          <div id="bar"></div>
          <button></button>
        </div>
      );
    }

    const root = AReact.createRoot(container);
    // 等待 render 异步执行完成后再执行最后的 expect 对比
    await act(() => {
      root.render(<App />);
      expect(container.innerHTML).toBe("");
    });

    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar"></div><button></button></div>'
    );
  });

  it("should render nested Function Component", async () => {
    const container = document.createElement("div");
    function App(props) {
      return (
        <div id="foo">
          <div id="bar">{props.title}</div>
          <button></button>
          {props.children}
        </div>
      );
    }

    const root = AReact.createRoot(container);
    // 等待 render 异步执行完成后再执行最后的 expect 对比
    await act(() => {
      root.render(
        <App title="MAIN TITLE">
          <App title="SUB TITLE" />
        </App>
      );
      expect(container.innerHTML).toBe("");
    });

    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar">MAIN TITLE</div><button></button><div id="foo"><div id="bar">SUB TITLE</div><button></button></div></div>'
    );
  });
});
