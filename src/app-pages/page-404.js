import { O3D } from '../gl'
import { html, render } from 'lit-html'
import { Scene, Color } from 'three'

export class Page extends O3D {
  static get observedAttributes () {
    return ['from']
  }

  syncDOM () {
    render(html`

      <gl-o3d animated layout="bg">
        <gl-refraction-area depth="-1" image="/texture/dudv/waterdudv.jpg" blur="${this.blur}"></gl-refraction-area>
      </gl-o3d>

      <gl-scroll-canvas text=${this.mytext}></gl-scroll-canvas>

      <gl-sky-plane></gl-sky-plane>
    `, this.shadowRoot)
  }

  setup () {
    this.execute = true
    this.scene = new Scene()
    this.scene.background = new Color('#ffffff')
    this.$parent.scene = this.scene

    this.mytext =  `
      Page not found...
    `
    this.blur = 0.9

    this.lookup('base').onLoop(() => {
      if (!this.execute) { return }
      let distnace = 100
      let time = window.performance.now() * 0.001
      let speed = 0.3
      let openess = `${this.getScreenAtDepth(150).width} * 0.5`

      // this.blur = Math.abs(Math.cos(time * speed * 4.0))

      this.layouts = {
        bg: {
          pz: `-1`
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
    this.scene.add(this.o3d)
  }
  remove () {
    this.execute = false
    this.scene.remove(this.o3d)
  }
}

window.customElements.define('page-404', Page);
