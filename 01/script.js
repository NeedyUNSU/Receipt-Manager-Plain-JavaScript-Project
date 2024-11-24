
class Product {
    constructor(name, amount, price) {
        this.name = name;
        this.amount = parseFloat(amount);
        this.price = parseFloat(price);
    }

    createRow(index) {
        const total = (this.amount * this.price).toFixed(2) + " zł";
        return `
            <tr>
                <td class="td-slim">
                    <div class="button-container-flex">
                        <div class="button-container">
                            <div class="hidden-button btn-red">
                                <button onclick="receipt.removeProduct(${index})">Usuń</button>
                            </div>
                        </div>
                        <div class="button-container">
                            <div class="hidden-button btn-green">
                                <button onclick="receipt.editProduct(${index})">Edytuj</button>
                            </div>
                        </div>
                    </div>
                </td>
                <td>${index + 1}</td>
                <td>${this.name}</td>
                <td>${this.amount}</td>
                <td>${this.price.toFixed(2)} zł</td>
                <td>${total}</td>
            </tr>`;
    }
}

class Receipt {
    constructor() {
        this.products = [];
        this.load();
    }

    load() {
        const storedProducts = JSON.parse(localStorage.getItem("products"));
        this.products = storedProducts ? storedProducts.map(p => new Product(p.name, p.amount, p.price)) : [];
        document.addEventListener("DOMContentLoaded", function () {
            this.render();
        }.bind(this));
    }

    save() {
        localStorage.setItem("products", JSON.stringify(this.products));
    }

    render() {
        const tbody = document.getElementById("productsTableBody");
        tbody.innerHTML = this.products.map((p, i) => p.createRow(i)).join("");
        this.updateTotal();
    }

    addProduct() {
        const name = document.getElementById("nameTx").value.trim();
        const amount = parseFloat(document.getElementById("amountNb").value);
        const price = parseFloat(document.getElementById("priceNb").value);

        if (!name) {
            alert("Nazwa produktu nie może być pusta.");
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            alert("Ilość musi być liczbą większą od 0.");
            return;
        }
        if (isNaN(price) || price <= 0) {
            alert("Cena musi być liczbą większą od 0.");
            return;
        }

        const product = new Product(name, amount, price);
        this.products.push(product);
        this.save();
        this.render();
    }

    addProductDialog()
    {
        const dialog = document.getElementById("addDialog");
        dialog.showModal();

        document.getElementById("addSaveBtn").onclick = () => {
            const name = document.getElementById("addNameTx").value.trim();
            const amount = parseFloat(document.getElementById("addAmountNb").value);
            const price = parseFloat(document.getElementById("addPriceNb").value);

            if (!name) {
                alert("Nazwa produktu nie może być pusta.");
                return;
            }
            if (isNaN(amount) || amount <= 0) {
                alert("Ilość musi być liczbą większą od 0.");
                return;
            }
            if (isNaN(price) || price <= 0) {
                alert("Cena musi być liczbą większą od 0.");
                return;
            }
            
            document.getElementById("addNameTx").value = "";
            document.getElementById("addAmountNb").value = "";
            document.getElementById("addPriceNb").value = "";

            const product = new Product(name, amount, price);
            this.products.push(product);
            this.save();
            this.render();
            dialog.close();
        };

        document.getElementById("addCancelBtn").onclick = () => dialog.close();
    }

    removeProduct(index) {
        if (window.confirm("Czy na pewno chcesz usunąć ten produkt?")) {
            this.products.splice(index, 1);
            this.save();
            this.render();
        }
    }

    editProduct(index) {
        const product = this.products[index];
        document.getElementById("editNameTx").value = product.name;
        document.getElementById("editAmountNb").value = product.amount;
        document.getElementById("editPriceNb").value = product.price;

        const dialog = document.getElementById("editDialog");
        dialog.showModal();

        document.getElementById("editSaveBtn").onclick = () => {
            const name = document.getElementById("editNameTx").value.trim();
            const amount = parseFloat(document.getElementById("editAmountNb").value);
            const price = parseFloat(document.getElementById("editPriceNb").value);

            if (!name) {
                alert("Nazwa produktu nie może być pusta.");
                return;
            }
            if (isNaN(amount) || amount <= 0) {
                alert("Ilość musi być liczbą większą od 0.");
                return;
            }
            if (isNaN(price) || price <= 0) {
                alert("Cena musi być liczbą większą od 0.");
                return;
            }

            product.name = name;
            product.amount = amount;
            product.price = price;
            this.save();
            this.render();
            dialog.close();
        };

        document.getElementById("editCancelBtn").onclick = () => dialog.close();
    }


    updateTotal() {
        const total = this.products.reduce((sum, p) => sum + p.amount * p.price, 0);
        document.getElementById("totalPrice").textContent = total.toFixed(2) + " zł";
    }
}

const receipt = new Receipt();

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("addBttn").onclick = () => {
        const name = document.getElementById("nameTx").value;
        const amount = parseFloat(document.getElementById("amountNb").value);
        const price = parseFloat(document.getElementById("priceNb").value);

        if (!name || amount <= 0 || price <= 0) {
            alert("Proszę wypełnić wszystkie pola poprawnymi wartościami!");
            return;
        }

        receipt.addProduct(new Product(name, amount, price));
    };
});