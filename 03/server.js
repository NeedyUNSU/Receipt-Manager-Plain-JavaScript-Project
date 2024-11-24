const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization']
}));


let products = [];

app.get('/products', (req, res) => {
    if (products.some(() => true))
    {
        console.log("Getting all products:");
        products.forEach(item => {
            console.log(`added id:${item.id} name:${item.name} amount:${item.amount} price:${item.price}`);
        });
    }
    else
    {
        console.log("no products in database");
    }
    res.json(products);
});

app.post('/products', (req, res) => {
    const { id, name, amount, price } = req.body;

    if (!id || !name || !amount || !price ) {
        return res.status(400).json({ error: 'All fields (id, name, amount, price) are required.' });
    }

    console.log(`added id:${id} name:${name} amount:${amount} price:${price}`);

    const newProduct = {
        id,
        name,
        amount,
        price
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.patch('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, amount, price } = req.body;

    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ error: 'The product with the given ID does not exist.' });
    }

    console.log(`Edited from id:${product.id} name:${product.name} amount:${product.amount} price:${product.price} to id:${id} name:${name} amount:${amount} price:${price}`);

    if (name) product.name = name;
    if (amount) product.amount = amount;
    if (price) product.price = price;

    res.json(product);
});

app.delete('/products/:id', (req, res) => {
    const { id } = req.params;

    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'The product with the given ID does not exist.' });
    }
    const product = products.find(p => p.id === id);
    console.log(`Removed id:${product.id} name:${product.name} amount:${product.amount} price:${product.price}`);

    const deletedProduct = products.splice(index, 1);
    res.json(deletedProduct[0]);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on  http://localhost:${PORT}/products`);
});
