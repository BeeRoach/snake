$(document).ready(function(){

		//Prepare the 2D canvas
		var canvas = $("#canvas")[0];
		var ctx = canvas.getContext("2d");
		var w = $("#canvas").width();
		var h = $("#canvas").height();
		
		//Game variables
		var cw = 20; //20px is the width of the cell
		var d;
		var food;
		var score;
		
		//Make the snake!
		var snake_array; //The snake is made of an array of cells
		
		function init()
		{
			d = "right"; //The default direction of the snake
			create_snake();
			create_food(); //Creates the little food cell
			
			score = 0; //Displays the score
			
			//Moves the snake now using a timer which will trigger the paint function every 55ms

			if(typeof game_loop != "undefined") clearInterval(game_loop);
			game_loop = setInterval(paint, 55);
		}
		init();
		
		function create_snake()
		{
			var length = 8; //Length of the snake
			snake_array = []; //Empty array to start with
			for(var i = length-1; i>=0; i--)
			{
				//This will create a horizontal snake starting from the top left
				snake_array.push({x: i, y:0});
			}
		}
		
		//Nom nom, food
		function create_food()
		{
			food = {
				x: Math.round(Math.random()*(w-cw)/cw), 
				y: Math.round(Math.random()*(h-cw)/cw), 
			};
		}
		
		//Paint the snake
		function paint()
		{
			//To avoid snake trails, repaint the canvas every frame
			//Lets paint the canvas now
			ctx.fillStyle = "grey";
			ctx.fillRect(0, 0, w, h);
			ctx.strokeStyle = "black";
			ctx.strokeRect(0, 0, w, h);
			
			//Snake movement
			//The logic is popping off the tail array cell and putting in front of the head
			var nx = snake_array[0].x;
			var ny = snake_array[0].y;
			//These were the position of the head cell.
			//We will increment it to get the new head position
			//Lets add proper direction based movement now
			if(d == "right") nx++;
			else if(d == "left") nx--;
			else if(d == "up") ny--;
			else if(d == "down") ny++;
			
			//Game over conditionas
			//If the snake hits the wall, the game restarts
			//If the head hits the body, the game restarts
			if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
			{
				//Game restarts, initializes
				init();
				
				return;
			}
			
			//If snake eats food, create new head instead of tail
			if(nx == food.x && ny == food.y)
			{
				var tail = {x: nx, y: ny};
				score++;
				//Create new food
				create_food();
			}
			else
			{
				var tail = snake_array.pop(); //Pops out the last array cell
				tail.x = nx; tail.y = ny;
			}
			
			
			snake_array.unshift(tail); //Puts back the tail as the first cell
			
			for(var i = 0; i < snake_array.length; i++)
			{
				var c = snake_array[i];
				//Paints th cells
				paint_cell(c.x, c.y);
			}
			
			//Paint the food
			paint_cell(food.x, food.y);
			//Paint the score
			var score_text = "SCORE: " + score;
			ctx.fillText(score_text, 5, h-5);
			ctx.font = "20px Georgia";

			
		}
		
		//Paints the snake cell
		function paint_cell(x, y)
		{
			ctx.fillStyle = "#40E0D0"; //My teal snake
			ctx.fillRect(x*cw, y*cw, cw, cw);
			ctx.strokeStyle = "white";
			ctx.strokeRect(x*cw, y*cw, cw, cw);
		}
		
		function check_collision(x, y, array)
		{
			//This function will check if the provided x/y coordinates exist
		
			for(var i = 0; i < array.length; i++)
			{
				if(array[i].x == x && array[i].y == y)
				 return true;
			}
			return false;
		}
		
		//The keyboard controls
		$(document).keydown(function(e){
			var key = e.which;
			if(key == "37" && d != "right") d = "left";
			else if(key == "38" && d != "down") d = "up";
			else if(key == "39" && d != "left") d = "right";
			else if(key == "40" && d != "up") d = "down";

		})
	
	
	})
