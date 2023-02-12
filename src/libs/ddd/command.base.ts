import { RequestContextService } from "@witsoft/libs/application/context/AppRequestContext";
import { ArgumentNotProvidedException } from "@witsoft/libs/exceptions";
import { Guard } from "@witsoft/libs/guards/guard";
import { uuidv4To12 } from "@witsoft/libs/utils";

export type CommandProps<T> = Omit<T, "correlationId" | "id"> &
	Partial<Command>;

export class Command {
	public readonly id: string;

	public readonly correlationId: string;

	public readonly causationId?: string;

	constructor(props: CommandProps<unknown>) {
		if (Guard.isEmpty(props)) {
			throw new ArgumentNotProvidedException(
				"Command props should not be empty",
			);
		}
		const ctx = RequestContextService.getContext();
		this.correlationId = props.correlationId || ctx.requestId;
		this.id = props.id || uuidv4To12();
	}
}
