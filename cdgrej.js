    var width = window.innerWidth; //window width
    var height = window.innerHeight; //window height
        
    var difficultyLevel = 6; //difficulty default to 6 (normal)
    
    var balls = []; //array of balls
    var id_count = 0; //counter to keep track of what the next element should have as id
    var balls_clicked = 0; //counter of how many balls you've clicked  
        
    var seconds_left = 60000; //timer
    var timer = 0; //also timer
        
        //function to set the difficulty when you press the difficulty buttons
        function set_difficulty(d){
            difficultyLevel = d;
        }
        
        //add a ball to the balls array
        function add_ball() {
            //ball object with id, coordinates, and velocity
            var new_ball = {
                id: "cd" + id_count.toString(),
                x: 0,
                y: 0,
                xv: 1,
                yv: 1,
            };
            
            balls.push(new_ball);
            
            id_count++;
            //make new div with the id from it's corresponding object, and the class "id"
            var div = document.createElement('div');
            div.id = new_ball.id;
            div.className = 'cd';
			div.textContent = "Fish!";
            //EventListener to register clicks on the ball
            div.addEventListener("click", function(){
                var bg_color = div.style.backgroundColor;
                //Nothing should happen unless you haven't already clicked the element
                if (bg_color != "aqua") {
                    balls_clicked++;
                    div.style.backgroundColor = "aqua";
                    div.style.zIndex = -1; //Change zIndex so that clicked elements can't block unclicked ones
                }
                
            });
            //add the new div to the body
            document.body.appendChild(div);
            //give the element a position
            set_random_position(div, new_ball);
        }
        //give a random position and velocity to an object/element
        function set_random_position(cd, cd_obj) {
            //make random x and y coordinates
            var x_pos = Math.random() * (width - 100);
            var y_pos = Math.random() * (height - 100);
            //give a random velocity, depending on the difficulty
            var y_vel = Math.random() * (difficultyLevel/5 + 5) - difficultyLevel/10 - 2;
            var x_vel = Math.random() * (difficultyLevel/5 + 5) - difficultyLevel/10 - 2;
            //test for illlegal cases
            if (x_pos < 0) {
                x_pos = 0;
            }
            
            if (y_pos < 0) {
                y_pos = 0;
            }
            
            //apply new position and velocity to object
            cd_obj.x = x_pos;
            cd_obj.y = y_pos;
            cd_obj.xv = x_vel;
            cd_obj.yv = y_vel;
            //apply new position to the element
            cd.style.left = cd_obj.x + "px";
            cd.style.top = cd_obj.y + "px";
        }
        //initialize all the shit
        function init(){
            //make all the buttons disappear
			var buttons = document.getElementsByTagName("button")
            for(i = 0; i < buttons.length; i++){
                buttons[i].style.display = "none"
            }
            //add a few balls depending on the difficulty
            for(i = 0; i < difficultyLevel; i++){
                add_ball();
            }
			//if difficulty is EXTREME add eventlistener on div in the background
			if(difficultyLevel >= 12){
				var extreme = document.getElementById("extremedif");
				extreme.style.height = height + "px";
				extreme.addEventListener("click", function(){
					add_ball();
				});
			}

             
            var spawn_interval = 2000; //how often to spawn new balls
            var timer_div = document.getElementById("time_left"); //the actual timer html element
            var outcome = document.getElementById("outcome"); //Outcome element (to say you've won or lost)
            var interval = setInterval( function() {
                timer += 5;
                seconds_left -= 5;
                
                timer_div.textContent = parseInt(seconds_left/1000) + " seconds left...";
                
                //test if you've won or lost, if you have, end the game and show score
                if (balls_clicked == balls.length) {
                    clearInterval(interval);
                    outcome.textContent = "You win!";
                    outcome.style.display = 'block';
                }else if (seconds_left <= 0) {
                    clearInterval(interval);
                    var resultPercentage = Math.round(((balls_clicked / balls.length) * 100) * 100) / 100;
                    outcome.textContent = "You got " + balls_clicked.toString() + " points, That is " + resultPercentage.toString() + "%";
                    outcome.style.display = 'block';
                }
                
                // If getting closer to win, make it more difficult
                if(balls_clicked > balls.length * 0.9 && difficultyLevel >= 8){
                    spawn_interval = 100;
                }else if(balls_clicked > balls.length * 0.75 && difficultyLevel >= 5) {
                    spawn_interval = 1000;
                }
                //every x seconds spawn a new ball
                if (timer % spawn_interval == 0) {
                    add_ball();
                }
                
                //for each ball move it
                balls.forEach(function (ball) {
                    ball_dom = document.getElementById(ball.id);
                    move_ball(ball_dom, ball);
                });
                
                
            }, 5 );
        }
        function move_ball(cd, cd_obj){
            //test if ball hits any of the walls
            if(cd_obj.x < 0 || cd_obj.x >= (width - 100)){
                cd_obj.xv = 0 - cd_obj.xv; //invert velocity
            }
            if(cd_obj.y < 0 || cd_obj.y >= (height - 100)){
                cd_obj.yv = 0 - cd_obj.yv; //invert velocity 
            }
            //add velocity to position of the object
            cd_obj.x += cd_obj.xv;
            cd_obj.y += cd_obj.yv;
            //apply new coordinates to element
            cd.style.left = cd_obj.x + "px";
            cd.style.top = cd_obj.y + "px";
        }