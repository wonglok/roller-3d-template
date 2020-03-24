import { O3D } from '../gl/index.js'
import { BoxBufferGeometry, MeshBasicMaterial, Color, LineSegments } from 'three'
// import { html, render } from 'lit-html'

export class Box extends O3D {
  static get observedAttributes() {
    return ['color', 'velocity']
  }

  constructor () {
    super()
    this.name = 'Box'
  }

  setup () {
    this.geo = new BoxBufferGeometry(50, 50, 50, 3, 3, 3)
    this.mat = new MeshBasicMaterial({ color: new Color(this.props.color) })
    this.item = new LineSegments(this.geo, this.mat)
    this.velocity = 0.1

    this.lookup('base').onLoop(() => {
      let time = window.performance.now() * 0.0001
      this.item.rotateX(0.01 + 0.5 * this.velocity * Math.abs(Math.sin(time)))
      this.item.rotateY(0.01 + 0.5 * this.velocity * Math.abs(Math.sin(time)))
    })
  }

  onRefreshProps () {
    if (!this.props) {
      return
    }
    this.velocity = Number(this.props.velocity)

    if (this.mat) {
      this.mat.color = new Color(this.props.color)
    }
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
