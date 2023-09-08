export class InvitationInDTO {
  email: string;
  role: string;
  allowed_cci_qids: string[];
}

export class InvitationOutDTO {
  invitation_id: number;
  email: string;
  token: string;
  acceptance_time: Date;
  creation_time: Date;
}
