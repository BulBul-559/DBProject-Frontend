<script setup>
import ShowDataBasicBar from 'OA/components/showData/ShowDataBasicBar.vue'
import ShowDataBasicPie from 'OA/components/showData/ShowDataBasicPie.vue'
import MemberList from 'OA/components/showData/MemberList.vue'

import { ref } from 'vue'

let lookData = ref('排名')
</script>
<template>
  <div class="exhibit-info">
    <el-radio-group v-model="lookData" size="large">
      <el-radio-button label="排名" />
      <el-radio-button label="部门" />
      <el-radio-button label="列表" />
    </el-radio-group>
    <ShowDataBasicBar v-if="lookData == '排名'" :title="''"></ShowDataBasicBar>
    <ShowDataBasicPie v-if="lookData == '部门'" :title="''"></ShowDataBasicPie>
    <MemberList v-if="lookData == '列表'" :title="''"></MemberList>
  </div>
</template>

<style scoped>
@media only screen and (min-width: 768px) {
  /* for desktop */
  .exhibit-info {
    width: 100%;
    font-size: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* background-color: #9dffa0; */
  }
}
@media only screen and (max-width: 768px) {
  /* for phone */
  .exhibit-info {
    width: 100%;
    font-size: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* background-color: #9dffa0; */
  }
}
</style>
