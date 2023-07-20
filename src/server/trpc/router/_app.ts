
import { coursesRouter } from './courses';
import { creditsRouter } from './credits';
import { planRouter } from './plan';
import { templateRouter } from './template';
import { userRouter } from './user';
import { validatorRouter } from './validator';
import { router } from '../trpc';

export const appRouter = router({
  user: userRouter,
  plan: planRouter,
  template: templateRouter,
  credits: creditsRouter,
  courses: coursesRouter,
  validator: validatorRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
