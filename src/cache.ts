export const cacheStore = () => {
  const cache: Object[] = []

  return {
    addNote: (req: Request) => {
      cache.push({
        url: req.url,
        method: req.method
      })
    },
    collect: () => {
      const res = [...cache]
      cache.length = 0

      return res
    }
  }
}