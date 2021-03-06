import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account/account.service';
import { Account } from '../../../data/account.model';
import { Review } from '../../../data/review.model';
import { Booking } from '../../../data/booking.model';
import { ActivatedRoute } from '@angular/router';
import { Lodging } from 'src/app/data/lodging.model';
import { LodgingService } from 'src/app/services/lodging/lodging.service';

import { map } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'uic-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  // properties
  data: Account;
  bookings: Booking[];
  bookingLocations: string[] = [];
  reviews: Review[];
  reviewLocations: string[] = [];

  // functions
  // http get to call the most recent booking information from the booking service.
  // Bookings will be sorted on the API end. using account id.
  getBookings() {
    this.AccSer.getBookings(this.data.id.toString()).pipe(map(bookings => bookings.slice(0, 2))).subscribe(books => this.bookings = books);
    if (this.bookings.length >= 1) {
      for (const booking of this.bookings){
        this.LodgServ.get(booking.lodgingId.toString())
          .subscribe(lodge => this.bookingLocations.push(lodge[0].name));
      }
    }
  }

  // http get to call the most recent reviews by the account from the review service. using account id.
  getReviews() {
    this.AccSer.dummyGetReveiws('hi').subscribe(val => this.reviews = val);
    if (this.reviews.length >= 1) {
      for (const review of this.reviews) {
        this.LodgServ.get(review.hotelId.toString())
          .subscribe(lodge => this.reviewLocations.push(lodge[0].name));
      }
    }
  }

  // http get to retrieve account information from account service using account id
  getAccount() {
    const x = this.AccSer.getUserId();
    console.log(x);
    // const x = +this.route.snapshot.paramMap.get('id');
    this.AccSer.get(x).subscribe(data => {
      this.data = data[0]; this.obscure();
      this.getReviews();
      this.getBookings();
      console.log(this.data.id);
    });
  }

  // hashing the credit card number displayed.
  obscure() {
    // tslint:disable-next-line
    for (let i = 0; i < this.data.payments.length; i++) {
      this.data.payments[i].cardNumber = '***********' + this.data.payments[i].cardNumber.substring(11, 16);
    }
  }

  constructor(private AccSer: AccountService,
              private route: ActivatedRoute,
              private LodgServ: LodgingService,
  ) { }

  ngOnInit(): void {
    this.getAccount();
  }
}
