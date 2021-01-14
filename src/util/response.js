export const handleError = (res, error, errorMessage) => {
  console.log(error);
  sendResponse(
    res,
    false,
    error["_message"] != null ? error["_message"] : errorMessage
  );
};

export const sendResponse = (res, success, data) => {
  var obj = new Object();
  obj["success"] = success;
  if (success) {
    obj["data"] = data;
  } else {
    obj["message"] = data;
  }

  res.json(obj);
};
