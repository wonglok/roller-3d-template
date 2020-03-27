import { getScreen } from './Screen'
import { Object3D } from 'three'
import { Parser } from 'expr-eval'

// import compose from "lodash/fp/compose"
export const castDownEvent = (vm, ev, data) => {
  if (vm && vm.o3d.children.length > 0) {
    vm.$emit(ev, data)
    vm.o3d.children.forEach((kid) => {
      castDownEvent(kid, ev, data)
    })
  }
}

let parent = (vm) => vm.parentElement || vm.getRootNode().host

// let getVal = (n, key) => n && n[key]

let lookup = (vm, key) => {
  if (parent(vm) && parent(vm)[key]) {
    return parent(vm)[key]
  } else {
    vm = parent(vm)
    if (!vm) {
      return false
    }
    return lookup(vm, key)
  }
}

export class O3D extends HTMLElement {
  static get observedAttributes () {
    return ['layout', 'visible']
  }

  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.$refs = new Proxy(this, {
      get (obj, key) {
        return obj.shadowRoot.querySelector('#' + key)
      }
    })
    this._ready = false
    this._eventCleaners = []
    this._name = this.constructor.name

    // Public APIs
    this.props = {}
    this.o3d = new Object3D()
    this.o3d.visible = false

    this.child = {
      width: 0.000000000000001,
      height: 0.000000000000001,
      depth: 0.000000000000001,
      radius: 0.000000000000001
    }
    this.$on('size', ({ detail }) => {
      this.child = detail
      this.onSyncFormula()
    })
  }

  get $parent () {
    return this.parentElement || this.getRootNode().host
  }

  $emit (ev, data) {
    this.dispatchEvent(new CustomEvent(ev, { detail: data }))
  }

  $on (ev, handler) {
    this.addEventListener(ev, handler)
    this._eventCleaners.push(() => {
      this.removeEventListener(ev, handler)
    })
  }

  lookup (key) {
    if (!key) {
      throw new Error('must have key')
    }
    return lookup(this, key)
  }

  attr (key) {
    return this.getAttribute(key)
  }

  hasAttr (key) {
    return this.hasAttribute(key)
  }

  async connectedCallback() {
    if (this.isConnected) {
      if (this.setup) {
        console.log(this._name, 'setup')
        await this.setup()
      }

      if (this.add) {
        console.log(this._name, 'add hook')
        this.add()
      }

      let parentO3D = this.lookup('o3d')
      if (parentO3D) {
        console.log(this._name, 'add to parent', this.$parent._name)
        parentO3D.add(this.o3d)
      }

      if (this.base) {
        console.log(this._name, 'loop init')
        this.base.onInit()
      }

      if (this.onRefreshProps) {
        this.onRefreshProps()
        this.onRefreshInternalProps()
        this._ready = true
        this.o3d.visible = true
      }

      if (this.hasAttr('animated')) {
        this.lookup('base').onLoop(() => {
          this.onRefreshInternalProps()
        })
      }
    }
  }

  onRefreshInternalProps () {
    if (this.hasAttribute('visible')) {
      let visible = true
      if (this.props.visible === 'false') {
        visible = false
      }
      this.o3d.visible = visible
    }
    this.onSyncFormula()
  }

  get right () {
    let val = 0
    try {
      val = Parser.evaluate(`screen.width * 0.5 - scaleX * width * 0.5 - padding`, this)
    } catch (e) {
      console.log(e)
    }
    return val
  }

  get left () {
    let val = 0
    try {
      val = Parser.evaluate(`screen.width * -0.5 + scaleX * width * 0.5 + padding`, this)
    } catch (e) {
      console.log(e)
    }
    return val
  }

  get top () {
    let val = 0
    try {
      val = Parser.evaluate(`screen.height * 0.5 + scaleY * height * -0.5 - padding`, this)
    } catch (e) {
      console.log(e)
    }
    return val
  }

  get bottom () {
    let val = 0
    try {
      val = Parser.evaluate(`screen.height * -0.5 + scaleY * height * 1 - padding`, this)
    } catch (e) {
      console.log(e)
    }
    return val
  }

  getScreenAtDepth (depth) {
    return getScreen({ camera: this.lookup('camera'), depth })
  }

  get screen () {
    return getScreen({ camera: this.lookup('camera'), depth: this.o3d.position.z })
  }

  get layout () {
    let layoutMap = this.lookup('layouts')
    let layoutName = this.attr('layout')
    if (layoutMap && layoutName && layoutMap[layoutName]) {
      return layoutMap[layoutName]
    } else {
      return {}
    }
  }

  onSyncFormula () {
    let run = (fnc) => {
      try {
        fnc()
      } catch (e) {
        console.log(this._name, e)
      }
    }

    // console.log(this.layout)

    run(() => { this.o3d.rotation.x = Parser.evaluate('' + (this.layout.rx || '0'), this) })
    run(() => { this.o3d.rotation.y = Parser.evaluate('' + (this.layout.ry || '0'), this) })
    run(() => { this.o3d.rotation.z = Parser.evaluate('' + (this.layout.rz || '0'), this) })

    run(() => { this.scaleX = this.o3d.scale.x = Parser.evaluate('' + (this.layout.sx || '1'), this) })
    run(() => { this.scaleY = this.o3d.scale.y = Parser.evaluate('' + (this.layout.sy || '1'), this) })
    run(() => { this.scaleZ = this.o3d.scale.z = Parser.evaluate('' + (this.layout.sz || '1'), this) })

    run(() => { this.o3d.position.x = Parser.evaluate('' + (this.layout.px || '0'), this) })
    run(() => { this.o3d.position.y = Parser.evaluate('' + (this.layout.py || '0'), this) })
    run(() => { this.o3d.position.z = Parser.evaluate('' + (this.layout.pz || '0'), this) })
  }

  disconnectedCallback() {
    if (!this.isConnected) {
      if (this.remove) {
        console.log(this._name, 'remove hook')
        this.remove()
      }

      let parentO3D = this.lookup('o3d')
      if (parentO3D) {
        console.log(this._name, 'remove from parent', this.$parent._name)
        parentO3D.remove(this.o3d)
      }

      if (this.base) {
        console.log(this._name, 'loop teardown')
        this.base.onTearDown()
      }

      if (this._eventCleaners) {
        this._eventCleaners.forEach(c => c())
      }
    }
  }

  onRefreshProps () {
  }

  attributeChangedCallback (name, oldValue, newValue) {
    this.props[name] = newValue
    if (this._ready) {
      this.onRefreshProps()
      this.onRefreshInternalProps()
    }
    // this.props[name] = newValue
    // console.log(name, 'change attr', oldValue, newValue)
  }
}

// const Root = {}
// const MixedO3D = compose(MXO3D)(Root)
// export const O3D = MixedO3D;

window.customElements.define('gl-o3d', O3D);
