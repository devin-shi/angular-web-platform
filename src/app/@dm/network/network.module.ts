import { NgModule, ModuleWithProviders } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NetworkConfig } from './network.config';

@NgModule({})
export class DelonMockModule {
  static forRoot(config: NetworkConfig): ModuleWithProviders {
    return {
      ngModule: NetworkConfig,
      providers: [{ provide: NetworkConfig, useValue: config }],
    };
  }
}
