
//Declare a generator function with function* ..... 
//so the star at the end of function means it's a generator function

//they are good for asynchronous requests

function* myGenerator() {
    // yield will pause and exit the function
    yield true;
    // we could put logic here if we wanted, like let a = 5 + 7 , and then we yield a
    yield 100;
    yield 'Hello!';
}

//Generator functions are stored in a variable as an instance
// of the function. 

const goDogGo = myGenerator();
// .next() is how you CALL a generator function!!
console.log(goDogGo.next());
console.log(goDogGo.next());
console.log(goDogGo.next());
console.log(goDogGo.next());





function* getSwitch() {
    while(true) {
        yield 'on';
        yield 'off';
    }
}

const toggle = getSwitch();
console.log(toggle.next().value); // 'on'
console.log(toggle.next().value); // 'off'
console.log(toggle.next().value); // 'on'