// app/mocks/browser.js
import { setupWorker } from 'msw/browser';
import { loginHandler } from './handlers/login-handler';
import { usersHandler } from './handlers/users-handler';
import { familiesHandler } from './handlers/families-handler';
import { adminHandler } from './handlers/admin-handler';

// 핸들러를 사용하여 서비스 워커를 설정합니다.
export const worker = setupWorker(...loginHandler, ...usersHandler, ...familiesHandler, ...adminHandler);