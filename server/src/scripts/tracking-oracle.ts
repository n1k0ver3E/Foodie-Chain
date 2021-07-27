import Mongoose from '../config/db';
import { ProductLocationRequestModel, ProductTrackingModel } from '../models/TraceModel';
import secrets from "../../secrets.json";
var HDWalletProvider = require("@truffle/hdwallet-provider");
const Eth: any = require('web3-eth');

var Product = require("./../../../client/src/contracts/Trace.json");
var addresses = require("./../../../solidity/addresses.json");


// Read the tract contract address.
const contractAddress = addresses.trace;
console.log("Trace contract address is:", contractAddress);

// Setup the wallet
const provider = new HDWalletProvider({
    mnemonic: {
        phrase: secrets.mnemonic
    },
    providerOrUrl: "http://localhost:7545"
});

const eth = new Eth(provider);

// Create a tract contract reference
const traceContract = new eth.Contract(Product['abi'], contractAddress);

// Dummy setting to simulate the data logging.
const maxTick = 10

// Dummy function to get the dummy location. Each oracle will have to implement their own approach to retrieve by the trackingNumber.
function retrieveProductLocaionByTrackingNumber(trackingNumber: string) {
    // Code for retrieve the product location.
    // We use random location around -33.91759, 151.23054 to simulate the tracking.

    let latitude = Math.floor(-3391759 + 100 * Math.random());
    let longitude = Math.floor(15123054 + 100 * Math.random());

    // Return the latitude, longitude.
    return [latitude, longitude]
}

// Connect to the database
Mongoose().initialiseMongoConnection().then(function(mongo) {

    // A wrapping funciton.
    function getLogs() {

        // Retrieve the data from the database. Filter by the address.
        // This query for products that need to update the location information.
        ProductTrackingModel.find({ trackerAddress: addresses.oracle, $or: [{ tick: { $exists: false } }, { tick: { $lte: maxTick } }] }).exec().then(function(row) {
            let promises = row.map((r) => {
                return new Promise<void>((resolve, reject) => {

                    try {
                        // Call the function logLocation to log the product location on to the blockchain.
                        traceContract.methods
                            .logLocation(r.productId, Date.now(), ...retrieveProductLocaionByTrackingNumber(r.trackingNumber))
                            .send({ from: addresses.oracle }, function(err: any, result: any) {

                                // Increase the tick to simulate the update counter.
                                // We limit the automatically log to `maxTick`
                                r.tick = (r.tick == null ? 0 : r.tick) + 1;

                                // Save the update result to the database.
                                r.save().then(() => {
                                    // Log the information to console.
                                    console.log(`Oracle [ProductTracking] Oracle: productId=${r.productId} tick=${r.tick}`);

                                    // Make as success.
                                    resolve();
                                });
                            });
                    } catch {
                        reject();
                    }
                });
            });

            return Promise.all(promises);
        }).then(() => {
            // Retrieve the data from the database. Filter by the address.
            // This query for products that need to update the location information.
            return ProductTrackingModel.find({ trackerAddress: addresses.logistic, $or: [{ tick: { $exists: false } }, { tick: { $lte: maxTick } }] }).exec().then(function(row) {
                let promises = row.map((r) => {
                    return new Promise<void>((resolve, reject) => {
                        try {
                            // Call the function logLocation to log the product location on to the blockchain.
                            traceContract.methods
                                .logLocation(r.productId, Date.now(), ...retrieveProductLocaionByTrackingNumber(r.trackingNumber))
                                .send({ from: addresses.logistic }, function(err: any, result: any) {


                                    // Increase the tick to simulate the update counter.
                                    // We limit the automatically log to `maxTick`
                                    r.tick = (r.tick == null ? 0 : r.tick) + 1;

                                    // Save the update result to the database.
                                    r.save().then(() => {

                                        // Log the information to console.
                                        console.log(`Oracle [ProductTracking] Logistic: productId=${r.productId} tick=${r.tick}`);

                                        // Make as success.
                                        resolve();
                                    });
                                });
                        } catch {
                            reject();
                        }
                    });
                });

                return Promise.all(promises);
            });
        }).then(() => {
            // Retrieve the data from the database.
            // This query for products that requested for the location by user.
            return ProductLocationRequestModel.find({ isResponded: false }).exec().then(function(requests) {
                let promises = requests.map((request) => {
                    return new Promise<void>((resolve, reject) => {
                        try {
                            // Retrieve the product information from the database
                            ProductTrackingModel.findOne({ productId: request.productId }).exec().then(function(product) {
                                if( product == null ) {
                                    reject();
                                    return;
                                }

                                // Call the function logLocation to log the product location on to the blockchain.
                                traceContract.methods
                                    .logLocation(request.productId, Date.now(), ...retrieveProductLocaionByTrackingNumber(product.trackingNumber))
                                    .send({ from: product?.trackerAddress }, function(err: any, result: any) {

                                        // Update the status request status.
                                        request.isResponded = true;

                                        // Save
                                        request.save().then(() => {

                                            // Log the information to console.
                                            console.log(`Oracle [ProductLocationRequest] productId=${request.productId}`);

                                            // Mark as success.
                                            resolve();
                                        });
                                    });
                            });
                        } catch {
                            reject();
                        }
                    });
                });

                return Promise.all(promises);
            });
        }).then(() => {
            // console.log("timeout")
            setTimeout(getLogs, 7000);
        });
    }

    // Call the wrapping function
    getLogs();
});