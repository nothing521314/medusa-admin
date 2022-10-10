export const getErrorMessage = (error) => {
  try {
    let msg = error?.response?.data?.message;
    if (msg[0].message) {
      msg = msg[0].message;
    }
    if (!msg) {
      msg = "Something went wrong, Please try again.";
    }
    return msg;
  } catch (er) {
    return String(error);
  }
};
