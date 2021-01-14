import { sendResponse, handleError } from "../util/response";
import CategoryModel from "./model";

const router = require("express").Router();

router.post("/", async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (userEmail !== "quack@domain.com")
      return sendResponse(res, false, "Please log in with admin account ( ')>");

    const { name, parent } = req.body;
    const newCategory = new CategoryModel({ name, parent });
    const category = await newCategory.save();
    return sendResponse(res, true, category);
  } catch (error) {
    return handleError(res, error, "Get error");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (userEmail !== "quack@domain.com")
      return sendResponse(res, false, "Please log in with admin account ( ')>");

    const id = req.params.id || null;
    const parent = req.body.parent;

    const category = await CategoryModel.findById(id);

    if (parent !== undefined) {
      let _id = parent;
      while (_id !== null) {
        let cat = await CategoryModel.findById(_id);
        if (cat === null)
          return sendResponse(res, false, "Parent category not found");
        _id = cat.parent;
        if (_id == id)
          return sendResponse(res, false, "Cycle found in category parent.");
      }
      category.parent = parent;
    }
    if (req.body.name !== undefined) category.name = req.body.name;

    await category.save();
    return sendResponse(res, true, category);
  } catch (error) {
    return handleError(res, error, "Get error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (userEmail !== "quack@domain.com")
      return sendResponse(res, false, "Please log in with admin account ( ')>");

    const id = req.params.id || null;
    const category = await CategoryModel.deleteOne({ _id: id });
    return sendResponse(res, true, category);
  } catch (error) {
    return handleError(res, error, "Get error");
  }
});

module.exports = router;
