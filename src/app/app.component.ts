import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { EditorService } from '../services/editor.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CdkDrag, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  items: { text: any[]; image: any[] } = { text: [], image: [] };
  selectedItem: any;
  @ViewChild('boundary') boundary: any;
  boundaryRect: ClientRect | undefined;

  constructor(
    private apiService: EditorService,
    private toastr: ToastrService
  ) {}

  get allItems() {
    return [...this.items.text, ...this.items.image];
  }

  //text nesnesi ekliyoruz
  addText(type: string) {
    const boundaryRect = this.boundary.nativeElement.getBoundingClientRect();
    this.items.text.push({
      type: 'text',
      name: '',
      value: '',
      x_axis: boundaryRect.height / 2,
      y_axis: boundaryRect.width / 2,
      font: 'Verdana',
      font_size: 15,
      bold: false,
      italic: false,
      // alignment: 'left', //aslında yazının ne tarafa yaslı olduğunu belirten ve olması gereken bir özellik ama bana gelen json requestte buna uygun bir alan yoktu
      underline: false,
      strikethrough: false,
    });
  }

  //image nesnesi ekiyoruz
  addImage(event: any) {
    const boundaryRect = this.boundary.nativeElement.getBoundingClientRect();
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.items.image.push({
        type: 'image',
        name: 'Symbol',
        value: e.target.result,
        x_axis: boundaryRect.height / 2,
        y_axis: boundaryRect.width / 2,
      });
    };
    reader.readAsDataURL(file);
  }

  //burası kullanıcının manuel textboxa sayı girerek pozisyonu değiştirdiği yer X ekseni
  updatePositionX(event: any, index: number) {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      this.items.text[index].y_axis = value;
    }
  }

  //burası kullanıcının manuel textboxa sayı girerek pozisyonu değiştirdiği yer Y ekseni
  updatePositionY(event: any, index: number) {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      this.items.text[index].y_axis = value;
    }
  }

  //seçilen item bilgilerini alıyoruz
  selectItem(item: any) {
    this.selectedItem = item;
  }

  //kaydet ve gönder buttonu aktifse apiye bilgileri gönderebiliriz
  sendData() {
    const jsonData = JSON.stringify(this.items, null, 2);
    console.log(jsonData);
  
    this.apiService.postData(jsonData).subscribe(
      (response: any) => {
        this.toastr.success('Veri Başarıyla Gönderildi!', 'Başarılı');
      },
      (error: any) => {
        this.toastr.error('Bir Hata Oluştu !', 'Hata');
      }
    );
  }

  //kullanıcının sürükleme işlemini bitirdiğinde devreye girer
  onDragEnd(event: CdkDragEnd, index: number) {
    const boundaryRect = this.boundary.nativeElement.getBoundingClientRect(); //sürükleme alanımız (büyük dikdörtgen)
    const dragRect = event.source.element.nativeElement.getBoundingClientRect(); //sürüklenen eleman

    const newTop = dragRect.top - boundaryRect.top; //sürüklendiği yerin top değeri (x ekseni)
    const newLeft = dragRect.left - boundaryRect.left; //sürüklendiği yerin left değeri değeri (y ekseni)

    const item = this.allItems[index]; // bizim dizideki ilgili item ı buluyoruz

    if (item.type === 'text') {
      const textIndex = this.items.text.indexOf(item);
      if (textIndex !== -1) {
        this.items.text[textIndex].x_axis = newTop; //yeni koordinatlar bilgilerini güncelliyoruz
        this.items.text[textIndex].y_axis = newLeft;
      }
    } else if (item.type === 'image') {
      const imageIndex = this.items.image.indexOf(item);
      if (imageIndex !== -1) {
        this.items.image[imageIndex].x_axis = newTop;
        this.items.image[imageIndex].y_axis = newLeft;
      }
    }
  }
}
