const axios = require('axios');
const fs = require('fs');
const prompt = require('prompt-sync')();

function loader() {

    console.log('\n\n    >> Defina o arquivo de entrada ou digite "q!" para sair\n');

    while (true) {
        try {

            let list_path = './dbs/'
            list_path += prompt('       Digite o nome do arquivo: ');
            
            if (list_path == './dbs/q!') {
                process.exit();
            }
            let combo_list = fs.readFileSync(`${list_path}.txt`, 'utf-8');
            combo_list = combo_list.split('\n');
            
            return combo_list;

        } catch(err){

            console.log('\n       Erro: este arquivo não existe\n');
            
            continue;
        }
    }
}

function output() {

    console.log('\n\n    >> Defina o arquivo de saída ou digite "q!" para sair\n');

    while (true) {
        try {

            let outputFile = './aprovadas/'
            outputFile += prompt('       Digite o nome do arquivo: ');
            
            if (outputFile == 'q!') {
                process.exit();
            }
            
            return outputFile + '.txt';

        } catch(err){

            console.log('\n       Nome inválido!\n');
            
            continue;
        }
    }
}

async function get_proxy() {

    return await axios({
        method: 'get',
        url: 'https://proxy.webshare.io/api/proxy/list/',
        headers: {
            Authorization: 'Token 54c038119775e1807741c18d61182e9d29b0ea8c	'
        }
    }).then(res => {
        return res.data.results
    }).catch(error => {
        console.log(error)
    }) 

}

function msleep(n) {
	Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function sleep(n) {
	msleep(n*1000);
}

module.exports = {
    loader: loader,
    get_proxy: get_proxy,
    sleep: sleep,
    output: output,
}