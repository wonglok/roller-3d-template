import { O3D } from '../gl/index.js'
import { BoxBufferGeometry, MeshBasicMaterial, Color, LineSegments } from 'three'
// import { html, render } from 'lit-html'

export class Box extends O3D {
  static get observedAttributes () {
    return ['color', 'velocity']
  }

  onRefreshProps () {
    if (!this.props) {
      return
    }
    this.velocity = Number(this.props.velocity)
    this.color.setStyle(this.props.color)
  }

  setup () {
    // vars
    this.color = new Color(this.props.color)
    this.velocity = 0

    // item
    this.geo = new BoxBufferGeometry(100, 100, 100, 30, 30, 30)
    this.mat = new MeshBasicMaterial({ color: this.color, transparent: true, opacity: 0.5 })
    this.item = new LineSegments(this.geo, this.mat)

    // looper
    this.lookup('base').onLoop(() => {
      let time = window.performance.now() * 0.001

      this.color.offsetHSL(0.01, 0.0, 0.0);
      this.mat.color = this.color;

      this.item.rotation.x = time + 5.0 * this.velocity * Math.cos(Math.sin(time))
      this.item.rotation.y = time + 5.0 * this.velocity * Math.cos(Math.sin(time))
    })
  }

  add () {
    this.o3d.add(this.item)
  }

  remove () {
    this.o3d.remove(this.item)
    this.item.geometry.dispose()
    this.item.material.dispose()
  }
}

window.customElements.define('gl-box', Box);
