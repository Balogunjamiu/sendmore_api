const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')
beforeEach(setupDatabase)

test('should signup a new user', async () => {
   const response =  await request(app).post('/users').send({
        name:'jamiu',
        email:'jamiu1234@example.com',
        password:'balogun1234'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    // Assertion about the response
    expect(response.body).toMatchObject({
        user:{
            name:'jamiu',
            email:'jamiu1234@example.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('balogun1234')
})
 test('should login a new user', async ()=>{
     response  = await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
     }).expect(200)
     const user = await User.findById(userOneId)
     expect(response.body.token).toBe(user.tokens[1].token)
 })
 test('should login non-existing user', async ()=>{
     await request(app).post('/users/login').send({
         email: 'balogunjamiu49@gmail.com',
         password:'balogun334344'
     }).expect(400)
 })

test('should get profile for user', async()=>{
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should not get profile for unauthenticated user', async ()=>{
    await request(app).get('/users/me').send().expect(401)
})

test('should delete account for user', async ()=>{
     await request(app).delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})
test('should not delete an account for an unauthenticated user', async ()=>{
    await request(app).delete('/users/me').send().expect(401)
})

test('should upload upload avatar image', async ()=>{
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('shoould update valid user  field ', async ()=>{
    const response = await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name:'jamiu'
    }).expect(200)
     const user = await User.findById(userOneId)
    expect(user.name).toEqual('jamiu')
})
test('should not update invalid user field', async ()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        location:'Nigeria'
    }).expect(400)  
})