import { Request, Response } from "express";
import { Resources, ResourceKey } from "../resourceLookup";
import { TransactionPageResponse, CommandResponse, ActiveUser, Product, ProductListingPageResponse } from "./typeDefinitions";
import * as Helper from "./helpers/routeControllerHelper";
import * as ProductsQuery from "./commands/products/productsQuery";
import * as ValidateActiveUser from "./commands/activeUsers/validateActiveUserCommand";
import { ViewNameLookup } from "./lookups/routingLookup";

const processStartTransactionError = (error: any, res: Response): void => {
	if (Helper.processStartError(error, res)) {
		return;
	}

	res.setHeader(
		"Cache-Control",
		"no-cache, max-age=0, must-revalidate, no-store");
		
		//Change the ViewNameLookUp to Transaction and make sure that the products are working currently

	return res.status((error.status || 500))
		.render(
			ViewNameLookup.ProductListing,
			<ProductListingPageResponse>{
				products: [],
				isElevatedUser: false,
				errorMessage: (error.message
					|| Resources.getString(ResourceKey.PRODUCTS_UNABLE_TO_QUERY))
			});
};

export const start = async (req: Request, res: Response): Promise<void> => {
	if (Helper.handleInvalidSession(req, res)) {
		return;
	}

	return ValidateActiveUser.execute((<Express.Session>req.session).id)
	.then((): Promise<CommandResponse<Product[]>> => {
		return ProductsQuery.query();
	}).then((productsCommandResponse: CommandResponse<Product[]>): void => {
		return res.render(ViewNameLookup.Transaction,
		<TransactionPageResponse>{
			products: productsCommandResponse.data
		});
	}).catch((error: any): void => {
		return processStartTransactionError(error, res);
	});
};
