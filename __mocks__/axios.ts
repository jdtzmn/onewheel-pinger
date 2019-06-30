const axios = {
  create: jest.fn(() => axios),
  post: jest.fn(() => Promise.resolve({ data: {} }))
}

export default axios
