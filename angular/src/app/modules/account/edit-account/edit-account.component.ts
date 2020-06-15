import { Component, OnInit } from '@angular/core';
import { Account } from '../../../data/account.model';
import { AccountService } from 'src/app/services/account/account.service';
import { Payment } from 'src/app/data/payment.model';
import { Profile } from 'src/app/data/profile.model';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, animate, style } from '@angular/animations';
import * as _ from 'lodash';

@Component({
  selector: 'uic-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})
export class EditAccountComponent implements OnInit {

  //properties
  data:Account;
  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  hideCard:boolean=true;
  hideProfile:boolean=true;

  //functions
  //boolean toggle to show/hide the add new payment section in html
  toggleCard(){
    this.hideCard = !this.hideCard;
  }

  //boolean toggle to show/hide the add new profile section in html
  toggleProfile(){
    this.hideProfile = !this.hideProfile;
  }

  //function to check if an input field is nul/undefined/or white spaces
  isNullOrWhitespace(input:string) {
    if (typeof input === 'undefined' || input == null) return true;
    return input.replace(/\s/g, '').length < 1;
}

  //adds a new credit card info to the array of payments in the data:Account property
  addCard(cardName:string,cardNumberr:number,cardExpi:Date){
    //validation to check entered card name is not empty, is 15 digit number, and is a future expiration date
    let today = new Date();
    if( cardNumberr.toString().length!=15 || this.isNullOrWhitespace(cardName) || 
    today>cardExpi ||this.data.payments.some(x=>x.cardNumber==cardNumberr.toString())){
      return console.log('Error, please try again');
    }else{
    let newCard:Payment = {
      id:null,
      cardExpirationDate:cardExpi,
      cardName:cardName,
      cardNumber:cardNumberr.toString()
    }
    this.data.payments.push(newCard);
    this.toggleCard();
    console.log('Successfully added to the list');
  }}

  //remove a payment card from arrays of payments in the data:Account property
  removeCard(card){
    
    this.data.payments
    .splice(this.data.payments.indexOf(card),1);
  }
  
  //For transferring uploaded image to base64
  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        const max_size = 20971520;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 15200;
        const max_width = 25600;

        if (fileInput.target.files[0].size > max_size) {
            this.imageError =
                'Maximum size allowed is ' + max_size / 1000 + 'Mb';

            return false;
        }

        if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
            this.imageError = 'Only Images are allowed ( JPG | PNG )';
            return false;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {
                const img_height = rs.currentTarget['height'];
                const img_width = rs.currentTarget['width'];

                console.log(img_height, img_width);

                if (img_height > max_height && img_width > max_width) {
                    this.imageError =
                        'Maximum dimentions allowed ' +
                        max_height +
                        '*' +
                        max_width +
                        'px';
                    return false;
                } else {
                    const imgBase64Path = e.target.result;
                    this.cardImageBase64 = imgBase64Path;
                    this.isImageSaved = true;
                    // this.previewImagePath = imgBase64Path;
                }
            };
        };
        reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  //removing a selected image from the add new profile section
  removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
  }

  //adds a new profile to the array of profiles in the data:Account property
  addProfile(firstName:string,lastName:string,age:"Adult"|"Child",email:string,phone:number,img: string){
    //validation for adding a new profile
    if(this.data.profiles.some(x=>x.name.given==firstName&&x.name.family==lastName) || 
    this.isNullOrWhitespace(firstName) || this.isNullOrWhitespace(lastName) || 
    this.isNullOrWhitespace(email) || phone.toString().length!=10){
      return console.log('Error, please try again');      
    }
    let newProfile:Profile = {
      id:null,
      email:email,
      phone:phone.toString(),
      age:age,
      name:{
        id:null,
        family:lastName,
        given:firstName
      },
      image: img
    }
    this.data.profiles.push(newProfile);
    this.toggleProfile();
  }

  //remove a profile from array of profiles in the data:Account property
  removeProfile(profile){
    this.data.profiles
    .splice(this.data.profiles.indexOf(profile),1);
  }
  
  //http get from account service to obtain all the information of an account based on account id
  get(){
    const x = +this.route.snapshot.paramMap.get('id');
    this.AccServ.get(x.toString()).subscribe(data => this.data = data[0]);
  }

  //http put from account service to update account information, validation is very ugly
  onSubmit(){
    if(this.isNullOrWhitespace(this.data.name)||this.isNullOrWhitespace(this.data.address.street)||
      this.isNullOrWhitespace(this.data.address.city)||this.isNullOrWhitespace(this.data.address.stateProvince)||
      this.isNullOrWhitespace(this.data.address.postalCode)||this.isNullOrWhitespace(this.data.address.country)||
      this.data.payments.length<=0||this.data.profiles.length<=0){
        confirm("Please fill all the information and have at least one payment and profile before you update");
        return console.log("there was an error");
      }
    this.AccServ.put(this.data).subscribe(
      success=>console.log('success: ', this.data),
      error=>console.log('error'));
      confirm("Account updated!");
      this.router.navigateByUrl('account/1');
      console.log(this.data);

  }

  constructor(private AccServ: AccountService,
              private route: ActivatedRoute,
              private router:Router
    ) { }

  ngOnInit(): void {
    this.get();
  }
}
