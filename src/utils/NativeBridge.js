const NativeBridge = {
  // 存储回调的容器
  callbacks: {},

  // 发起请求
  call: function (action, params) {
    if (!window.webkit || !window.webkit.messageHandlers || !window.webkit.messageHandlers.native) {
      return undefined;
    }
    const callbackId = `cb_${action}_${Math.random().toString(36).substring(2, 5)}`;
    return new Promise((resolve, reject) => {
      // 生成一个唯一的 ID（防止多个并发请求混淆）
      this.callbacks[callbackId] = resolve;

      window.webkit.messageHandlers.native.postMessage({
        action: action,
        params: params,
        callback: callbackId // 把 ID 传给 Native
      });
    });
  },

  // 供 Native 调用的统一回传入口
  receive: function (callbackId, data) {
    if (this.callbacks[callbackId]) {
      this.callbacks[callbackId](data); // 执行 resolve
      delete this.callbacks[callbackId]; // 销毁引用
    }
  },

  /**
   * 获取屏幕方向
   * @returns {Promise<'portrait' | 'landscape'>} 
   */
  async getOrientationMode() {
    return this.call('getOrientationMode')
  },
  /**
   * 屏幕是否锁定
   * @returns {Promise<boolean>}
   */
  async isScreenLocked() {
    return this.call('isScreenLocked')
  },
  /**
   * 锁定或解锁屏幕旋转
   * @param {bool} lock 
   */
  async lockScreen(lock) {
    return this.call('lockScreen', { lock })
  },
  /**
   * 旋转屏幕
   * @param {'portrait'|'landscape'} mode 
   * @returns {Promise<boolean>}
   */
  async rotateOrientation(mode) {
    return this.call('rotateOrientation', { mode })
  },
};

export default NativeBridge;