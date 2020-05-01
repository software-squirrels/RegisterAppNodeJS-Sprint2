import express from "express";
import { RouteLookup } from "../controllers/lookups/routingLookup";
import * as checkoutRouteController from "../controllers/checkoutRouteController";

function checkoutRoutes(server: express.Express) {
	server.get(RouteLookup.Checkout, checkoutRouteController.start);
	server.post(RouteLookup.Checkout, checkoutRouteController.confirmation);
	server.patch(RouteLookup.Checkout, checkoutRouteController.update);
	server.delete(RouteLookup.Checkout, checkoutRouteController.deleteTransaction);
}

module.exports.routes = checkoutRoutes;
