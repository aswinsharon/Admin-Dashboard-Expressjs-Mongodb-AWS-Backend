import { Request, Response } from 'express';
import userController from '../../controllers/userController'; // Update the path accordingly
import userServices from '../../services/userServices';
jest.mock('../../services/userServices');

describe('getUsers', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {};
        jsonMock = jest.fn();
        res = {
            status: jest.fn(() => ({ json: jsonMock })),
        } as unknown as Response;;
    });

    it('should return users when they exist in the database', async () => {
        // Arrange
        const usersFromDB = [
            {
                _id: '1',
                username: 'testuser',
                email: 'testuser@example.com',
                img: 'avatar.jpg',
                isActive: true,
                isAdmin: false,
                phone: '123456789',
                address: '123 Main St',
            },
        ];
        // Mock the service to return the users
        (userServices.getAllUsersService as jest.Mock).mockResolvedValue(usersFromDB);

        // Act
        await userController.getUsers(req as Request, res as Response);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith([
            {
                _id: '1',
                username: 'testuser',
                email: 'testuser@example.com',
                img: 'avatar.jpg',
                isActive: true,
                isAdmin: false,
                phone: '1234567890',
                address: '123 Main St',
            },
        ]);
    });

    it('should return an empty array when no users are found in the database', async () => {
        // Arrange
        // Mock the service to return null (no users)
        (userServices.getAllUsersService as jest.Mock).mockResolvedValue(null);

        // Act
        await userController.getUsers(req as Request, res as Response);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith([]);
    });

    it('should handle errors and return a server error status code', async () => {
        // Arrange
        const errorMessage = 'An error occurred';
        // Mock the service to throw an error
        (userServices.getAllUsersService as jest.Mock).mockRejectedValue(new Error(errorMessage));

        // Act
        await userController.getUsers(req as Request, res as Response);

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({ error: errorMessage });
    });
});
