const fs = require('fs')
const checkers = require('./scripts/main');
const conf = require('./utils/conf');
const checkerConf = require('./utils/checkers');
const signale = require('signale');
const prompt = require('prompt-sync')();
const figlet = require('figlet')
const chalk = require('chalk');

async function main(){
    
    console.log('\n     Checker Auxílio - by: Abel Junior\n')
    console.log('\n    >> Escolha o modo de teste:\n')

    while (true) {
        var type = prompt("       Digite '1' para carregar uma lista, '2' para usar gerador de CPF ou 'q!' para sair: ");
        if (type == 'q!'){
            process.exit()
        }
        if (type == 1 || type == 2) {
            break
        } else {
            console.log('\n       Entrada inválida!\n')
        }
        break
    }

    
    const checkerApi = checkers.auxilio

    let results = {
        numLoaded: 0,
        numTests: 0,
        numErrors: 0,
        numDies: 0,
        numLives: 0,
        lives: [],
        erros: []
    }

    if (type == 1){
        var cpfs = conf.loader()
        results.numLoaded = cpfs.length
    }

    const outputFile = conf.output();

    while (true){

        if (type == 2) {
            while (true) {
                try {
        
                    var cpfs = await checkerConf.cpfGen()
                    break
    
                } catch {
                    continue
                }
            }
        }

        console.log('\n\n')
    
        for (i = 0; i < cpfs.length; i ++) {

            _results = '       RESULTADOS >> '
            _results += ' | testados: ' + results.numTests
            _results += ' | erros: ' + results.numErrors + ' | dies: ' + results.numDies
            _results += ' | lives: ' + results.numLives + ' | RubyCheckers - ' + 'AUX'

            try {
                var login = await checkerApi(cpfs[i]);

            } catch(err) {
                console.log(err)
            }

            if (login.status == 'live') {

                const newLine = 'APROVADO >> ' + login.test.user + ' | ' + login.info + '\n'
                fs.appendFileSync(outputFile, newLine);

                signale.success('APROVADO >> ' + login.test.user + ' | ' + login.info + '\n')
                
                
                results.numTests += 1
                results.numLives += 1
                results.lives.push(login);
                
            } else if (login.status == 'die') {

                signale.error('REPROVADO >> ' + login.test.user + ' | ' + login.info + '\n')
                
                results.numTests += 1
                results.numDies += 1
                              
            } else {

                signale.warning('ERRO >> ' + login.test.user)
              
                results.numTests += 1
                results.numErrors += 1
                results.erros.push(combos[i])
                  
                fs.appendFileSync(
                    `./control/testcontrol/auxilioErrors.txt`,
                    `${login.test.user}\n`
                );
    
            }
        }

        if (type == 1){
            break
        }
    }

    _results = '       RESULTADOS >> '
        _results += 'carregados: ' + results.numLoaded +  ' | testados: ' + results.numTests
        _results += ' | erros: ' + results.numErrors + ' | com cadastro: ' + results.numDies
        _results += ' | sem cadastro: ' + results.numLives

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