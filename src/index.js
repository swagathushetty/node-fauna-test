const app = require('express')()

const { Index } = require('faunadb')
const faunadb = require('faunadb')


const client = new faunadb.Client({
  secret: 'fnAEGC882-ACBQhLpRvMPI4WRhMUmqq7or4Vc2aL'
})

const {
  Paginate,
  Ref,
  Get,
  Select,
  Match,
  Create,
  Collection,
  Lambda,
  Var,
  Join,
  Call,
  Function: Fn
} = faunadb.query


app.get('/tweet/:id', async (req, res) => {

  const doc = await client.query(
    Get(
      Ref(
        Collection('tweets'),
        req.params.id
      )
    )

  ).catch(e => res.send(e))

  res.send(doc)


})


app.get('/tweet', async (req, res) => {
  const docs = await client.query(
    Paginate(
      Match(
        Index('tweets_by_user'),
        Call(Fn("getUser"), "swagath")
      )
    )
  )
})


app.post('/tweet', async (req, res) => {

  const data = {
    user: Call(Fn("getUser"), "swagath"),
    text: "Holma Muncho !!!!"
  }


  const doc = await client.query(
    Create(
      Collection('tweets'),
      { data }
    )
  )


  res.send(doc)


})


app.post('/relationship', async (req, res) => {
  const data = {
    follower: Call(Fn("getUser"), "bob"),
    followee: Call(Fn("getUser"), "swagath")
  }

  const doc = await client.query(
    Create(
      Collection('relationships'),
      { data }
    )
  ).catch(e => res.send(e))

  res.send(doc)
})

app.listen(5000, () => {
  console.log('the app is working on POR 5000')
})