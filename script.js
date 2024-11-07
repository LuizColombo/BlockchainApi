const formulario = document.getElementById('form_wallet');
// 3BTbmmRubF8uwVb4UFuYcckX2soKDWjiyi

formulario.addEventListener('submit', function (event) {
    event.preventDefault();
    let input_wallet = document.getElementById('input_wallet_address').value.trim();

    if (input_wallet !== "") {
        walletSearch(input_wallet);
        document.getElementById('input_wallet_address').value = "";
    }
});

function walletSearch(input_wallet) {
    console.log("Entrou na função");
    let url_api = `https://blockchain.info/rawaddr/${input_wallet}`;
    console.log(url_api);

    const ul = document.getElementById("wallet_transactions_list");
    ul.innerHTML = "";

    fetch(url_api)
        .then((response) => response.json())
        .then((data) => {

            if (data.error) {
                console.log(data);
                document.getElementById('error_search').style.display = "block";
                document.getElementById('error_search').innerHTML = "Error: " + data.message;
            }
            else {
                document.getElementById('error_search').style.display = "none";
                document.getElementById('container_results').style.display = "block";
                console.log(data);
                document.getElementById('wallet_address').innerHTML = "<strong>Wallet Address:</strong> " + data.address;
                document.getElementById('wallet_nr_transactions').innerHTML = "<strong>Nº of Transactions:</strong> " + data.n_tx;
                document.getElementById('wallet_total_received').innerHTML = "<strong>Total Received:</strong> " + data.total_received + " BTC";
                document.getElementById('wallet_total_sent').innerHTML = "<strong>Total Sent:</strong> " + data.total_sent + " BTC";
                document.getElementById('final_balance').innerHTML = "<strong>Final Balance:</strong> " + data.final_balance + " BTC";

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