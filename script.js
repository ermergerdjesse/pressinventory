const inventory = [
    { name: "Item A", current: 10, min: 5 },
    { name: "Item B", current: 3, min: 5 },
    { name: "Item C", current: 8, min: 7 },
    { name: "Item D", current: 2, min: 4 }
];

function renderInventory() {
    const tbody = document.getElementById("inventory-body");
    tbody.innerHTML = "";
    inventory.forEach(item => {
        const canOrder = item.current < item.min ? item.min - item.current : 0;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td class="${item.current < item.min ? 'low-inventory' : ''}">${item.current}</td>
            <td>${item.min}</td>
            <td>${canOrder}</td>
        `;
        tbody.appendChild(row);
    });
}

renderInventory();
