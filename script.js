const placeholderImage = "https://via.placeholder.com/150"; // Default placeholder image

const inventory = [
    { name: "Item A", current: 10, min: 5, image: "" },
    { name: "Item B", current: 3, min: 5, image: "" },
    { name: "Item C", current: 8, min: 7, image: "" },
    { name: "Item D", current: 2, min: 4, image: "" }
];

function renderInventory() {
    const tbody = document.getElementById("inventory-body");
    tbody.innerHTML = "";
    inventory.forEach((item, index) => {
        const canOrder = item.current < item.min ? item.min - item.current : 0;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>
                <img src="${item.image || placeholderImage}" alt="Item Image">
                ${item.image ? `<button onclick="removeImage(${index})">Remove</button>` : ""}
            </td>
            <td>
                <button onclick="adjustInventory(${index}, -1)">-</button>
                <input type="number" value="${item.current}" class="${item.current < item.min ? 'low-inventory' : ''}" onchange="updateInventory(${index}, 'current', this.value)">
                <button onclick="adjustInventory(${index}, 1)">+</button>
            </td>
            <td><input type="number" value="${item.min}" onchange="updateInventory(${index}, 'min', this.value)"></td>
            <td class="${canOrder > 0 ? 'order-needed' : ''}">${canOrder}</td>
            <td><input type="file" accept="image/*" onchange="uploadImage(event, ${index})"></td>
        `;
        tbody.appendChild(row);
    });
}

function updateInventory(index, key, value) {
    inventory[index][key] = parseInt(value, 10) || 0;
    renderInventory();
}

function adjustInventory(index, amount) {
    inventory[index].current = Math.max(0, inventory[index].current + amount);
    renderInventory();
}

function uploadImage(event, index) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            inventory[index].image = e.target.result;
            renderInventory();
        };
        reader.readAsDataURL(file);
    }
}

function removeImage(index) {
    inventory[index].image = "";
    renderInventory();
}

renderInventory();
