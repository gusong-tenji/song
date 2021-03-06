export default {
    props: {
      parentData: {}
    },
    data: () => ({
      valid: true,
      employeeId: '',
      employeeIdRules: [
        v => !!v || '社員IDを入力してください。',
        v => (v && v.length <= 6) || '社員IDは６桁以下で入力してください。',
      ],
      name:'',
      nameRules: [
        v => !!v || '名前を入力してください。',
        v => (v && v.length <= 20) || '名前は２０桁以下で入力してください。',
      ],
      frigana:'',
      enteringDate:'',
      enteringDateRules: [
        v => !!v || '入社年月日を入力してください。'
      ],
      menu1: false,
      menu2: false,
      menu3: false,
      certificationName:'',
      certificationNameRules: [
        v => !!v || '資格を入力してください。'
      ],
      getDate:'',
      getDateRules: [
        v => !!v || '取得日付を入力してください。'
      ],
      encourageDate:'',
      hasCommit: false,
      employeeIds: [],
      updateCertMode: false,
      dialog: false
    }),

    created () {
      this.initialize()
    },

    methods: {
      goList () {
        this.$emit('handleSwitch','list')
      },
      initialize () {
        if (this.parentData && this.parentData.employee_id) {
          this.employeeId = this.parentData.employee_id,
          this.employeeIds = [this.employeeId]
          this.name =  this.parentData.name,
          this.frigana = this.parentData.frigana,
          this.enteringDate = this.parentData.entering_date,
          this.certificationName = this.parentData.certification_name,
          this.certificationId = this.parentData.certification_id,
          this.getDate = this.parentData.get_date,
          this.encourageDate = this.parentData.encourage_date
          this.updateCertMode = !!this.certificationName
        } else {
          let _this = this;
  
          _this.$http.get('/employees').then((res)=>{
        if(res.status == 200){
          console.log('res.data ', res.data)
          this.employeeIds = res.data;
        }else{
            alert('エラーが発生しました。');
        }
            console.log(res);
        },(err)=>{
            alert('APIエラーが発生しました。');
            console.log(err);
        });
        }
      },
      
      customFilter (item, queryText, itemText) {
        const textOne = item.employee_id.toLowerCase()
        const searchText = queryText.toLowerCase()

        return textOne.indexOf(searchText) > -1
      },

      checkCertification () {
        if (this.getDate || this.certificationName) {
          this.updateCertMode = true
        }
      },

      fillOthers () {
        console.log(this.employeeId)
        const employInfo = this.employeeIds.find(e => e.employee_id == this.employeeId )
        this.name = employInfo.name
        this.frigana = employInfo.frigana
        this.enteringDate = employInfo.entering_date
      },
      validate () {
        let _this = this;

        var succ = this.$refs.form.validate()
        console.log(succ)
        if (succ) {
          var sendData = {
            employeeId: _this.employeeId,
            name: _this.name,
            frigana: _this.frigana,
            enteringDate: _this.enteringDate,
            certificationName: _this.certificationName,
            certificationId: _this.certificationId,
            getDate: _this.getDate,
            encourageDate: _this.encourageDate
          }

          const api = this.updateCertMode ? '/updateEmployeeCertification' : '/updateEmployee'

          _this.$http.post(api,sendData).then((res)=>{
            if(res.status == 200){
              _this.regInfo = res.data;
              if(_this.regInfo.status == 1){
                  // alert('提出成功しました。');
                  this.hasCommit = true
                  const url = this.updateCertMode ? 'search' : 'list'
                  setTimeout(() => {
                    this.$emit('handleSwitch',url)
                  }, 1000);
              }else{
                  alert('提出失敗しました。');
              }
            }else{
                alert('エラーが発生しました。');
            }
              console.log('res.data ', res.data)
            },(err)=>{
                alert('APIエラーが発生しました。');
                console.log(err);
            });
        }
      },
      reset () {
        this.$refs.form.reset()
      },
    },
  }