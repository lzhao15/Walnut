const express = require('express');
const router = express.Router();
const axios = require("axios");

//ping API
router.get('/ping', (req, res, next) => {
    try{
        res.status(200).json({success: true})
    } catch(err){
        return next({
            log: `apiRouter/ping: ERROR: ${err}`,
            message: {
              err: 'apiRouter/ping: ERROR: Check server logs for details',
            },
          });
    }
})

//posts API
router.get('/posts', async (req, res, next)=>{
    try{
        let sortBy = req.query.sortBy
        let direction = req.query.direction
        if (!req.query.sortBy) sortBy = 'id'
        if (!req.query.direction) direction = 'asc'

        const validSort = ['id', 'reads', 'likes', 'popularity']
        const validDirection = ['desc', 'asc']
        
        if (!req.query.tag) res.status(400).send({error: 'Tags parameter is required'})
        if (!validSort.includes(sortBy)) res.status(400).send({error: 'sortBy parameter is invalid'})
        if (!validDirection.includes(direction)) res.status(400).send({error: 'direction parameter is invalid'})

        const tag = req.query.tag.split(',')
        const acquiredPosts = new Set()
        res.locals.data = {posts:[]}
        //since API can only handle one tag at once, iterate through tags and fetch data for each tag
        for (let i=0; i< tag.length; i++){
            const data = await axios.get(`https://api.hatchways.io/assessment/blog/posts`, {
            params: {
              tag: tag[i],
            }
          })
          //check if the new posts have been accounted for in res.locals.data
          for (let j=0; j<data.data.posts.length; j++){
            if (acquiredPosts.has(data.data.posts[j].id)) continue
            res.locals.data.posts.push(data.data.posts[j])
            acquiredPosts.add(data.data.posts[j].id)
          }
        }
        if (direction === 'asc') res.locals.data.posts.sort((a,b) => a[sortBy] - b[sortBy])
        else res.locals.data.posts.sort((a,b) => b[sortBy] - a[sortBy])
        res.status(200).json(res.locals.data)
    }catch(err){
        return next({
            log: `apiRouter/posts: ERROR: ${err}`,
            message: {
              err: 'Tags parameter is required',
            },
          });
    }
})

module.exports = router