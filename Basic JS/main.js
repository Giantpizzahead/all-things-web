/**
 * Cookie Clicker!
 */
function cookieClicked() {
    var cookieCounter = document.getElementById("cookie-counter");
    var numCookies = parseInt(cookieCounter.innerText);
    numCookies++;
    numCookies *= Math.random() * 0.1 + 1;
    if (numCookies > 50) {
        document.getElementById("cookie-counter").style.color = Math.random() < 0.5 ? "red" : "blue";
    }
    if (numCookies > 300) {
        document.getElementById("cookie-title").style.color = Math.random() < 0.5 ? "red" : "blue";
    }
    if (numCookies > 5000) {
        document.getElementById("cookie-button").style.backgroundColor = Math.random() < 0.5 ? "red" : "blue";
    }
    if (numCookies > 50000) {
        document.getElementsByTagName("h1")[0].style.color = Math.random() < 0.5 ? "red" : "blue";
    }
    if (numCookies > 1000000) {
        document.getElementsByTagName("body")[0].style.color = Math.random() < 0.5 ? "red" : "blue";
    }
    if (numCookies > 50000000) {
        document.getElementsByTagName("body")[0].style.backgroundColor = Math.random() < 0.5 ? "pink" : "cyan";
    }
    if (numCookies > 1000000000) {
        document.title = Math.random() < 0.5 ? "RED" : "BLUE";
        document.getElementsByTagName("h1")[0].innerText = Math.random() < 0.5 ? "RED" : "BLUE";
    }
    if (numCookies > 50000000000) {
        var elements = document.getElementsByTagName("h2");
        for (var i = 0; i < elements.length; i++) {
            if (Math.random() < 0.5) {
                elements[i].style.visibility = "visible";
                elements[i].innerText = "AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH";
            } else {
                elements[i].style.visibility = "hidden";
            }
        }
        numCookies *= Math.random() * 0.2 + 1.1;
    }
    if (numCookies > 500000000000000) {
        var elements = document.getElementsByTagName("h2");
        for (var i = 0; i < elements.length; i++) {
            if (Math.random() < 0.5) {
                elements[i].style.visibility = "visible";
                elements[i].innerText = "WARNING: STOP OR YOU WILL BE RESET";
            } else {
                elements[i].style.visibility = "hidden";
            }
        }
    }
    if (numCookies > 5000000000000000000) {
        open(location, '_self').close();
    }
    cookieCounter.innerText = Math.round(numCookies);
}

/**
 * Maze solver
 * Complexity: O(N^2) in theory, but there might be some memory leak somewhere that I don't know how to fix
 */
function solveMaze() {
    // Reset maze output
    var output = document.getElementById("maze-output");
    output.innerText = "Working...";
    var mazeOutput = document.getElementById("maze-solution");
    mazeOutput.innerText = "";

    // Parse maze input
    var grid = document.getElementById("maze-input").value.split("\n");
    var R = grid.length, C = grid[0].length;
    if (R == 0 || C == 0) {
        output.innerText = "Maze cannot be empty!";
        return;
    }

    // Validate maze input
    for (var i = 0; i < R; i++) {
        if (grid[i].length != C) {
            if (i == R-1 && grid[i].length == 0) {
                // Trailing newline (ignore)
                R--;
                break;
            }
            output.innerText = "Maze must be rectangular!";
            return;
        }
    }

    function printGrid(g) {
        for (var i = 0; i < R; i++) console.log(g[i]);
    }
    console.log("Input grid (R = %d, C = %d):", R, C);
    printGrid(grid);

    class Point {
        constructor(i, j) {
            this.i = i;
            this.j = j;
        }
    }

    function validCell(i, j) {
        return i >= 0 && i < R && j >= 0 && j < C && grid[i][j] != '#';
    }

    // Parse the grid / find starting and ending locations
    var sp, ep;
    for (var i = 0; i < R; i++) {
        for (var j = 0; j < C; j++) {
            if (grid[i][j] == 'A') {
                if (sp) {
                    output.innerText = "There should only be one 'A'!";
                    return;
                }
                sp = new Point(i, j);
            } else if (grid[i][j] == 'B') {
                if (ep) {
                    output.innerText = "There should only be one 'B'!";
                    return;
                }
                ep = new Point(i, j);
            } else if (grid[i][j] != ' ' && grid[i][j] != '#') {
                output.innerText = "Unexpected character detected (" + grid[i][j] + ")!"
                return;
            }
        }
    }

    // Make sure there is actually a start and end point
    if (!sp || !ep) {
        output.innerText = "There should be exactly one 'A' and one 'B' in the maze.";
        return;
    }
    console.log("\nGoing from (%d, %d) to (%d, %d)...", sp.i, sp.j, ep.i, ep.j);

    // Setup visited array
    var visited = [], from = [];
    for (var i = 0; i < R; i++) {
        visited.push([]);
        from.push([]);
        for (var j = 0; j < C; j++) {
            visited[i].push(-1);
            from[i].push(null);
        }
    }
    visited[sp.i][sp.j] = 0;

    // Setup BFS
    var queue = [sp];
    var ci = [1, 0, -1, 0], cj = [0, -1, 0, 1];
    var p;
    while (queue.length != 0) {
        p = queue.pop();
        // Check adjacent cells
        var ni, nj;
        for (var d = 0; d < 4; d++) {
            ni = p.i + ci[d];
            nj = p.j + cj[d];
            if (validCell(ni, nj) && visited[ni][nj] == -1) {
                // Not yet visited; visit this cell
                visited[ni][nj] = visited[p.i][p.j] + 1;
                from[ni][nj] = p;
                queue.unshift(new Point(ni, nj));
            }
        }
    }

    if (visited[ep.i][ep.j] == -1) {
        // No path from A to B
        console.log("(%d, %d) is not reachable!\n", ep.i, ep.j);
        output.innerText = "There is no valid path from A to B.";
    } else {
        console.log("(%d, %d) can be reached in %d steps.\n", ep.i, ep.j, visited[ep.i][ep.j]);
        output.innerText = "The minimum distance from A to B is " + visited[ep.i][ep.j] + " steps.\nOne possible path is pictured below:";

        // Mark the shortest path from A to B
        var solution = [];
        for (var i = 0; i < R; i++) {
            solution.push([]);
            for (var j = 0; j < C; j++) {
                solution[i].push(grid[i][j]);
            }
        }
        p = ep;
        while (from[p.i][p.j]) {
            p = from[p.i][p.j];
            if (p.i == sp.i && p.j == sp.j) break;  // Reached start location
            solution[p.i][p.j] = '.';
        }
        for (var i = 0; i < R; i++) {
            for (var j = 0; j < C; j++) {
                if (solution[i][j] == ' ') mazeOutput.innerHTML += "&nbsp;";
                else mazeOutput.innerText += solution[i][j];
            }
            mazeOutput.innerText += "\n";
        }
    }
}