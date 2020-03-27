import { O3D } from '../gl/index.js'
import { BoxBufferGeometry, MeshBasicMaterial, Color, LineSegments } from 'three'

export class Box extends O3D {
  static get observedAttributes () {
    return ['color', 'velocity']
  }

  onRefreshProps () {
    if (!this.props) {
      return
    }
    this.velocity = Number(this.props.velocity)
    if (this.color) {
      this.color.setStyle(this.props.color)
    }
  }

  setup () {
    // vars
    this.color = new Color(this.props.color)
    this.velocity = 0

    // renderable
    this.geometry = new BoxBufferGeometry(50, 50, 50, 30, 30, 30)
    this.material = new MeshBasicMaterial({ color: this.color, transparent: true, opacity: 0.5 })
    this.renderable = new LineSegments(this.geometry, this.material)

    // geometry
    this.geometry.computeBoundingSphere()
    this.geometry.computeBoundingBox()

    // size
    this.$parent.$emit('size', {
      radius: this.geometry.boundingSphere.radius,
      width: Math.abs(this.geometry.boundingBox.min.x) + Math.abs(this.geometry.boundingBox.max.x),
      height: Math.abs(this.geometry.boundingBox.min.y) + Math.abs(this.geometry.boundingBox.max.y),
      depth: Math.abs(this.geometry.boundingBox.min.z) + Math.abs(this.geometry.boundingBox.max.z)
    })

    // looper
    this.lookup('base').onLoop(() => {
      let time = window.performance.now() * 0.001

      this.color.offsetHSL(0.01, 0.0, 0.0);
      this.material.color = this.color;

      this.renderable.rotation.x = time + 5.0 * this.velocity * Math.cos(Math.sin(time))
      this.renderable.rotation.y = time + 5.0 * this.velocity * Math.cos(Math.sin(time))
    })
  }

  add () {
    this.o3d.add(this.renderable)
  }

  remove () {
    this.o3d.remove(this.renderable)

    this.renderable.geometry.dispose()
    this.renderable.material.dispose()
  }
}

window.customElements.define('gl-box', Box);
