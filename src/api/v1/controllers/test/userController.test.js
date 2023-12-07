const { Request, Response } = require("express");
const userController = require("../userController");
const userServices = require("../../services/userServices");
const Constants = require("../../../../config/constants");
const { validateUserId } = require("../../helpers/validationHelpers");

const req = { params: { userId: "validUserId" } };
const res = { status: jest.fn(), json: jest.fn(), send: jest.fn() };
