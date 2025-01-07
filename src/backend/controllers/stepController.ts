import dotenv from 'dotenv';
import { Response, Request } from 'express';
import {
  addStepDB,
  updateStepDB,
  getStepByMonthDB,
  getStepByYearDB,
} from '../db/database';

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

    res.status(200).json({ message: 'step updated' });
  } catch (error) {
    res.status(500).json({ error: 'failed to add step to user' });
  }
}

export async function getStepByMonth(req: Request, res: Response) {
  try {
    const date: Date = new Date(req.body.date);
    const month: number = date.getMonth() + 1;
    const year: number = Number(date.getFullYear());

    const result = await getStepByMonthDB(Number(req.params.id), month, year);

    if (!result) {
      res.status(500).json({ error: 'unable to get steps by month' });
      return;
    }

    res.status(200).json({ steps: result });
  } catch (error) {
    res.status(500).json({ error: 'failed to get steps by month' });
  }
}

export async function getStepByYear(req: Request, res: Response) {
  try {
    const date: Date = new Date(req.body.date);

    const year: number = Number(date.getFullYear());

    const result = await getStepByYearDB(Number(req.params.id), year);

    if (!result) {
      res.status(500).json({ error: 'unable to get steps by year' });
      return;
    }

    res.status(200).json({ steps: result });
  } catch (error) {
    res.status(500).json({ error: 'failed to get steps by year' });
  }
}
