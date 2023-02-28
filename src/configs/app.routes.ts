/**
 * Rutas de la apliccion con su version
 */

// Root
const homeRoot = "";
const organizationRoot = "organization";
const authRoot = "auth";

// Versiones de la api
const v1 = "v1";

// Rutas
export const routesV1 = {
	version: v1,
	home: {
		root: homeRoot,
	},
	organization: {
		root: organizationRoot,
		findById: `${organizationRoot}/:id`,
		fullUpdate: `${organizationRoot}/:id`,
		partialUpdate: `${organizationRoot}/:id`,
		update: `${organizationRoot}/:id`,
	},
	auth: {
		root: authRoot,
		loginOrganization: `${authRoot}/${organizationRoot}/login`,
	},
};
