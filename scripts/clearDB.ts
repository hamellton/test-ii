import { deleteAllUsers } from "@models/user"

const clearDB = async () => {
  await deleteAllUsers()
}

clearDB()