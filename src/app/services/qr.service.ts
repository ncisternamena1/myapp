import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class QRService {

  constructor(private firestore: AngularFirestore) {}

  async generarSesionQR(profesorId: string) {
    const sessionId = this.firestore.createId();  // Genera un ID único para la sesión
    const qrContent = `asistencia-${sessionId}`;  // Contenido del QR único para la sesión

    // Generar la imagen QR como base64
    const qrCodeData = await QRCode.toDataURL(qrContent);

    // Crear la sesión de asistencia en Firestore
    await this.firestore.collection('attendance_sessions').doc(sessionId).set({
      profesorId,
      sessionId,
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      qrContent
    });

    return qrCodeData;  // Devuelve el QR como imagen en base64
  }
}
