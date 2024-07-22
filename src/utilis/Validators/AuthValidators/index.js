const UserSignUpValidator = (req, res, next) => {
    const { firstName, lastName, email, dob, password } = req.body;
  
    if (!firstName) {
      return res.status(400).json({ message: 'First name is required' });
    }
    if (!lastName) {
      return res.status(400).json({ message: 'Last name is required' });
    }
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!dob) {
      return res.status(400).json({ message: 'Date of birth is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
  
    next();
  };
  
  module.exports = {UserSignUpValidator};
  