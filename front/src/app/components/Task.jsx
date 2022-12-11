import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ResponsiveAppBar from "./Navbar";
import axios from "../../axiosInstance.js";
import {
  addTask,
  fetchTasks,
  removeTask,
  setErrors,
  setSelectedTask,
} from "../redux/silces/TaskSlice";
import { useDispatch, useSelector } from "react-redux";

import * as yup from "yup";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Switch,
  TextField,
} from "@mui/material";
import { Formik, useFormik } from "formik";
const validationSchema = yup.object({
  title: yup.string().required("title is required"),
  description: yup
    .string()
    .required("description is required")
    .max(300, "description must contain as maximum 300 characters"),
});

export default function Task() {
  const tasks = useSelector((state) => state.TaskSlice.tasks);
  const selectedTask = useSelector((state) => state.TaskSlice.selectedTask);
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [addTaskModal, setAddTaskModal] = React.useState(false);
  const [id, setId] = React.useState("");
  const [success, setSuccess] = React.useState(null);

  const handleClickOpen = (id) => {
    setId(id);
    setOpen(true);
  };
  const handleClickOpenDialog = (id) => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClickOpenAddTaskModal = (id) => {
    setAddTaskModal(true);
  };

  const handleCloseAddTaskModal = () => {
    setAddTaskModal(false);
  };
  const handleChangeTask = (value, id) => {
    let obj = {
      finished: value,
    };

    axios
      .put(`/task/update/${id}`, obj)
      .then((res) => {
        setSuccess(res.data.message);
        handleCloseDialog();
        formik.resetForm();
        dispatch(fetchTasks());
        setTimeout(() => {
          setSuccess(null);
        }, 2000);
      })
      .catch((err) => {
        dispatch(setErrors(err));
      });
  };
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      axios
        .post("/task/add", values)
        .then((res) => {
          setSuccess("task added successfully");
          dispatch(addTask(res.data.task));
          handleCloseAddTaskModal();
          formik.resetForm();
          setTimeout(() => {
            setSuccess(null);
          }, 2000);
        })
        .catch((err) => {
          dispatch(setErrors(err));
        });
    },
  });

  const onSubmit = async (values) => {
    axios
      .put(`/task/update/${selectedTask._id}`, values)
      .then((res) => {
        setSuccess(res.data.message);
        handleCloseDialog();
        formik.resetForm();

        dispatch(fetchTasks());
        setTimeout(() => {
          setSuccess(null);
        }, 2000);
      })
      .catch((err) => {
        dispatch(setErrors(err));
      });
  };

  return (
    <>
      <ResponsiveAppBar />
      {success && <Alert severity="success">{success ? success : ""}</Alert>}

      <TableContainer sx={{ margin: "5%", width: "90%" }} component={Paper}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h1>Tasks :</h1>
          <button
            onClick={() => {
              handleClickOpenAddTaskModal();
            }}
            type="button"
            className="btn btn-labeled btn-success"
          >
            <span className="btn-label">
              <i className="fa-solid fa-plus"></i>
            </span>
            Add Task
          </button>
        </div>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="left">Description </TableCell>
              <TableCell align="left">Creation date</TableCell>
              <TableCell align="left">Update date </TableCell>
              <TableCell align="left">Finished</TableCell>
              <TableCell align="left">Date of finish</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((row) => (
              <TableRow
                style={{ backgroundColor: row.finished && "#808080" }}
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="left">
                  <div
                    style={{
                      display: "block",
                      whiteSpace: "wrap",
                      width: "350px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    data-toggle="tooltip" data-placement="bottom" title={row.description}
                  >
                    {row.description}
                  </div>
                </TableCell>
                <TableCell align="left">
                  {row.updatedAt.substring(0, 10)}
                </TableCell>
                <TableCell align="left">
                  {row.createdAt.substring(0, 10)}
                </TableCell>
                <TableCell align="left">
                  <Switch
                    checked={row.finished}
                    onChange={() => handleChangeTask(!row.finished, row._id)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </TableCell>
                <TableCell align="left">
                  {row.finished_at !== null
                    ? row.finished_at.substring(0, 10)
                    : "---"}
                </TableCell>
                <TableCell align="left">
                  <i
                    onClick={() => handleClickOpen(row._id)}
                    style={{
                      marginRight: "10px",
                      cursor: "pointer",
                      fontSize: "17px",
                    }}
                    className="fa fa-trash"
                    aria-hidden="true"
                  ></i>
                  <i
                    onClick={() => {
                      dispatch(setSelectedTask(row));
                      handleClickOpenDialog();
                    }}
                    style={{ cursor: "pointer", fontSize: "18px" }}
                    className="fas fa-edit"
                  ></i>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        {/* delete task modal  */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete Task</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete your account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={() => {
                dispatch(removeTask(id));
                setSuccess("task deleted successfully");
                setTimeout(() => {
                  setSuccess(null);
                }, 2000);
                handleClose();
              }}
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        {/* update task modal */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Update Task</DialogTitle>
          <Formik
            initialValues={{
              title: selectedTask.title,
              description: selectedTask.description,
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              setFieldValue,
              values,
              touched,
              errors,
            }) => (
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogContent>
                  <DialogContentText>
                    To update this task, please complete the following steps
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    name="title"
                    value={values.title}
                    label="Title"
                    type="text"
                    fullWidth
                    variant="standard"
                    required
                    onChange={handleChange}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                  />
                  <TextField
                    margin="dense"
                    id="description"
                    name="description"
                    label="Description"
                    type="text"
                    fullWidth
                    variant="standard"
                    required
                    value={values.description}
                    onChange={handleChange}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => {
                      handleCloseDialog();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update</Button>
                </DialogActions>
              </Box>
            )}
          </Formik>
        </Dialog>
        {/* add task modal */}
        <Dialog open={addTaskModal} onClose={handleCloseAddTaskModal}>
          <DialogTitle>Add Task</DialogTitle>
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <DialogContent>
              <DialogContentText>
                To add new task, please complete the following steps
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="title"
                name="title"
                label="Title"
                type="text"
                fullWidth
                variant="standard"
                required
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
              <TextField
                margin="dense"
                id="description"
                name="description"
                label="Description"
                type="text"
                fullWidth
                variant="standard"
                required
                value={formik.values.description}
                onChange={formik.handleChange}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddTaskModal}>Cancel</Button>
              <Button type="submit">Add</Button>
            </DialogActions>
          </Box>
        </Dialog>
      </div>
    </>
  );
}
