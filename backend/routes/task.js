const express = require("express");
const { addTask, deleteTask, updateTask, getTasks } = require("../controllers/task");
const { taskValidator } = require("../validators/taskValidator");
const router = express.Router();

// add task
router.post("/add", [taskValidator], addTask);
//get tasks list
router.get("/", getTasks);
// delete task
router.delete("/delete/:id", deleteTask);
// update task
router.put("/update/:id", [taskValidator], updateTask);
module.exports = router;