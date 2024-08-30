let updateindex = 0;
function saveOrUpdate() {
    if (document.getElementById('myBtn').innerHTML === 'Save') {
        additem();
    } else {
        update();
    }
}
async function edit(id) {
    const response = await fetch(`http://localhost:8080/person/getone/${id}`);
    document.getElementById('myBtn').innerHTML = 'update';
    const stock = await response.json();
    document.getElementById('companyName').value = stock.uname;
    document.getElementById('currentPrice').value = stock.email;
    updateindex = id;
}
async function update() {
    console.log("update called");
    await fetch(`http://localhost:8080/person/edit/${updateindex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id:updateindex,
            uname: document.getElementById('companyName').value,
            email: document.getElementById('currentPrice').value,
        })
    });
    document.getElementById('myBtn').innerHTML = 'Save';
    document.getElementById('stockForm').reset();
    updateindex=0;
};
//  }
async function deleteE(id) {
    // const confirmed = confirm("Are you sure you want to delete?");
    // if (confirmed) {
        fetch(`http://localhost:8080/person/delete/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    alert('deleted')
                } else {
                    alert("Failed to delete entity. Please try again.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
               // alert("An error occurred while trying to delete the entity.");
            });
            location.reload(); 
    }
// }

function additem() {
 
    document.getElementById('stockForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        const stockData = {
            uname: document.getElementById('companyName').value,
            email: document.getElementById('currentPrice').value,
        };

        try {
            const response = await fetch('http://localhost:8080/person/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(stockData)
            });
            if (response.ok) {
                alert('Stock added successfully!');
                document.getElementById('stockForm').reset(); 
                location.reload(); 
            } else {
                alert('Error: Unable to add stock.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error adding the stock.');
        }
    });

}


async function fetchStockData() {
    try {
        const response = await fetch('http://localhost:8080/person/details');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const stocks = await response.json();

        const tableBody = document.querySelector('#stockTable tbody');

        stocks.forEach(stock => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${stock.id}</td>
                <td>${stock.uname}</td>
                <td>${stock.email}</td>
                <td><button onclick="deleteE(${stock.id})">Delete</button></td>
                <td><button onclick="edit(${stock.id})">Edit</button></td>`
            tableBody.appendChild(row);

        });
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

window.onload = fetchStockData;