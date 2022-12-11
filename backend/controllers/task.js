const { validationResult } = require("express-validator");
const Task = require("../models/task");

const addTask = async (req, res) => {
  const errors = validationResult(req).errors;
  if (errors.length !== 0) return res.status(400).json(errors);
  else {
    let task = new Task({
      title: req.body.title,
      description: req.body.description,
      finished_at: req.body.finished_at,
    });
    task
      .save()
      .then((element) => {
        return res.status(200).json({ success: true, task: element });
      })
      .catch((err) => {
        return res.status(500).json(err.message);
      });
  }
};

const deleteTask = async (req, res) => {
  Task.findByIdAndDelete(req.params.id)
    .then((task) => {
      return res
        .status(200)
        .json({ success: true, message: "task deleted successfully" });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: err.message });
    });
};

const getTasks = async (req, res) => {
  Task.find()
    .then((tasks) => {
      return res.status(200).json({
        success: true,
        tasks: tasks,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        tasks: [],
      });
    });
};

const updateTask = async (req, res) => {
  const { title, description, finished } = req.body;
  console.log(finished);
  let taskFeilds = {};
  if (title) taskFeilds.title = title;
  if (description) taskFeilds.description = description;

  if (finished === true) {
    taskFeilds.finished = true;
    taskFeilds.finished_at = new Date();
  }
  if (finished === false) {
    taskFeilds.finished = false;
    taskFeilds.finished_at = null;
  }
  Task.findByIdAndUpdate(req.params.id, { $set: taskFeilds }, { new: true })
    .then((task) => {
      return res
        .status(200)
        .json({ success: true, message: "task updated successfuly" });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: err.message });
    });
};

module.exports = {
  addTask,
  deleteTask,
  getTasks,
  updateTask,
};
