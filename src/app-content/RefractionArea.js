import { O3D } from '../gl/index.js'
import { FastBlurShader } from './FastBlurShader.js'
import { Refractor } from 'three/examples/jsm/objects/Refractor.js'
import { PlaneBufferGeometry, Vector2, TextureLoader } from 'three'

export class RefractionArea extends O3D {
  static get observedAttributes () {
    return ['blur', 'image']
  }

  onRefreshProps () {
    // if (this.props.blur && this.renderable) {
    //   this.renderable.material.uniforms['blur'].value = this.props.blur
    // }
  }

  setup () {
    let RES_SIZE = 1024

    this.lookup('base').onResize(() => {
      let camera = this.lookup('camera')
      let depth = 150
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

      let dudv = '/texture/dudv/waterdudv.jpg'
      if (this.props && this.props.image) {
        dudv = this.props.image
      }
      this.renderable.material.uniforms['tDudv'].value = new TextureLoader().load(dudv)
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
        if (this.renderable.material.uniforms['blur'] && this.props.blur) {
          this.renderable.material.uniforms['blur'].value = this.props.blur // Math.abs(Math.sin(time * 0.3))
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
