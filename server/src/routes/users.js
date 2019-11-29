const mongoose = require('mongoose')
const express = require('express')
const User = require('../models/User')

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).json({user, token})
    }
    catch(err) {
        res.status(400).send(err)
    }
})

router.post('/login', async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body

        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({
                error: 'Login failed! Check authentication credentials'
            })
        }
        const token = await user.generateAuthToken()
        res.send({
            user,
            token
        })
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router