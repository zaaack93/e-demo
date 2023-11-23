<script>
export default {
  props: {
    label: {
      type: String,
    },
    inputField: {
      type: String,
    },
    rules: {
      type: Array,
    },
    initval: {
      type: String,
    },
    readonly: {
      type: Boolean,
    },
  },
  data: () => ({
    input: '',
    isKeyboardOpen: false,
  }),
  watch: {
    // whenever question changes, this function will run
    input(newInput) {
      this.$emit('onChange', newInput)
    },
  },
  mounted() {
    setTimeout(() => {
      this.input = this.initval
    }, 300)
  },
  methods: {
    onChange(input) {
      this.input = input
      this.$emit('onChange', input)
    },
    onKeyPress(button) {
      if (button === '{enter}')
        this.isKeyboardOpen = false
    },
    onInputChange(input) {
      this.input = input.target.value
    },
  },
}
</script>

<template>
  <div class="relative">
    <AppTextField
      v-model="input"
      :label="label"
      class="v-locale--is-rtl"
      :append-inner-icon="isKeyboardOpen ? 'tabler-circle-x' : 'tabler-keyboard'"
      :rules="rules"
      clearable
      :readonly="readonly"
      @click:append-inner="isKeyboardOpen = !isKeyboardOpen"
      @input="onInputChange"
    />

    <SimpleKeyboardInput

      v-if="isKeyboardOpen"
      :input="input"
      @onChange="onChange"
      @onKeyPress="onKeyPress"
    />
  </div>
</template>

<style scoped>
/* .rtlinput, .v-field__input{
  text-align: end !important;
} */
input {
  text-align: end;
}

.relative {
  position: relative;
}
</style>
