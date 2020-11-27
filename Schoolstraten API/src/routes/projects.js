const router = require("express").Router();
const { ProjectModel } = require("../models/project.model");
const { isAuthorized, isCreator } = require("../guards/auth");

// Get all projects
router.get("/", async (request, response, next) => {
  try {
    const projects = await ProjectModel.find();
    return response.status(200).json({ projects });
  } catch (error) {
    error.status = 400;
    next(error);
  }
});

// Create project - Protected route
router.post("/", [isAuthorized, isCreator], async (request, response, next) => {
  const { id, role } = request.user;
  const projectObj = { ...request.body, user: id };
  const project = new ProjectModel(projectObj);
  try {
    const saved = await project.save();
    return response.status(200).json({ saved });
  } catch (error) {
    error.status = 400;
    next(error);
  }
});

// Get project by id
router.get("/:id", async (request, response, next) => {
  const id = request.params.id;

  try {
    const project = await ProjectModel.findById(id);
    return response.status(200).json({ project });
  } catch (error) {
    console.log(error);
    return response
      .status(400)
      .json({ message: "Something went wrong", error });
  }
});

// Delete project by id
router.delete(
  "/:id",
  [isAuthorized, isCreator],
  async (request, response, next) => {
    const id = request.params.id; // string
    const user = request.user; // { id: string, role: string }

    try {
      const project = await ProjectModel.findById(id);
      if (!project)
        return response.status(400).json({ message: "Project not found" });
      else if (hasPrivileges(user, project)) {
        try {
          const deleted = await ProjectModel.findOneAndDelete({
            _id: project._id,
          });
          return response
            .status(200)
            .json({ message: "Project deleted", deleted });
        } catch (error) {
          return response
            .status(400)
            .json({ message: "Something went wrong", error });
        }
      } else
        return response
          .status(401)
          .json({ message: "The user is not authorized to make the request" });
    } catch (error) {
      return response.status(400).json({ error });
    }
  }
);

// Update project
router.patch(
  "/:id",
  [isAuthorized, isCreator],
  async (request, response, next) => {
    const id = request.params.id; // string
    const user = request.user; // { id: string, role: string }

    try {
      const project = await ProjectModel.findById(id);
      if (!project)
        return response.status(400).json({ message: "Project not found" });
      else if (hasPrivileges(user, project)) {
        try {
          const updated = await ProjectModel.findByIdAndUpdate(
            { _id: project._id },
            request.body,
            { new: true }
          );
          return response
            .status(200)
            .json({ message: "Project updated", updated });
        } catch (error) {
          return response
            .status(400)
            .json({ message: "Something went wrong", error });
        }
      } else
        return response
          .status(401)
          .json({ message: "The user is not authorized to make the request" });
    } catch (error) {
      return response.status(400).json({ error });
    }
  }
);

function hasPrivileges(token, project) {
  switch (token.role) {
    case "user":
      console.log("hasPrivileges()", token.role);
      return false;
    case "creator":
      console.log("hasPrivileges()", token.role);
      return String(token.id) === String(project.user) ? true : false;
    case "admin":
      console.log("hasPrivileges()", token.role);
      return true;
    default:
      return false;
  }
}

module.exports = router;
