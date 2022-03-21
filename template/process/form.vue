
<template>
  <el-form ref="form" class="form-modal" :model="modal[$options.name]" :label-width="label">
    <form-item v-for="option in options" :key="option.prop" :option="option" v-model="modal[$options.name][option.prop]"></form-item>
  </el-form>
</template>
<script lang="ts">
import { Component, Prop, Inject, Vue } from 'vue-property-decorator'
import formItem from '&/components/form/form-item/index.vue'
import { DntFormItem } from '&/types/dnt-form-item'

export const useModal = () => ({})

@Component({
  name: '#name#',
  components: {
    formItem
  }
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

  public label = '120px'

  get options (): DntFormItem[] {
    return []
  }

  public async isValid () {
    return await (this.$refs as any).form.validate()
  }

  #preview#
  public qaPreview () {
    this.preview()
  }
  #preview#
  #next#
  public qaNext () {
    await this.isValid() && this.next()
  }
  #next#
  #submit#
  public qaSubmit () {
    /* dosome thing */
  }
  #submit#
}
</script>
