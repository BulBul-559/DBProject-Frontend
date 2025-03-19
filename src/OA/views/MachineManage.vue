<script setup>
const options = [
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  },
  {
    value: 'Option3',
    label: 'Option3'
  },
  {
    value: 'Option4',
    label: 'Option4'
  },
  {
    value: 'Option5',
    label: 'Option5'
  }
]
</script>
<template>
  <div class="main_box">
    <el-form>
      <el-form-item label="">
        <el-input v-model="input" placeholder="Please input" />
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="input" placeholder="Please input" />
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="value" class="m-2" placeholder="Select">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped></style>
