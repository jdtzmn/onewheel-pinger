import qs from 'querystring'
import axios from 'axios'
import useNamespace from 'debug'
const debug = useNamespace('onewheel-pinger-ping')

const instance = axios.create({
  baseURL: 'https://tracker.onewheel.com/include/production_query.php'
})

function formatDate (date: Date) {
  return date.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric'
  })
}

async function ping (order: number, email: string) {
  debug(`Pinging order: ${order}, email: ${email}`)
  const response = await instance.post('/', qs.stringify({
    order_number: order,
    email
  }))
  
  const { data } = response
  
  if (data.status === 'error') throw new Error(data.error_message)

  const date = new Date(data.ship_date)
  const dateString = formatDate(date)

  return dateString
}

export default ping
