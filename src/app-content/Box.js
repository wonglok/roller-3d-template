import { O3D } from '../gl/index.js'
import { Mesh, BoxBufferGeometry, MeshBasicMaterial, Color, LineSegments } from 'three'
import { html, render } from 'lit-html'

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
    this.velocity = 0.16

    this.lookup('base').onLoop(() => {
      this.item.rotateX(this.velocity)
    })
  }

  refresh () {
    if (this.props) {
      this.velocity = Number(this.props.velocity)
    }
    if (this.props && this.mat) {
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
