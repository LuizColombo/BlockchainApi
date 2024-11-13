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

// function walletSearch(input_wallet) {
//     console.log("Entrou na função walletSearch");
//     console.log("Addr: " + input_wallet);
//     let url_api = `https://blockchain.info/rawaddr/${input_wallet}`;

//     const ul = document.getElementById("wallet_transactions_list");
//     ul.innerHTML = "";

//     fetch(url_api)
//         .then((response) => response.json())
//         .then((data) => {
//             document.getElementById('container_results_transaction').style.display = "none";
//             console.log(data);

//             if (data.error) {
//                 document.getElementById('error_search').style.display = "block";
//                 document.getElementById('error_search').innerHTML = "Error: " + data.message;
//             }
//             else {
//                 document.getElementById('error_search').style.display = "none";
//                 document.getElementById('container_results').style.display = "block";
//                 document.getElementById('wallet_address').innerHTML = "<strong>Wallet Address:</strong> " + data.address;
//                 document.getElementById('wallet_nr_transactions').innerHTML = "<strong>Nº of Transactions:</strong> " + data.n_tx;
//                 document.getElementById('wallet_total_received').innerHTML = "<strong>Total Received:</strong> " + data.total_received / 100000000;
//                 document.getElementById('wallet_total_sent').innerHTML = "<strong>Total Sent:</strong> " + data.total_sent / 100000000;
//                 document.getElementById('final_balance').innerHTML = "<strong>Final Balance:</strong> " + data.final_balance / 100000000;

//                 data.txs.forEach((transaction) => {
//                     const li = document.createElement("li");

//                     li.innerHTML = `
//                         Hash da Transação: ${transaction.hash} <br>
//                         Data: ${new Date(transaction.time * 1000).toLocaleString()}
//                     `;

//                     li.onclick = function () {
//                         transactionSearch(transaction.hash);
//                     };

//                     ul.appendChild(li);
//                 });
//             }
//         })
//         .catch((error) => {
//             console.error("Erro:", error);
//         });
// }

// function transactionSearch(input_transaction) {
//     let url_transaction = `https://blockchain.info/rawtx/${input_transaction}`

//     fetch(url_transaction)
//         .then((response) => response.json())
//         .then((data) => {
//             console.log(data);
//             document.getElementById('container_results').style.display = "none";

//             if (data.error) {
//                 document.getElementById('error_search').style.display = "block";
//                 document.getElementById('error_search').innerHTML = "Error: " + data.message;
//             }
//             else {
//                 document.getElementById('error_search').style.display = "none";
//                 document.getElementById('container_results_transaction').style.display = "block";

//                 document.getElementById('transaction_id').innerHTML = "<strong>Hash:</strong> " + data.hash;

//                 data.out.forEach(output => {
//                     let pAddress = document.createElement('p');
//                     pAddress.innerHTML = `<strong>Wallet Address:</strong> ${output.addr}`;
//                     document.getElementById('container_results_transaction').appendChild(pAddress);

//                     let pValue = document.createElement('p');
//                     pValue.innerHTML = `<strong>Value:</strong> ${(output.value / 100000000).toFixed(8)} `;
//                     document.getElementById('container_results_transaction').appendChild(pValue);

//                     pAddress.onclick = function () {
//                         walletSearch(output.addr);
//                     };
//                 });

//                 document.getElementById('transaction_date').innerHTML = `<strong>Date:</strong> ${new Date(data.time * 1000).toLocaleString()}`;
//                 document.getElementById('transaction_block_id').innerHTML = "<strong>Block ID:</strong> " + data.block_index;
//                 document.getElementById('transaction_fee').innerHTML = "<strong>Fee:</strong> " + (data.fee / 100000000).toFixed(8);

//             }
//         })
//         .catch((error) => {
//             console.error("Erro:", error);
//         });
// }

// async function walletSearch(input_wallet) {
//     console.log("Entrou na função walletSearch");
//     console.log("Addr: " + input_wallet);
//     let url_api = `https://blockchain.info/rawaddr/${input_wallet}`;

//     const ul = document.getElementById("wallet_transactions_list");
//     ul.innerHTML = "";

//     // Se já existe uma requisição anterior, cancela antes de iniciar uma nova
//     if (controller) controller.abort();
//     controller = new AbortController();
//     const { signal } = controller;

//     // Verifica cache
//     const cachedData = sessionStorage.getItem(input_wallet);

//     document.getElementById("convert_button").addEventListener("click", () => {
//         const cachedData = sessionStorage.getItem(input_wallet);
//         if (cachedData) {
//             exportToXLSX(JSON.parse(cachedData));
//         } else {
//             alert("Por favor, faça uma busca antes de exportar.");
//         }
//     });

//     if (cachedData) {
//         return renderWalletData(JSON.parse(cachedData));
//     }

//     try {
//         const response = await fetch(url_api, { signal });
//         if (!response.ok) throw new Error("Falha ao buscar dados da API");

//         const data = await response.json();

//         // Armazena no cache da sessão
//         sessionStorage.setItem(input_wallet, JSON.stringify(data));

//         renderWalletData(data);
//     } catch (error) {
//         console.error("Erro:", error);
//         document.getElementById('error_search').style.display = "block";
//         document.getElementById('error_search').innerHTML = "Erro ao buscar informações da carteira.";
//     }
// }

async function walletSearch(input_wallet) {

    const limit = 50;
    let offset = 0;
    let allTransactions = [];
    let hasMoreTransactions = true;
    let data = null; // Armazenará a resposta inicial da API

    const ul = document.getElementById("wallet_transactions_list");
    ul.innerHTML = "";

    // Se já existe uma requisição anterior, cancela antes de iniciar uma nova
    if (controller) controller.abort();
    controller = new AbortController();
    const { signal } = controller;

    // Verifica cache
    const cachedData = sessionStorage.getItem(input_wallet);

    document.getElementById("convert_button").addEventListener("click", () => {
        const cachedData = sessionStorage.getItem(input_wallet);
        if (cachedData) {
            exportToXLSX(JSON.parse(cachedData));
        } else {
            alert("Por favor, faça uma busca antes de exportar.");
        }
    });

    if (cachedData) {
        return renderWalletData(JSON.parse(cachedData));
    }

    try {
        while (hasMoreTransactions) {
            let url_api = `https://blockchain.info/rawaddr/${input_wallet}?limit=${limit}&offset=${offset}`;
            const response = await fetch(url_api, { signal });

            if (!response.ok) throw new Error("Falha ao buscar dados da API");

            const newData = await response.json();

            // Armazena os dados gerais da resposta inicial
            if (!data) data = newData;

            // Adiciona as transações obtidas ao array allTransactions
            allTransactions = allTransactions.concat(newData.txs);

            // Verifica se há mais transações para buscar
            hasMoreTransactions = newData.txs.length === limit;
            offset += limit; // Incrementa o offset para a próxima "página"
        }

        // Armazena no cache da sessão
        sessionStorage.setItem(input_wallet, JSON.stringify({ ...data, txs: allTransactions }));

        // Renderiza os dados com todas as transações
        renderWalletData({ ...data, txs: allTransactions });

    } catch (error) {
        console.error("Erro:", error);
        document.getElementById('error_search').style.display = "block";
        document.getElementById('error_search').innerHTML = "Erro ao buscar informações da carteira.";
    }
}

function renderWalletData(data) {
    document.getElementById('container_results_transaction').style.display = "none";
    document.getElementById('convert_button').style.display = "block";

    if (data.error) {
        document.getElementById('error_search').style.display = "block";
        document.getElementById('error_search').innerHTML = "Error: " + data.message;
    } else {
        document.getElementById('error_search').style.display = "none";
        document.getElementById('container_results').style.display = "block";
        document.getElementById('wallet_address').innerHTML = `<strong>Wallet Address:</strong> ${data.address}`;
        document.getElementById('wallet_nr_transactions').innerHTML = `<strong>Nº of Transactions:</strong> ${data.n_tx}`;
        document.getElementById('wallet_total_received').innerHTML = `<strong>Total Received:</strong> ${(data.total_received / 100000000).toFixed(8)}`;
        document.getElementById('wallet_total_sent').innerHTML = `<strong>Total Sent:</strong> ${(data.total_sent / 100000000).toFixed(8)}`;
        document.getElementById('final_balance').innerHTML = `<strong>Final Balance:</strong> ${(data.final_balance / 100000000).toFixed(8)}`;

        const ul = document.getElementById("wallet_transactions_list");
        data.txs.forEach((transaction) => {
            const li = document.createElement("li");

            li.innerHTML = `
                Hash da Transação: ${transaction.hash} <br>
                Data: ${new Date(transaction.time * 1000).toLocaleString()}
            `;

            li.onclick = () => transactionSearch(transaction.hash);

            ul.appendChild(li);
        });
    }
}

async function transactionSearch(input_transaction) {
    console.log("Iniciando busca de transação:", input_transaction);
    let url_transaction = `https://blockchain.info/rawtx/${input_transaction}`;

    // Se já existe uma requisição anterior, cancela antes de iniciar uma nova
    if (transactionController) transactionController.abort();
    transactionController = new AbortController();
    const { signal } = transactionController;

    // Verifica se já existe cache
    const cachedData = sessionStorage.getItem(input_transaction);
    if (cachedData) {
        return renderTransactionData(JSON.parse(cachedData));
    }

    try {
        const response = await fetch(url_transaction, { signal });
        if (!response.ok) throw new Error("Erro ao buscar dados da transação");

        const data = await response.json();

        // Armazena no cache
        sessionStorage.setItem(input_transaction, JSON.stringify(data));

        renderTransactionData(data);
    } catch (error) {
        console.error("Erro:", error);
        document.getElementById('error_search').style.display = "block";
        document.getElementById('error_search').innerHTML = "Erro ao buscar informações da transação.";
    }
}

function renderTransactionData(data) {
    document.getElementById('container_results').style.display = "none";
    document.getElementById('convert_button').style.display = "none";

    if (data.error) {
        document.getElementById('error_search').style.display = "block";
        document.getElementById('error_search').innerHTML = "Error: " + data.message;
    } else {
        document.getElementById('error_search').style.display = "none";
        document.getElementById('container_results_transaction').style.display = "block";
        document.getElementById('transaction_id').innerHTML = `<strong>Hash:</strong> ${data.hash}`;
        document.getElementById('transaction_date').innerHTML = `<strong>Date:</strong> ${new Date(data.time * 1000).toLocaleString()}`;
        document.getElementById('transaction_block_id').innerHTML = `<strong>Block ID:</strong> ${data.block_index}`;
        document.getElementById('transaction_fee').innerHTML = `<strong>Fee:</strong> ${(data.fee / 100000000).toFixed(8)}`;

        const container = document.getElementById('container_results_transaction');
        container.innerHTML = ""; // Limpa conteúdo antigo

        data.out.forEach(output => {
            const pAddress = document.createElement('p');
            pAddress.innerHTML = `<strong>Wallet Address:</strong> ${output.addr}`;
            pAddress.onclick = () => walletSearch(output.addr);

            const pValue = document.createElement('p');
            pValue.innerHTML = `<strong>Value:</strong> ${(output.value / 100000000).toFixed(8)}`;

            container.appendChild(pAddress);
            container.appendChild(pValue);
        });
    }
}

function exportToXLSX(data) {
    // Define os dados para o arquivo Excel
    const workbook = XLSX.utils.book_new();

    // Dados principais da carteira
    const walletData = [
        ["Wallet Address", data.address],
        ["Nº of Transactions", data.n_tx],
        ["Total Received", (data.total_received / 100000000).toFixed(8)],
        ["Total Sent", (data.total_sent / 100000000).toFixed(8)],
        ["Final Balance", (data.final_balance / 100000000).toFixed(8)],
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