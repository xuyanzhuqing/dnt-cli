<script lang="ts">
import process from '&/components/process/index.vue'
import { Component, Prop, Provide } from 'vue-property-decorator'
#import#

const steps: any[] = #steps#

const modal: any = #modal#

@Component({
  name: 'Processmaster',
  components: {
    #components#
  }
})
export default class MasterModal extends process {
  @Prop({ default: false }) public visible!: boolean
  @Prop({ default: null }) public value!: any
  @Prop({ default: '#title#' }) public title!: string
  @Prop({ default: '800' }) public width!: string
  @Prop({ default: false }) public vertical!: boolean
  @Prop({ default: true }) public link!: boolean

  @Provide('modal')
  modal = modal

  @Provide('steps')
  steps = steps

  public currentView = #currentView#
}
</script>
