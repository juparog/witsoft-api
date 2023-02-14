// Todas las propiedades que tiene una organizaion
export interface OrganizationProps {
	email: string;
	name: string;
	password: string;
	domain: string;
}

// Propiedades para crear una organizacion
export interface CreateOrganizationProps {
	email: string;
	name: string;
	password: string;
	domain: string;
}
