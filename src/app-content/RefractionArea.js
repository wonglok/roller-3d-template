import { O3D } from '../gl/index.js'
import { FastBlurShader } from './FastBlurShader.js'
import { Refractor } from 'three/examples/jsm/objects/Refractor.js'
import { PlaneBufferGeometry, Vector2, TextureLoader } from 'three'

export class RefractionArea extends O3D {
  static get observedAttributes () {
    return ['color', 'velocity']
  }

  onRefreshProps () {
    if (!this.props) {
      return
    }
    // this.velocity = Number(this.props.velocity)
    // this.color.setStyle(this.props.color)
  }

  setup () {
    // vars
    // this.color = new Color(this.props.color)
    // this.velocity = 0

    let camera = this.lookup('camera')

    console.log(camera)

    // renderable
    // this.geometry = new BoxBufferGeometry(100, 100, 100, 30, 30, 30)
    // this.material = new MeshBasicMaterial({ color: this.color, transparent: true, opacity: 0.5 })
    // this.renderable = new LineSegments(this.geometry, this.material)

    // this.o3d.position.z = 100

    let RES_SIZE = 1024
    // this.geometry = new PlaneBufferGeometry(this.screen.width, this.screen.height, 2, 2)
    // this.renderable = new Refractor(this.geometry, {
    //   color: this.color,
    //   textureWidth: RES_SIZE,
    //   textureHeight: RES_SIZE * camera.aspect,
    //   shader: FastBlurShader
    // })

    this.lookup('base').onResize(() => {
      let depth = 100
      let screen = this.getScreenAtDepth(depth)
      this.geometry = new PlaneBufferGeometry(screen.width, screen.height, 2, 2)
      this.remove()
      this.renderable = new Refractor(this.geometry, {
        color: this.color,
        textureWidth: RES_SIZE,
        textureHeight: RES_SIZE * camera.aspect,
        shader: FastBlurShader
      })
      this.renderable.position.z = depth
      this.add()

      this.renderable.material.uniforms['tDudv'].value = new TextureLoader().load('/texture/dudv/palms-only.jpg')
      this.renderable.material.uniforms['resolution'].value = new Vector2(RES_SIZE, RES_SIZE * camera.aspect)

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
    })


    // looper
    this.lookup('base').onLoop(() => {
      let time = window.performance.now() * 0.001
      if (this.renderable) {
        if (this.renderable.material.uniforms['blur']) {
          this.renderable.material.uniforms['blur'].value = 0.9
        }
        this.renderable.material.uniforms['time'].value = time
      }
    })
  }

  add () {
    if (this.renderable) {
      this.o3d.add(this.renderable)
    }
  }

  remove () {
    if (this.renderable) {
      this.o3d.remove(this.renderable)
      this.renderable.geometry.dispose()
    }
    // this.renderable.material.dispose()
  }
}

window.customElements.define('gl-refraction-area', RefractionArea);
