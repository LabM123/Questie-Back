import { Test, TestingModule } from '@nestjs/testing';
import { Auth0Controller } from './auth0.controller';
import { Auth0Service } from './auth0.service';

describe('Auth0Controller', () => {
  let controller: Auth0Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Auth0Controller],
      providers: [Auth0Service],
    }).compile();

    controller = module.get<Auth0Controller>(Auth0Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
