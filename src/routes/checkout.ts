import express from "express";
import { RouteLookup } from "../controllers/lookups/routingLookup";
import * as checkoutRouteController from "../controllers/checkoutRouteController";

function checkoutRoutes(server: express.Express) {
	server.get(RouteLookup.Checkout, checkoutRouteController.start);
	server.post(RouteLookup.Checkout, checkoutRouteController.confirmation);
	server.delete(RouteLookup.Checkout, checkoutRouteController.deleteTransaction);
	server.patch(RouteLookup.Checkout, checkoutRouteController.updateTransactionEntries);

	// server.delete(
		// (RouteLookup.API + RouteLookup.SignOut),
		// SignInRouteController.clearActiveUser);
}

module.exports.routes = checkoutRoutes;
