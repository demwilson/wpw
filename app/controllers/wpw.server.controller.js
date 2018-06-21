exports.render = function(req, res) {
    res.render('index', {
        title: 'WPW - Dashboard',
        user: JSON.stringify(req.user)
    });
};