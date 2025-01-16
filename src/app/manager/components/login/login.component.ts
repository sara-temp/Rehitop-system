import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Login } from '../../../models/login.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  user = ''
  password = ''
  Login: Login | undefined
  showPassword = false;
  LoginForm: FormGroup = new FormGroup({})
  constructor(private authService: AuthService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.LoginForm = new FormGroup({
      username: new FormControl(this.Login?.username || '', Validators.required),
      password: new FormControl(this.Login?.password || '', Validators.required)
    });
    }
  
  
  onlogin() {
    this.authService.login(this.LoginForm.value).subscribe((response) => {
      this.router.navigate([''])
    },
    (err)=> alert('ההתחברות נכשלה'))
  }

  onCancel() {
    this.dialog.closeAll();
  }
 
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // החלפת המצב
  }
}
