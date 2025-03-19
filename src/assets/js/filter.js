// export const departmentOption = [
//   { label: '程序部', value: '程序部' },
//   { label: '媒体中心', value: '媒体中心' },
//   { label: '共建中心', value: '共建中心' },
//   { label: '美工部', value: '美工部' },
//   { label: '综合部', value: '综合部' },
//   { label: '闪客部', value: '闪客部' },
//   { label: '视频推广部', value: '视频推广部' },
//   { label: '摄影部', value: '摄影部' },
//   { label: '管理组', value: '管理组' }
// ]

export const departmentOption = [
  { label: '程序部', value: '程序部' },
  { label: '媒体中心', value: '媒体中心' },
  { label: '共建中心', value: '共建中心' },
  { label: '美工部', value: '美工部' },
  { label: '综合部', value: '综合部' },
  { label: '闪客部', value: '闪客部' },
  { label: '视频推广部', value: '视频推广部' },
  { label: '视频编辑部', value: '视频编辑部' },
  { label: '摄影部', value: '摄影部' },
  { label: '管理组', value: '管理组' }
]

export const identityOption = [
  { label: '试用', value: '试用' },
  { label: '正式', value: '正式' },
  { label: '管理员', value: '管理员' }
]

export const dutyDayOption = [
  { label: '0：未安排', value: '0' },
  { label: '1：周一', value: '1' },
  { label: '2：周二', value: '2' },
  { label: '3：周三', value: '3' },
  { label: '4：周四', value: '4' },
  { label: '5：周五', value: '5' },
  { label: '6：周六', value: '6' },
  { label: '7：周日', value: '7' }
]
export const dutyFrameOption = [
  { label: '0：未安排', value: '0' },
  { label: '1：12节', value: '1' },
  { label: '2：34节', value: '2' },
  { label: '3：56节', value: '3' },
  { label: '4：78节', value: '4' },
  { label: '5：910节', value: '5' }
]

// export const departmentFilter = [
//   { text: '程序部', value: '程序部' },
//   { text: '媒体中心', value: '媒体中心' },
//   { text: '共建中心', value: '共建中心' },
//   { text: '美工部', value: '美工部' },
//   { text: '综合部', value: '综合部' },
//   { text: '闪客部', value: '闪客部' },
//   { text: '视频推广部', value: '视频推广部' },
//   { text: '摄影部', value: '摄影部' },
//   { text: '管理组', value: '管理组' }
// ]

export const departmentFilter = [
  { text: '程序部', value: '程序部' },
  { text: '媒体中心', value: '媒体中心' },
  { text: '共建中心', value: '共建中心' },
  { text: '美工部', value: '美工部' },
  { text: '综合部', value: '综合部' },
  { text: '视频编辑部', value: '视频编辑部' },
  { text: '视频推广部', value: '视频推广部' },
  { text: '闪客部', value: '闪客部' },
  { text: '摄影部', value: '摄影部' },
  { text: '管理组', value: '管理组' }
]

export const stateFilter = [
  { text: '正在值班', value: '正在值班' },
  { text: '正常值班', value: '正常值班' },
  { text: '值班时间不足', value: '值班时间不足' },
  { text: '早退', value: '早退' },
  { text: '迟到', value: '迟到' }
]

export const identityFilter = [
  { text: '试用', value: '试用' },
  { text: '正式', value: '正式' },
  { text: '管理员', value: '管理员' }
]

export const formatterDay = (data) => {
  let res = ''
  res += '周'
  switch (data.day) {
    case 1:
      res += '一'
      break
    case 2:
      res += '二'
      break
    case 3:
      res += '三'
      break
    case 4:
      res += '四'
      break
    case 5:
      res += '五'
      break
    case 6:
      res += '六'
      break
    case 7:
      res += '日'
      break
  }
  return res
}

export const formatterFrame = (data) => {
  let res = ''
  res += '第'
  switch (data.frame) {
    case 1:
      res += '12节'
      break
    case 2:
      res += '34节'
      break
    case 3:
      res += '56节'
      break
    case 4:
      res += '78节'
      break
    case 5:
      res += '910节'
  }
  return res
}
