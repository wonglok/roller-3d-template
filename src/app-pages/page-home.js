import { O3D } from '../gl'
import { html, render } from 'lit-html'

export class Page extends O3D {
  static get observedAttributes () {
    return ['from']
  }

  syncDOM () {
    render(html`
      <gl-o3d animated layout="moving1">
        <gl-box velocity=${0.01} color="#ff0000"></gl-box>
      </gl-o3d>

      <gl-o3d animated layout="moving2">
        <gl-box velocity=${0.01} color="#00ff00"></gl-box>
      </gl-o3d>

      <gl-o3d animated layout="moving3">
        <gl-box velocity=${0.01} color="#0000ff"></gl-box>
      </gl-o3d>

      <gl-o3d animated layout="moving4">
        <gl-refraction-area blur="${this.blur}"></gl-refraction-area>
      </gl-o3d>

      <gl-sky-plane></gl-sky-plane>
    `, this.shadowRoot)
  }

  setup () {
    this.blur = 0.5

    this.lookup('base').onLoop(() => {
      let distnace = 70
      let time = window.performance.now() * 0.001
      let speed = 0.3
      let openess = `${this.getScreenAtDepth(150).width} * ${Math.sin(time * speed)}`

      this.blur = Math.cos(time * speed * 4.0)

      this.layouts = {
        moving1: {
          px: `${distnace} + 50.0 * 0.5 * ${((Math.sin(time * 3.141592 * speed) * Math.sin(time * 3.141592 * speed)) - 0.5)}`,
          py: `50.0 * 0.5 * ${Math.sin(time * 3.141592 * speed) * Math.cos(time * 3.141592 * speed)}`,
          pz: `50.0 * 0.5 * ${Math.sin(time * 3.141592 * speed) * Math.cos(time * 3.141592 * speed)}`
        },
        moving2: {
          px: `50.0 * 0.5 * ${((Math.sin(time * 3.141592 * speed) * Math.sin(time * 3.141592 * speed)) - 0.5)}`,
          py: `50.0 * 0.5 * ${Math.sin(time * 3.141592 * speed) * Math.cos(time * 3.141592 * speed)}`,
          pz: `50.0 * 0.5 * ${Math.sin(time * 3.141592 * speed) * Math.cos(time * 3.141592 * speed)}`
        },
        moving3: {
          px: `-${distnace} + 50.0 * 0.5 * ${((Math.sin(time * 3.141592 * speed) * Math.sin(time * 3.141592 * speed)) - 0.5)}`,
          py: `50.0 * 0.5 * ${Math.sin(time * 3.141592 * speed) * Math.cos(time * 3.141592 * speed)}`,
          pz: `50.0 * 0.5 * ${Math.sin(time * 3.141592 * speed) * Math.cos(time * 3.141592 * speed)}`
        },
        moving4: {
          visible: true,
          px: openess
        }
      }

      this.syncDOM()
    })
  }

  add () {
  }

  remove () {
  }
}

window.customElements.define('page-home', Page);
