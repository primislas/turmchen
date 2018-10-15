import { TestBed } from '@angular/core/testing';

import { Js.Duct.TapeService } from './js.duct.tape.service';

describe('Js.Duct.TapeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Js.Duct.TapeService = TestBed.get(Js.Duct.TapeService);
    expect(service).toBeTruthy();
  });
});
