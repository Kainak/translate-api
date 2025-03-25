import httpStatus from "http-status";

export default (req, res, next) => {
  res.ok = (data) => {
    res
      .status(httpStatus.OK)
      .json(data);
  }

  res.created = () => {
    res
      .status(httpStatus.CREATED)
      .send();
  }

  res.no_content = () => {
    res
      .status(httpStatus.NO_CONTENT)
      .send();
  }

  next();
}
