# F14 Fetch Interceptor

A simple tool for fetch data and intercept errors

## Quick start

```
npm i f14-fetch-interceptor
```

## Fetch data

```
const f14 = new F14()

f14.get('full api url')
f14.post('full api url', false, {
  key: 'body data'
})
```

Now you can use GET, POST, PATCH, PUT, DELETE methods

## Main Settings

You can set main instance of F14

```
import F14 from 'f14-fetch-interceptor'

export const f14Instance = new F14()
  .settings({
    apiUrl: 'url path'
    headers: {
      'Content-Type': 'application/json'
    }
  }).auth(() => {
    const jwtToken = ... get token

    return jwtToken
  }).intercept401(() => {
    ... refresh Token

    return true
  })
```

If you want use store inside F14 -> inject it

```
const someStore

f14Instance.injectStore(someStore)

```

Then you will be able to use dispatch and getState

```
.auth((dispatch, getState) => {
    const jwtToken = ... get token

    return jwtToken
  })
```
