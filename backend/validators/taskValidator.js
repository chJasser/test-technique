const { check } = require("express-validator");

exports.taskValidator = [
  check("title", "title is required")
    .notEmpty(),
  check("description", "description is required")
    .notEmpty()
    .isLength({
        max: 300,
      })
    .withMessage("description must contains a maximum of 300 characters"),
];
