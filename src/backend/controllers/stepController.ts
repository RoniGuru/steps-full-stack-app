import dotenv from 'dotenv';
import { Response, Request } from 'express';
import { addStepDB, updateStepDB } from '../db/database';

dotenv.config();

export async function addStep(req: Request, res: Response) {
  try {
    const steps: number = req.body.steps;
    const result = await addStepDB(Number(req.params.id), steps);

    if (!result) {
      res.status(500).json({ error: 'unable to add step' });
      return;
    }
    //update user

    res.status(200).json({ message: 'step added' });
  } catch (error) {
    res.status(500).json({ error: 'failed to add step to user' });
  }
}

export async function updateStep(req: Request, res: Response) {
  try {
    const steps: number = req.body.steps;
    const date: Date = req.body.date;
    const result = await updateStepDB(date, steps, Number(req.params.id));

    if (!result) {
      res.status(500).json({ error: 'unable to update step' });
      return;
    }
    //update user

    res.status(200).json({ message: 'step updated' });
  } catch (error) {
    res.status(500).json({ error: 'failed to add step to user' });
  }
}
