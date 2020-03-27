import { O3D } from '../gl/index.js'
import { Mesh, LinearFilter, NearestFilter, TextureLoader, PlaneBufferGeometry, ShaderMaterial, MirroredRepeatWrapping } from 'three'

export class SkyPlane extends O3D {
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
  constructor () {
    super()
    this.o3d.position.z = 0
  }
  setup () {
    // vars
    // this.color = new Color(this.props.color)
    // this.velocity = 0

    let tex = new TextureLoader().load(`/texture/bg/white-flower.jpg`)
    // tex.wrapS = MirroredRepeatWrapping
    // tex.wrapT = MirroredRepeatWrapping
    tex.magFilter = NearestFilter
    tex.minFilter = NearestFilter


    // renderable
    this.material = new ShaderMaterial({
      uniforms: {
        tex: { value: tex },
        time: { value: 0 }
      },
      vertexShader: `

        varying highp vec2 vUv;
        void main (void) {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform sampler2D tex;
        varying highp vec2 vUv;

        void main (void) {

          vec2 swifting = vUv;

          swifting.x = swifting.x + time * 0.1;
          swifting.x = fract(swifting.x);

          swifting.y = swifting.y + time * -0.0;
          swifting.y = fract(swifting.y);

          vec4 color = texture2D(tex, swifting);
          gl_FragColor = vec4(color);
        }
      `
    })

    this.geometry = new PlaneBufferGeometry(this.screen.max, this.screen.max, 2, 2)
    this.renderable = new Mesh(this.geometry, this.material)
    this.lookup('base').onResize(() => {
      this.renderable.position.z = -50
      let screen = this.getScreenAtDepth(-50)
      this.geometry = new PlaneBufferGeometry(screen.max, screen.max, 4, 4)
      this.renderable.geometry = this.geometry
      this.geometry.needsUpdate = true
      this.renderable.needsUpdate = true
      // this.renderable.rotateY(3.1415 * 0.5)
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
        this.renderable.material.uniforms.time.value = time
      }
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

window.customElements.define('gl-sky-plane', SkyPlane);
