import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../model/user.model';
import { AuthService } from '../../model/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User;
  validEmail: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService

  ) { }

  ngOnInit(): void {
    this.user = new User();
  }

  onRegisterSubmit(): void {
    this.authService.registerUser(this.user).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('Thank you for registering', {cssClass: 'alert-success', timeOut: 6000});
        this.router.navigate(['/login']);
      } else {
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeOut: 6000});
      }
    });
  }
}
