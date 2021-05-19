<script lang="tsx">
import { Component } from 'vue-property-decorator'
import Page from '&/components/biz/page.vue'

@Component({
  name: '',
  component: {}
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