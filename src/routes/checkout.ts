import express from "express";
import { RouteLookup } from "../controllers/lookups/routingLookup";
import * as CheckoutRouteController from "../controllers/checkoutRouteController";

function checkoutRoutes(server: express.Express) {
	server.get(RouteLookup.Checkout, CheckoutRouteController.start);

	server.post(RouteLookup.Checkout, CheckoutRouteController.confirmation);

	server.patch(RouteLookup.Checkout, CheckoutRouteController.update);

	//server.delete(
		//(RouteLookup.API + RouteLookup.SignOut),
		//SignInRouteController.clearActiveUser);
}

module.exports.routes = checkoutRoutes;
