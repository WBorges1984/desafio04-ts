import { User, UserService } from "./UserService";

describe('UserService', () => {
    const mockDb: User[] = []
    const userService = new UserService(mockDb);

    it('Deve adicionar um novo usuário', () => {
        const mockConsole = jest.spyOn(global.console, 'log')
        userService.createUser('nath', 'nath@test.com');
        expect(mockConsole).toHaveBeenCalledWith('DB atualizado', mockDb)
    })

    it('Deve deletar um usuário existente', () => {
        // Primeiro, garantimos que temos um usuário para deletar
        userService.createUser('user', 'user@test.com');
        
        // Verifica se o usuário foi adicionado
        const usersBeforeDeletion = userService.getAllUsers();
        expect(usersBeforeDeletion.length).toBe(2); // Temos o usuário 'nath' do teste anterior e o novo 'user'
        
        // Deleta o usuário
        const deleted = userService.deleteUser('user@test.com');
        
        // Verifica se o retorno é verdadeiro (usuário encontrado e deletado)
        expect(deleted).toBe(true);
        
        // Verifica se o usuário foi removido
        const usersAfterDeletion = userService.getAllUsers();
        expect(usersAfterDeletion.length).toBe(1);
        expect(usersAfterDeletion.find(user => user.email === 'user@test.com')).toBeUndefined();
    })

    it('Deve retornar falso ao tentar deletar um usuário inexistente', () => {
        const deleted = userService.deleteUser('nonexistent@test.com');
        expect(deleted).toBe(false);
    })
})