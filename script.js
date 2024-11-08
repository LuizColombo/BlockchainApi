const formulario = document.getElementById('form_wallet');
// 3BTbmmRubF8uwVb4UFuYcckX2soKDWjiyi

formulario.addEventListener('submit', function (event) {
    event.preventDefault();
    let input_wallet = document.getElementById('input_wallet_address').value.trim();
    let transaction_wallet = document.getElementById('input_transaction_address').value.trim();

    if (input_wallet !== "") {
        document.getElementById('input_transaction_address').value = "";
        walletSearch(input_wallet);
        document.getElementById('input_wallet_address').value = "";
    }

    if (transaction_wallet !== "") {
        document.getElementById('input_wallet_address').value = "";
        transactionSearch(transaction_wallet);
        document.getElementById('input_transaction_address').value = "";
    }
});

function walletSearch(input_wallet) {
    console.log("Entrou na função walletSearch");
    let url_api = `https://blockchain.info/rawaddr/${input_wallet}`;

    const ul = document.getElementById("wallet_transactions_list");
    ul.innerHTML = "";

    fetch(url_api)
        .then((response) => response.json())
        .then((data) => {
            document.getElementById('container_results_transaction').style.display = "none";
            console.log(data);

            if (data.error) {
                document.getElementById('error_search').style.display = "block";
                document.getElementById('error_search').innerHTML = "Error: " + data.message;
            }
            else {
                document.getElementById('error_search').style.display = "none";
                document.getElementById('container_results').style.display = "block";
                document.getElementById('wallet_address').innerHTML = "<strong>Wallet Address:</strong> " + data.address;
                document.getElementById('wallet_nr_transactions').innerHTML = "<strong>Nº of Transactions:</strong> " + data.n_tx;
                document.getElementById('wallet_total_received').innerHTML = "<strong>Total Received:</strong> " + data.total_received / 100000000;
                document.getElementById('wallet_total_sent').innerHTML = "<strong>Total Sent:</strong> " + data.total_sent / 100000000;
                document.getElementById('final_balance').innerHTML = "<strong>Final Balance:</strong> " + data.final_balance / 100000000;

                data.txs.forEach((transaction) => {
                    const li = document.createElement("li");
                    
                    li.innerHTML = `
                        Hash da Transação: ${transaction.hash} <br>
                        Data: ${new Date(transaction.time * 1000).toLocaleString()}
                    `;
                    
                    // Adiciona o item de lista à lista
                    ul.appendChild(li);
                });
            }
        })
        .catch((error) => {
            console.error("Erro:", error);
        });
}

function transactionSearch(input_transaction){
    console.log("Entrou na função transactionSearch");
    let url_transaction = `https://blockchain.info/rawtx/${input_transaction}`

    fetch(url_transaction)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        document.getElementById('container_results').style.display = "none";

        if (data.error) {
            document.getElementById('error_search').style.display = "block";
            document.getElementById('error_search').innerHTML = "Error: " + data.message;
        }
        else {
             document.getElementById('error_search').style.display = "none";
             document.getElementById('container_results_transaction').style.display = "block";

             document.getElementById('transaction_id').innerHTML = "<strong>Hash:</strong> " + data.hash;

            data.out.forEach(output => {
                let pAddress = document.createElement('p');
                pAddress.innerHTML = `<strong>Wallet Address:</strong> ${output.addr}`;
                document.getElementById('container_results_transaction').appendChild(pAddress);

                let pValue = document.createElement('p');
                pValue.innerHTML = `<strong>Value:</strong> ${(output.value / 100000000).toFixed(8)} `;
                document.getElementById('container_results_transaction').appendChild(pValue);
            });
             
             document.getElementById('transaction_date').innerHTML = `<strong>Date:</strong> ${new Date(data.time * 1000).toLocaleString()}`;
             document.getElementById('transaction_block_id').innerHTML = "<strong>Block ID:</strong> " + data.block_index;
             document.getElementById('transaction_fee').innerHTML = "<strong>Fee:</strong> " + (data.fee / 100000000).toFixed(8);
             
        }
    })
    .catch((error) => {
        console.error("Erro:", error);
    });
}