import { O3D } from '../gl'
import { html, render } from 'lit-html'

export class Page extends O3D {
  static get observedAttributes () {
    return ['from']
  }

  syncDOM () {
    render(html`
      <!--
        <gl-o3d>
        </gl-o3d>
        <gl-o3d>
          <gl-box velocity=${0.02} color="#00ff00"></gl-box>
        </gl-o3d>
        <gl-o3d>
          <gl-box velocity=${0.03} color="#0f00ff"></gl-box>
        </gl-o3d>
      -->
      <gl-o3d animated layout="moving1">
        <gl-box velocity=${0.01} color="#ff0000"></gl-box>
      </gl-o3d>
      <gl-o3d animated layout="moving2">
        <gl-box velocity=${0.01} color="#00ff00"></gl-box>
      </gl-o3d>
      <gl-o3d animated layout="moving3">
        <gl-box velocity=${0.01} color="#0000ff"></gl-box>
      </gl-o3d>

      <gl-sky-plane></gl-sky-plane>
      <gl-refraction-area></gl-refraction-area>

    `, this.shadowRoot)
  }

  setup () {
    this.lookup('base').onLoop(() => {
      let distnace = 70
      let time = window.performance.now() * 0.001
      let speed = 0.5
      this.layouts = {
        moving1: {
          px: `${distnace} + 50.0 * 0.5 * ${((Math.sin(time * 3.141592 * speed) * Math.sin(time * 3.141592 * speed)) - 0.5)}`,
          py: `50.0 * 0.5 * ${Math.sin(time * 3.141592 * speed) * Math.cos(time * 3.141592 * speed)}`,
          pz: `50.0 * 0.5 * ${Math.sin(time * 3.141592 * speed) * Math.cos(time * 3.141592 * speed)}`
        },
        moving2: {
          px: `0.0 * ${distnace} + 50.0 * 0.5 * ${((Math.sin(time * 3.141592 * speed) * Math.sin(time * 3.141592 * speed)) - 0.5)}`,
          py: `50.0 * 0.5 * ${Math.sin(time * 3.141592 * speed) * Math.cos(time * 3.141592 * speed)}`,
          pz: `50.0 * 0.5 * ${Math.sin(time * 3.141592 * speed) * Math.cos(time * 3.141592 * speed)}`
        },
        moving3: {
          px: `-${distnace} + 50.0 * 0.5 * ${((Math.sin(time * 3.141592 * speed) * Math.sin(time * 3.141592 * speed)) - 0.5)}`,
          py: `50.0 * 0.5 * ${Math.sin(time * 3.141592 * speed) * Math.cos(time * 3.141592 * speed)}`,
          pz: `50.0 * 0.5 * ${Math.sin(time * 3.141592 * speed) * Math.cos(time * 3.141592 * speed)}`
        }
      }
    })
    this.syncDOM()
  }

  add () {
  }

  remove () {
  }
}

window.customElements.define('page-home', Page);
