/**
 * Rutas de la apliccion con su version
 */

// Root
const home = "";
const organizationRoot = "organization";

// Versiones de la api
const v1 = "v1";

export const routesV1 = {
	version: v1,
	home: {
		root: home,
	},
	organization: {
		root: organizationRoot,
		findById: `${organizationRoot}/:id`,
		fullUpdate: `${organizationRoot}/:id`,
		partialUpdate: `${organizationRoot}/:id`,
		update: `${organizationRoot}/:id`,
	},
};
