import expressAsyncHandler from "express-async-handler";
import user from "../models/user.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { getToken } from "../utils/getToken.js";
import { verifyToken } from "../utils/verifyToken.js";
// register user
// Post/admin/register @route
// Admin login

export const register = expressAsyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  //check for user exist
  const userExist = await user.findOne({ email });
  if (userExist) {
    //throw
    throw new Error("User Already Exists");
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //create a new user
  const admin = await user.create({
    fullname,
    email,
    password: hashedPassword,
  });
  res.status(201).json({
    status: "Success",
    message: "User registered sucessfully",
    data: user,
  });
});

// login user
// route /admin/login
//acess public
export const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Find the user in db by email only
  const userFound = await user.findOne({
    email,
  });
  // Password comparing
  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    res.json({
      status: "sucess",
      message: "user logged in successfully",
      userFound,
      token: generateToken(userFound?._id), // for getting the id of user if logged in sucessful
    });
  } else {
    throw new Error("Invalid Login");
  }
});

//dummy profile
// access private

export const userprofile = expressAsyncHandler(async (req, res) => {
  //find the user
  const User = await user.findById(req.userAuthId).populate("orders");
  res.json({
    status: "Sucess",
    message: "User profile fetched sucessfully",
    User,
  });
});

//update user shipping addresss
//update/shipping
// acess private

export const updateShippingAddressctrl = expressAsyncHandler(
  async (req, res) => {
    const { firstName, lastName, address, city, postalCode, province, phone } =
      req.body;
    //find user
    const User = await user.findByIdAndUpdate(
      req.userAuthId,
      {
        ShippingAddress: {
          firstName,
          lastName,
          address,
          city,
          postalCode,
          province,
          phone,
        },
        hasShippingAddress: true,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      message: "shipping address updated",
      data: User,
    });
  }
);
