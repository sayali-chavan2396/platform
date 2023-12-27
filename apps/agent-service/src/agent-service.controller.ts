import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AgentServiceService } from './agent-service.service';
import {
  GetCredDefAgentRedirection,
  GetSchemaAgentRedirection,
  IAgentSpinupDto,
  IIssuanceCreateOffer,
  ITenantCredDef,
  ITenantDto,
  ITenantSchema,
  OutOfBandCredentialOffer
} from './interface/agent-service.interface';
import { IConnectionDetails, IUserRequestInterface } from './interface/agent-service.interface';
import { ISendProofRequestPayload } from './interface/agent-service.interface';
import { user } from '@prisma/client';
import { ICreateConnectionUrl } from '@credebl/common/interfaces/connection.interface';
import { IConnectionDetailsById } from 'apps/api-gateway/src/interfaces/IConnectionSearch.interface';

@Controller()
export class AgentServiceController {
  constructor(private readonly agentServiceService: AgentServiceService) {}


  //DONE
  @MessagePattern({ cmd: 'agent-spinup' })
  async walletProvision(payload: { agentSpinupDto: IAgentSpinupDto, user: IUserRequestInterface }): Promise<IAgentSpinUpSatus> {
    return this.agentServiceService.walletProvision(payload.agentSpinupDto, payload.user);
  }


  //DONE
  @MessagePattern({ cmd: 'create-tenant' })
  async createTenant(payload: { createTenantDto: ITenantDto; user: IUserRequestInterface }): Promise<{
    agentSpinupStatus: number;
  }> {
    return this.agentServiceService.createTenant(payload.createTenantDto, payload.user);
  }

  //DONE
  @MessagePattern({ cmd: 'agent-create-schema' })
  async createSchema(payload: ITenantSchema): Promise<object> {
    return this.agentServiceService.createSchema(payload);
  }

  //DONE
  @MessagePattern({ cmd: 'agent-get-schema' })
  async getSchemaById(payload: IGetSchemaAgentRedirection): Promise<object> {
    return this.agentServiceService.getSchemaById(payload);
  }

  //DONE
  @MessagePattern({ cmd: 'agent-create-credential-definition' })
  async createCredentialDefinition(payload: ITenantCredDef): Promise<object> {
    return this.agentServiceService.createCredentialDefinition(payload);
  }

 // DONE
  @MessagePattern({ cmd: 'agent-get-credential-definition' })
  async getCredentialDefinitionById(payload: IGetCredDefAgentRedirection): Promise<object> {
    return this.agentServiceService.getCredentialDefinitionById(payload);
  }

  //DONE
  @MessagePattern({ cmd: 'agent-create-connection-legacy-invitation' })
  async createLegacyConnectionInvitation(payload: {
    connectionPayload: IConnectionDetails;
    url: string;
    apiKey: string;
  }): Promise<object> {
    return this.agentServiceService.createLegacyConnectionInvitation(
      payload.connectionPayload,
      payload.url,
      payload.apiKey
    );
  }

//DONE
  @MessagePattern({ cmd: 'agent-send-credential-create-offer' })
  async sendCredentialCreateOffer(payload: {
    issueData: IIssuanceCreateOffer;
    url: string;
    apiKey: string;
  }): Promise<object> {
    return this.agentServiceService.sendCredentialCreateOffer(payload.issueData, payload.url, payload.apiKey);
  }

  //DONE
  @MessagePattern({ cmd: 'agent-get-all-issued-credentials' })
  async getIssueCredentials(payload: { url: string; apiKey: string }): Promise<object> {
    return this.agentServiceService.getIssueCredentials(payload.url, payload.apiKey);
  }

  //DONE
  @MessagePattern({ cmd: 'agent-get-issued-credentials-by-credentialDefinitionId' })
  async getIssueCredentialsbyCredentialRecordId(payload: { url: string; apiKey: string }): Promise<object> {
    return this.agentServiceService.getIssueCredentialsbyCredentialRecordId(payload.url, payload.apiKey);
  }
  //DONE
  @MessagePattern({ cmd: 'agent-get-proof-presentations' })
  async getProofPresentations(payload: { url: string; apiKey: string }): Promise<object> {
    return this.agentServiceService.getProofPresentations(payload.url, payload.apiKey);
  }

  //DONE
  @MessagePattern({ cmd: 'agent-get-proof-presentation-by-id' })
  async getProofPresentationById(payload: { url: string; apiKey: string }): Promise<object> {
    return this.agentServiceService.getProofPresentationById(payload.url, payload.apiKey);
  }

  //DONE
  @MessagePattern({ cmd: 'agent-send-proof-request' })
  async sendProofRequest(payload: {
    proofRequestPayload: ISendProofRequestPayload;
    url: string;
    apiKey: string;
  }): Promise<object> {
    return this.agentServiceService.sendProofRequest(payload.proofRequestPayload, payload.url, payload.apiKey);
  }
//DONE
  @MessagePattern({ cmd: 'agent-verify-presentation' })
  async verifyPresentation(payload: { url: string; apiKey: string }): Promise<object> {
    return this.agentServiceService.verifyPresentation(payload.url, payload.apiKey);
  }

  //DONE
  @MessagePattern({ cmd: 'agent-get-all-connections' })
  async getConnections(payload: { url: string; apiKey: string }): Promise<object> {
    return this.agentServiceService.getConnections(payload.url, payload.apiKey);
  }

  //DONE
  @MessagePattern({ cmd: 'agent-get-connections-by-connectionId' })
  async getConnectionsByconnectionId(payload: { url: string; apiKey: string }): Promise<object> {
    return this.agentServiceService.getConnectionsByconnectionId(payload.url, payload.apiKey);
  }


//Needs to check
  @MessagePattern({ cmd: 'agent-health' })
  async getAgentHealth(payload: { user: user; orgId: string, apiKey: string; }): Promise<object> {
    return this.agentServiceService.getAgentHealthDetails(payload.orgId, payload.apiKey);
  }

  //DONE
  @MessagePattern({ cmd: 'agent-send-out-of-band-proof-request' })
  async sendOutOfBandProofRequest(payload: {
    proofRequestPayload: ISendProofRequestPayload;
    url: string;
    apiKey: string;
  }): Promise<object> {
    return this.agentServiceService.sendOutOfBandProofRequest(payload.proofRequestPayload, payload.url, payload.apiKey);
  }

  //DONE
  @MessagePattern({ cmd: 'agent-proof-form-data' })
  async getProofFormData(payload: { url: string; apiKey: string }): Promise<object> {
    return this.agentServiceService.getProofFormData(payload.url, payload.apiKey);
  }

  @MessagePattern({ cmd: 'agent-schema-endorsement-request' })
  async schemaEndorsementRequest(payload: {
    url: string;
    apiKey: string;
    requestSchemaPayload: object;
  }): Promise<object> {
    return this.agentServiceService.schemaEndorsementRequest(payload.url, payload.apiKey, payload.requestSchemaPayload);
  }
  @MessagePattern({ cmd: 'agent-credDef-endorsement-request' })
  async credDefEndorsementRequest(payload: {
    url: string;
    apiKey: string;
    requestSchemaPayload: object;
  }): Promise<object> {
    return this.agentServiceService.credDefEndorsementRequest(
      payload.url,
      payload.apiKey,
      payload.requestSchemaPayload
    );
  }

  //DONE
  @MessagePattern({ cmd: 'agent-sign-transaction' })
  async signTransaction(payload: { url: string; apiKey: string; signEndorsementPayload: object }): Promise<object> {
    return this.agentServiceService.signTransaction(payload.url, payload.apiKey, payload.signEndorsementPayload);
  }

  //DONE
  @MessagePattern({ cmd: 'agent-submit-transaction' })
  async submitTransaction(payload: { url: string; apiKey: string; submitEndorsementPayload: object }): Promise<object> {
    return this.agentServiceService.sumbitTransaction(payload.url, payload.apiKey, payload.submitEndorsementPayload);
  }

  //DONE
  @MessagePattern({ cmd: 'agent-out-of-band-credential-offer' })
  async outOfBandCredentialOffer(payload: {
    outOfBandIssuancePayload: OutOfBandCredentialOffer;
    url: string;
    apiKey: string;
  }): Promise<object> {
    return this.agentServiceService.outOfBandCredentialOffer(
      payload.outOfBandIssuancePayload,
      payload.url,
      payload.apiKey
    );
  }

  //DONE
  @MessagePattern({ cmd: 'delete-wallet' })
  async deleteWallet(payload: { url; apiKey }): Promise<object> {
    return this.agentServiceService.deleteWallet(payload.url, payload.apiKey);
  }

  @MessagePattern({ cmd: 'get-org-agent-api-key' })
  async getOrgAgentApiKey(payload: { orgId: string }): Promise<string> {
    return this.agentServiceService.getOrgAgentApiKey(payload.orgId);
  }
  
}
