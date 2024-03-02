const jwt = require('jsonwebtoken')
exports.protect = async (req, res, next) => {
    const bearer = req.headers.authorization
    if (!bearer) {
        res.status(401)
        res.json({ message: 'Not Autorized bearer' })
        return
    }
    const [, token] = bearer.split(' ')
    if (!token) {
        res.status(401)
        res.json({ message: 'Not Autorized token' })
        return
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user

        next()
    } catch (e) {
        console.error(e)
        res.status(401)
        res.json({ message: 'Not Autorized catch' })
        return
    }
}
exports.isAdmin = (req, res, next) => {
    if (req.user.role === "joueur") {
        res.status(401)
        res.json({ message: 'Access denied, you must be an admin' })
        return
    }
    console.error(req.user.role)

    next();

}