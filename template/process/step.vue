<template>
  <div>
  </div>
</template>
<script lang="ts">
import { Inject, Vue, Component } from 'vue-property-decorator'

@Component({
  name: '#name#'
})
export default class extends Vue {
  @Inject('modal') modal?: any
  @Inject('jump') jump!: Function
  @Inject('preview') preview!: Function
  @Inject('next') next!: Function
  @Inject('close') close!: Function
  @Inject('safeClose') safeClose!: Function
  #preview#
  public qaPreview () {
    this.preview()
  }
  #preview#
  #next#
  public qaNext () {
    this.next()
  }
  #next#
  #submit#
  public qaSubmit () {
    /*dosome thing*/
  }
  #submit#
}

</script>
