import { Request, Response } from 'express';

export const healCheck = (_: Request, res: Response) => {
  res.status(200).send();
}
