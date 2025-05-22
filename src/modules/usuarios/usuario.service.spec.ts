const { Test, TestingModule } = require('@nestjs/testing');
const { UsuarioService } = require('./usuario.service');
const { BadRequestException } = require('@nestjs/common');

describe('UsuarioService', () => {
	let service;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UsuarioService],
		}).compile();

		service = module.get<UsuarioService>(UsuarioService);
	});

	it('should register a user with valid data', async () => {
		const userData = {
			nome: 'testesenha',
			email: 'batata@batata.com',
			senha: 'Teste@123',
		};
		const result = await service.register(userData);
		expect(result).toEqual(expect.objectContaining(userData));
	});

	it('should throw BadRequestException for invalid data', async () => {
		const invalidUserData = {
			nome: '',
			email: 'invalid-email',
			senha: '123',
		};
	 await expect(service.register(invalidUserData)).rejects.toThrow(BadRequestException);
	});
});