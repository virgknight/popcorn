# Popcorn Popper

## Background
Popcorn Popper is a single-player game in which a player earns points and ascends levels by popping popcorn kernels. The game plays out on a rectangular grid which is bordered by flames on the right-hand side and popcorn kernels on the left-hand side. Each cell of the grid contains a section of rope fuse which can be rotated on a click. In order to pop a kernel, the player must rotate fuse segments to form a continuous path from the fire to the kernel, allowing a flame to travel along the fuse. Once the kernel pops, all fuse pieces along the path burn up and disappear; these pieces will be replaced by randomly generated new fuse pieces. Some fuse pieces point in 3 or 4 directions at once, effectively splitting the flame and allowing the player to pop multiple kernels at once!

## Functionality & MVPs
In Popcorn Popper, the user will be able to:
* Start and stop a new game
* Play through different levels of increasing difficulty
* Rotate fuse pieces on a click
* Construct fuse paths that ignite one or more popcorn kernels

In addition, this project will include:
* A production README
* A "How to Play" modal with game instructions

## Wireframes
![wireframe](/images/Homepage.png)
The navigation bar will include links to this project's GitHub repo, my LinkedIn, and the "How to Play" modal.

## Technologies, Libraries, APIs
This project will be implemented with the following technologies:
* JavaScript to handle game logic
* Canvas to render the game grid
* Webpack to bundle and transpile the source JavaScript code
* npm to handle project dependencies

## Implementation Timeline
### Friday Afternoon & Weekend
* Study similar games to get a feel for the setup and logic
* Set up the environment, including WebPack
* Write classes and controllers for grid pieces
* Hopefully get the Canvas display up and running

### Monday
* Write logic for user interaction: rotating fuse elements, getting directions, etc.
* Write logic for scoring, game timer, and level completion 

### Tuesday
* Complete any remaining logic in run.js file; by the end of the day the game should (hopefully) be fully functional, just lacking styling

### Wednesday
* Focus on styling and graphic touches, including but not limited to color-coding fuse pieces, animating popped popcorn pieces, using CSS to make nav and other HTML elements "pretty"

### Thursday Morning
* Complete any last-minute polishing and bug fixing
* Push to GitHub and Heroku!
