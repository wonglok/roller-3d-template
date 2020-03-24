import { O3D } from '../gl/index.js'
import { BoxBufferGeometry, MeshBasicMaterial, Color, LineSegments } from 'three'
// import { html, render } from 'lit-html'

export class Box extends O3D {
  static get observedAttributes () {
    return ['color', 'velocity']
  }

  constructor () {
    super()
    this.name = 'Box'
  }

  setup () {
    this.velocity = 0
    this.color = new Color(this.props.color)

    this.geo = new BoxBufferGeometry(50, 50, 50, 15, 15, 15)
    this.mat = new MeshBasicMaterial({ color: this.color })
    this.item = new LineSegments(this.geo, this.mat)

    this.lookup('base').onLoop(() => {
      let time = window.performance.now() * 0.001

      this.color.offsetHSL(0.01, 0.0, 0.0);
      this.mat.color = this.color;

      this.item.rotation.x = time + 5.0 * this.velocity * Math.cos(Math.sin(time))
      this.item.rotation.y = time + 5.0 * this.velocity * Math.cos(Math.sin(time))
    })
  }

  onRefreshProps () {
    if (!this.props) {
      return
    }
    this.velocity = Number(this.props.velocity)
    this.color.setStyle(this.props.color)
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
