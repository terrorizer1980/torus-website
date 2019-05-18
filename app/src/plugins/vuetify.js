import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify, {
  theme: {
    primary: '#3f51b5',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c',
    torus_accept: '#56ab7f',
    torus_reject: '#959595',
    torus_reject_mild: '#959595',
    torus_active: '#7d7c7e',
    torus_svg_bcg: '#3996ff',
    torus_blue: '#3996ff',
    torus_bcg: '#f7f7f7',
    torus_icon: '#CCCACA'
  },
  options: {
    customProperties: true
  },
  iconfont: 'md'
  // breakpoint: {
  //   thresholds: {
  //     xs: 576
  //   }
  // }
})
