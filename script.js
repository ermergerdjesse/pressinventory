const inventory = JSON.parse(localStorage.getItem('inventory')) || [
    { name: "Item A", current: 10, min: 5, image: "" },
    { name: "Item B", current: 3, min: 5, image: "" },
    { name: "Item C", current: 8, min: 7, image: "" },
    { name: "Item D", current: 2, min: 4, image: "" }
];

function saveInventory() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function renderInventory() {
    const tbody = document.getElementById("inventory-body");
    tbody.innerHTML = "";
    inventory.forEach((item, index) => {
        const canOrder = item.current < item.min ? item.min - item.current : 0;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td><img src="${item.image || 'placeholder.jpg'}" alt="Item Image"></td>
            <td><input type="number" value="${item.current}" class="${item.current < item.min ? 'low-inventory' : ''}" onchange="updateInventory(${index}, 'current', this.value)"></td>
            <td><input type="number" value="${item.min}" onchange="updateInventory(${index}, 'min', this.value)"></td>
            <td>${canOrder}</td>
            <td><input type="file" accept="image/*" onchange="uploadImage(event, ${index})"></td>
        `;
        tbody.appendChild(row);
    });
}

function updateInventory(index, key, value) {
    inventory[index][key] = parseInt(value, 10) || 0;
    saveInventory();
    renderInventory();
}

function uploadImage(event, index) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            inventory[index].image = e.target.result;
            saveInventory();
            renderInventory();
        };
        reader.readAsDataURL(file);
    }
}

renderInventory();
