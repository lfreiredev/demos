# CancelPendingRequests

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Goals

Navigate to `http://localhost:4200/`, open DevTools and set the type of Network to `Slow 3G`.
Refresh the page and you'll see both requests will take a while to finish.
Meanwhile, if you click on any of the `Cancel Requests` buttons, the respective requests (observables) will be canceled before finishing.
