import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
// import { faFontAwesome, faUps } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSort)
library.add(faSortUp)
library.add(faSortDown)

// library.add(faFontAwesome)
Vue.component('font-awesome-icon', FontAwesomeIcon)
