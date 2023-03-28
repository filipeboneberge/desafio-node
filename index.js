const { request } = require("express");
const express = require("express");
const uuid = require("uuid");
const app = express();
app.use(express.json())
const port = 3001;

const orders = [];

const myOrderId = (request, response, next) => {
    const {id} = request.params;
    const index = orders.findIndex(index => index.id === id);

    if(index < 0){
        return response.status(404).json("ID not found!");
    }

    request.orderIndex = index;
    request.orderId = id;

    next();
}

const myRoute = (request, response, next) => {
    const typeRequisition = request.method;
    const url = request.url;
    console.log(`Method: [${typeRequisition}] - ${url}`);
    next();
}

app.post("/order", myRoute, (request, response) => {
    const id = uuid.v4();
    const { order, clienteName, price } = request.body;
    orders.push({id, order, clienteName, price, status: "Em preparação"});

    return response.status(201).json({id, clienteName, price, status: "Em preparação"});
});

app.put("/order/:id", myOrderId, myRoute, (request, response) => {
    const id = request.orderId;
    const {order, clienteName, price} = request.body;
    const index = request.orderIndex;
    const updateOrder = {id, order, clienteName, price, status: "Em preparação"};
    orders[index] = updateOrder;

    return response.status(204).json(updateOrder);

});

app.delete("/order/:id", myOrderId, myRoute, (request, response) => {
    const index = request.orderIndex;

    orders.splice(index, 1);

    return response.status(204).json("Order deleted with success!");
});

app.patch("/order/:id", myOrderId, myRoute, (request, response) => {
    const id = request.orderId;
    const index = request.orderIndex;
    const newStatus = orders.filter(st => {
        if(st.id === id){
            st.status = "Pronto";
            let alterOrder = {
                id: id,
                order: st.order,
                clienteName: st.clienteName,
                price: st.price,
                status: st.status
            }
            return alterOrder;
        }
    });
        
    orders[index] = newStatus;

    return response.status(200).json(newStatus);
});

app.get('/order/:id', myOrderId, myRoute, (request, response) => {
    const index = request.orderIndex;

    return response.status(200).json(orders[index]);
})

app.get("/order", myRoute, (request, response) => {
    return response.json(orders);
});

app.listen(port , () => {
    console.log(`🚀 Started on port ${port}`);
});