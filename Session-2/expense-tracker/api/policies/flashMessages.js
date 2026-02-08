module.exports = function(req, res, next) {
  res.locals.successMessages = req.flash('success') || [];
  res.locals.errorMessages = req.flash('error') || [];
  res.locals.infoMessages = req.flash('info') || [];
  next();
};
