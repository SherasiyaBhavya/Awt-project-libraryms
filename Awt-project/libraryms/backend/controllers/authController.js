import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, email, password, role, phone, address } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'client',
    phone,
    address
  });

  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token: generateToken(user._id, user.role)
  });
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token: generateToken(user._id, user.role)
  });
};
