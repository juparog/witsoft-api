import { Command, CommandProps } from '@witsoft/libs/ddd';
import { CreateOrganizationRequestDto } from './create-organization.request.dto';

export class CreateOrganizationCommand extends Command {

  readonly email: string;

  readonly name: string;

  readonly password: string;

  readonly workspace: string;

  constructor(props: CommandProps<CreateOrganizationRequestDto>) {
    super(props);
    this.email = props.email;
    this.name = props.name;
    this.password = props.password;
    this.workspace = props.workspace;
  }
}
