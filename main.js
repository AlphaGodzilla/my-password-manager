const crypto = require('crypto');

function sha256(value_str) {
    const hash = crypto.createHash('sha256');
    hash.update(value_str);
    return hash.digest('hex');
}

function numbers(domain, simplePassword, salt) {
    const hash = sha256(domain + simplePassword + salt);
    // console.log(hash);
    const step = 2;
    let start = 0;
    let end = start + step;
    const steps = Math.ceil(hash.length/step);
    const numbers = [];
    for(let i = 0; i < steps; i++) {
        const seq = hash.slice(start, end);
        // numbers.push(seq);
        numbers.push(parseInt('0x' + seq) % 10)
        start += step;
        end = start + step;
    }
    // console.log(numbers);
    return {
        hash,
        value: numbers, 
    };
}


function letters(numbersHash) {
    const hash = sha256(sha256(numbersHash));
    // console.log(hash);
    const letters = 'abcdefghijklnmopqrstuvwxyz' + 'ABCDEFGHIJKLNMOPQRSTUVWXYZ';
    const step = 2;
    let start = 0;
    let end = start + step;
    const steps = Math.ceil(hash.length/step);
    const letters_seq = [];
    for(let i = 0; i < steps; i++) {
        const seq = hash.slice(start, end);
        const letters_index = parseInt('0x' + seq) % letters.length;
        letters_seq.push(letters[letters_index])
        start += step;
        end = start + step;
    }
    return {
        hash,
        value: letters_seq,
    }
}

function symbols(lettersHash) {
    const hash = sha256(sha256(sha256(lettersHash)))
    // console.log(hash)
    const symbols = '~!@#$%^&*()-_=+[{]}|;:,<.>/?'
    const step = 2;
    let start = 0;
    let end = start + step;
    const steps = Math.ceil(hash.length/step);
    const symbols_seq = [];
    for(let i = 0; i < steps; i++) {
        const seq = hash.slice(start, end);
        const symbol_index = parseInt('0x' + seq) % symbols.length;
        symbols_seq.push(symbols[symbol_index])
        start += step;
        end = start + step;
    }
    return {
        hash,
        value: symbols_seq,
    }
}

function printMatrix(row, colum, seq, fill) {
    let r = ''
    let index = 0
    for(i=0; i<row; i++) {
        for(j=0; j<colum; j++) {
            let e = seq[index];
            e = !e ? fill : e;
            r += e
            if (j < colum - 1) {
                r += ', '
            }
            index++;
        }
        if (i < row - 1) {
            r += '\n'
        }
    }
    return r;
}




// test
const doamin = "https://local"
const simple_password = "123456"
const salt = "I'a Salt"
const numbers_result = numbers(doamin, simple_password, salt);
console.log(numbers_result)
// console.log(printMatrix(4, 8, numbers_result.value, 0))
const letters_result = letters(numbers_result.hash)
console.log(letters_result)
const symbols_result = symbols(letters_result.hash)
console.log(symbols_result)
