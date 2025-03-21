import { UserController } from "./UserController";
import { UserService } from '../services/UserService'
import { Request } from 'express'
import { makeMockResponse } from "../__mocks__/mockResponse.mock";

describe('UserController', () => {
    const mockUserService: Partial<UserService> = {
        createUser: jest.fn(),
        getAllUsers: jest.fn(),
        deleteUser: jest.fn()
    }
    
    const userController = new UserController(mockUserService as UserService);

    it('Deve adicionar um novo usuário', () => {
        const mockRequest = {
            body: {
                name: 'Nath',
                email: 'nath@test.com'
            }
        } as Request
        const mockResponse = makeMockResponse()
        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(201)
        expect(mockResponse.state.json).toMatchObject({ message: 'Usuário criado' })
    })

    it('Deve retornar erro quando o usuário não informar o name', () => {
        const mockRequest = {
            body: {
                email: 'nath@test.com'
            }
        } as Request
        const mockResponse = makeMockResponse()
        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! Name obrigatório' })
    })

    it('Deve retornar erro quando o usuário não informar o email', () => {
        const mockRequest = {
            body: {
                name: 'Nath'
            }
        } as Request
        const mockResponse = makeMockResponse()
        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! Email obrigatório' })
    })

    it('Deve verificar se a função getAllUsers está sendo chamada', () => {
        const mockRequest = {} as Request
        const mockResponse = makeMockResponse()
        userController.getAllUsers(mockRequest, mockResponse)
        expect(mockUserService.getAllUsers).toHaveBeenCalled()
        expect(mockResponse.state.status).toBe(200)
    })

    it('Deve deletar um usuário existente', () => {
        (mockUserService.deleteUser as jest.Mock).mockReturnValueOnce(true)
        
        const mockRequest = {
            params: {
                email: 'user@test.com'
            }
        } as unknown as Request
        
        const mockResponse = makeMockResponse()
        userController.deleteUser(mockRequest, mockResponse)
        
        expect(mockUserService.deleteUser).toHaveBeenCalledWith('user@test.com')
        expect(mockResponse.state.status).toBe(200)
        expect(mockResponse.state.json).toMatchObject({ message: 'Usuário deletado com sucesso' })
    })

    it('Deve retornar 404 quando tentar deletar um usuário inexistente', () => {
        (mockUserService.deleteUser as jest.Mock).mockReturnValueOnce(false)
        
        const mockRequest = {
            params: {
                email: 'nonexistent@test.com'
            }
        } as unknown as Request
        
        const mockResponse = makeMockResponse()
        userController.deleteUser(mockRequest, mockResponse)
        
        expect(mockUserService.deleteUser).toHaveBeenCalledWith('nonexistent@test.com')
        expect(mockResponse.state.status).toBe(404)
        expect(mockResponse.state.json).toMatchObject({ message: 'Usuário não encontrado' })
    })

    it('Deve retornar erro quando não informar o email para deletar', () => {
        const mockRequest = {
            params: {}
        } as unknown as Request
        
        const mockResponse = makeMockResponse()
        userController.deleteUser(mockRequest, mockResponse)
        
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toMatchObject({ message: 'Email é obrigatório para deletar um usuário' })
    })
})