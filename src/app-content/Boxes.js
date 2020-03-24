import { Renderer, PCamera, makeBase, O3D } from '../gl'
import { Scene } from 'three'
import { html, render } from 'lit-html'

export class Boxes extends O3D {
  syncDOM () {
    let timer = this.timer
    render(html`
      <gl-o3d>
        <gl-box velocity="${timer + 0.001}" color="#ff00ff"></gl-box>
        <gl-box velocity="${timer + 0.002}" color="#0000ff"></gl-box>
        <gl-box velocity="${timer + 0.003}" color="#0f00ff"></gl-box>
        <gl-box velocity="${timer + 0.004}" color="#ff0000"></gl-box>
      </gl-o3d>
    `, this.shadowRoot)
  }

  onRefreshProps () {
    this.syncDOM()
  }

  setup () {
    this.timer = 0
    this.lookup('base').onLoop(() => {
      this.timer = Math.sin(window.performance.now() * 0.001) * 0.01
      this.syncDOM()
    })
  }

  add () {
    // this.scene.add(this.o3d)
  }

  remove () {
    // this.scene.remove(this.o3d)
  }
}

window.customElements.define('gl-boxes', Boxes);
