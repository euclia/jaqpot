import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../jaqpot-client';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-social-base',
  templateUrl: './social.base.component.html',
  styleUrls: ['./social.base.component.css'],
})
export class SocialBaseComponent {
  public urlForm: FormGroup;

  public websiteURL: FormControl;

  public githubURL: FormControl;

  public linkedinURL: FormControl;

  public twitterURL: FormControl;

  editWeb: boolean = true;
  editGithub: boolean = true;
  editTwitter: boolean = true;
  editLinkedin: boolean = true;

  @Input() user: User;

  @Output() userUpdated = new EventEmitter<User>();

  constructor(public snackBar: MatSnackBar) {
    this.websiteURL = new FormControl(
      { value: '', disabled: true },
      Validators.required,
    );
    this.githubURL = new FormControl(
      { value: '', disabled: true },
      Validators.required,
    );
    this.linkedinURL = new FormControl(
      { value: '', disabled: true },
      Validators.required,
    );
    this.twitterURL = new FormControl(
      { value: '', disabled: true },
      Validators.required,
    );
    this.urlForm = new FormGroup({
      url: new FormControl({ value: '', disabled: true }, Validators.required),
      title: new FormControl(),
      description: new FormControl(),
    });
  }

  editWebsiteUrl() {
    this.websiteURL.enable();
    this.editWeb = false;
  }

  saveWebsiteUrl() {
    this.editWeb = true;
    if (this.websiteURL.valid) {
      this.user.website = this.websiteURL.value;
      this.userUpdated.emit(this.user);
    } else {
      this.openSnackBar('Invalid Website Url. Please check ', 'OK');
    }
    this.websiteURL.disable();
  }

  deleteWebsiteUrl() {
    this.user.website = null;
    this.userUpdated.emit(this.user);
  }

  editGithubUrl() {
    this.githubURL.enable();
    this.editGithub = false;
  }

  saveGithubUrl() {
    this.editGithub = true;
    if (this.githubURL.valid) {
      this.user.github = this.githubURL.value;
      this.userUpdated.emit(this.user);
    } else {
      this.openSnackBar('Invalid Github Url. Please check ', 'OK');
    }
    this.githubURL.disable();
  }

  deleteGithubUrl() {
    this.user.github = null;
    this.userUpdated.emit(this.user);
  }

  editLinkedinUrl() {
    this.linkedinURL.enable();
    this.editLinkedin = false;
  }

  saveLinkedinUrl() {
    this.editLinkedin = true;
    if (this.linkedinURL.valid) {
      this.user.linkedin = this.linkedinURL.value;
      this.userUpdated.emit(this.user);
    } else {
      this.openSnackBar('Invalid LinkedIn Url. Please check ', 'OK');
    }
    this.linkedinURL.disable();
  }

  deleteLinkedinUrl() {
    this.user.linkedin = null;
    this.userUpdated.emit(this.user);
  }

  editTwitterUrl() {
    this.twitterURL.enable();
    this.editTwitter = false;
  }

  saveTwitterUrl() {
    this.editTwitter = true;
    if (this.twitterURL.valid) {
      this.user.twitter = this.twitterURL.value;
      this.userUpdated.emit(this.user);
    } else {
      this.openSnackBar('Invalid Twitter Url. Please check ', 'OK');
    }
    this.twitterURL.disable();
  }

  deleteTwitterUrl() {
    this.user.twitter = null;
    this.userUpdated.emit(this.user);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3200,
    });
  }
}
