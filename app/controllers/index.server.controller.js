exports.render = function(req, res) {
    res.render('index', {
        title: 'WPW',
        user: JSON.stringify(req.user)
    });
};