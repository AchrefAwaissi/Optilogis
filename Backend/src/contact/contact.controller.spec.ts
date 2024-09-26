import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { Logger } from '@nestjs/common';
import { ContactDto } from './dto/contact.dto';

jest.mock('nodemailer');

describe('ContactService', () => {
  let service: ContactService;
  let mockTransporter: any;

  beforeEach(async () => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
      verify: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    (service as any).transporter = mockTransporter;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('submitContact', () => {
    const mockContactDto: ContactDto = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    };

    it('should successfully send an email', async () => {
      const result = await service.submitContact(mockContactDto);
      expect(result.success).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
    });

    it('should handle error when sending email fails', async () => {
      mockTransporter.sendMail.mockRejectedValueOnce(new Error('SMTP error'));
      const result = await service.submitContact(mockContactDto);
      expect(result.success).toBe(false);
      expect(result.message).toContain('Une erreur est survenue');
    });

    it('should limit to 2 messages per 24 hours for the same email', async () => {
      // Premier message
      const firstResult = await service.submitContact(mockContactDto);
      expect(firstResult.success).toBe(true);

      // Deuxième message
      const secondResult = await service.submitContact(mockContactDto);
      expect(secondResult.success).toBe(true);

      // Troisième message (devrait être refusé)
      const thirdResult = await service.submitContact(mockContactDto);
      expect(thirdResult.success).toBe(false);
      expect(thirdResult.message).toContain('Limite de 2 messages par 24 heures atteinte');
    });

    it('should allow sending again after 24 hours', async () => {
      // Envoyer 2 messages
      await service.submitContact(mockContactDto);
      await service.submitContact(mockContactDto);

      // Avancer le temps de 24 heures
      jest.advanceTimersByTime(24 * 60 * 60 * 1000);

      // Le 3ème message devrait être autorisé
      const result = await service.submitContact(mockContactDto);
      expect(result.success).toBe(true);
    });
  });

  describe('cleanupOldEntries', () => {
    it('should remove entries older than 24 hours', async () => {
      const mockContactDto1: ContactDto = { name: 'User1', email: 'Achrefawaissi@gmail.com', message: 'Test' };
      const mockContactDto2: ContactDto = { name: 'User2', email: 'awachref7@gmail.com', message: 'Test' };

      // Envoyer des messages
      await service.submitContact(mockContactDto1);
      await service.submitContact(mockContactDto2);

      // Avancer le temps de 25 heures
      jest.advanceTimersByTime(25 * 60 * 60 * 1000);

      // Déclencher le nettoyage
      (service as any).cleanupOldEntries();

      // Vérifier que les anciennes entrées ont été supprimées
      expect((service as any).userMessageCounts).toEqual({});
    });
  });
});