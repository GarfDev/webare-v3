import { Router } from 'express';

import { joinQueue } from '../resources/join_queue';
import { leaveQueue } from '../resources/leave_queue';
import { leaveMatch } from '../resources/leave_match';

export const rootRouter = Router();

rootRouter.post('/queue/join', joinQueue);
rootRouter.post('/queue/leave', leaveQueue)
rootRouter.post('/match/leave', leaveMatch)
