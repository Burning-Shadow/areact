import "../requestIdleCallbackPolyfill";

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.flat().map((child) => {
        return typeof child !== "object" ? createTextElement(child) : child;
      }),
    },
  };
}

function createTextElement(text) {
  return {
    type: "HostText",
    props: { nodeValue: text, children: [] },
  };
}

const isProperty = (key) => key !== "children";
let workInProgress = null; // 当前处理的 fiber 节点
let workInProgressRoot = null; // 当前处理的 fiberRoot 节点

class AReactDomRoot {
  _internalRoot = null;
  constructor(container) {
    this.container = container;
    this._internalRoot = {
      current: null,
      containerInfo: container,
    };
  }

  render(element) {
    this._internalRoot.current = {
      alternate: {
        stateNode: this._internalRoot.containerInfo,
        props: {
          children: [element],
        },
      },
    };
    workInProgressRoot = this._internalRoot;
    workInProgress = workInProgressRoot.current.alternate;

    window.requestIdleCallback(workloopConcurrent);
  }
}

function workloopConcurrent() {
  while (workInProgress) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}

// 接收将要处理的 fiber
function performUnitOfWork(fiber) {
  // 处理当前 fiber: 创建 DOM【但 Function 节点不可以】，设置 props，插入当前 DOM 至 parent
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    fiber.props.children = [fiber.type(fiber.props)];
  } else {
    if (!fiber.stateNode) {
      fiber.stateNode =
        fiber.type === "HostText"
          ? document.createTextNode("")
          : document.createElement(fiber.type);
      Object.keys(fiber.props)
        .filter(isProperty)
        .forEach((key) => {
          fiber.stateNode[key] = fiber.props[key];
        });
    }

    if (fiber.return) {
      // 网上查找，直到找到存在 stateNode 的节点
      let domParentFiber = fiber.return;
      while (!domParentFiber.stateNode) {
        domParentFiber = domParentFiber.return;
      }

      domParentFiber.stateNode.appendChild(fiber.stateNode);
    }
  }

  // 初始化 children 的 fiber
  let prevSibling = null;
  fiber.props.children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      stateNode: null,
      props: child.props,
      return: fiber,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
  });

  // 返回下一个要处理的 fiber
  return getNextFiber(fiber);
}

/**
 * 遍历顺序:
 * 先遍历 child
 * 然后是 sibling
 * 然后 return 并找下一个 sibling
 */
function getNextFiber(fiber) {
  if (fiber.child) return fiber.child;

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    else nextFiber = nextFiber.return;
  }

  return null;
}

function createRoot(container) {
  return new AReactDomRoot(container);
}

/**
 * 间歇性的判断 workInProgress 是否存在值即可判断是否结束
 */
function act(callback) {
  callback();

  return new Promise((resolve) => {
    function loop() {
      if (workInProgress) {
        window.requestIdleCallback(loop);
      } else {
        resolve();
      }
    }
    loop();
  });
}

export default { createElement, createRoot, act };
