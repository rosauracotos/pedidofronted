import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImagenService {
  subirImagen(archivo: File | string): Promise<string> {
    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('upload_preset', 'Alex639');

    if (archivo.toString().startsWith('http')) {
      return Promise.resolve(archivo.toString());
    }

    return fetch(
      'https://api.cloudinary.com/v1_1/dnt7ig9r4/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            'Error en la subida de imagen. Código: ' + response.status
          );
        }
        return response.json();
      })
      .then((data) => {
        if (!data.secure_url) {
          throw new Error('Cloudinary no devolvió una URL válida.');
        }
        return data.secure_url;
      })
      .catch((error) => {
        console.error('Error en ImagenService:', error);
        return '';
      });
  }
}
