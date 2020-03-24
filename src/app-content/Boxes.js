import { Renderer, PCamera, makeBase, O3D } from '../gl'
import { Scene } from 'three'
import { html, render } from 'lit-html'

export class Boxes extends O3D {
  syncDOM () {
    render(html`
      <gl-o3d>
        <gl-box velocity=${0.01} color="#ff0000"></gl-box>
        <gl-box velocity=${0.02} color="#00ff00"></gl-box>
        <gl-box velocity=${0.03} color="#0f00ff"></gl-box>
      </gl-o3d>
    `, this.shadowRoot)
  }

  onRefreshProps () {
    this.syncDOM()
  }

  setup () {
  }

  add () {
    // this.scene.add(this.o3d)
  }

  remove () {
    // this.scene.remove(this.o3d)
  }
}

window.customElements.define('gl-boxes', Boxes);
