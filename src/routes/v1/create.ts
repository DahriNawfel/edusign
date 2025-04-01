import { NextFunction, Request, Response } from 'express';
import Edusign from '@_edusign/api';

import logger from '@logger';

/**
 * Affiche un formulaire pour créer un événement pour une école spécifique.
 *
 * @param req - L'objet de requête HTTP, qui contient le paramètre `schoolId`.
 * @param res - L'objet de réponse HTTP utilisé pour envoyer la réponse au client.
 * @param next - La fonction middleware suivante dans le cycle requête-réponse d'Express.js.
 *
 * @returns Une réponse JSON avec le formulaire de création d'événement.
 */
export default async function CreateEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const schoolId = req.schoolId as string;
    logger.info(`Affichage du formulaire d'événement pour l'école: ${schoolId}`);

    const blocksApi = new Edusign.Blocks();
    
    blocksApi.Title('title', 'Créer un nouvel événement');
    blocksApi.Text('subheader', `École: ${schoolId}`);
    
    blocksApi.Text('name_label', 'Nom de l\'événement:');
    blocksApi.Text('description_label', 'Description de l\'événement:');
    blocksApi.Text('date_label', 'Date de l\'événement:');
    
    blocksApi.Text('name_placeholder', '________________');
    blocksApi.Text('description_placeholder', '________________');
    blocksApi.Text('date_placeholder', '________________');
    
    // blocksApi.Button('submitButton', 'primary', 'Créer l\'événement', `/api/schools/${schoolId}/events/create`);
    // blocksApi.Button('cancelButton', 'secondary', 'Annuler', `/api/schools/${schoolId}/dashboard`);
    res.send(blocksApi.toJson());
  } catch (error) {
    logger.error('Erreur lors de l\'affichage du formulaire d\'événement:', error);
    return next(error);
  }
}