const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function toast(message) {
  wx.showToast({
    title: message,
    image:"../../images/image_wtf.png",
    duration:3000
  })
}

function dialog(message) {
  wx.showModal({
    title: 'log',
    content: '' + message,
  });
}

module.exports = {
  formatTime: formatTime,
  toast:toast,
  dialog:dialog
}
