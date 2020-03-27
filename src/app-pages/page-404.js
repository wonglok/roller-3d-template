import { O3D } from '../gl'
import { html, render } from 'lit-html'

export class Page extends O3D {
  static get observedAttributes () {
    return ['from']
  }

  syncDOM () {
    render(html`
      <gl-o3d animated layout="moving">
        <gl-scroll-canvas text=${this.props.from}></gl-scroll-canvas>
      </gl-o3d>
    `, this.shadowRoot)
  }

  setup () {
    this.lookup('base').onLoop(() => {
      let time = window.performance.now() * 0.001
      let speed = 0.5
      this.layouts = {
        moving: {
          px: `child.width * 0.5 * ${((Math.sin(time * 3.141592 * speed) * Math.sin(time * 3.141592 * speed)) - 0.5)}`,
          py: `child.height * 0.5 * ${Math.sin(time * 3.141592 * speed) * Math.cos(time * 3.141592 * speed)}`,
          pz: `child.depth * 0.5 * ${Math.sin(time * 3.141592 * speed) * Math.cos(time * 3.141592 * speed)}`
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

window.customElements.define('page-404', Page);
