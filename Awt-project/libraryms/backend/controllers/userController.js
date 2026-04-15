import User from '../models/User.js';

export const getUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
};

export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { name, email, role, phone, address } = req.body;

  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  user.phone = phone || user.phone;
  user.address = address || user.address;

  const updatedUser = await user.save();
  res.json({
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    phone: updatedUser.phone,
    address: updatedUser.address
  });
};

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await user.remove();
  res.json({ message: 'User deleted successfully' });
};
