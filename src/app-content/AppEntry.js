import { Renderer, PCamera, makeBase, O3D, Stats, makeScroller } from '../gl'
import { Scene } from 'three'
import { html, render } from 'lit-html'
import Navigo from 'navigo'

export class AppEntry extends O3D {
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
        #stats {
          position: absolute;
          top: 0px;
          right: 0px;
        }
      </style>

      <gl-router></gl-router>

      <div id="mounter"></div>
      <div id="stats"></div>
    `, this.shadowRoot)
  }

  onRefreshProps () {
    this.syncDOM()
  }

  onMove () {

  }

  setup () {
    // BEFORE MOUNT
    // Setup loop
    this.base = makeBase()
    this.$router = new Navigo(location.origin)
    this.resources = {}

    // MOUNT
    // create dom
    this.syncDOM()

    // MOUNTED
    // get mounter
    this.mounter = this.$refs.mounter
    this.base.mounter = this.mounter
    this.limit = {
      canRun: true,
      y: 10
    }

    this.scroller = makeScroller({ base: this.base, mounter: this.mounter, limit: this.limit, onMove: () => { this.onMove() } })

    // insert renderer
    this.renderer = new Renderer({ base: this.base, makeGIF: false })
    this.mounter.appendChild(this.renderer.domElement)

    // prepare camera
    this.camera = new PCamera({ base: this.base })
    this.camera.position.z = 200

    // prepare scene
    this.scene = new Scene()

    // prepare render loop
    this.base.onLoop(() => {
      if (this.scene) {
        this.renderer.render(this.scene, this.camera)
      }
    })

    // statistics
    if (process.env.NODE_ENV === 'development') {
      this.base.stats = new Stats({ mounter: this.$refs.stats })
    }

    let i = 0
    window.onclick = () => {
      if (i%2 === 0) {
        this.$router.navigate('/red')
      } else {
        this.$router.navigate('/')
      }
      i++
    }
    window.ontouchstart = () => {
      if (i%2 === 0) {
        this.$router.navigate('/red')
      } else {
        this.$router.navigate('/')
      }
      i++
    }
  }

  add () {
    this.scene.add(this.o3d)
  }

  remove () {
    this.scene.remove(this.o3d)
  }
}

window.customElements.define('app-entry', AppEntry);
