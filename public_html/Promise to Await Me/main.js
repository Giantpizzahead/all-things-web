// setInterval()

function flashText() {
  const list = document.querySelectorAll('.flashing-text');
  for (e of list) {
    if (e.style.color === 'red') e.style.color = 'blue';
    else e.style.color = 'red';
  }
}
setInterval(flashText, 1000);

// setTimeout()

const countText = document.querySelector('#count-display');
let count = 0;
function counter() {
  count++;
  countText.textContent = `Count: ${count}`;
}
setTimeout(function() {
  setInterval(counter, 100);
}, 3000);

// Promises

const promiseTracker = document.querySelector('#promise-tracker');
function wait(resolve, reject) {
  // Assume program is doing some important query here
  setTimeout(function() {
    resolve("wait done!");
  }, 3000);
}

function waitError(resolve, reject) {
  // Program does something important... uh-oh! It's an error!
  setTimeout(() => reject(new Error("oh no!")), 1500);
}

const promise = new Promise(wait);
// Handle promise once it finishes
promise.then((success) => {
  promiseTracker.textContent = "Promise 1 success";
  console.log(success);
}).catch((error) => {
  promiseTracker.textContent = "Promise 1 error";
  console.log(`ERROR: ${error.message}`);
})

const promise2 = new Promise(waitError);
// Handle promise2 once it finishes
promise2.then(function(success) {
  promiseTracker.textContent = "Promise 2 success";
  console.log(success);
}).catch((error) => {
  promiseTracker.textContent = "Promise 2 error";
  console.log(`ERROR: ${error.message}`);
})

// async await

const asyncTracker = document.querySelector('#async-tracker');
async function coolThing() {
  p = new Promise((res, rej) => {
    setTimeout(function() { res('yay!') }, 3000);
  });

  asyncTracker.textContent = "Async before await";
  let result = await p;
  asyncTracker.textContent = "Async after await (" + result + ')';
  return "done!";
}
setTimeout(coolThing, 1000);

// Promise.race()

const promise3 = new Promise((res, rej) => {
  setTimeout(() => res("promise3 finished!"), 5055);
});

const promise4 = new Promise((res, rej) => {
  setTimeout(() => res("promise4 finished!"), 5000);
});

const result = Promise.race([promise3, promise4]);
result.then((text) => document.querySelector('#race-tracker').textContent = text);

// Promise.all()

Promise.all([promise3, promise4])
.then(() => document.querySelector('#all-tracker').textContent = 'All done!');

// This code runs first, since the promise handling is asynchronous
console.log("i run first!");