var frisby = require('frisby');
var baseURL = 'http://localhost:8002';

frisby.create('Get Users')
  .get(baseURL + '/users')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes(
  [{
    id: Number,
    name: String,
    email: String
  }]
  )
  .toss();

frisby.create('Get Posts')
  .get(baseURL + '/posts')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes(
  [{
    userId: Number,
    id: Number,
    title: String,
    body: String
  }]
  )
  .toss();

  frisby.create('Get Posts/1/Comments')
    .get(baseURL + '/posts/1/comments')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes(
    [{
      postId: Number,
      id: Number,
      name: String,
      email: String,
      body: String
    }]
    )
    .toss();

  frisby.create('Get Posts')
    .post(baseURL + '/posts')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes(
    [{
      userId: Number,
      id: Number,
      title: String,
      body: String
    }]
    )
    .toss();

//
// Helpful Frisby functions:
//
// .inspectRequest()
// .inspectStatus()
// .inspectHeaders()
// .inspectBody()

//
//  List of Endpoints tested
//
// get('/users')
// get('/posts')
// get('/api/test' - is a form, not important to test or keep in code base possibly
