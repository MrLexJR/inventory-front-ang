import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(private keycloak: KeycloakService) {}

  getRoles() {
    return this.keycloak.getUserRoles();
  }

  isAdmin() {
    const admin = 'admin-inventory';
    let roles = this.keycloak.getUserRoles().filter((roles: string) => roles === admin);

    return roles.length > 0 ? true : false;
  }
}
