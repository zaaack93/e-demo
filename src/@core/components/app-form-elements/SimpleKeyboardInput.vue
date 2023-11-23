<script>
import Keyboard from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'
import layout from 'simple-keyboard-layouts/build/layouts/arabic'

export default {
  name: 'SimpleKeyboard',
  props: {
    keyboardClass: {
      default: 'simple-keyboard',
      type: String,
    },
    input: {
      type: String,
    },
  },
  data: () => ({
    keyboard: null,
  }),
  watch: {
    input(input) {
      this.keyboard.setInput(input)
    },
  },
  mounted() {
    this.keyboard = new Keyboard({
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      ...layout,
      rtl: true,
    })

    this.keyboard.setInput(this.input)

    console.log('input', this.input)
  },
  methods: {
    onChange(input) {
      this.$emit('onChange', input)
    },
    onKeyPress(button) {
      this.$emit('onKeyPress', button)

      /**
       * If you want to handle the shift and caps lock buttons
       */
      if (button === '{shift}' || button === '{lock}')
        this.handleShift()
    },
    handleShift() {
      const currentLayout = this.keyboard.options.layoutName
      const shiftToggle = currentLayout === 'default' ? 'shift' : 'default'

      this.keyboard.setOptions({
        layoutName: shiftToggle,
      })
    },
  },
}
</script>

<template>
  <div :class="keyboardClass" />
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scopped>
  .simple-keyboard {
    position: absolute;
    z-index: 9;
    box-shadow: rgba(50, 50, 93, 25%) 0 2px 5px -1px, rgba(0, 0, 0, 30%) 0 1px 3px -1px;
    inset-inline-end: 0;
  }
</style>
