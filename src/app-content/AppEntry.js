import { Renderer, PCamera, makeBase, O3D, Stats } from '../gl'
import { Scene } from 'three'
import { html, render } from 'lit-html'

export class App extends O3D {
  syncDOM () {
    render(html`
      <style>
        :host {
          width: 100%;
          height: 100%;
          background-color: #f2f3f4;
        }
        #mounter {
          position: absolute;
          top: 0px;
          left: 0px;
          height: 100%;
          width: 100%;
        }
      </style>

      <gl-o3d>
        <gl-boxes></gl-boxes>
      </gl-o3d>

      <div id="mounter"></div>
    `, this.shadowRoot)
  }

  onRefreshProps () {
    this.syncDOM()
  }

  setup () {
    this.base = makeBase()
    this.resources = {}
    this.syncDOM()

    this.renderer = new Renderer({ base: this.base, makeGIF: false })
    this.base.mounter = this.$refs.mounter
    this.base.stats = new Stats()
    this.$refs.mounter.appendChild(this.renderer.domElement)

    this.camera = new PCamera({ base: this.base })
    this.camera.position.z = 200

    this.scene = new Scene()

    this.base.onLoop(() => {
      this.renderer.render(this.scene, this.camera)
    })
  }

  add () {
    this.scene.add(this.o3d)
  }

  remove () {
    this.scene.remove(this.o3d)
  }
}

window.customElements.define('app-entry', App);
