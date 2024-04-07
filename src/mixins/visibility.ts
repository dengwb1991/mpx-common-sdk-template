/**
 * visibility Mixin
 */
import { getMixin } from '@mpxjs/core'

const EVENT_TOGGLE = 'toggle'

export default getMixin({
  properties: {
    visible: {
      type: Boolean,
      value: false
    }
  },
  data: {
    isVisible: false
  },
  watch: {
    isVisible (val) {
      this.triggerEvent(EVENT_TOGGLE, {
        value: val
      })
    }
  },
  methods: {
    show () {
      this.isVisible = true
    },
    hide () {
      this.isVisible = false
    }
  },
  created () {
    this.$watch('visible', (newVal, oldVal) => {
      console.log(newVal, oldVal)
      if (newVal) {
        this.show()
      } else if (oldVal) {
        this.hide()
      }
    }, {
      immediate: true
    })
  }
})
