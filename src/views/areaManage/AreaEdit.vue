<template>
  <el-dialog :title="dialogTitle" :visible.sync="visible">
    <el-form :model="form" :rules="formRule" ref="form">
      <el-form-item label="编码" prop="code" :label-width="formLabelWidth">
        <el-input v-model="form.code" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="地名" prop="name" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="全称" prop="fullName" :label-width="formLabelWidth">
        <el-input v-model="form.fullName" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="级别" prop="level" :label-width="formLabelWidth">
        <el-select v-model="form.level">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="经度" :label-width="formLabelWidth">
        <el-input v-model="form.longitude" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="纬度" :label-width="formLabelWidth">
        <el-input v-model="form.latitude" autocomplete="off" ></el-input>
      </el-form-item>
  </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancle">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>

import areaApi from '@/api/AreaApi.js'

export default {
  data () {
    return {
      visible: false,
      formLabelWidth: '80px',
      form: {

      },
      loading: false,
      opeType: 'detail',
      dialogTitle: '',
      addRow: {},
      formRule: {
        code: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        fullName: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      options: [{
        value: 0,
        label: '国家'
      }, {
        value: 1,
        label: '省'
      }, {
        value: 2,
        label: '市'
      }, {
        value: 3,
        label: '区/县'
      }, {
        value: 4,
        label: '镇/乡'
      }]
    }
  },
  methods: {
    onCancle () {
      this.$parent.afterCancle(this.form.parentCode === -1 ? this.form.code : this.form.parentCode, this.form.id)
      this.resetForm()
      this.$refs['form'].clearValidate()
      this.visible = false
    },
    open (row, type) {
      this.visible = true
      this.resetForm()
      if (row) {
        this.opeType = type
        this.addRow = row
        if (type === 'add') {
          this.form.parentId = row.id
          this.form.parentCode = row.code
          this.dialogTitle = '新增'
        } else {
          this.form = row
          this.dialogTitle = '修改'
        }
      }
    },
    resetForm () {
      this.form = {
        code: '',
        name: '',
        fullName: '',
        parentCode: '',
        longitude: '',
        latitude: '',
        level: ''
      }
    },
    async onSubmit () {
      const vm = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          vm.loading = true
          const { id, code, name, fullName, parentCode, longitude, latitude, level, parentId } = vm.form
          const params = {
            id,
            code,
            name,
            fullName,
            parentCode,
            longitude,
            latitude,
            level,
            parentId
          }
          if (vm.opeType === 'add') {
            if (params.level === 0) {
              params.parentCode = '-1'
            }
            areaApi.addArea(params).then(result => {
              if (result.isSuccess) {
                // 需要把当前数据加载到
                if (params.level === 0) {
                  vm.$parent.tableData.push(result.data)
                } else {
                  vm.$parent.refreshChild(params.parentCode, result.data, vm.addRow)
                }
                this.visible = false
              }
            })
          } else if (vm.opeType === 'edit') {
            areaApi.updatArea(params).then(result => {
              if (result.isSuccess) {
                // 需要把当前数据加载到
                // vm.$parent.tableData.push(result.data)
                this.visible = false
              }
            })
          }
        }
        vm.loading = false
      })
    }
  }
}
</script>
