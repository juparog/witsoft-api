import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, now } from "mongoose";

export type OrganizationDocument = HydratedDocument<Organization>;

@Schema({ timestamps: true, id: true })
export class Organization {
	@Prop({
    type: String,
    required: "Please provide the {PATH} for the organization.",
    trim: (str: string) => str.trim()
  })
	name: string;

	@Prop({
    type: String,
		required: "Please inform the {PATH} of the organization.",
		unique: "The {PATH} {VALUE} is already registered.",
		validate: {
			validator: (email: string) =>
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email),
			message: "The {PATH} {VALUE} does not comply with the allowed format.",
		}
  })
	email: string;

	@Prop({
    type: String,
    required: "Please, inform the {PATH} of the organization.",
	})
	password: string;

	@Prop({
		type: String,
		required: "Please provide the workspace for the organization.",
		unique: "The {PATH} {VALUE} is already registered.",
		trim: (str: string) => str.trim()
	})
	workspace: string;

	@Prop({default: now()})
	createdAt: Date;

	@Prop({default: now()})
	updatedAt: Date;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
