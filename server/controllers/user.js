import bcrypt from 'bcryptjs'
import { response } from 'express'
import jwt from 'jsonwebtoken'

import User from '../models/user.js'

export const signin = async(req,res) => {
    // destructure all the post data from the res object
    const { email, password } = req.body
    try{
        // Check for the existing user in database
        const existingUser = await User.findOne({email})
        if(!existingUser)
            return res.status(404).json({message: "User doesn't exist"})
        // Compare the bcrypted passwords
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if(!isPasswordCorrect) 
            return res.status(400).json({message: "Invalid credentials"})
        // Generate token for the user/ then we add a secret/options
        const token = jwt.sign({email: existingUser.email, id:existingUser._id},'test', { expiresIn: "1h"} )
        res.status(200).json({result : existingUser, token})
    }catch(error){
        response.status(500).json({message: "Something went wrong"})
    }
}

export const signup = async(req,res) => {
    const {email, password, confirmPassword, firstName, lastName} = req.body
    try{
        const existingUser = await User.findOne({email})
        if(existingUser) return res.status(400).json({message:"User already exists"})
        if(password !== confirmPassword) return res.status(400).json({message: "Passwords don't match"})
        const hashedPassword = await bcrypt.hash(password,12)
        const result = await User.create({email, password: hashedPassword,name: `${firstName} ${lastName}`})
        const token = jwt.sign({email: result.email, id:result._id}, 'test', {expiresIn: "1h"})
        res.status(200).json({result,token})
    }catch(error){
        res.status(500).json({message: 'Something went wrong'})
    }

}

