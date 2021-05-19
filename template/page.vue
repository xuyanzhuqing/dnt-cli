<script lang="tsx">
import { Component } from 'vue-property-decorator'
import Page from '&/components/biz/page.vue'

@Component({
  name: '',
  components: {}
})
export default class extends Page {
  public dynamic: any = {}

  get topBtns () {
    return {}
  }

  get columns () {
    return []
  }

  public getData () {}
}

</script>
<!-- scoped = "true" 将导致组建内部样式失效如需覆盖，请使用 /depp/ <selector> 代替 -->
<style lang="scss">
</style>