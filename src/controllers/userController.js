import httpStatus from "http-status";
import User from "../models/userModel.js";

export const showUser = async (req, res, next) => {
  try {
    const user = await User.findOne(req.params);

    res.hateos_item(user);
  } catch (err) {
    next(err);
  }

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    res.hateos_list(users);
  } catch (err) {
    next(err);
  }
}

export const createUser = async (req, res, next) => {
  try {
    await new User(req.body).save();

    res
      .status(httpStatus.CREATED)
      .send();
  } catch (err) {
    next(err);
  }
}

export const editUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(req.params, req.body, { new: true });

    res.hateos_item(user);
  } catch (err) {
    next(err);
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params._id);

    res
      .status(httpStatus.OK)
      .send();
  } catch (err) {
    next(err);
  }
}
