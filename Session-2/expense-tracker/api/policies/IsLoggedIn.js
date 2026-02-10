module.exports = function (req, res, proceed) {
    console.log("Hello")

    if(req.path === '/' || req.path === '/register'){
        return proceed();
    }

    if(!req.session.user){
        return res.redirect('/');
    }

    const doesKeyExist = CacheService.get(`user:${req.session.user.id}`);
    if (!doesKeyExist) {
        return res.redirect('/');
    }
    proceed();
}