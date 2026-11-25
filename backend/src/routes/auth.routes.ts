import { Router } from "express";
import {
  validateRegisterUser,
  validateLoginUser,
} from "../validator/auth.validator.js";

const router = Router();

router.post("/register", validateRegisterUser);

router.post("/login", validateRegisterUser);
