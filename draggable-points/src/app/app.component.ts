import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Popup } from './models/popup';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  public bg: string = 'https://images.unsplash.com/photo-1640597995884-57667d173ccf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80';
  public form: FormGroup;
  
  constructor() {
    this.form = new FormGroup({
      markers: new FormControl([])
    });

    setInterval(() => {
      console.log(this.form.value);
      console.log(this.form.touched);
    }, 2000);
  }

  public ngAfterViewInit(): void {
    const data = JSON.parse(localStorage.getItem('data'));
    console.log(data);
    if (data && data.markers) {
      this.form.controls.markers.setValue(data.markers);
    }
  }

  public disable(): void {
    this.form.disable();
  }

  public enable(): void {
    this.form.enable();
  }

  public save(): void {
    console.log(this.form.value);
    localStorage.setItem('data', JSON.stringify(this.form.value));
  }
}