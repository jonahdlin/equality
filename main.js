//----------------------------
// JQuery
//----------------------------

$(document).ready(function()
{
	$(".bubble").css("border-radius", "50%");
});

$(".navicon").click(function(){
	$(".options").animate({width: 'toggle'}, 400, "swing");
});

//----------------------------
// Auxiliary
//----------------------------


// Fisher-Yates shuffle. Shuffles array randomly.
// source: https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

// checks if arg is in array
function inside(arg,array) {
	for (var i = array.length - 1; i >= 0; i--) {
		if (arg===array[i]) {
			return true;
		}
	}
	return false;
}

//----------------------------
// Initialization
//----------------------------

document.getElementsByTagName('body')[0].addEventListener("load", init());

function init() {
	numBubbles = 9;
	maxSum = 100;
	minSum = 50;
	blueSum = 0;
	yellowSum = 0;
	arrayNumsState=[];
	for (var i = 9; i > 0; i--) {
		arrayNumsState.push(0);
	}
	arrayNums = findNums();
	populateDivs(arrayNums);
};

// returns an array of numbers that can be split into to two groups that add to the same thing
function findNums() {
	var sum = Math.floor(Math.random()*(maxSum-minSum)) + minSum + 1;
	var firstAmount = Math.floor(Math.random()*(numBubbles-1)) + 1;
	var secondAmount = numBubbles - firstAmount;
	var firstAddends = sumTo(firstAmount, sum);
	var secondAddends = sumTo(secondAmount, sum);

	return shuffle(firstAddends.concat(secondAddends));
};

// returns an array of numofnums numbers that add to sum
function sumTo(numofnums, sum) {
	var curr_sum = sum;
	var arrayAddends = [];

	for (var i = numofnums-1; i > 0; i--) {
		var new_addend = Math.floor(Math.random()*(curr_sum-i)) + 1;
		arrayAddends.push(new_addend);
		curr_sum -= new_addend;
	};

	arrayAddends.push(curr_sum);

	return arrayAddends;
};

//populates the html bubbles with the inputted array
function populateDivs(numArray) {
	for (var i = numArray.length - 1; i >= 0; i--) {
		document.getElementsByClassName("number")[i].innerHTML = numArray[i].toString();
	};
};

//----------------------------
// Gameplay
//----------------------------

var numClears = 0;

// updates the sums and checks if they are equal
function updateSum(n) {
	var currState = arrayNumsState[n]%3;
	var currNum = arrayNums[n];
	var innerInfoBox = document.getElementsByClassName("innerInfoBox")[0];

	innerInfoBox.style.opacity = "0";

	if (!currState) {
		document.getElementsByClassName("bubble")[n].style.backgroundColor = "#53B3D4";
		arrayNumsState[n] = currState + 1;

		blueSum += currNum;

	} else if (currState===1) {
		document.getElementsByClassName("bubble")[n].style.backgroundColor = "#DADE64";
		arrayNumsState[n] = currState + 1;

		blueSum -= currNum;
		yellowSum += currNum;

	} else {
		document.getElementsByClassName("bubble")[n].style.backgroundColor = "#D1D1D1";
		arrayNumsState[n] = currState + 1;

		yellowSum -= currNum
	}

	var curr_blue_sum = document.getElementsByClassName("innerTotal")[0];
	var curr_yellow_sum = document.getElementsByClassName("innerTotal")[1];

	curr_blue_sum.innerHTML = blueSum.toString();
	curr_yellow_sum.innerHTML = yellowSum.toString();

	var notAllFilled = inside(0,arrayNumsState);

	if (blueSum && blueSum===yellowSum && !notAllFilled) {
		nextLevelTransition();
	} else if (blueSum && blueSum===yellowSum) {
		innerInfoBox.innerHTML = "Make sure you've used all the bubbles.";
		innerInfoBox.style.color = "#BA3838";
		innerInfoBox.style.opacity = "1";
	}
}

function nextLevelTransition() {
	$(".nonTitle").slideToggle("slow","swing");
	setTimeout(function () {
		// get new array and sums
		init();

		// reset totals
		var curr_blue_sum = document.getElementsByClassName("innerTotal")[0];
		var curr_yellow_sum = document.getElementsByClassName("innerTotal")[1];
	
		curr_blue_sum.innerHTML = blueSum.toString();
		curr_yellow_sum.innerHTML = yellowSum.toString();
	
		// reset bubble colour
		var bubbles = document.getElementsByClassName("bubble");
		for (var i = bubbles.length - 1; i >= 0; i--) {
			bubbles[i].style.backgroundColor = "#D1D1D1";
		}
		
		// update the record of wins
		numClears += 1;
		document.getElementsByClassName("innerLevelBox")[0].innerHTML = "Levels Cleared: ".concat(numClears.toString());

		//slide it back up
		$(".nonTitle").slideToggle("slow","swing");
	}, 2000);
}