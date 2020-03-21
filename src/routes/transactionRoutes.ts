import express from "express";
import { RouteLookup } from "../controllers/lookups/routingLookup";
import * as TransactionRouteController from "../controllers/transactionRouteController";

function transactionRoutes(server: express.Express) {
	server.get(RouteLookup.Transaction, TransactionRouteController.start);
}

module.exports.routes = transactionRoutes;
