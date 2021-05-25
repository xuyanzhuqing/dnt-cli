<template>
  <div>
  </div>
</template>
<script lang="ts">
import { Inject, Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'step3'
})
export default class extends Vue {
  @Inject('modal') modal?: any

  public qaPreview () {
  }

  public qaSubmit () {
  }
}

</script>
