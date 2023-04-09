/**
 * 人眼对于 100ms 的延迟是无感的
 * 故 requestIdleCallback 会用 50ms 来执行当前任务，并给后边的任务同样预留 50ms 的时间来避免卡顿
 */
window.requestIdleCallback =
  window.requestIdleCallback ||
  function (callback) {
    const start = Date.now();

    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

window.cancelIdleCallback = function (id) {
  clearTimeout(id);
};
