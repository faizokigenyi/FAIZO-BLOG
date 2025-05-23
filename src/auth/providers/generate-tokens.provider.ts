import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { User } from 'src/users/user.entity';
import { ActiveUserData } from '../interfaces/active-user-data';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    // Injecting UserService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /**
     * Inject jwtService
     */
    private readonly jwtService: JwtService,

    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signInToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  public async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      // generate accessToken
      this.signInToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
        },
      ),
      // generate refresh token
      this.signInToken(user.id, this.jwtConfiguration.accessRefresfTtl),
    ]);
    return { accessToken, refreshToken };
  }
}
