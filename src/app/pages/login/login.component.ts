import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient); // Inject HttpClient to make HTTP requests

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '729802594250-ld4oooctcid3krs804ud4cvtltvsicib.apps.googleusercontent.com',
      callback: (response: any) => this.handleLogin(response)
    });

    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      theme: 'filled_blue',
      size: 'large',
      shape: 'rectangle',
      width: 250,
      margin: 'auto'
    });
  }

  private decodeToken(token: string) {
    return JSON.parse(atob(token.split(".")[1]));
  }

  handleLogin(response: any) {
    if (response) {
      /* Decode the token */
      const payLoad = this.decodeToken(response.credential);
      const email = payLoad.email;
  
      /* Prepare the payload */
      const userPayload = { email };
      /* Store it in session */
      sessionStorage.setItem("loggedInUser", JSON.stringify(payLoad));
      /* Navigate to home */
     // this.router.navigate(['browse']);
  
      /* Send to create user */
      this.http.post('https://tfarrej-backend.onrender.com/api/user/create', userPayload).pipe(
        catchError(error => {
          // If there is an error (such as 400), attempt to login the user directly
          if (error.status === 400) {
            console.log('User already exists, proceeding to login...');
            this.loginUser(userPayload);
          } else {
            console.error('Error creating user:', error);
          }
          return of(error); // Return an empty observable if there's an error
        })
      ).subscribe((createResponse: any) => {
        if (createResponse && createResponse.message === 'User created successfully') {
          // If creation succeeds, log the user in
          this.loginUser(userPayload);
        }
      });
    }
  }
  
  private loginUser(userPayload: { email: string }) {
    // Send the email to login endpoint
    this.http.post('https://tfarrej-backend.onrender.com/api/user/login', userPayload).pipe(
      catchError(error => {
        console.error('Error logging in:', error);
        return of(error); // Return an empty observable if there's an error
      })
    ).subscribe((loginResponse: any) => {
      if (loginResponse) {
        console.log('User logged in successfully:', loginResponse);
        // Store the user in session storage
        //sessionStorage.setItem("loggedInUser", JSON.stringify(loginResponse));
        // Navigate to home
        this.router.navigate(['browse']);
      }
    });
  }
}  