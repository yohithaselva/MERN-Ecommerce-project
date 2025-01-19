import user from "../models/user.js";

// if use use this middleware in any route then the user must be admin then only he can access the route
export const isAdmin = async (req, res, next) => {
  //find the user role
  const User = await user.findById(req.userAuthId);
  //check if admin
  if (User.isAdmin) {
    next();
  } else {
    next(new Error("Access Denied, You are not an admin"));
  }
};
