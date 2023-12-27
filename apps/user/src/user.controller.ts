import { AddPasskeyDetails, ICheckUserDetails, PlatformSettings, ShareUserCertificate, UpdateUserProfile, UserCredentials, IUserInformation, IUsersProfile, UserInvitations, ISendVerificationEmail, IVerifyUserEmail} from '../interfaces/user.interface';
import {IOrgUsers, Payload} from '../interfaces/user.interface';

import { AcceptRejectInvitationDto } from '../dtos/accept-reject-invitation.dto';
import { Controller } from '@nestjs/common';
import { LoginUserDto } from '../dtos/login-user.dto';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { VerifyEmailTokenDto } from '../dtos/verify-email.dto';
import { user } from '@prisma/client';
import { IUsersActivity } from 'libs/user-activity/interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
   * Description: Registers new user
   * @param email 
   * @returns User's verification email sent status
   */
  @MessagePattern({ cmd: 'send-verification-mail' })
  async sendVerificationMail(payload: { userEmailVerification: ISendVerificationEmail }): Promise<ISendVerificationEmail> {
    return this.userService.sendVerificationMail(payload.userEmailVerification);
  }

  /**
   * Description: Verify user's email
   * @param email
   * @param verificationcode
   * @returns User's email verification status 
   */
  @MessagePattern({ cmd: 'user-email-verification' })
  async verifyEmail(payload: { param: VerifyEmailTokenDto }): Promise<IVerifyUserEmail> {
    return this.userService.verifyEmail(payload.param);
  }

  @MessagePattern({ cmd: 'user-holder-login' })
  async login(payload: LoginUserDto): Promise<object> {
   return this.userService.login(payload);
  }

  @MessagePattern({ cmd: 'get-user-profile' })
  async getProfile(payload: { id }): Promise<IUsersProfile> {
    return this.userService.getProfile(payload);
  }

  @MessagePattern({ cmd: 'get-user-public-profile' })
  async getPublicProfile(payload: { username }): Promise<IUsersProfile> {
    return this.userService.getPublicProfile(payload);
  }
  @MessagePattern({ cmd: 'update-user-profile' })
  async updateUserProfile(payload: { updateUserProfileDto: UpdateUserProfile }): Promise<user> {
    return this.userService.updateUserProfile(payload.updateUserProfileDto);
  }

  @MessagePattern({ cmd: 'get-user-by-supabase' })
  async findSupabaseUser(payload: { id }): Promise<object> {
    return this.userService.findSupabaseUser(payload);
  }


  @MessagePattern({ cmd: 'get-user-by-mail' })
  async findUserByEmail(payload: { email }): Promise<object> {
    return this.userService.findUserByEmail(payload);
  }


  @MessagePattern({ cmd: 'get-user-credentials-by-id' })
  async getUserCredentialsById(payload: { credentialId }): Promise<UserCredentials> {
    return this.userService.getUserCredentialsById(payload);
  }

  @MessagePattern({ cmd: 'get-org-invitations' })
  async invitations(payload: { id; status; pageNumber; pageSize; search; }): Promise<UserInvitations> {
        return this.userService.invitations(payload);
  }

  /**
   *
   * @param payload
   * @returns Organization invitation status  fetch-organization-users
   */
  @MessagePattern({ cmd: 'accept-reject-invitations' })
  async acceptRejectInvitations(payload: {
    acceptRejectInvitation: AcceptRejectInvitationDto;
    userId: string;
  }): Promise<string> {
    return this.userService.acceptRejectInvitations(payload.acceptRejectInvitation, payload.userId);
  }

  /**
   *
   * @param payload
   * @returns Share user certificate
   */
  @MessagePattern({ cmd: 'share-user-certificate' })
  async shareUserCertificate(payload: {
    shareUserCredentials: ShareUserCertificate;
  }): Promise<string> {
    return this.userService.shareUserCertificate(payload.shareUserCredentials);
  }

  /**
   *
   * @param payload
   * @returns organization users list
   */
  @MessagePattern({ cmd: 'fetch-organization-user' })
  async getOrganizationUsers(payload: {orgId:string} & Payload): Promise<IOrgUsers> {
    return this.userService.getOrgUsers(payload.orgId, payload.pageNumber, payload.pageSize, payload.search);
  }

  /**
 * @param payload
 * @returns organization users list
 */
  @MessagePattern({ cmd: 'fetch-users' })
  async get(payload: { pageNumber: number, pageSize: number, search: string }): Promise<object> {
    const users = this.userService.get(payload.pageNumber, payload.pageSize, payload.search);
    return users;
  }
  
  /** 
  * @param email
  * @returns User's email exist status
  * */
  @MessagePattern({ cmd: 'check-user-exist' })
  async checkUserExist(payload: { userEmail: string }): Promise<ICheckUserDetails> {
    return this.userService.checkUserExist(payload.userEmail);
  }
  @MessagePattern({ cmd: 'add-user' })
  async addUserDetailsInKeyCloak(payload: { userInfo: IUserInformation }): Promise<string | object> {
    return this.userService.createUserForToken(payload.userInfo);
  }

  // Fetch Users recent activities
  @MessagePattern({ cmd: 'get-user-activity' })
  async getUserActivity(payload: { userId: string, limit: number }): Promise<IUsersActivity[]> {
    return this.userService.getUserActivity(payload.userId, payload.limit);
  }

  @MessagePattern({ cmd: 'add-passkey' })
  async addPasskey(payload: { userEmail: string, userInfo: AddPasskeyDetails }): Promise<string | object> {
    return this.userService.addPasskey(payload.userEmail, payload.userInfo);
  }

  @MessagePattern({ cmd: 'update-platform-settings' })
  async updatePlatformSettings(payload: { platformSettings: PlatformSettings }): Promise<string> {
    return this.userService.updatePlatformSettings(payload.platformSettings);
  }

  @MessagePattern({ cmd: 'fetch-platform-settings' })
  async getPlatformEcosystemSettings(): Promise<object> {
    return this.userService.getPlatformEcosystemSettings();
  }

}
