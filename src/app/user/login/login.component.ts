import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private auth: AngularFireAuth) {}

  showAlert = false;
  alertMsg = 'Signing in...';
  alertColor = 'blue';

  inSubmission = false;

  credentials = {
    email: '',
    password: '',
  };

  async login() {
    this.showAlert = true;
    this.alertMsg = 'Signing in...';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
    } catch (e) {
      this.alertMsg = 'An unexpected error occured. Please try again later.';
      this.alertColor = 'red';
      this.inSubmission = false;
      console.error(e);
      return;
    }

    this.alertMsg = 'Success. You are logged in';
    this.alertColor = 'green';
  }
}
