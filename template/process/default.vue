<template>
  <div>
  </div>
</template>
<script lang="ts">
import { Inject, Vue, Component, Prop } from 'vue-property-decorator'

export const useModal = () => ({})

@Component({
  name: '#name#'
})
export default class extends Vue {
  @Prop() value!: any
  @Inject('modal') modal!: any
  @Inject('steps') steps!: any[]
  @Inject('getFlow') getFlow!: Function
  @Inject('setLink') setLink!: Function
  @Inject('checkDirty') checkDirty!: Function
  @Inject('close') close!: Function
  @Inject('safeClose') safeClose!: Function
  @Inject('preview') preview!: Function
  @Inject('next') next!: Function
  @Inject('jump') jump!: Function
  @Inject('getCurrentView') getCurrentView!: Function

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
    /* dosome thing */
  }
  #submit#
}

</script>
