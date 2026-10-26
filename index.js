/**
 * 宿主侧（Node）半边：这个皮肤不需要任何 Host 服务 —— 主题注册、挂件与用量探针
 * 全部发生在浏览器里。保留一个空的 Cordis 插件，是为了让 Loader 的 insert 行
 * 有一个可加载的包入口；client 半边由 package.json 的 `dsh.client` 声明单独下发。
 */

export const name = 'dsh-dalian-xianzun'

/** 无 Host 配置项。 */
export const inject = []

export function apply() {}
