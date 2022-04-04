const fs = require('fs');
module.exports = app => {
    const orders = require("../controllers/order.controller.js");
    var router = require("express").Router();

    // Create a new Order
    router.post("/", orders.create);

    // Retrieve all orders
    router.get("/", orders.findAll);

    // Retrieve a single Order with id
    router.get("/:id", orders.findOne);

    // Update a Order with id
    router.put("/:id", orders.update);

    // Delete a Order with id
    router.delete("/:id", orders.delete);

    // Delete all orders
    router.delete("/", orders.deleteAll);


    router.post("/report", orders.reportByProduct);
    router.post("/reportUser", orders.reportByUser);

    router.get("/one/files", orders.insertData);
    router.get("/one/newRequest", (req, res, next) => {
        var endpointURL = "https://apple-pay-gateway-cert.apple.com/paymentservices/startSession";
        // var cert_path = new URL('/ns/oa', "https://testyourapp.online/keys/Certificates.pem");
        var cert_path = "./nuevo.crt.pem";
        // var key = './nuervo.crt.pem'
        var cert = fs.readFileSync(cert_path);
        console.log('endpointURL is ' + endpointURL);
        console.log('cert_path is ' + cert_path);
        console.log('cert is' + cert);

        const options = {
            url: endpointURL,
            method: 'post',
            cert: cert,
            key: cert,
            body:
            {
                merchantIdentifier: "merchant.emunedemo",
                displayName: "Testyourapp Pay Demo",
                initiative: "web",
                initiativeContext: "testyourapp.online",
                domainName: "testyourapp.online",
            },
            json: true,
        };

        request(options, function (error, response, body) {
            console.log('body of  getAppleSession' + body);
            console.log('Response from getAppleSession' + response);
            console.error('Error object ' + error);
            res.send(body);
        });
    });

    // router.get("/one/parquetData", orders.filParquet);

    app.use('/api/orders', router);
};
