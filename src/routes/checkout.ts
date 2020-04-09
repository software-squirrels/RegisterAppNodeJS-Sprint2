import express from "express";
import { RouteLookup } from "../controllers/lookups/routingLookup";
import * as CheckOutRouteController from "../controllers/checkoutRouteController";

function checkoutRoutes(server: express.Express) {
	server.get(RouteLookup.Checkout, CheckoutController.start);

	server.post(RouteLookup.Checkout, CheckoutController.confirmation);
	
	server.patch(RouteLookup.Checkout, CheckoutController.update);

	//server.delete(
		//(RouteLookup.API + RouteLookup.SignOut),
		//SignInRouteController.clearActiveUser);
}

module.exports.routes = checkoutRoutes;
