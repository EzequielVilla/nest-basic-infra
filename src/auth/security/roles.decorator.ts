import { Reflector } from '@nestjs/core';
import { ROLE } from './../../common/types';

export const Roles = Reflector.createDecorator<ROLE[]>();
