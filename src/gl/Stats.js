import Stats3JS from 'stats.js'
export class Stats {
  constructor () {
    var stats = new Stats3JS()
    stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom)
    return stats
  }
}