import { NextFunction, Request, Response } from 'express';
import Edusign from '@_edusign/api';

import logger from '@logger';
import * as credentialsRepository from '@repositories/credentials';

/**
 * Uninstalls the app for a specific school based on the provided school ID.
 *
 * @param req - The HTTP request object, which contains the `schoolId` parameter.
 * @param res - The HTTP response object used to send the response back to the client.
 * @param next - The next middleware function in the Express.js request-response cycle.
 *
 * @throws Will throw an error if no school is found with the provided `schoolId`.
 *
 * @returns A JSON response indicating the success of the uninstallation process.
 */
export default async function GetUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const  schoolId = req.schoolId as string;
    console.log('schoolId', schoolId);

    const blocksApi = new Edusign.Blocks();

    blocksApi.Title('title', 'School Id');
    blocksApi.Text('description', schoolId);
  
    res.send(blocksApi.toJson());
  } catch (error) {
    return next(error);
  }
}
