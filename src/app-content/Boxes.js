import { Renderer, PCamera, makeBase, O3D, getScreen } from '../gl'
import { Scene } from 'three'
import { html, render } from 'lit-html'

export class Boxes extends O3D {
  syncDOM () {
    render(html`
      <gl-o3d animated layout="mybox">
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
    this.lookup('base').onLoop(() => {
      let time = window.performance.now() * 0.001
      this.layouts = {
        mybox: {
          px: `${50} * ${Math.sin(time * 3.141592)}`
        }
      }
    })
  }

  add () {
  }

  remove () {
  }
}

window.customElements.define('gl-boxes', Boxes);
