import mockAxios from '../__mocks__/axios'
import ping from '../src/ping'

it('fetches data from the onewheel website', async () => {
  // Setup axios mock
  mockAxios.post.mockImplementationOnce(() => Promise.resolve({
    data: {
      status: 'success',
      ship_date: 'Sunday Jun 30 2019 00:00:00 -0700'
    }
  }))

  const date = await ping(12345, 'email@domain.com')
  expect(date).toEqual('June 30')
})

it('should error if invalid email is provided', async () => {
  // Setup axios mock
  const errorMessage = 'No matching records.  Please try again.'
  mockAxios.post.mockImplementationOnce(() => Promise.resolve({
    data: {
      status: 'error',
      error_message: errorMessage
    }
  }))

  try {
    await ping(12345, 'bademail')
  } catch (err) {
    expect(err.message).toBe(errorMessage)
  }
})
