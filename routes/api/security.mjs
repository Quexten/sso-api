export async function ensureIsOwner (req, res, next) {
    if (req.userId !== req.params.userId) {
        res.status(403).send({
            message: "User does not have the necessary permissions."
        })
    } else {
        next()
    }
}
