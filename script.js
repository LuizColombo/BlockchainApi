let controller;
let transactionController;
const formulario = document.getElementById('form_wallet');

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
    document.getElementById('container_results_transaction').style.display = "none";
    document.getElementById('convert_button').style.display = "block";

    console.log("Entrou na função walletSearch");
    console.log("Addr: " + input_wallet);
    let url_api = `https://blockchain.info/multiaddr?active=${input_wallet}`;

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
                document.getElementById('wallet_address').innerHTML = "<strong>Wallet Address:</strong> " + data.addresses[0].address;
                document.getElementById('wallet_nr_transactions').innerHTML = "<strong>Nº of Transactions:</strong> " + data.addresses[0].n_tx;
                document.getElementById('wallet_total_received').innerHTML = `<strong>Total Received:</strong> ${(data.addresses[0].total_received / 100000000).toFixed(8)} BTC`;
                document.getElementById('wallet_total_sent').innerHTML = `<strong>Total Sent:</strong> ${(data.addresses[0].total_sent / 100000000).toFixed(8)} BTC`;
                document.getElementById('final_balance').innerHTML = `<strong>Final Balance:</strong> ${(data.addresses[0].final_balance / 100000000).toFixed(8)} BTC`;

                data.txs.forEach((transaction) => {
                    const li = document.createElement("li");

                    li.innerHTML = `
                        Hash da Transação: ${transaction.hash} <br>
                        Data: ${new Date(transaction.time * 1000).toLocaleString()}
                    `;

                    li.onclick = function () {
                        transactionSearch(transaction.hash);
                    };

                    ul.appendChild(li);
                });

                document.getElementById("convert_button").addEventListener("click", () => {
                    exportToXLSX(JSON.parse(data));
                });
            }
        })
        .catch((error) => {
            document.getElementById('error_search').style.display = "block";
            document.getElementById('error_search').innerHTML = "Error: Erro ao buscar informações da Carteira";
        });
}

function transactionSearch(input_transaction) {
    document.getElementById('container_results').style.display = "none";
    document.getElementById('convert_button').style.display = "none";

    let url_transaction = `https://blockchain.info/rawtx/${input_transaction}`

    fetch(url_transaction)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            document.getElementById('container_results').style.display = "none";

            if (data.error) {
                document.getElementById('error_search').style.display = "block";
                document.getElementById('error_search').innerHTML = "Erro ao buscar informações da transação.";
            }
            else {
                document.getElementById('error_search').style.display = "none";
                document.getElementById('container_results_transaction').style.display = "block";

                document.getElementById('transaction_id').innerHTML = "<strong>Hash:</strong> " + data.hash;
                document.getElementById('transaction_date').innerHTML = `<strong>Date:</strong> ${new Date(data.time * 1000).toLocaleString()}`;
                document.getElementById('transaction_block_id').innerHTML = "<strong>Block ID:</strong> " + data.block_index;
                document.getElementById('transaction_fee').innerHTML = "<strong>Fee:</strong> " + (data.fee / 100000000).toFixed(8);

                data.out.forEach(output => {
                    let pAddress = document.createElement('p');
                    pAddress.innerHTML = `<strong>Wallet Address:</strong> ${output.addr}`;
                    document.getElementById('container_results_transaction').appendChild(pAddress);

                    let pValue = document.createElement('p');
                    pValue.innerHTML = `<strong>Value:</strong> ${(output.value / 100000000).toFixed(8)} `;
                    document.getElementById('container_results_transaction').appendChild(pValue);

                    pAddress.onclick = function () {
                        walletSearch(output.addr);
                    };
                });
            }
        })
        .catch((error) => {
            document.getElementById('error_search').style.display = "block";
            document.getElementById('error_search').innerHTML = "Erro ao buscar informações da transação.";
        });
}

function exportToXLSX(data) {
    // Define os dados para o arquivo Excel
    const workbook = XLSX.utils.book_new();

    // Dados principais da carteira
    const walletData = [
        ["Wallet Address", data.addresses[0].address],
        ["Nº of Transactions", data.addresses[0].n_tx],
        ["Total Received", (data.addresses[0].total_received / 100000000).toFixed(8)],
        ["Total Sent", (data.addresses[0].total_sent / 100000000).toFixed(8)],
        ["Final Balance", (data.addresses[0].final_balance / 100000000).toFixed(8)],
    ];

    const walletSheet = XLSX.utils.aoa_to_sheet(walletData);
    XLSX.utils.book_append_sheet(workbook, walletSheet, "Wallet Info");

    // Dados das transações
    const transactionsData = data.txs.map(transaction => [
        transaction.hash,
        new Date(transaction.time * 1000).toLocaleString()
    ]);

    transactionsData.unshift(["Transaction Hash", "Date"]); // Cabeçalhos da tabela

    const transactionSheet = XLSX.utils.aoa_to_sheet(transactionsData);
    XLSX.utils.book_append_sheet(workbook, transactionSheet, "Transactions");

    // Cria e salva o arquivo
    XLSX.writeFile(workbook, `Wallet_${data.address}.xlsx`);
}