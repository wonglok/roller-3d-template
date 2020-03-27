import { O3D } from '../../gl'
import { html, render } from 'lit-html'
import { CanvasTexture, PlaneBufferGeometry, Mesh, MeshBasicMaterial } from 'three'
import rasterizeHTML from 'rasterizehtml/dist/rasterizeHTML.allinone'

export class ScrollCanvas extends O3D {
  static get observedAttributes () {
    return ['text']
  }

  onRefreshProps () {
    this.renderHTML()
  }

  constructor () {
    super()
    this.canvas = document.createElement('canvas')
    this.dom = document.createElement('div')
    this.wScale = 0.4
  }
  async renderHTML () {
    console.log(this.props)
    this.screenPixelWidth = 500
    render(html`
      <style>
        html, body {
          padding: 0px;
          margin: 0px;
          background: transparent;
        }
        .content {
          width: ${this.screenPixelWidth}px;
          background: rgba(0,0,0,0.3);
          color: black;
        }
      </style>
      <div class="content">
        ${this.props.text || 'Not Found...'}
      </div>
    `, this.dom)

    let res = await rasterizeHTML.drawHTML(this.dom.innerHTML, this.canvas)
    let width = res.image.width
    let height = res.image.height
    let aspect = height / width
    let canvas = document.createElement('canvas')
    let scale = 2
    canvas.width = width * scale
    canvas.height = height * scale
    let ctx = canvas.getContext('2d')
    ctx.scale(scale, scale)
    let sx = 0
    let sy = 0
    let sWidth = width
    let sHeight = height
    let dx = 0
    let dy = 0
    let dWidth = width
    let dHeight = height

    ctx.fillStyle = 'transparent'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(res.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    // console.log(width, height, res.svg)

    this.o3d.position.z = 70
    let tWidth = this.screen.width * this.wScale;
    let texture = new CanvasTexture(canvas)
    let planeGeo = new PlaneBufferGeometry(tWidth, tWidth * aspect)
    planeGeo.computeBoundingBox()
    planeGeo.computeBoundingSphere()

    let planeWidth = Math.abs(planeGeo.boundingBox.min.x) + Math.abs(planeGeo.boundingBox.max.x)
    let planeHeight = Math.abs(planeGeo.boundingBox.min.y) + Math.abs(planeGeo.boundingBox.max.y)
    let planeRadius = planeGeo.boundingSphere.radius
    this.$parent.$emit('size', {
      width: planeWidth,
      radius: planeRadius,
      height: planeHeight,
      depth: 0
    })

    // planeGeo.translate(this.screen.width * -0.5 + planeWidth * 0.5, planeHeight * -0.5 + this.screen.height * 0.5, 0)
    let planeMat = new MeshBasicMaterial({ map: texture, transparent: true })
    let planeItem = new Mesh(planeGeo, planeMat)

    this.planeItem = planeItem
  }
  async setup () {
    await this.renderHTML()
    this.lookup('base').onResize(async () => {
      await this.renderHTML()
    })
  }
  add () {
    if (this.planeItem) {
      this.o3d.children.forEach((v) => {
        this.o3d.remove(v)
      })
      this.o3d.add(this.planeItem)
    }
  }
  remove () {
    if (this.planeItem) {
      this.o3d.remove(this.planeItem)
      this.planeItem.geometry.dispose()
      this.planeItem.material.dispose()
    }
  }
}

window.customElements.define('gl-scroll-canvas', ScrollCanvas);
