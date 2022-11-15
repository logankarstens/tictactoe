/*
 * A complete tic-tac-toe widget, using JQuery.  Just include this 
 * script in a browser page and play.  A tic-tac-toe game will be 
 * included as a child element of the element with id "tictactoe".  
 * If the page has no such element, it will just be added at the end 
 * of the body.
 */

$(function () {
    let $tictactoe = $("#tictactoe");
    let $message = $("#message");
    let $reset = $("#reset");

    var squares = [], 
        SIZE = 3,
        EMPTY = "&nbsp;",
        score,
        moves,
        turn = "X",

    /*
     * To determine a win condition, each square is "tagged" from left
     * to right, top to bottom, with successive powers of 2.  Each cell
     * thus represents an individual bit in a 9-bit string, and a
     * player's squares at any given time can be represented as a
     * unique 9-bit value. A winner can thus be easily determined by
     * checking whether the player's current 9 bits have covered any
     * of the eight "three-in-a-row" combinations.
     *
     *     273                 84
     *        \               /
     *          1 |   2 |   4  = 7
     *       -----+-----+-----
     *          8 |  16 |  32  = 56
     *       -----+-----+-----
     *         64 | 128 | 256  = 448
     *       =================
     *         73   146   292
     *
     */

    wins = [7, 56, 448, 73, 146, 292, 273, 84],

    /*
     * Clears the score/move count, erases the board, resets all background colors, and makes it X's turn.
     */
    startNewGame = function () {
        turn = "X";
        score = {"X": 0, "O": 0};
        moves = 0;
        squares.forEach(function (square) {square.html("<img src=empty.svg width=80%></img>");});
        $message.text("Player 1's turn");
        $reset.empty();
        $("tr").css({
            transition : 'background-color 0s',
            "background-color": ""
        });
        $("td").css({
            transition : 'background-color 0s',
            "background-color": ""
        });
    },

    /*
     * Adds fade to black on tiles that result in game win.
     */

    addTransition = function(row, col) {
        var str = "tr:eq(" + row + ") td:eq(" + col + ")";
        $(str).css({
            transition : 'background-color 1s ease-out',
            "background-color": "rgb(86, 86, 86)"
        });
    },

    changeBackgrounds = function(win) {

        switch (win) {
            case 0 : case 1 : case 2 :
                addTransition(win, 0); addTransition(win, 1); addTransition(win, 2); 
                break;
            case 3 : case 4 : case 5 :
                addTransition(0, win%3); addTransition(1, win%3); addTransition(2, win%3);
                break;
            case 6 : 
                addTransition(0, 0); addTransition(1, 1); addTransition(2, 2); 
                break;
            case 7 : 
                addTransition(0, 2); addTransition(1, 1); addTransition(2, 0); 
                break;
        }
    },

    /*
     * Returns whether the given score is a winning score.
     */

    win = function (score) {
        for (var i = 0; i < wins.length; i += 1) {
            if ((wins[i] & score) === wins[i]) {
                changeBackgrounds(i);
                return true;
                
            }
        }
        return false;
    },

    /*
     * Adds reset button upon game victory that restarts the game when clicked.
     */
    addResetButton = function() {
        var button= $('<br><br><div text-align="center" width="100%" id=><input type="button" value="Reset"/></div>');
        button.click(startNewGame);
        $reset.append(button);
        button.fadeOut(0)
        .fadeIn("slow");
    }

    /*
     * Sets the clicked-on square to the current player's mark,
     * then checks for a win or cats game.  Also changes the
     * current player.
     */

    

    

    set = function () {
        if (win(score["X"]) || win(score["O"]) || $(this).find("img").attr("src") != "empty.svg") {
            return;
        }
        var source = turn + ".svg";
        $(this).html("<img src=" + source + " width=80% margin=-10 padding=-10 alt=" + turn + ">");
        if (turn == "O") {
            $message.text("Player 1's turn");
        } else {
            $message.text("Player 2's turn");
        }
        let $image = $(this).find("img");
        $image.fadeOut(0)
        .fadeIn("slow");
        moves += 1;
        score[turn] += $(this)[0].indicator;
        console.log(score[turn]);
        if (win(score[turn])) {
            $message.text(turn + " wins!");
            setTimeout(function(){ addResetButton(); }, 1000)
        } else if (moves === SIZE * SIZE) {
            $message.text("Cat\u2019s game!");
            addResetButton();
        } else {
            turn = turn === "X" ? "O" : "X";
        }
    },

    /*
     * Creates and attaches the DOM elements for the board as an
     * HTML table, assigns the indicators for each cell, and starts
     * a new game.
     */
    play = function () {

        var board = $("<table border=1 cellspacing=0>"), indicator = 1;
        for (var i = 0; i < SIZE; i += 1) {
            var row = $("<tr>");
            board.append(row);
            for (var j = 0; j < SIZE; j += 1) {
                var cell = $("<td height=50 width=50 align=center valign=center></td>");
                cell[0].indicator = indicator;
                cell.click(set);
                row.append(cell);
                squares.push(cell);
                indicator += indicator;
            }
        }

        // Attach under tictactoe if present, otherwise to body.
        $(document.getElementById("tictactoe") || document.body).append(board);
        $message.fadeOut(0)
        .delay(500)
        .fadeIn("slow");
        $tictactoe.fadeOut(0)
        .delay(500)
        .fadeIn("slow");
        startNewGame();
    };

    play();
});

