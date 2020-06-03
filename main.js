// --- Typing animation ---

var timer = 0, currAnim = 0, waiting = true;
var animStates;

// Fetch JSON file with details on each animation state
fetch("animStates.json")
  .then(response => response.json())
  .then(json => animStates = json.animStates);

function typeAnimation() {
  var output = document.getElementById("typing-header");
  if (waiting && timer == animStates[currAnim].delay) {
    // Start new animation
    waiting = false;
    timer = 0;
  }
  if (!waiting) {
    if (output.innerText.length < animStates[currAnim].text.length) {
      // Add characters
      if (animStates[currAnim].text[output.innerText.length] == ' ') {
        output.innerHTML += "&nbsp;";
      } else {
        output.innerText += animStates[currAnim].text[output.innerText.length];
      }
    } else if (output.innerText.length > animStates[currAnim].text.length) {
      // Remove characters
      output.innerText = output.innerText.substr(0, output.innerText.length - 1);
    } else {
      // Done with this step of the animation (make sure last char is correct)
      output.innerText = output.innerText.substr(0, output.innerText.length - 1);
      if (animStates[currAnim].text[output.innerText.length] == ' ') {
        output.innerHTML += "&nbsp;";
      } else {
        output.innerText += animStates[currAnim].text[output.innerText.length];
      }
      currAnim++;
      waiting = true;
      // If on last animation, loop
      if (animStates[currAnim].text == "LOOP") currAnim = 0;
    }
    // Resize text box
    output.style.width = output.innerText.length + "ch";
  } else {
    timer++;
  }
  setTimeout(typeAnimation, animStates[currAnim].speed);
}
setTimeout(typeAnimation, 100);

// ---Bad link glitch effect---

var glitchChance = 0.93;
function update() {
  // Create glitchy effect
  var badLinks = document.getElementsByClassName("bad-link");
  for (var i = 0; i < badLinks.length; i++) {
    var element = badLinks[i];
    var newText = "";
    var oldChars = element.innerText.split("");
    for (var j = 0; j < element.innerText.length; j++) {
      var c = oldChars[j];
      if (c == '!' || c == '1') {
        // Glitch from ! to 1
        if (Math.random() > glitchChance) {
          c = '1';
        } else {
          c = '!';
        }
      } else {
        // Glitch from uppercase to lowercase
        if (Math.random() > glitchChance) {
          c = c.toLowerCase();
        } else {
          c = c.toUpperCase();
        }
      }
      newText += c;
    }
    element.innerText = newText;
  }
  setTimeout(update, 100);
}
setTimeout(update, 100);