const storageKey = "inventoryData";

// Ensure at least 16 items exist, but allow adding more
let inventory = JSON.parse(localStorage.getItem(storageKey)) || Array.from({ length: 16 }, (_, i) => ({
    name: `Item ${String.fromCharCode(65 + i)}`, // Generates "Item A" to "Item Q"
    image: "",
    current: Math.floor(Math.random() * 10) + 1,
    min: 5
}));

// Save inventory to Local Storage
function saveInventory() {
    localStorage.setItem(storageKey, JSON.stringify(inventory));
}

// Render inventory table correctly
function renderInventory() {
    const tbody = document.getElementById("inventory-body");
    tbody.innerHTML = "";
    let itemsToOrder = [];

    inventory.forEach((item, index) => {
        const canOrder = item.current < item.min ? item.min - item.current : 0;
        if (canOrder > 0) {
            itemsToOrder.push(`${item.name} (Order ${canOrder})`);
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <input type="text" value="${item.name}" onchange="updateInventory(${index}, 'name', this.value)">
            </td> <!-- Editable Item Name -->
            <td>
                <img src="${item.image || 'placeholder.jpg'}" alt="Item Image">
                ${item.image ? `<button onclick="removeImage(${index})">Remove</button>` : ""}
            </td> <!-- Correct Image Placement -->
            <td>
                <button onclick="adjustInventory(${index}, -1)">-</button>
                <input type="number" value="${item.current}" class="${item.current < item.min ? 'low-inventory' : ''}" onchange="updateInventory(${index}, 'current', this.value)">
                <button onclick="adjustInventory(${index}, 1)">+</button>
            </td> <!-- Correct Current Inventory -->
            <td>
                <input type="number" value="${item.min}" onchange="updateInventory(${index}, 'min', this.value)">
            </td> <!-- Correct Minimum Inventory -->
            <td class="${canOrder > 0 ? 'order-needed' : ''}">${canOrder}</td> <!-- Correct Can Order -->
            <td>
                <input type="file" accept="image/*" onchange="uploadImage(event, ${index})">
            </td> <!-- Correct Upload Image -->
        `;
        tbody.appendChild(row);
    });

    // Show popup if items need to be ordered
    if (itemsToOrder.length > 0) {
        alert(`Items that need to be ordered:\n${itemsToOrder.join("\n")}`);
    }
}

// Update inventory and save to Local Storage
function updateInventory(index, key, value) {
    inventory[index][key] = key === "name" ? value : parseInt(value, 10) || 0;
    saveInventory();
    renderInventory();
}

// Adjust inventory and save to Local Storage
function adjustInventory(index, amount) {
    inventory[index].current = Math.max(0, inventory[index].current + amount);
    saveInventory();
    renderInventory();
}

// Upload image and save to Local Storage
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

// Remove image and save to Local Storage
function removeImage(index) {
    inventory[index].image = "";
    saveInventory();
    renderInventory();
}

// Add a new item row
function addNewItem() {
    const newItem = {
        name: `Item ${String.fromCharCode(65 + inventory.length)}`,
        image: "",
        current: 0,
        min: 5
    };
    inventory.push(newItem);
    saveInventory();
    renderInventory();
}

// Load the inventory when the page loads
renderInventory();
