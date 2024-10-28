import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.page.html',
  styleUrls: ['./estudiante.page.scss'],
})
export class EstudiantePage {
  attendanceStatus: string = '';

  constructor(
    private qrScanner: QRScanner,
    private firestore: AngularFirestore,
    private alertCtrl: AlertController
  ) {}

  async openScanner() {
    const status: QRScannerStatus = await this.qrScanner.prepare();

    if (status.authorized) {
      const scanSub = this.qrScanner.scan().subscribe(async (text: string) => {
        await this.registerAttendance(text);
        this.qrScanner.hide();
        scanSub.unsubscribe();
      });

      this.qrScanner.show();
    } else {
      this.showAlert('Error', 'No se pudo acceder a la cámara.');
    }
  }

  async registerAttendance(qrCode: string) {
    const estudianteId = 'ID_DEL_ESTUDIANTE'; // Obtén el ID del estudiante de la sesión o localStorage
    const sessionRef = this.firestore.collection('attendance_sessions').doc(qrCode);

    const sessionData = await sessionRef.get().toPromise();

    if (sessionData.exists) {
      await this.firestore.collection('asistencias').add({
        estudianteId,
        sessionId: qrCode,
        fecha: new Date(),
      });
      this.attendanceStatus = 'Asistencia registrada con éxito.';
    } else {
      this.attendanceStatus = 'Sesión de asistencia no válida.';
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
