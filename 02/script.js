class Product {
    constructor(id, name, amount, price) {
        this.id = id;
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

    convertToProducts(productsData) {
        let products = [];
        if (productsData != null) {
            productsData.forEach(item =>
                products.push(new Product(item.id, item.name, item.amount, item.price))
            );
        } else {
            console.error("Dane są niepoprawne lub brak danych 'products'");
        }

        return products;
    }

    async load() {
        try {
            const response = await fetch("http://localhost:3000/products");
            const products = await response.json();
            this.products = this.convertToProducts(products);
            this.render();
        } catch (error) {
            console.error("Błąd podczas ładowania danych", error);
        }
    }
    async save() {
        try {

            const response = await fetch('http://localhost:3000/products');
            const products = await response.json();

            for (let product of products) {
                await fetch(`http://localhost:3000/products/${product.id}`, {
                    method: 'DELETE'
                });
            }

            await this.products.forEach(item => fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            })
                .then(response => response.json())
                .then(data => console.log('Nowy produkt dodany:', data))
                .catch(error => console.error('Błąd:', error)));

        } catch (error) {
            console.error("Błąd podczas zapisywania danych", error);
        }
    }

    render() {
        const tbody = document.getElementById("productsTableBody");
        tbody.innerHTML = this.products.map((p, i) => p.createRow(i)).join("");
        this.updateTotal();
    }

    async addProduct() {
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



        const product = new Product(this.guidNew(), name, amount, price);
        this.products.push(product);

        await this.addServer(product.id, name, amount, price);
        this.render();
    }

    async removeProduct(index) {
        if (window.confirm("Czy na pewno chcesz usunąć ten produkt?")) {
            var productId = this.products[index].id;
            this.products.splice(index, 1);
            await this.removeServer(productId);
            this.render();
        }
    }

    async editProduct(index) {
        const product = this.products[index];
        document.getElementById("editNameTx").value = product.name;
        document.getElementById("editAmountNb").value = product.amount;
        document.getElementById("editPriceNb").value = product.price;

        const dialog = document.getElementById("editDialog");
        dialog.showModal();

        document.getElementById("editSaveBtn").onclick = async () => {
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

            if (product.name === name && product.amount === amount && product.price === price)
            {
                dialog.close();
                return;
            }

            product.name = name;
            product.amount = amount;
            product.price = price;

            this.editServer(product.id, name, amount, price);
            dialog.close();
            this.render();
        };

        document.getElementById("editCancelBtn").onclick = () => {
            dialog.close();
        };
    }

    async addProductDialog()
    {
        const dialog = document.getElementById("addDialog");
        dialog.showModal();

        document.getElementById("addSaveBtn").onclick = async () => {
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


            const product = new Product(this.guidNew(), name, amount, price);
            this.products.push(product);
            await this.addServer(product.id, name, amount, price);
            this.render();
            dialog.close();
        };

        document.getElementById("addCancelBtn").onclick = () => dialog.close();
    }

    updateTotal() {
        const total = this.products.reduce((sum, product) => sum + product.amount * product.price, 0).toFixed(2);
        document.getElementById("totalPrice").textContent = `${total} zł`;
    }

    async editServer(id, name, amount, price) {
        fetch(`http://localhost:3000/products/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                amount: amount,
                price: price,
            })
        })
            .then(response => response.json())
            .then(data => console.log('Zaktualizowano produkt:', data))
            .catch(error => console.error('Błąd:', error));
    }

    async addServer(id, name, amount, price) {
        try {

            fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(new Product(id, name, amount, price))
            })
                .then(response => response.json())
                .then(data => console.log('Nowy produkt dodany:', data))
                .catch(error => console.error('Błąd:', error));

        } catch (error) {
            console.error("Błąd podczas zapisywania danych", error);
        }
    }

    async removeServer(id)
    {
        await fetch(`http://localhost:3000/products/${id}`, {
            method: 'DELETE'
        }).then(console.log('Usunięto produkt o Id:', id));
    }

    guidNew() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );
    }
}

const receipt = new Receipt();

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("addBttn").onclick = () => {
        receipt.addProduct();
    }
});