export const spyFetch = () => {
  const spyFetch = jest.spyOn(global, 'fetch')

  return spyFetch
}

export const mockFetch = (response?: any, options?: {
  ok?: boolean,
  status?: number
}) => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: options?.ok ?? true,
    status: options?.status ?? 400,
    json: () => Promise.resolve(response ?? {})
  })) as jest.Mock
}

export const spyAndMockFetch = (response?: any, options?: {
  ok?: boolean,
  status?: number
}) => {
  const spyFetch = jest.spyOn(global, 'fetch')
    .mockImplementation(
      jest.fn(() => {
        return Promise.resolve({
          ok: options?.ok ?? true,
          status: options?.status ?? 400,
          json: () => Promise.resolve(response ?? {})
        })
      }) as jest.Mock
    )
  return spyFetch
}
