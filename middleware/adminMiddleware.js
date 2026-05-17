const asyncHandler = require('./asyncHandler');

const admin = asyncHandler(async (req, res, next) => {
  console.log('[ADMIN] req.user:', req.user?.email);
  console.log('[ADMIN] isAdmin:', req.user?.isAdmin);
  
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    console.log('[ADMIN] Not authorized as admin');
    res.status(403);
    throw new Error('Not authorized as admin');
  }
});

module.exports = { admin };