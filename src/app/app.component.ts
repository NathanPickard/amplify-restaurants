import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { APIService } from './API.service';
import { Restaurant } from '../types/restaurant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'amplify-restaurants';
  public createForm: FormGroup;

  restaurants: Array<Restaurant>;

  constructor(private api: APIService, private fb: FormBuilder) { }

  async ngOnInit() {
    this.createForm = this.fb.group({
      'name': ['', Validators.required],
      'description': ['', Validators.required],
      'city': ['', Validators.required]
    });

    this.api.ListRestaurants().then(event => {
      this.restaurants = event.items;
    });

    this.api.OnCreateRestaurantListener.subscribe((event: any) => {
      const newRestaurant = event.value.data.onCreateRestaurant;
      this.restaurants = [newRestaurant, ...this.restaurants];
    });
  }

  public onCreate(restaurant: Restaurant) {
    this.api.CreateRestaurant(restaurant).then(event => {
      console.log('item created!');
      this.createForm.reset();
    })
      .catch(event => {
        console.log('error creating restaurant...', event);
      });
  }
}
