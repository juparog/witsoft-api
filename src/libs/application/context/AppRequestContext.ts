import { RequestContext } from "nestjs-request-context";
import { Connection } from "mongoose";

export class AppRequestContext extends RequestContext {
	requestId: string;
	transactionConnection?: Connection;
}

export class RequestContextService {
	static getContext(): AppRequestContext {
		const ctx: AppRequestContext = RequestContext.currentContext.req;
		return ctx;
	}

	static setRequestId(id: string): void {
		const ctx = this.getContext();
		ctx.requestId = id;
	}

	static getRequestId(): string {
		return this.getContext().requestId;
	}

	static getTransactionConnection(): Connection | undefined {
		const ctx = this.getContext();
		return ctx.transactionConnection;
	}

	static setTransactionConnection(transactionConnection?: Connection): void {
		const ctx = this.getContext();
		ctx.transactionConnection = transactionConnection;
	}

	static cleanTransactionConnection(): void {
		const ctx = this.getContext();
		ctx.transactionConnection = undefined;
	}
}
