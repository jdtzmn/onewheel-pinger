import qs from 'querystring'
import axios, { AxiosRequestConfig } from 'axios'
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

// IP address "spoofing" to avoid the server's rate limiting
let ipAddress = '10.0.0.0'
function incrementIpAddress () {
  const currentLastDigit = +ipAddress.split('.')[3]
  const nextDigit = (currentLastDigit + 1) % 255
  const nextIpAddress = `10.0.0.${nextDigit}`
  ipAddress = nextIpAddress
  return ipAddress
}

async function ping (order: number, email: string) {
  debug(`Pinging order: ${order}, email: ${email}`)

  const body = qs.stringify({
    order_number: order,
    email
  })

  const config: AxiosRequestConfig = {
    headers: {
      'X-Forwarded-For': ipAddress
    }
  }

  const response = await instance.post('/', body, config)
  const { data } = response

  if (data.status === 'error') throw new Error(data.error_message)
  if (data === 'Error') { // This is the response when being rate-limited
    incrementIpAddress()
    return ping(order, email)
  }

  const date = new Date(data.ship_date)
  const dateString = formatDate(date)

  return dateString
}

export default ping
