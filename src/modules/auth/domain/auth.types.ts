// Propiedades para el payload de un token
export interface PayloadTokenProps {
	type: "ORGANIZATION" | "USER" | "GENERIC";
	id: string;
}
