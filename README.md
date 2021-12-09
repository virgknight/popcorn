# Popcorn Popper
Popcorn Popper is a movie-theater themed, single-player game in which a player earns points and ascends levels by popping popcorn for a hungry kitty. It is inspired by a favorite childhood flash game of mine, Popcap Games' Rocket Mania. 
<img src="/images/kittens/intro.png" alt = "i can has popcorn?" width="280" height="210">

## Description
The game plays out on a rectangular grid which is bordered by flames on the right-hand side and popcorn kernels on the left-hand side. Each cell of the grid contains a section of rope fuse which can be rotated on a click. In order to pop a kernel, the player must rotate fuse segments to form a continuous path from the fire to the kernel, allowing a flame to travel along the fuse. Once the kernel pops, all fuse pieces along the path burn up and disappear; these pieces will be replaced by randomly generated new fuse pieces. Some fuse pieces point in 3 or 4 directions at once, effectively splitting the flame and allowing the player to pop multiple kernels at once!

Check out the live demo [here](https://virgknight.github.io/popcorn/)!

## Functionality & MVPs
In Popcorn Popper, a player can:
* Start and stop a new game
* Rotate fuse pieces on a click
* Easily distinguish which fuses are already connected to a flame or a kernel with color-coding
* Construct fuse paths that ignite one or more popcorn kernels
* If a continuous fuse path is accidentally created, click out of it within a second-long grace period
* Earn extra points by popping multiple kernels concurrently
* Play through different levels of increasing difficulty

In addition, this project will include:
* A production README
* An introductory modal with how-to-play instructions

## Features
#### Landing screen with introductory modal
![introductory modal](/images/readme/intro-modal.png)

#### Demo gameplay
![](images/readme/gameplay.gif)

#### Fuse connection logic
Popcorn Popper uses a queue data structure to perform breadth-first node traversal when determining whether a piece is connected to a flame or kernel at any distance. A fuse at a given index may be checked up to four times to account for the fact that there are four directions (up, down, left, and right) from which the fuse may connect with its neighboring fuses.
```
        // To begin, populate queue with the pieces that immediately border the flames/kernels
        let queue = [];
        for (let i=0; i<9; i++) {
            queue.push([startIdx, i]);
        }
        // checked will be populated with key: indices checked, value: number of times they've been checked
        let checked = {};

        while (queue.length > 0) {
            let idx = queue.shift();
            // add to checked object if not already there
            if (!([JSON.stringify(idx)] in checked)) checked[JSON.stringify(idx)] = 0;
            checked[JSON.stringify(idx)] ++;

            let fuse = this.grid[idx[0]][idx[1]];
            let neighbors = fuse.getConnectedNeighbors();

            callback.call(fuse);
            let condition = (subject === "flame") ? fuse.connectF : fuse.connectK;

            if (condition && neighbors.length > 0) {
                neighbors.forEach((neighbor) => {
                    // must convert to string to allow JS to check for equality
                    let neighborStr = JSON.stringify(neighbor);
                    // if that neighbor hasn't been checked yet...
                    if (!(neighborStr in checked) || 
                        // or if they are an edge piece but have not been checked from all three sides...
                        (checked[neighborStr] < 3) ||
                        // or if they are not an edge piece but have not been checked from all four sides...
                        (checked[neighborStr] < 4 && ![0, 5].includes(neighbor[0]))
                    ) {
                        // then add to queue to be checked (or checked again)
                        queue.push(neighbor);
                    }
                });
            }
        }
```

## Technologies
This project was implemented with the following technologies:
* JavaScript to handle game logic
* HTML5/CSS3 to render the game grid, sidebar, and modals
* Canvas to render a fun popcorn-popping graphic
* Webpack to bundle and transpile the source JavaScript code
* npm to handle project dependencies

## Future Considerations
* Global leaderboard for high scores
* Scoring multipliers after a score threshhold has been reached- eg. after the player earns X points, a single kernel pile will generate two pieces of popcorn when ignited rather than one
* Improved celebrating cat graphics
* Scalability for different browser dimensions
* Unidirectional "dead-end" fuse pieces
