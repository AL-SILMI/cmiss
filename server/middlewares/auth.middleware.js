const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const requireStaff = (req, res, next) => {
  if (!req.user || !req.user.role || !['staff', 'hod', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Staff privileges required' });
  }
  next();
};

module.exports = authMiddleware;
module.exports.requireStaff = requireStaff;