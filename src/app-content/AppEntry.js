import { Renderer, PCamera, makeBase, O3D } from '../gl'
import { Scene } from 'three'
import { html, render } from 'lit-html'

export class App extends O3D {
  tree () {
    render(html`
      <style>
        :host {
          width: 100%;
          height: 100%;
          background-color: #f2f3f4;
        }
        #mounter {
          height: 100%;
          width: 100%;
        }
      </style>

      <gl-o3d layout="wrapper">
        <gl-o3d>
          <gl-box velocity="0.01" color="#ff00ff"></gl-box>
          <gl-box velocity="-0.01" color="#0000ff"></gl-box>
        </gl-o3d>
      </gl-o3d>

      <div id="mounter"></div>

    `, this.shadowRoot)
  }

  constructor () {
    super()
    this.name = 'App'
    this.base = makeBase()
    this.resources = {}
    this.refresh()
  }

  refresh () {
    this.tree()
  }

  setup () {
    this.renderer = new Renderer({ base: this.base, makeGIF: false })
    this.mounter = this.$refs.mounter
    this.mounter.appendChild(this.renderer.domElement)

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
    console.log('teardown')
  }
}

window.customElements.define('app-entry', App);
