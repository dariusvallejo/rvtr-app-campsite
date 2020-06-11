import { Component, OnInit } from '@angular/core';
import { Account } from '../../../data/account.model';
import { AccountService } from 'src/app/services/account/account.service';
import { Payment } from 'src/app/data/payment.model';
import { Profile } from 'src/app/data/profile.model';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'uic-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {
  data:Account;
  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;

  isNullOrWhitespace(input:string) {
    if (typeof input === 'undefined' || input == null) return true;
    return input.replace(/\s/g, '').length < 1;
}
  //adds a new credit card info to the displayed list
  addCard(cardName:string,cardNumberr:number,cardExpi:Date){
    //validation to check entered card name is not empty, 15 digit number, and future expiration date
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
    console.log('Successfully added to the list')
  }
  }

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

  removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
  }

  removeCard(card){
    this.data.payments
    .splice(this.data.payments.indexOf(card),1);
  }

  addProfile(firstName:string,lastName:string,age:"Adult"|"Child",email:string,phone:number,img: string){
    //validation for adding new profile
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
  }


  removeProfile(profile){
    this.data.profiles
    .splice(this.data.profiles.indexOf(profile),1);
  }

  obscure(){
    for(let i = 0; i < this.data.payments.length; i++){
      this.data.payments[i].cardNumber = "***********"+ this.data.payments[i].cardNumber.substring(11,16);
    }
  }
  
  //directed from the view account page with unique id
  get(){
    const x = +this.route.snapshot.paramMap.get('id');
    this.AccServ.get(x.toString()).subscribe(data => this.data = data[0]);
  }

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
