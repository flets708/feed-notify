module.exports.setDisplayDate = date => {
  const year = date.getFullYear()
  const month = ("0"+(date.getMonth() + 1)).slice(-2)
  const day = ("0" + date.getDate()).slice(-2)
  const hour = ("0" + date.getHours()).slice(-2) 
  const minute = ("0" + date.getMinutes()).slice(-2)
  const second = ("0" + date.getSeconds()).slice(-2)
  const dayOfWeek = date.getDay()
  const dayOfWeekStr = [ "日", "月", "火", "水", "木", "金", "土" ][dayOfWeek]
  const displayDate = `${year}/${month}/${day}(${dayOfWeekStr}) ${hour}:${minute}:${second}`
  return displayDate
}