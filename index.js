const fs = require('fs');
const checkers = require('./scripts/main');
const conf = require('./utils/conf');

async function main(){

    let results = {
        numLoaded: 0,
        numTests: 0,
        numErrors: 0,
        numDies: 0,
        numLives: 0,
        lives: [],
        erros: []
    }


    const checkerApi = checkers.auxilio
    var combos = conf.loader();
    const outputFile = conf.output();


    try {
        var checkerNum = parseInt(fs.readFileSync(`./control/testcontrol/auxilio.txt`));
        combos = combos.slice(checkerNum)
    } catch {
        var checkerNum = 0;
    }
    
    results.numLoaded = combos.length

    console.log('\n\n')

    for (i = 0; i < combos.length; i ++) {

        _results = '       RESULTADOS >> '
        _results += 'carregados: ' + results.numLoaded +  ' | testados: ' + results.numTests
        _results += ' | erros: ' + results.numErrors + ' | dies: ' + results.numDies
        _results += ' | lives: ' + results.numLives + ' | RubyCheckers - ' + 'AUX'

        console.log(_results)
        console.log('\n')
        var login = await checkerApi(combos[i]);

        if (login.status == 'live') {

            if (login.test.password) {
                if(login.info) {
                    const newLine = 'APROVADO >> ' + login.test.user + ' | ' + login.test.password + login.info + '\n'
                    fs.appendFileSync(outputFile, newLine);
                } else {
                    const newLine = 'APROVADO >> ' + login.test.user + ' | ' + login.test.password + '\n'
                    fs.appendFileSync(outputFile, newLine);
                }
            } else {
                if(login.info) {
                    const newLine = 'APROVADO >> ' + login.test.user + ' | ' + login.info + '\n'
                    fs.appendFileSync(outputFile, newLine);
                } else {
                    const newLine = 'APROVADO >> ' + login.test.user + '\n'
                    fs.appendFileSync(outputFile, newLine);
                }
            }
            
            results.numTests += 1
            results.numLives += 1
            checkerNum += 1
            results.lives.push(login);

            fs.writeFileSync(
                `./control/testcontrol/auxilio.txt`,
                `${results.numTests + checkerNum}`
            );

        } else if (login.status == 'die') {
            results.numTests += 1
            results.numDies += 1
            checkerNum += 1

            fs.writeFileSync(
                `./control/testcontrol/auxilio.txt`,
                `${checkerNum}`
            );
            
        } else {
            results.numTests += 1
            results.numErrors += 1
            checkerNum += 1
            results.erros.push(combos[i])

            fs.writeFileSync(
                `./control/testcontrol/auxilio.txt`,
                `${checkerNum}`
            );

            fs.appendFileSync(
                `./control/testcontrol/auxilioErrors.txt`,
                `${login.test.user}|${login.test.password}\n`
            );

        }
    }

    _results = '       RESULTADOS >> '
        _results += 'carregados: ' + results.numLoaded +  ' | testados: ' + results.numTests
        _results += ' | erros: ' + results.numErrors + ' | dies: ' + results.numDies
        _results += ' | lives: ' + results.numLives + ' | RubyCheckers - ' + 'AUX'

    console.log(_results)

    console.log('\n    >> LIVES: \n')

    if (results.lives.length > 0) {
        if (results.lives[0].info && results.lives[0].password) {
            results.lives.forEach(live => {
                console.log('    APROVADO >> ' + live.test.user + ' | ' + live.test.password + live.info)
            })
        } else if (results.lives[0].info && !results.lives[0].password) {
            results.lives.forEach(live => {
                console.log('    APROVADO >> ' + live.test.user + ' | ' + live.info)
            })
        } 
    } else {
        console.log('       Não há lives')
    }

    fs.writeFileSync(
        `./control/testcontrol/auxilio.txt`, '0');

    
}

main();