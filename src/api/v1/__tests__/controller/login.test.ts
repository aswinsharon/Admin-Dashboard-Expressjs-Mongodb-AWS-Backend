import { Request, Response } from "express";
import loginController from "../../controllers/loginController";
import { User } from "../../models/userSchema";
import bcrypt from "bcrypt"


jest.mock('bcrypt');
const findOneMock = jest.fn();
jest.spyOn(User, 'findOne').mockImplementation(findOneMock);

describe("", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    const request = {
        body: {
            username: 'john',
            password: 'abc'
        }
    } as Request

    const response = {
        status: jest.fn(() => response),
        json: jest.fn()
    } as unknown as Response;
    it("validating successful login", async () => {
        findOneMock.mockResolvedValueOnce(() => ({
            _id: "1",
            username: "john",
            email: "abc@gmail.com",
            img: "https://abc.com",
            isActive: true,
            isAdmin: true,
            phone: "1234567890",
            address: "abc city",
            password: bcrypt.hashSync('abc', 10)
        }));
        (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
        await loginController.login(request, response);
        // Assertions
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(expect.any(Object));
    })
})