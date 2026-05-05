import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SessionManager } from '@waha/core/abc/manager.abc';
import {
  ApiKey,
  IApiKeyRepository,
} from '@waha/core/storage/IApiKeyRepository';
import { ApiKeyDTO, ApiKeyRequest } from '@waha/structures/apikeys.dto';
import { generatePrefixedId, generateSecret } from '@waha/utils/ids';

function CheckInvariant(
  apiKey: Pick<ApiKey, 'isAdmin' | 'session' | 'actions'>,
): void {
  if (apiKey.isAdmin && apiKey.session) {
    throw new UnprocessableEntityException(
      'Session is not allowed for admin keys',
    );
  }
  if (!apiKey.isAdmin && !apiKey.session) {
    throw new UnprocessableEntityException(
      'Either isAdmin must be true or session must be provided',
    );
  }
  if (apiKey.actions && !apiKey.session) {
    throw new UnprocessableEntityException(
      'Actions are only allowed for session-scoped keys',
    );
  }
}

export class ApiKeyService {
  private readonly repository: IApiKeyRepository;

  constructor(private readonly manager: SessionManager) {
    this.repository = manager.apiKeyRepository;
  }

  async create(body: ApiKeyRequest): Promise<ApiKeyDTO> {
    CheckInvariant(body);
    if (body.session) {
      const exists = await this.manager.exists(body.session);
      if (!exists) {
        throw new UnprocessableEntityException(
          `Session "${body.session}" does not exist`,
        );
      }
    }
    let apikey: ApiKey | null = null;
    for (let i = 0; i < 5; i++) {
      apikey = {
        id: generatePrefixedId('key_id'),
        key: `key_${generateSecret(32)}`,
        isActive: body.isActive,
        isAdmin: body.isAdmin,
        session: body.session,
        actions: body.actions ?? null,
      };
      const idExists = await this.repository.getById(apikey.id);
      if (idExists) {
        continue;
      }
      const keyExists = await this.repository.getByKey(apikey.key);
      if (keyExists) {
        continue;
      }
      break;
    }
    if (!apikey) {
      throw new UnprocessableEntityException(
        `Failed to generate API key, try again`,
      );
    }
    CheckInvariant(apikey);
    await this.repository.upsert(apikey);
    return this.toDTO(apikey);
  }

  async list(): Promise<ApiKeyDTO[]> {
    const keys = await this.repository.list();
    return keys.map((key) => this.toDTO(key));
  }

  async update(id: string, body: ApiKeyRequest): Promise<ApiKeyDTO> {
    const existing = await this.repository.getById(id);
    if (!existing) {
      throw new NotFoundException('API key not found');
    }
    const apikey: ApiKey = {
      ...existing,
      isActive: body.isActive,
      isAdmin: body.isAdmin,
      session: body.session,
      actions: body.actions ?? null,
    };
    CheckInvariant(apikey);
    if (apikey.session) {
      const exists = await this.manager.exists(apikey.session);
      if (!exists) {
        throw new UnprocessableEntityException(
          `Session "${apikey.session}" does not exist`,
        );
      }
    }
    CheckInvariant(apikey);
    await this.repository.upsert(apikey);
    return this.toDTO(apikey);
  }

  async delete(id: string): Promise<{ result: true }> {
    const existing = await this.repository.getById(id);
    if (!existing) {
      throw new NotFoundException('API key not found');
    }
    await this.repository.deleteById(id);
    return { result: true };
  }

  private toDTO(apikey: ApiKey): ApiKeyDTO {
    return {
      id: apikey.id,
      key: apikey.key,
      isActive: apikey.isActive,
      isAdmin: apikey.isAdmin,
      session: apikey.session,
      actions: apikey.actions,
    };
  }
}
