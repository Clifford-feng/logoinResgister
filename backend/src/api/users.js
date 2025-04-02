import { getUsersFromDb } from "../utils/getUsers.js";

async function getUsers(req, res) {
    const users = await getUsersFromDb()

    res.status(200).json(users)
}

async function getUserById(req, res) {
    const { userId } = req.params

    res.status(200).json({
        userId
    })
}

export { getUsers, getUserById }
