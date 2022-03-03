# NG DraggablePoints

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Goals

Navigate to `http://localhost:4200/` and you'll see an image and four buttons.
By clicking the `Add` button, a new marker will be added within the boundaries of the image.
Each marker is red until edited, meaning they can't be dragged around until their edit button has been pressed.
After being pressed, the marker will turn green and you can drag it around.
Each marker also has a cross icon, that deletes it.

The `Enable/Disable` buttons, enable and disable the form that's controlling the markers. By disabling it, no operations can be done,
be it adding new markers, editing or deleting existing ones.

Lastly, there's the `Save` button, that saves the current drawn markers coordinates to the local storage.
Then, on page refresh, the markers coordinates are restored and immediatly redrawn to the image.

![image](https://user-images.githubusercontent.com/54550772/156543325-9408ada2-1768-4094-9bca-2cc13ad5e264.png)

Note: the image is just a container with a background. It can be anything else with boundaries.
