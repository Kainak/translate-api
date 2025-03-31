import User from "../models/userModel.js";

export const showUser = async (req, res, next) => {
  try {
    const user = await User.findOne(req.params);

    res.hateoas_item(user);
  } catch (err) {
    next(err);
  }
}

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    res.hateoas_list(users);
  } catch (err) {
    next(err);
  }
}

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    await new User({
      name,
      email,
      password,
    }).save();

    res.created();
  } catch (err) {
    next(err);
  }
}

export const editUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOneAndUpdate(req.params, {
      name,
      email,
      password,
    }, {
      new: true,
    });

    res.hateoas_item(user);
  } catch (err) {
    next(err);
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params._id);

    res.no_content();
  } catch (err) {
    next(err);
  }
}
