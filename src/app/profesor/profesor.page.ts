import { Component } from '@angular/core';
import { QRService } from '../services/qr.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.page.html',
  styleUrls: ['./profesor.page.scss'],
})
export class ProfesorPage {
  qrCodeData: string | null = null;

  constructor(private qrService: QRService, private afAuth: AngularFireAuth) {}

  async generarQR() {
    const user = await this.afAuth.currentUser;
    if (user) {
      const profesorId = user.uid;

      // Genera el código QR y lo muestra en pantalla
      this.qrCodeData = await this.qrService.generarSesionQR(profesorId);
    }
  }
}
