import { AppService } from './app.service';

describe('AppService', () => {
  it('returns an ok health status', () => {
    const service = new AppService();
    expect(service.getHealth()).toEqual({ status: 'ok' });
  });
});
