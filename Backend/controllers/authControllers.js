const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const Cart=require('../models/AddToCart.model')
const Wishlist=require('../models/AddToWishlist.model');
const { response } = require('express');

const authController = {
  checkAuth: async (req, res) => {
    res.json({ 
      isAuthenticated: true,
      user: {
        name: req.user.name,
        email: req.user.email
      }
    });
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = generateToken(user._id);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

      // store user _id into session variable named `user_id`
      req.session.user_id=user._id;
      console.log(user._id);
      

      res.json({ 
        success: true,
        user: {
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
      
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = generateToken(newUser._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({ 
      success: true,
      user: {
        name: newUser.name,
        email: newUser.email
      }
    });

    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  logout: (req, res) => {
    req.session.destroy();
    res.clearCookie('token');
    res.json({ success: true });
  },

  cart_wishlist_count: async (req,res) => { 
    // hello
          const userId = req.session.user_id;

            if (!userId) {
              return res.status(401).json({ message: 'User not logged in',response:false });
            }

          try {
            const userCart = await Cart.findOne({ user_id: userId });
            const cart_count = userCart?.plantList?.length || 0;

            const userWishlist = await Wishlist.findOne({ user_id: userId });
            const wishlist_count = userWishlist?.plantList?.length || 0;

            res.json({ message: {cart_count,wishlist_count},response:true });
          } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error',response:false });
          }
  },

  isLogin : async (req,res)=>{
        if(!req.session.user_id) return res.json({response:false});
        return res.json({response:true});
  } 

};

module.exports = authController;

