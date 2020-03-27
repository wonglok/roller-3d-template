import { O3D } from '../gl'
import { html, render } from 'lit-html'
export class Router extends O3D {
  syncDOM () {
    if (this.page === '' || this.page === '/') {
      render(html`
        <page-home></page-home>
    `, this.shadowRoot)
    } else if (this.page === '/red') {
      render(html`
        <page-red></page-red>
      `, this.shadowRoot)
    } else if (this.page === '/404') {
      render(html`
      <page-404 from=${this.from}></page-404>
      `, this.shadowRoot)
    }
  }

  onRefreshProps () {
    this.syncDOM()
  }

  async setup () {
    this.from = ''
    this.page = 'home'

    this.$router = this.$parent.$router
    let onArrive = () => {
      this.page = this.$router.lastRouteResolved().url
      console.log('page change', this.page)
      this.syncDOM()
    }
    let onNotFound = () => {
      let lastURL = this.$router.lastRouteResolved().url
      this.from = `Page not found.... You come from ${lastURL}`
      this.page = `/404`
      this.syncDOM()
    }
    // this.$router.on('', onArrive).resolve()
    this.$router.on('/', onArrive).resolve()
    this.$router.on('/red', onArrive).resolve()
    this.$router.notFound(onNotFound).resolve()
    this.$parent.$router = this.$router


    await this.$router.resolve()
    window.addEventListener('hashchange', () => {
      this.$router.resolve()
    }, false)
  }

  add () {
  }

  remove () {

  }
}

window.customElements.define('gl-router', Router);
