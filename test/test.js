const request = require('supertest');
const fs = require('fs');
const path = require('path');
const testJsonFile = path.resolve(__dirname, './test_data.json');
const server = 'http://localhost:8000';

describe('Route integration', () => {
  describe('/api/ping', () => {
    describe('GET', () => {
      it('responds with 200 status and json content type', () => {
        return request(server)
          .get('/api/ping')
          .expect('Content-Type', /application\/json/)
          .expect(200)
      });
    });
  });

  describe('/api/posts', () => {
    describe('GET', () => {
      it('responds with 200 status and json content type', () => {
        return request(server)
          .get('/api/posts')
          .query({tag: 'tech' })
          .expect('Content-Type', /application\/json/)
          .expect(200)
          })
      it('Every post should contain at least one query parameter tag' , ()=>{
        return request(server)
          .get('/api/posts')
          .query({tag: 'tech, history'})
          .then((res)=>{
            let containsTag = true
            res.body.posts.forEach((post) => {
              if (!post.tags.includes('tech') && !post.tags.includes('history'))containsTag = false
            })
            expect(containsTag).toBe(true)
          })
      })

      it('Returns error message if tag parameter is not present' , ()=>{
        return request(server)
          .get('/api/posts')
          .expect(400)
          .then((res)=>{
            expect(res.body.error).toEqual('Tags parameter is required')
          })
      })

      it('Returns error message if sortBy parameter is invalid' , ()=>{
        return request(server)
          .get('/api/posts')
          .query({tag: 'tech', sortBy: 'hello'})
          .expect(400)
          .then((res)=>{
            expect(res.body.error).toEqual('sortBy parameter is invalid')
          })
      })

      it('Returns error message if direction parameter is invalid' , ()=>{
        return request(server)
          .get('/api/posts')
          .query({tag: 'tech', sortBy: 'id', direction: 'north'})
          .expect(400)
          .then((res)=>{
            expect(res.body.error).toEqual('direction parameter is invalid')
          })
      })

    });
  });
});
