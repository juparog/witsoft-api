import { ArgumentNotProvidedException } from '../exceptions';
import { Guard } from '@witsoft/libs/guards/guard';
import { v4 } from 'uuid';
import { RequestContextService } from '@witsoft/libs/application/context/AppRequestContext';

export type DomainEventProps<T> = Omit<
  T,
  'id' | 'timestamp' | 'correlationId' | 'eventName'
> & {
  aggregateId: string;
  correlationId?: string;
  causationId?: string;
  timestamp?: number;
};

export abstract class DomainEvent {
  public readonly id: string;

  /** ID agregado donde ocurrió el evento de dominio */
  public readonly aggregateId: string;

  /** Marca de tiempo cuando se produjo este evento de dominio */
  public readonly timestamp: number;

  /** ID para fines de correlación (para eventos de integración, correlación de registros, etc.). */
  public correlationId: string;

  /**
   * ID de causalidad utilizado para reconstruir la orden de ejecución si es necesario
   */
  public causationId?: string;

  constructor(props: DomainEventProps<unknown>) {
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException(
        'DomainEvent props should not be empty',
      );
    }
    this.id = v4();
    this.aggregateId = props.aggregateId;
    this.timestamp = props.timestamp || Date.now();
    this.correlationId =
      props.correlationId || RequestContextService.getRequestId();
  }
}
