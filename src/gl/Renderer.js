import { WebGLRenderer } from "three"

export class Renderer {
  constructor ({ base, makeGIF }) {
    this.base = base
    let renderer = base.renderer = new WebGLRenderer({
      preserveDrawingBuffer: makeGIF,
      antialias: true,
      alpha: true
    })
    // renderer.domElement.style.marginBottom = '-6px'
    base.getWidth = () => {
      if (makeGIF) {
        return 256
      } else {
        return window.innerWidth
      }
    }
    base.getHeight = () => {
      if (makeGIF) {
        return 256
      } else {
        return window.innerHeight
      }
    }
    base.getDPI = () => {
      if (makeGIF) {
        return 4
      } else {
        return 2
      }
    }

    let resizer = () => {
      let dpi = base.getDPI() // window.devicePixelRatio || 2.0;
      renderer.setSize(base.getWidth(), base.getHeight())
      renderer.setPixelRatio(dpi)
    }
    // resizer()
    base.onResize(resizer)

    return renderer
  }
}
