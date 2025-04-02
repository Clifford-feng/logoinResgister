import prisma from "../lib/prisma.js";

async function getUsersFromDb() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.log("getUsers error: ", error)
    throw error
  }
}

async function findUserByName(username) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    })
    return user
  } catch (error) {
    console.log("findUserByName error: ", error)
    throw error
  }
}

export {
  getUsersFromDb,
  findUserByName
}